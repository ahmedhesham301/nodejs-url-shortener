FROM flink:2.2.1-java17

USER root

RUN wget -q -P /opt/flink/lib/ \
    https://repo.maven.apache.org/maven2/org/apache/flink/flink-sql-connector-kafka/5.0.0-2.2/flink-sql-connector-kafka-5.0.0-2.2.jar \
    && wget -q -P /opt/flink/lib/ \
    https://repo.maven.apache.org/maven2/org/apache/flink/flink-connector-jdbc-core/4.1.0-2.2/flink-connector-jdbc-core-4.1.0-2.2.jar \
    && wget -q -P /opt/flink/lib/ \
    https://repo.maven.apache.org/maven2/org/apache/flink/flink-connector-jdbc-postgres/4.1.0-2.2/flink-connector-jdbc-postgres-4.1.0-2.2.jar \
    && wget -q -P /opt/flink/lib/ \
    https://repo.maven.apache.org/maven2/org/postgresql/postgresql/42.7.10/postgresql-42.7.10.jar \
    && wget -q -P /opt/flink/lib/ \
    https://repo.maven.apache.org/maven2/io/openlineage/openlineage-java/1.32.0/openlineage-java-1.32.0.jar \
    && wget -q -P /opt/flink/lib/ \
    https://repo.maven.apache.org/maven2/io/openlineage/openlineage-sql-java/1.32.0/openlineage-sql-java-1.32.0.jar

USER flink