CREATE TYPE monitoring_type AS ENUM ('none', 'basic', 'detailed');
CREATE TYPE plan_type AS ENUM ('free', 'basic', 'pro');
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    plan plan_type DEFAULT 'free',
    plan_expiration DATE
);
CREATE TABLE IF NOT EXISTS urls (
    id VARCHAR PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    url VARCHAR NOT NULL,
    monitoring monitoring_type NOT NULL
);