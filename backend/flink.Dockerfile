FROM flink:2.3-java17

# Keep JDBC TIMESTAMP values aligned with the SQL job's UTC windows.
ENV JAVA_TOOL_OPTIONS="-Duser.timezone=UTC"

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

# Create traversable directories before ADD applies file permissions.
RUN mkdir -p /opt/flink/usrlib/sql-scripts /opt/flink/usrlib/jars \
    && chmod 0755 /opt/flink/usrlib /opt/flink/usrlib/sql-scripts /opt/flink/usrlib/jars

# Remote ADD defaults to mode 0600; the runtime flink user must read this JAR.
ADD --chmod=0644 https://github.com/DataSQRL/flink-sql-runner/releases/download/0.11.2/flink-sql-runner-0.11.2-flink-2.3.jar /opt/flink/usrlib/sql-runner.jar

# The runner excludes stdlib-utils; its ServiceLoader API belongs on Flink's classpath.
ADD --chmod=0644 https://repo.maven.apache.org/maven2/com/datasqrl/flinkrunner/stdlib-utils/0.11.2/stdlib-utils-0.11.2.jar /opt/flink/lib/stdlib-utils-0.11.2.jar

COPY configs/flink/pipeline.sql /opt/flink/usrlib/sql-scripts/pipeline.sql

USER flink
