SET 'pipeline.name' = 'url-view-aggregation';

CREATE TABLE url_views_kafka (
    url_id STRING,
    monitoringType STRING,

    event_time TIMESTAMP_LTZ(3)
        METADATA FROM 'timestamp',

    WATERMARK FOR event_time
        AS event_time - INTERVAL '5' SECOND
) WITH (
    'connector' = 'kafka',
    'topic' = 'url-views',
    'properties.bootstrap.servers' = 'kafka:9092',
    'properties.group.id' = 'flink-url-views',

    'scan.startup.mode' = 'latest-offset',

    'key.format' = 'raw',
    'key.fields' = 'url_id',

    'value.format' = 'json',
    'value.fields-include' = 'EXCEPT_KEY'
);

CREATE TABLE url_views_postgres (
    url_id STRING NOT NULL,
    `time` TIMESTAMP(3) NOT NULL,
    `count` INT NOT NULL,

    PRIMARY KEY (url_id, `time`) NOT ENFORCED
) WITH (
    'connector' = 'jdbc',

    'url' = 'jdbc:postgresql://db:5432/postgres',
    'table-name' = 'url_views',

    'username' = 'postgres',
    'password' = '1234'
);

CREATE VIEW minutely_events AS
SELECT url_id, event_time
FROM url_views_kafka
WHERE monitoringType = 'minutely';

CREATE VIEW hourly_events AS
SELECT url_id, event_time
FROM url_views_kafka
WHERE monitoringType = 'hourly';

CREATE VIEW daily_events AS
SELECT url_id, event_time
FROM url_views_kafka
WHERE monitoringType = 'daily';


EXECUTE STATEMENT SET
BEGIN

INSERT INTO url_views_postgres
SELECT
    url_id,
    window_start,
    CAST(COUNT(*) AS INT)
FROM TUMBLE(
    TABLE minutely_events,
    DESCRIPTOR(event_time),
    INTERVAL '1' MINUTE
)
GROUP BY
    url_id,
    window_start,
    window_end;


INSERT INTO url_views_postgres
SELECT
    url_id,
    window_start,
    CAST(COUNT(*) AS INT)
FROM TUMBLE(
    TABLE hourly_events,
    DESCRIPTOR(event_time),
    INTERVAL '1' HOUR
)
GROUP BY
    url_id,
    window_start,
    window_end;


INSERT INTO url_views_postgres
SELECT
    url_id,
    window_start,
    CAST(COUNT(*) AS INT)
FROM TUMBLE(
    TABLE daily_events,
    DESCRIPTOR(event_time),
    INTERVAL '1' DAY
)
GROUP BY
    url_id,
    window_start,
    window_end;

END;