# URL Shortener Service

A full-featured URL shortener service built with Node.js, Express, PostgreSQL, and Redis. This application allows users to register, authenticate, and create shortened URLs that redirect to original long URLs. The service includes session management, URL caching, metrics collection, and monitoring capabilities.

## Features

- **User Authentication**: Secure user registration and login with bcrypt password hashing
- **URL Shortening**: Generate unique base62-encoded short URLs from long URLs
- **URL Redirection**: Fast URL lookup and redirection with Redis caching
- **Session Management**: Redis-backed session storage for authenticated users
- **User Dashboard**: Retrieve all shortened URLs created by authenticated users
- **Metrics & Monitoring**: Prometheus metrics endpoint for monitoring and Grafana visualization
- **Input Validation**: Comprehensive request validation using Zod schema validation
- **Error Handling**: Robust error handling with appropriate HTTP status codes

## Technologies & Tools

### Core Technologies
- **Node.js 24** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **PostgreSQL 18** - Relational database for persistent storage
- **Redis** - In-memory data store for caching and session management

### Libraries & Frameworks
- **bcrypt** - Password hashing and verification
- **express-session** - Session middleware for Express
- **connect-redis** - Redis session store for express-session
- **Zod** - Schema validation library
- **pg** - PostgreSQL client for Node.js
- **@redis/client** - Official Redis client for Node.js
- **@sindresorhus/base62** - Base62 encoding for URL shortening
- **prom-client** - Prometheus metrics client
- **morgan** - HTTP request logger middleware

### DevOps & Monitoring
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container Docker application orchestration
- **Prometheus** - Metrics collection and monitoring system
- **Grafana** - Metrics visualization and dashboards
- **pgAdmin** - PostgreSQL administration tool
- **nodemon** - Development server with auto-reload

### Concepts & Patterns
- **MVC Architecture** - Model-View-Controller pattern separation
- **Middleware Pattern** - Request/response processing pipeline
- **Session-based Authentication** - Server-side session management
- **Caching Strategy** - Redis caching for frequently accessed URLs
- **Database Connection Pooling** - Efficient database connection management
- **Input Validation** - Request validation middleware
- **Metrics Collection** - HTTP request metrics for observability

## Project Structure

```
nodejs-url-shortener/
├── configs/
│   └── prometheus.yml          # Prometheus configuration
├── controller/
│   ├── urlController.js        # URL-related request handlers
│   └── userController.js       # User authentication handlers
├── database/
│   ├── postgresql.js           # PostgreSQL connection and initialization
│   └── redis.js                # Redis connection and initialization
├── middlewares/
│   ├── metrics.js              # Prometheus metrics middleware
│   ├── session.js              # Session configuration and auth middleware
│   └── validation/
│       ├── authValidator.js    # Authentication request validation
│       └── urlValidator.js     # URL request validation
├── models/
│   ├── urlModel.js             # URL database operations
│   └── userModel.js            # User database operations
├── routes/
│   ├── authRoutes.js           # Authentication routes
│   └── urlRoutes.js            # URL management routes
├── services/
│   ├── urlServices.js          # URL caching business logic
│   └── userServices.js         # User authentication business logic
├── docker-compose.yaml         # Docker Compose configuration
├── Dockerfile                  # Application container definition
├── package.json                # Node.js dependencies and scripts
└── server.js                   # Application entry point
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v24 or higher)
- **npm** (comes with Node.js)
- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd nodejs-url-shortener
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory with the following environment variables:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=1234

# Session Configuration
SESSION_SECRET=your-secret-key-here-change-in-production

# PostgreSQL Configuration
# Default connection (if not specified, uses default pg Pool settings)
# You can also set these explicitly:
# PGHOST=localhost
# PGPORT=5432
# PGUSER=postgres
# PGPASSWORD=1234
# PGDATABASE=postgres
```

**Important**: Replace `your-secret-key-here-change-in-production` with a strong, random secret key for production use.

### Step 4: Start Docker Services

The project uses Docker Compose to manage PostgreSQL, Redis, Prometheus, Grafana, and pgAdmin. Start all services:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5432`
- **Redis Stack** on port `6379` (with RedisInsight on port `8001`)
- **pgAdmin** on port `81`
- **Prometheus** on port `9090`
- **Grafana** on port `3000`

### Step 5: Verify Services

Check that all containers are running:

```bash
docker-compose ps
```

You should see all services in "Up" status.

### Step 6: Database Initialization

The application automatically initializes the database schema on startup. The following tables will be created:

- **users**: Stores user accounts (id, email, password_hash, created_at)
- **urls**: Stores shortened URLs (id, user_id, url)

### Step 7: Run the Application

#### Development Mode

```bash
npm start
```

This uses `nodemon` to automatically restart the server on file changes.

#### Production Mode

For production, you can use Docker:

```bash
docker build -t url-shortener .
docker run -p 8080:8080 --env-file .env url-shortener
```

The application will start on `http://localhost:8080`.

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "login successful"
}
```

**Note**: Login sets a session cookie. Subsequent requests will be authenticated automatically.

### URL Endpoints

#### Create Short URL (Authenticated)
```http
POST /create
Content-Type: application/json
Cookie: connect.sid=<session-id>

