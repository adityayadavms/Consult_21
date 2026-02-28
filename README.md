# Consult 21

## Overview
A compelling description of Consult_21 as a web platform offering expert consultations in 13 specific domains with guaranteed 24-48 hour email response delivery, with each consutation costs only Rs 21. 
### Categories offered:
1. Health & Wellness
2. Business Strategy
3. Legal Consulting
4. Financial Planning
5. Educational Guidance
6. Technology Advisory
7. Marketing Consultation
8. Career Coaching
9. Personal Development
10. Real Estate Advice
11. IT Solutions
12. Graphic Design
13. Parenting Support
## Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.10
- **Language**: Java 21
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: JPA (Java Persistence API)
- **Mapping**: ModelMapper 3.2.1
- **Build Tool**: Maven
- **Email Service**: Spring Boot Mail

### Frontend 
- **Framework**: React.js
- **UI Library**: Tailwind CSS
- **Router**: React Router DOM
## Key Features

### Backend Implementation
- **Secure Authentication**: JWT-based authentication with Spring Security
- **Role-Based Access Control**: Implemented through Spring Security
- **Data Persistence**: PostgreSQL database with JPA/Hibernate ORM
- **Caching Layer**: Redis integration for optimized performance
- **Email Notifications**: Automated email communication via Spring Mail
- **RESTful API**: Comprehensive REST API endpoints
- **Entity Mapping**: Efficient DTO mapping using ModelMapper

### Upcoming Frontend Features
- Intuitive user interface
- Real-time consultation scheduling
- Document management system
- User profile management
- Consultation history tracking

## Project Structure

```
Consult_21/
├── src/
│   ├── main/
│   │   ├── java/com/consult/
│   │   │   ├── config/                    # Configuration classes (Spring, Security, Database)
│   │   │   ├── controller/                # REST API Controllers
│   │   │   ├── service/                   # Business logic layer
│   │   │   ├── repository/                # Data access layer (JPA Repositories)
│   │   │   ├── entity/                    # JPA Entity classes
│   │   │   ├── dto/                       # Data Transfer Objects (Request/Response models)
│   │   │   ├── security/                  # Security configurations & JWT handlers
│   │   │   ├── exception/                 # Custom exception classes
│   │   │   ├── util/                      # Utility classes & helpers
│   │   │   └── ConsultApplication.java    # Main Spring Boot entry point
│   │   └── resources/
│   │       ├── application.properties     # Application configuration
│   │       ├── application-dev.properties # Development profile
│   │       ├── application-prod.properties# Production profile
│   │       └── templates/                 # Email templates (if applicable)
│   └── test/
│       └── java/com/consult/              # Unit and integration tests
├── .mvn/                                  # Maven wrapper files
├── .gitignore                             # Git ignore configuration
├── .gitattributes                         # Git attributes configuration
├── pom.xml                                # Maven project configuration & dependencies
├── mvnw                                   # Maven wrapper (Linux/Mac)
├── mvnw.cmd                               # Maven wrapper (Windows)
└── README.md                              # Project documentation
```

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL 12+
- Redis 6+

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/adityayadavms/Consult_21.git
cd Consult_21
```
### 2. Configure Database
Create a PostgreSQL database and update the connection properties:
```
properties
spring.datasource.url=jdbc:postgresql://localhost:5432/consult_21
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
```
### 3. Configure Redis
Ensure Redis is running on your system:
```
properties
spring.redis.host=localhost
spring.redis.port=6379
```
### 4. Build the Project
```bash
mvn clean install
```
### 5. Run the Application
```bash
mvn spring-boot:run
```
The backend server will start on http://localhost:8080 by default.

## API Documentation
The API follows RESTful conventions. Comprehensive API documentation and endpoints will be available once the frontend is integrated.

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Advanced Security Features

#### 1. **Token Management**
- **Access & Refresh Tokens**: Short-lived access tokens with refresh token rotation for enhanced security
- **Refresh Token Rotation**: Tokens are automatically rotated on each refresh to minimize exposure window
- **Token Blacklisting with Redis**: Revoked tokens are immediately invalidated and stored in Redis

#### 2. **Brute Force Protection**
- **Max Login Attempts**: Limited to 5 failed login attempts
- **Account Lockout**: After exceeding max attempts, account is locked for **15 minutes**
- **Prevents credential stuffing and brute force attacks**

#### 3. **Session Management**
- **Redis-backed Session Storage**: Centralized session management for consistent state
- **Multi-tab Logout**: Logging out from one session automatically logs out from all other tabs/devices
- **Real-time Session Invalidation**: Ensures compromised sessions are immediately revoked across all devices

#### 4. **CORS Security**
- **CORS Filter**: Configured to prevent unauthorized cross-origin requests
- **Origin Whitelisting**: Only trusted domains can access the API

#### 5. **Secure Password Reset**
- **Forgot Password Feature**: Allows registered users to securely reset forgotten passwords
- **Secure Token-based Reset**: Time-limited reset tokens prevent unauthorized password changes
- **Email Verification**: Password reset links are sent to registered email addresses
## Configuration
### Application Properties
Key configuration properties to be set in application.properties:
properties
```
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# JWT Configuration
jwt.expiration=86400000

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```
## Dependencies
### Core Dependencies
Spring Boot Starter Web: Web application development
Spring Boot Starter Security: Authentication and authorization
Spring Boot Starter Data JPA: Database operations
Spring Boot Starter Data Redis: Caching layer
PostgreSQL Driver: Database connectivity
Lombok: Reducing boilerplate code
### Security & Token Management
JJWT API v0.12.6: JWT creation and validation
JJWT Implementation: JWT processing
JJWT Jackson: JSON parsing for JWT
### Additional
Spring Boot Mail: Email functionality
ModelMapper: Object mapping
