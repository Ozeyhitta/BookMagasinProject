# BookMagasin Backend Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Security](#security)
9. [Architecture Patterns](#architecture-patterns)
10. [Development Guidelines](#development-guidelines)

---

## Project Overview

BookMagasin is a Spring Boot-based backend application for managing a bookstore system. It provides RESTful APIs for handling books, orders, users, authentication, payments, and various bookstore operations.

**Key Features:**

- User authentication and authorization (JWT-based)
- Book management (CRUD operations)
- Order processing and management
- Shopping cart functionality
- Payment processing
- Review and rating system
- Notification system
- Promotion and discount management
- Service booking system

---

## Technology Stack

### Core Framework

- **Spring Boot 3.5.5** - Main application framework
- **Java 21** - Programming language
- **Maven** - Build and dependency management

### Database

- **MySQL 8** - Relational database
- **Hibernate JPA** - ORM framework
- **Spring Data JPA** - Data access layer

### Security

- **Spring Security** - Authentication and authorization
- **JWT (JSON Web Tokens)** - Token-based authentication
- **BCrypt** - Password encryption

### Additional Libraries

- **Lombok** - Reduces boilerplate code
- **Jackson** - JSON serialization/deserialization
- **SendGrid** - Email service integration
- **Spring Mail** - Email functionality
- **Spring Dotenv** - Environment variable management

---

## Project Structure

```
bookmagasin_backend/
├── src/
│   ├── main/
│   │   ├── java/com/bookmagasin/
│   │   │   ├── config/              # Configuration classes
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── WebConfig.java
│   │   │   ├── entity/              # JPA entities (database models)
│   │   │   │   ├── Account.java
│   │   │   │   ├── User.java
│   │   │   │   ├── Book.java
│   │   │   │   ├── Order.java
│   │   │   │   └── ... (18 entities)
│   │   │   ├── enums/               # Enumeration types
│   │   │   │   ├── ERole.java
│   │   │   │   ├── EStatusPayment.java
│   │   │   │   └── ... (5 enums)
│   │   │   ├── repository/          # Data access layer
│   │   │   │   └── ... (18 repositories)
│   │   │   ├── service/             # Business logic layer
│   │   │   │   ├── impl/            # Service implementations
│   │   │   │   └── ... (36 services)
│   │   │   ├── util/                # Utility classes
│   │   │   │   └── JwtUtil.java
│   │   │   ├── web/
│   │   │   │   ├── controller/      # REST controllers (18 controllers)
│   │   │   │   ├── dto/             # Data Transfer Objects (19 DTOs)
│   │   │   │   ├── dtoResponse/     # Response DTOs (16 DTOs)
│   │   │   │   └── mapper/           # Entity-DTO mappers (15 mappers)
│   │   │   └── DemoApplication.java # Main application entry point
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        # Test files
└── pom.xml                          # Maven configuration
```

---

## Setup Instructions

### Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd BookMagasinProject/bookmagasin_backend
   ```

2. **Create MySQL database**

   ```sql
   CREATE DATABASE bookmagasin;
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend root (this repository already contains a template) or set environment variables:

   ```env
   JWT_SECRET=your-secret-key-here
   SPRING_MAIL_HOST=smtp.gmail.com
   SPRING_MAIL_PORT=587
   SPRING_MAIL_USERNAME=your-email@gmail.com
   SPRING_MAIL_PASSWORD=your-app-password
   SPRING_MAIL_SMTP_AUTH=true
   SPRING_MAIL_SMTP_STARTTLS_ENABLE=true

   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/bookmagasin?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Ho_Chi_Minh
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=your-db-password
   ```

   The application now auto-loads `.env` via `spring.config.import`, so you can change credentials without touching `application.properties`.

5. **Build the project**

   ```bash
   mvn clean install
   ```

6. **Run the application**

   ```bash
   mvn spring-boot:run
   ```

   Or run `DemoApplication.java` from your IDE.

7. **Verify the application**
   The API will be available at: `http://localhost:8080`

---

## Configuration

### Application Properties

Key configuration in `application.properties`:

```properties
# Application
spring.application.name=demo

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/bookmagasin
spring.datasource.username=root
spring.datasource.password=1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Jackson (JSON)
spring.jackson.serialization.indent_output=true
spring.jackson.default-property-inclusion=NON_NULL

# JWT
jwt.secret=${JWT_SECRET}

# Email Configuration
spring.mail.host=${SPRING_MAIL_HOST}
spring.mail.port=${SPRING_MAIL_PORT}
spring.mail.username=${SPRING_MAIL_USERNAME}
spring.mail.password=${SPRING_MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=${SPRING_MAIL_SMTP_AUTH:true}
spring.mail.properties.mail.smtp.starttls.enable=${SPRING_MAIL_SMTP_STARTTLS_ENABLE:true}
```

### Security Configuration

- **CORS**: Configured to allow requests from `http://localhost:3000` (Next.js frontend)
- **CSRF**: Disabled for REST API
- **Session Management**: Stateless (JWT-based)
- **Password Encoding**: BCrypt

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register Customer

```http
POST /api/auth/register-customer
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "0123456789",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "address": "123 Main St"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "userId": 1,
  "email": "customer@example.com",
  "role": "CUSTOMER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### User Management

#### Get All Users

```http
GET /api/users
```

#### Get User by ID

```http
GET /api/users/{id}
```

#### Get User by Phone

```http
GET /api/users/phone/{phone}
```

#### Create User

```http
POST /api/users
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "phoneNumber": "0987654321",
  "dateOfBirth": "1995-05-15",
  "gender": "Female",
  "address": "456 Oak Ave"
}
```

#### Update User

```http
PUT /api/users/{id}
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "phoneNumber": "0987654321"
}
```

### Account Management

#### Get All Accounts

```http
GET /api/accounts
```

#### Get Account by ID

```http
GET /api/accounts/{id}
```

#### Get Account by Email

```http
GET /api/accounts/email/{email}
```

#### Create Account

```http
POST /api/accounts
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "CUSTOMER",
  "userId": 1
}
```

#### Update Account

```http
PUT /api/accounts/{id}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "isActivated": true
}
```

### Book Management

#### Get All Books

```http
GET /api/books
```

**Response:** Returns list of books with details (author, bookDetail)

#### Get Book by ID

```http
GET /api/books/{id}
```

#### Create Book

```http
POST /api/books
Content-Type: application/json

