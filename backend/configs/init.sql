CREATE TYPE monitoring_type AS ENUM ('daily', 'hourly', 'minutely');
CREATE TYPE plan_type AS ENUM ('free', 'basic', 'pro');
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    plan plan_type NOT NULL DEFAULT 'free',
    plan_expiration DATE
);
CREATE TABLE IF NOT EXISTS urls (
    id VARCHAR PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    url VARCHAR NOT NULL,
    monitoring monitoring_type NOT NULL DEFAULT 'daily'
);
CREATE TABLE IF NOT EXISTS url_daily_views (
    id BIGSERIAL PRIMARY KEY,
    url_id VARCHAR NOT NULL REFERENCES urls(id),
    day DATE NOT NULL DEFAULT CURRENT_DATE,
    count INTEGER NOT NULL DEFAULT 1,
    UNIQUE (url_id, day)
);

CREATE TABLE IF NOT EXISTS url_hourly_views (
    id BIGSERIAL PRIMARY KEY,
    url_id VARCHAR NOT NULL REFERENCES urls(id),
    hour TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', now()),
    count INTEGER NOT NULL DEFAULT 1,
    UNIQUE (url_id, hour)
);

CREATE TABLE IF NOT EXISTS url_minutely_views (
    id BIGSERIAL PRIMARY KEY,
    url_id VARCHAR NOT NULL REFERENCES urls(id),
    minute TIMESTAMPTZ NOT NULL DEFAULT date_trunc('minute', now()),
    count INTEGER NOT NULL DEFAULT 1,
    UNIQUE (url_id, minute)
);