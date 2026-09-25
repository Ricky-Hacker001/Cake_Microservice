# Development Guide

## 1. Backend structure

Each Node.js microservice follows a similar structure:

```text
<service>/
├── Dockerfile
├── package.json
├── .env
└── src/
    ├── app.js
    ├── config/
    ├── middleware/
    ├── model/
    ├── route/
    ├── service/        # where required
    ├── consumer/       # notification service
    └── logger.js
```

## 2. Backend conventions

The services use:

- Express for HTTP APIs
- Mongoose for MongoDB access
- express-validator for input validation
- Axios for synchronous service calls
- amqplib for RabbitMQ
- Winston for logging
- dotenv for environment configuration
- Multer for cake image upload

## 3. Frontend structure

```text
cake-delight-frontend/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   └── admin/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── Dockerfile
├── nginx.conf
└── vite.config.js
```

## 4. Running a service locally

Install dependencies:

```bash
npm install
```

Start a service using its package script:

```bash
npm start
```

The package scripts use Nodemon.

## 5. Environment variables

Typical service variables:

### Cake Catalog

```text
MONGO_URL=<catalog mongodb connection string>
```

### Order Service

```text
MONGO_URI=<order mongodb connection string>
RABBITMQ_URL=<rabbitmq connection string>
CAKE_CATALOG_URL=<cake catalog base URL>
```

### Notification Service

```text
MONGO_URL=<notification mongodb connection string>
RABBITMQ_URL=<rabbitmq connection string>
```

### Rating Service

```text
MONGO_URL=<rating mongodb connection string>
CAKE_CATALOG_URL=<cake catalog base URL>
```

### Frontend

```text
VITE_API_BASE_URL=<gateway base URL>
```

## 6. Adding a new endpoint

Recommended sequence:

1. Add/modify the Mongoose model if persistent data changes.
2. Add validation middleware.
3. Implement the route.
4. Add logging for important business actions and errors.
5. Register the route in `app.js`.
6. Confirm gateway routing.
7. Update `docs/API_DOCUMENTATION.md`.
8. Update `docs/openapi.yaml`.
9. Update frontend API usage if required.
10. Test locally and through the gateway.

## 7. Service communication rule

Use direct REST calls when the caller needs an immediate answer.

Use RabbitMQ events when the action can be processed asynchronously and should not tightly couple the services.

Current examples:

```text
Order -> Cake Catalog       synchronous REST
Rating -> Cake Catalog      synchronous REST
Order -> Notification      asynchronous RabbitMQ
```

## 8. Logging

Use the existing logger rather than adding unrelated logging approaches.

Log:

- Important state changes
- IDs required for tracing
- External service failures
- RabbitMQ events
- Validation/business failures

Avoid logging passwords, tokens or other secrets.