{
  "title": "Spring Boot Guide",
  "authorId": 1,
  "bookDetailId": 1,
  "price": 29.99,
  "stock": 100
}
```

#### Update Book

```http
PUT /api/books/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 34.99
}
```

#### Delete Book

```http
DELETE /api/books/{id}
```

### Order Management

#### Get All Orders

```http
GET /api/orders
```

#### Get Order by ID

```http
GET /api/orders/{id}
```

#### Create Order

```http
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "orderItems": [
    {
      "bookId": 1,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "totalAmount": 59.98,
  "status": "PENDING"
}
```

#### Delete Order

```http
DELETE /api/orders/{id}
```

### Cart Management

#### Get Cart Items

```http
GET /api/carts/user/{userId}
```

#### Add to Cart

```http
POST /api/carts
Content-Type: application/json

{
  "userId": 1,
  "bookId": 1,
  "quantity": 2
}
```

#### Update Cart Item

```http
PUT /api/carts/{id}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Delete Cart Item

```http
DELETE /api/carts/{id}
```

### Category Management

#### Get All Categories

```http
GET /api/categories
```

#### Get Category by ID

```http
GET /api/categories/{id}
```

#### Create Category

```http
POST /api/categories
Content-Type: application/json

{
  "name": "Fiction",
  "description": "Fiction books"
}
```

### Review Management

#### Get All Reviews

```http
GET /api/reviews
```

#### Get Review by ID

```http
GET /api/reviews/{id}
```

#### Create Review

```http
POST /api/reviews
Content-Type: application/json

{
  "userId": 1,
  "bookId": 1,
  "rating": 5,
  "comment": "Great book!"
}
```

### Payment Management

#### Get All Payments

```http
GET /api/payments
```

#### Get Payment by ID

```http
GET /api/payments/{id}
```

#### Create Payment

```http
POST /api/payments
Content-Type: application/json

{
  "orderId": 1,
  "amount": 59.98,
  "method": "CREDIT_CARD",
  "status": "PENDING"
}
```

### Promotion Management

#### Get All Promotions

```http
GET /api/promotions
```

#### Get Promotion by ID

```http
GET /api/promotions/{id}
```

#### Create Promotion

```http
POST /api/promotions
Content-Type: application/json

{
  "code": "SUMMER2024",
  "discountPercent": 20,
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "description": "Summer sale"
}
```

### Service Management

#### Get All Services

```http
GET /api/services
```

#### Get Service by ID

```http
GET /api/services/{id}
```

#### Create Service

```http
POST /api/services
Content-Type: application/json

{
  "name": "Book Repair",
  "description": "Professional book repair service",
  "price": 15.00
}
```

### Notification Management

#### Get All Notifications

```http
GET /api/notifications
```

#### Get Notification by ID

```http
GET /api/notifications/{id}
```

#### Create Notification

```http
POST /api/notifications
Content-Type: application/json

{
  "title": "New Book Arrival",
  "content": "Check out our new arrivals!",
  "type": "INFO"
}
```

### Password Reset

#### Request Password Reset

```http
POST /api/password/reset-request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password

```http
POST /api/password/reset
Content-Type: application/json

{
  "token": "reset-token",
  "newPassword": "newpassword123"
}
```

---

## Database Schema

### Core Entities

#### Account

- `id` (INT, PK, Auto)
- `email` (VARCHAR, Unique, Not Null)
- `password` (VARCHAR, Not Null)
- `role` (ENUM: ADMIN, STAFF, CUSTOMER)
- `is_activated` (BOOLEAN)
- `user_id` (INT, FK → User)

#### User

- `id` (INT, PK, Auto)
- `full_name` (VARCHAR)
- `date_of_birth` (DATE)
- `gender` (VARCHAR)
- `phone_number` (VARCHAR)
- `address` (VARCHAR)
- `avatar_url` (VARCHAR)
- `position` (VARCHAR)
- `join_date` (DATE)

**Inheritance:**

- `RegisteredCustomer` extends `User`
- `Staff` extends `User`
- `Admin` extends `User`

#### Book

- `id` (INT, PK, Auto)
- `title` (VARCHAR)
- `author_id` (INT, FK)
- `book_detail_id` (INT, FK)
- `price` (DECIMAL)
- `stock` (INT)
- `category_id` (INT, FK)

#### Order

- `id` (INT, PK, Auto)
- `user_id` (INT, FK → User)
- `total_amount` (DECIMAL)
- `status` (ENUM)
- `created_date` (TIMESTAMP)

#### OrderItem

- `id` (INT, PK, Auto)
- `order_id` (INT, FK → Order)
- `book_id` (INT, FK → Book)
- `quantity` (INT)
- `price` (DECIMAL)

#### Cart

- `id` (INT, PK, Auto)
- `user_id` (INT, FK → User)
- `book_id` (INT, FK → Book)
- `quantity` (INT)

#### Payment

- `id` (INT, PK, Auto)
- `order_id` (INT, FK → Order)
- `amount` (DECIMAL)
- `method` (ENUM)
- `status` (ENUM)
- `payment_date` (TIMESTAMP)

#### Review

- `id` (INT, PK, Auto)
- `user_id` (INT, FK → User)
- `book_id` (INT, FK → Book)
- `rating` (INT)
- `comment` (TEXT)
- `created_date` (TIMESTAMP)

#### Promotion

- `id` (INT, PK, Auto)
- `code` (VARCHAR, Unique)
- `discount_percent` (DECIMAL)
- `start_date` (DATE)
- `end_date` (DATE)
- `description` (TEXT)

#### Category

- `id` (INT, PK, Auto)
- `name` (VARCHAR)
- `description` (TEXT)

#### Service

- `id` (INT, PK, Auto)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)

#### Notification

- `id` (INT, PK, Auto)
- `title` (VARCHAR)
- `content` (TEXT)
- `type` (VARCHAR)
- `created_date` (TIMESTAMP)

---

## Security

### Authentication Flow

1. **Registration**: User registers with email and password

   - Password is hashed using BCrypt
   - Account is created with role (CUSTOMER by default)

2. **Login**: User provides email and password

   - System validates credentials
   - Checks if account is activated
   - Generates JWT token (valid for 1 hour)
   - Returns token to client

3. **Token Usage**: Client includes token in Authorization header

   ```
   Authorization: Bearer <token>
   ```

4. **Logout**: Token is added to blacklist

### JWT Token Structure

- **Algorithm**: HS256
- **Expiration**: 1 hour (3600 seconds)
- **Claims**:
  - `sub`: Email address
  - `iat`: Issued at timestamp
  - `exp`: Expiration timestamp

### Password Security

- Passwords are hashed using BCrypt
- Never stored in plain text
- Minimum security requirements should be enforced in frontend

### CORS Configuration

- Allowed Origins: `http://localhost:3000` (Next.js frontend)
- Allowed Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Allowed Headers: All headers
- Credentials: Not enabled (due to wildcard patterns)

---

## Architecture Patterns

### Layered Architecture

1. **Controller Layer** (`web.controller`)

   - Handles HTTP requests/responses
   - Validates input
   - Delegates to service layer

2. **Service Layer** (`service`)

   - Contains business logic
   - Interfaces defined in `service` package
   - Implementations in `service.impl` package

3. **Repository Layer** (`repository`)

   - Data access operations
   - Extends `JpaRepository`
   - Custom queries using `@Query`

4. **Entity Layer** (`entity`)

   - JPA entities representing database tables
   - Relationships defined using JPA annotations

5. **DTO Layer** (`web.dto` & `web.dtoResponse`)

   - Data Transfer Objects for API communication
   - Separates internal entities from external API contracts

6. **Mapper Layer** (`web.mapper`)
   - Converts between entities and DTOs
   - Reduces coupling between layers

### Design Patterns Used

- **Repository Pattern**: Data access abstraction
- **Service Pattern**: Business logic encapsulation
- **DTO Pattern**: Data transfer separation
- **Dependency Injection**: Spring's IoC container
- **Builder Pattern**: Lombok's `@Builder` annotation

---

## Development Guidelines

### Code Style

- Follow Java naming conventions
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Keep methods focused and single-purpose

### Entity Guidelines

- Use Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`)
- Define relationships clearly with JPA annotations
- Use `@JsonManagedReference` and `@JsonBackReference` to prevent circular references
- Set appropriate cascade types

### Service Guidelines

- Keep business logic in service layer, not controllers
- Use interfaces for services (dependency inversion)
- Handle exceptions appropriately
- Return Optional for methods that might not find data

### Controller Guidelines

- Keep controllers thin (delegate to services)
- Use appropriate HTTP status codes
- Return ResponseEntity for better control
- Validate input using DTOs

### DTO Guidelines

- Create separate DTOs for request and response
- Don't expose internal entity structure
- Include only necessary fields
- Use validation annotations when needed

### Error Handling

- Use appropriate HTTP status codes:
  - `200 OK`: Successful GET, PUT, PATCH
  - `201 Created`: Successful POST
  - `204 No Content`: Successful DELETE
  - `400 Bad Request`: Invalid input
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions
  - `404 Not Found`: Resource not found
  - `500 Internal Server Error`: Server error

### Testing

- Write unit tests for services
- Write integration tests for controllers
- Use `@SpringBootTest` for integration tests
- Mock dependencies in unit tests

### Database Migrations

- Currently using `spring.jpa.hibernate.ddl-auto=update`
- For production, consider using Flyway or Liquibase
- Never use `update` in production without backups

### Logging

- Use SLF4J for logging
- Log important operations (create, update, delete)
- Don't log sensitive information (passwords, tokens)
- Use appropriate log levels (DEBUG, INFO, WARN, ERROR)

---

## Environment Variables

Required environment variables:

| Variable                           | Description                      | Example                |
| ---------------------------------- | -------------------------------- | ---------------------- |
| `JWT_SECRET`                       | Secret key for JWT token signing | `your-secret-key-here` |
| `SPRING_MAIL_HOST`                 | SMTP server host                 | `smtp.gmail.com`       |
| `SPRING_MAIL_PORT`                 | SMTP server port                 | `587`                  |
| `SPRING_MAIL_USERNAME`             | Email username                   | `your-email@gmail.com` |
| `SPRING_MAIL_PASSWORD`             | Email password/app password      | `your-app-password`    |
| `SPRING_MAIL_SMTP_AUTH`            | Enable SMTP authentication       | `true`                 |
| `SPRING_MAIL_SMTP_STARTTLS_ENABLE` | Enable STARTTLS                  | `true`                 |

---

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Check MySQL is running
   - Verify credentials in `application.properties`
   - Ensure database exists

2. **JWT Token Issues**

   - Verify `JWT_SECRET` is set
   - Check token expiration
   - Ensure token is in Authorization header

3. **CORS Errors**

   - Verify frontend URL matches allowed origins
   - Check SecurityConfig and WebConfig

4. **Email Not Sending**

   - Verify email credentials
   - Check SMTP settings
   - For Gmail, use App Password instead of regular password

5. **Port Already in Use**
   - Change port in `application.properties`: `server.port=8081`
   - Or stop the process using port 8080

---

## Future Improvements

- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Implement role-based access control (RBAC)
- [ ] Add request validation using Bean Validation
- [ ] Implement pagination for list endpoints
- [ ] Add filtering and sorting capabilities
- [ ] Implement caching for frequently accessed data
- [ ] Add comprehensive error handling with custom exceptions
- [ ] Implement rate limiting
- [ ] Add API versioning
- [ ] Set up CI/CD pipeline
- [ ] Add comprehensive test coverage
- [ ] Implement database migrations with Flyway
- [ ] Add monitoring and logging (e.g., Spring Boot Actuator)

---

## Contact & Support

For issues, questions, or contributions, please contact the development team or create an issue in the repository.

---

**Last Updated**: 2024
**Version**: 0.0.1-SNAPSHOT
