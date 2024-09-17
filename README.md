# Nest-Postgresql Project

This project is a NestJS application that integrates with PostgreSQL and Elasticsearch. 
It handles the creation and management of various tables, including appointments, 
customers, locations, service providers, and users. It also supports 
Elasticsearch for storing and querying data efficiently.

...
## Project Structure

The project architecture:


Nest-postgresql
│
├── sql
│   ├── create_appointments_table.sql
│   ├── create_customers_table.sql
│   ├── create_location_table.sql
│   ├── create_service_providers_table.sql
│   └── create_users_table.sql
│
├── src
│   ├── configuration
│   │   └── configuration.ts
│   │
│   ├── controllers
│   │   ├── appointment.controller.ts
│   │   ├── customer.controller.ts
│   │   ├── elasticsearch.controller.ts
│   │   ├── location.controller.ts
│   │   ├── service_provider.controller.ts
│   │   ├── technical.logs.controller.ts
│   │   └── users.controller.ts
│   │
│   ├── dto
│   │   ├── appointment.dto.ts
│   │   ├── customer.dto.ts
│   │   ├── location.dto.ts
│   │   ├── service_provider.dto.ts
│   │   └── user.dto.ts
│   │
│   ├── elasticsearch
│   │   └── elasticsearch.service.ts
│   │
│   ├── entities
│   │   ├── appointment.entity.ts
│   │   ├── base.entity.ts
│   │   ├── customer.entity.ts
│   │   ├── error_log.entity.ts
│   │   ├── location.entity.ts
│   │   ├── service_provider.entity.ts
│   │   └── user.entity.ts
│   │
│   ├── filters
│   │   └── all_exceptions_filter.ts
│   │
│   ├── modules
│   │   ├── appointment.module.ts
│   │   ├── customer.module.ts
│   │   ├── elasticsearch.module.ts
│   │   ├── location.module.ts
│   │   ├── serviceProvider.module.ts
│   │   ├── time.module.ts
│   │   └── user.module.ts
│   │
│   ├── search
│   │   └── search.controller.ts
│   │
│   ├── services
│   │   ├── appointment.service.ts
│   │   ├── base.service.ts
│   │   ├── customer.service.ts
│   │   ├── location.service.ts
│   │   ├── service_provider.service.ts
│   │   ├── time.service.ts
│   │   └── users.service.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
└── .env

...
Create a .env file in the root directory and provide the necessary configurations:

DB_TYPE=postgres
DB_HOST=<YOUR_DB_HOST>
DB_PORT=<YOUR_DB_PORT>
DB_USERNAME=<YOUR_DB_USERNAME>
DB_PASSWORD=<YOUR_DB_PASSWORD>
DB_DATABASE=<YOUR_DB_NAME>
ELASTIC_NODE=<YOUR_ELASTIC_NODE>
ELASTIC_USER=<YOUR_ELASTIC_USER>
ELASTIC_PASSWORD=<YOUR_ELASTIC_PASSWORD>
ELASTIC_INDEX=<YOUR_ELASTIC_INDEX>
ELASTIC_EXCEPTION_INDEX=business_logs
TIMEZONE=Asia/Jerusalem
