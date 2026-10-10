SET 'pipeline.name' = 'url-view-aggregation';
SET 'execution.runtime-mode' = 'streaming';
SET 'parallelism.default' = '1';
SET 'table.local-time-zone' = 'UTC';
SET 'execution.checkpointing.interval' = '30 s';
SET 'table.exec.source.idle-timeout' = '60 s';

-- The producer sends the URL ID as the raw Kafka key and
-- {"monitoringType":"minutely"|"hourly"|"daily"} as the JSON value.
CREATE TABLE url_views_kafka (
    url_id STRING,
    monitoringType STRING,
    event_time TIMESTAMP_LTZ(3) METADATA FROM 'timestamp' VIRTUAL,
    WATERMARK FOR event_time AS event_time - INTERVAL '5' SECOND
) WITH (
    'connector' = 'kafka',
    'topic' = 'url-views',
    -- Internal listener in backend/docker-compose.yaml.
    'properties.bootstrap.servers' = '${kafkaHost}:${kafkaPort}',
    'properties.group.id' = 'flink-url-views',
    'scan.startup.mode' = 'earliest-offset',
    'key.format' = 'raw',
    'key.fields' = 'url_id',
    'value.format' = 'json',
    'value.fields-include' = 'EXCEPT_KEY',
    'value.json.fail-on-missing-field' = 'true'
);

-- PostgreSQL's UNIQUE (url_id, time) enables idempotent upserts:
-- retries replace the completed count instead of incrementing it again.
-- JDBC 4.1 uses TIMESTAMP here; flink.Dockerfile pins the JVM timezone to
-- UTC so the driver writes UTC instants into PostgreSQL's timestamptz.
CREATE TABLE url_views_postgres (
    url_id STRING NOT NULL,
    `time` TIMESTAMP(3) NOT NULL,
    `count` INT NOT NULL,
    PRIMARY KEY (url_id, `time`) NOT ENFORCED
) WITH (
    'connector' = 'jdbc',
    'url' = 'jdbc:postgresql://${dbhost}:5432/${dbName}',
    'table-name' = 'url_views',
    'username' = '${dbuser}',
    'password' = '${dbpassword}',
    'sink.buffer-flush.max-rows' = '1000',
    'sink.buffer-flush.interval' = '1 s',
    'sink.max-retries' = '3'
);

CREATE VIEW minutely_events AS
SELECT url_id, event_time FROM url_views_kafka
WHERE monitoringType = 'minutely' AND url_id IS NOT NULL AND url_id <> '';

CREATE VIEW hourly_events AS
SELECT url_id, event_time FROM url_views_kafka
WHERE monitoringType = 'hourly' AND url_id IS NOT NULL AND url_id <> '';

CREATE VIEW daily_events AS
SELECT url_id, event_time FROM url_views_kafka
WHERE monitoringType = 'daily' AND url_id IS NOT NULL AND url_id <> '';

-- Submit all three branches as one streaming job. Each event belongs to
-- its URL's monitoring interval; time stores the inclusive window start.
-- COUNT returns BIGINT; the cast matches the existing PostgreSQL INTEGER.
-- Flink 2.3 requires a conflict policy when it cannot infer a unique key
-- across the window branches. A URL has one monitoring interval; fail if
-- different window results ever collide on (url_id, time).
EXECUTE STATEMENT SET
BEGIN

INSERT INTO url_views_postgres
SELECT url_id, window_start, CAST(COUNT(*) AS INT)
FROM TABLE(
    TUMBLE(TABLE minutely_events, DESCRIPTOR(event_time), INTERVAL '1' MINUTE)
)
GROUP BY url_id, window_start, window_end
ON CONFLICT DO ERROR;

INSERT INTO url_views_postgres
SELECT url_id, window_start, CAST(COUNT(*) AS INT)
FROM TABLE(
    TUMBLE(TABLE hourly_events, DESCRIPTOR(event_time), INTERVAL '1' HOUR)
)
GROUP BY url_id, window_start, window_end
ON CONFLICT DO ERROR;

INSERT INTO url_views_postgres
SELECT url_id, window_start, CAST(COUNT(*) AS INT)
FROM TABLE(
    TUMBLE(TABLE daily_events, DESCRIPTOR(event_time), INTERVAL '1' DAY)
)
GROUP BY url_id, window_start, window_end
ON CONFLICT DO ERROR;

END;