{
  "url": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "id": "abc123",
  "long_url": "https://example.com/very/long/url",
  "message": "url created"
}
```

#### Get User's URLs (Authenticated)
```http
GET /urls
Cookie: connect.sid=<session-id>
```

**Response:**
```json
{
  "message": "urls found",
  "count": 2,
  "urls": [
    {
      "id": "abc123",
      "url": "https://example.com/very/long/url"
    },
    {
      "id": "xyz789",
      "url": "https://another-example.com"
    }
  ]
}
```

#### Redirect to Original URL
```http
GET /:urlId
```

**Response:** HTTP 302 redirect to the original URL

### Metrics Endpoint

#### Prometheus Metrics
```http
GET /metrics
```

Returns Prometheus-formatted metrics including:
- `url_shortener_http_request_total` - Total HTTP requests counter
- `url_shortener_http_request_duration_seconds` - Request duration histogram

## Monitoring & Observability

### Prometheus

Access Prometheus at `http://localhost:9090` to:
- View collected metrics
- Query metrics using PromQL
- Configure alerting rules

The Prometheus configuration is located in `configs/prometheus.yml` and scrapes metrics from the application endpoint.

### Grafana

Access Grafana at `http://localhost:3000`:
- Default login: `admin` / `admin` (change on first login)
- Add Prometheus as a data source: `http://prometheus:9090`
- Create dashboards to visualize application metrics

### pgAdmin

Access pgAdmin at `http://localhost:81`:
- Email: `ahmed.hesham.farag@gmail.com`
- Password: `1234`
- Add PostgreSQL server:
  - Host: `db`
  - Port: `5432`
  - Username: `postgres`
  - Password: `1234`

### RedisInsight

Access RedisInsight at `http://localhost:8001` to:
- View cached URLs
- Monitor session data
- Inspect Redis keys and values

## Configuration Details

### Database Schema

**users table:**
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `password_hash` (VARCHAR(255) NOT NULL)
- `created_at` (TIMESTAMP DEFAULT now())

**urls table:**
- `id` (VARCHAR PRIMARY KEY) - base62 encoded short URL ID
- `user_id` (INTEGER NOT NULL REFERENCES users(id))
- `url` (VARCHAR NOT NULL) - original long URL

### Session Configuration

- **Store**: Redis (with prefix `sess:`)
- **Duration**: 30 days
- **Secure**: false (set to true in production with HTTPS)

### Caching Strategy

- URLs are cached in Redis with key format: `url:{urlId}`
- Cache expiration: 24 hours (86400 seconds)
- Cache lookup happens before database query for improved performance

### URL Generation

- Uses cryptographically secure random number generation
- Base62 encoding for URL-friendly short IDs
- Collision handling with retry mechanism (up to 3 attempts)

## Development

### Project Scripts

- `npm start` - Start development server with nodemon
- `npm test` - Run tests (currently not configured)

### Code Style

The project uses ES6 modules (`"type": "module"` in package.json). All imports use the `import` syntax.

### Adding New Features

1. **Models**: Add database operations in `models/`
2. **Services**: Add business logic in `services/`
3. **Controllers**: Add request handlers in `controller/`
4. **Routes**: Define routes in `routes/`
5. **Validation**: Add validation middleware in `middlewares/validation/`

## Production Considerations

1. **Environment Variables**: Use strong, unique values for:
   - `SESSION_SECRET`
   - `REDIS_PASSWORD`
   - Database passwords

2. **Security**:
   - Enable HTTPS and set `cookie.secure: true` in session config
   - Use environment-specific configuration
   - Implement rate limiting
   - Add CORS configuration if needed

3. **Performance**:
   - Configure PostgreSQL connection pooling appropriately
   - Monitor Redis memory usage
   - Set up database backups
   - Consider read replicas for high traffic

4. **Monitoring**:
   - Set up Grafana alerts
   - Configure Prometheus alerting rules
   - Monitor application logs
   - Track error rates and response times

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `docker-compose ps`
- Check environment variables in `.env`
- Verify network connectivity between containers

### Redis Connection Issues

- Verify Redis is running: `docker-compose ps`
- Check Redis password matches in `.env`
- Verify Redis port is accessible

### Session Issues

- Clear browser cookies and try again
- Verify Redis is running and accessible
- Check `SESSION_SECRET` is set correctly

### Port Conflicts

If ports are already in use, modify `docker-compose.yaml` to use different ports.
