# Consult 21

> **A Digital Consultation Platform for Expert Advice at Affordable Rates**

Consult 21 is a full-stack consultation booking and delivery platform that connects users with expert consultants across 13 specialized domains. Users can book consultations for just ₹21 and receive detailed, professional guidance within 24-48 hours.

**Live Demo:** [https://consult-21.vercel.app](https://consult-21.vercel.app)

---

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Consultation Categories](#consultation-categories)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

##  Overview

Consult 21 is designed to democratize access to professional consultation services by offering expert advice in 13 different categories at an extremely affordable price point. The platform employs a modern, scalable architecture with a Spring Boot backend and React.js frontend.

### Key Value Propositions
- **Affordable Pricing:** Professional consultations at just ₹21
- **Quick Turnaround:** Detailed responses within 24-48 hours
- **Diverse Categories:** 13 specialized consultation domains
- **Secure Transactions:** Payment integration via CashFree
- **User-Friendly Interface:** Intuitive design with Tailwind CSS

---

##  Features

### Backend Features
- **Secure Authentication & Authorization**
  - JWT-based authentication with Spring Security
  - Role-based access control for users and consultants
  - Secure token validation and refresh mechanisms
  - Brute force protection with account lockout (15 minutes after 5 failed attempts)
  - Token blacklisting with Redis for immediate revocation

- **Consultation Management**
  - Create, read, and manage consultations
  - Track consultation status and history
  - Automated email notifications
  - PDF generation for consultation reports

- **Payment Processing**
  - CashFree payment gateway integration
  - Secure transaction handling
  - Payment status tracking

- **Caching & Performance**
  - Redis caching layer for optimized database queries
  - Session management with Redis
  - Multi-device logout capability

- **Email Communication**
  - Automated email notifications for consultations
  - Secure password reset with time-limited tokens
  - Template-based email system
  - SMTP configuration via Spring Mail

- **Data Persistence**
  - PostgreSQL with JPA/Hibernate ORM
  - Type-safe queries with strong entity relationships
  - Hibernate Types support for advanced data mapping

### Frontend Features
- **Modern User Interface**
  - Responsive design with Tailwind CSS
  - Component-based architecture with React
  - Smooth navigation with React Router

- **Consultation Booking**
  - Intuitive category selection interface
  - Consultation inquiry form with validation
  - Real-time form feedback

- **User Dashboard**
  - View booking history
  - Track consultation status
  - Download consultation documents

- **Payment Integration**
  - CashFree payment gateway integration
  - Secure payment processing
  - Payment confirmation and receipts

- **Toast Notifications**
  - Real-time feedback with React Hot Toast
  - Error and success messaging
  - FontAwesome icons for visual feedback

---

##  Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Java** | 21 | Programming Language |
| **Spring Boot** | 3.5.10 | Application Framework |
| **PostgreSQL** | Latest | Relational Database |
| **Redis** | Latest | Caching & Session Store |
| **Spring Security** | Latest | Authentication & Authorization |
| **JWT (jjwt)** | 0.12.6 | Token-based Authentication |
| **Spring Data JPA** | Latest | ORM & Database Access |
| **Hibernate** | 60 | Object-Relational Mapping |
| **ModelMapper** | 3.2.1 | DTO Mapping |
| **Spring Mail** | Latest | Email Service |
| **PDFBox** | 3.0.5 | PDF Generation |
| **OkHttp** | 4.10.0 | HTTP Client (CashFree) |
| **Maven** | Latest | Build Tool |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **React Router DOM** | 7.13.0 | Client-side Routing |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS Framework |
| **Vite** | 7.2.4 | Build Tool & Dev Server |
| **Axios** | 1.13.6 | HTTP Client |
| **JWT Decode** | 4.0.0 | JWT Token Decoding |
| **React Hot Toast** | 2.6.0 | Toast Notifications |
| **CashFree React** | 1.0.3 | Payment Gateway Integration |
| **FontAwesome** | 7.3.0 | Icon Library |
| **ESLint** | 9.39.1 | Code Quality & Linting |

---

##  Project Structure

```
Consult_21/
├── src/                                    # Backend source code
│   ├── main/
│   │   ├── java/com/consult/
│   │   │   ├── config/                     # Spring & Security configuration
│   │   │   ├── controller/                 # REST API endpoints
│   │   │   ├── service/                    # Business logic layer
│   │   │   ├── repository/                 # JPA Repository interfaces
│   │   │   ├── entity/                     # JPA Entity classes
│   │   │   ├── dto/                        # Data Transfer Objects
│   │   │   ├── security/                   # JWT & Security handlers
│   │   │   ├── exception/                  # Custom exception classes
│   │   │   ├── util/                       # Utility & Helper classes
│   │   │   └── ConsultApplication.java    # Spring Boot entry point
│   │   └── resources/
│   │       ├── application.properties      # Default configuration
│   │       ├── application-dev.properties  # Development profile
│   │       ├── application-prod.properties # Production profile
│   │       └── templates/                  # Email templates
│   └── test/                               # Unit & Integration tests
│
├── frontend/consult/                       # Frontend source code
│   ├── src/
│   │   ├── components/                     # React components
│   │   ├── pages/                          # Page components
│   │   ├── services/                       # API integration services
│   │   ├── contexts/                       # React Context (state management)
│   │   ├── utils/                          # Utility functions
│   │   ├── App.jsx                         # Root application component
│   │   └── main.jsx                        # React entry point
│   ├── package.json                        # Dependencies & scripts
│   ├── vite.config.js                      # Vite configuration
│   ├── tailwind.config.js                  # Tailwind CSS configuration
│   └── eslint.config.js                    # ESLint configuration
│
├── pom.xml                                 # Maven project configuration
├── mvnw / mvnw.cmd                         # Maven wrapper
├── .gitignore                              # Git ignore file
└── README.md                               # Project documentation
```

---

##  Prerequisites

### System Requirements
- **Java Development Kit (JDK):** Version 21 or higher
- **Node.js:** Version 16 or higher
- **npm:** Version 8 or higher
- **PostgreSQL:** Version 12 or higher
- **Redis:** Latest version (optional, for caching)
- **Git:** For version control

### Required Accounts & Services
- PostgreSQL database (local or cloud-based)
- CashFree Payments account (for payment processing)
- Email service credentials (SMTP for email notifications)

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/adityayadavms/Consult_21.git
cd Consult_21
```

### 2. Backend Setup

#### Step 2.1: Database Configuration
Create a PostgreSQL database:
```sql
CREATE DATABASE consult_21;
```

Update `src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/consult_21
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

#### Step 2.2: Redis Configuration (Optional but Recommended)
```properties
# Redis Configuration
spring.redis.host=localhost
spring.redis.port=6379
spring.redis.database=0
```

#### Step 2.3: Build the Backend
```bash
# Using Maven wrapper
./mvnw clean install

# Or if Maven is installed globally
mvn clean install
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/consult

# Install dependencies
npm install

# Verify installation
npm list
```

---

##  Running the Application

### Start Backend Server
```bash
# From project root directory
./mvnw spring-boot:run

# Or using Maven globally
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### Start Frontend Development Server
```bash
# From frontend/consult directory
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the URL displayed in your terminal)

### Production Build
```bash
# Build frontend for production
cd frontend/consult
npm run build

# Preview production build locally
npm run preview

# Deploy built files to your hosting service
# (Currently deployed at https://consult-21.vercel.app)
```

### Lint Frontend Code
```bash
cd frontend/consult
npm run lint
```

---

##  API Documentation

The backend provides RESTful API endpoints for consultation booking and management.

**Base URL:** `http://localhost:8080/api`

### Main Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---|
| `/auth/register` | POST | User registration | No |
| `/auth/login` | POST | User login | No |
| `/auth/refresh` | POST | Refresh JWT token | Yes |
| `/auth/forgot-password` | POST | Initiate password reset | No |
| `/consultations` | GET | List all consultations | Yes |
| `/consultations` | POST | Create new consultation | Yes |
| `/consultations/{id}` | GET | Get consultation details | Yes |
| `/consultations/{id}` | PUT | Update consultation | Yes |
| `/consultations/{id}` | DELETE | Delete consultation | Yes |
| `/categories` | GET | List all categories | No |
| `/categories/{id}` | GET | Get category details | No |
| `/users/profile` | GET | Get user profile | Yes |
| `/users/profile` | PUT | Update user profile | Yes |
| `/payments/initiate` | POST | Initiate payment | Yes |
| `/payments/verify` | POST | Verify payment status | Yes |

### Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

For detailed API documentation, use API testing tools:
- **Postman:** Import the API collection
- **Insomnia:** REST client for testing
- **Swagger/OpenAPI:** (If integrated in future versions)

---

##  Consultation Categories

Consult 21 offers expert consultations in 13 specialized domains:

1. **Health & Wellness** - Medical advice and health coaching
2. **Business Strategy** - Business planning and growth strategies
3. **Legal Consulting** - Legal guidance and compliance
4. **Financial Planning** - Investment and financial advice
5. **Educational Guidance** - Academic and career planning
6. **Technology Advisory** - Tech solutions and consulting
7. **Marketing Consultation** - Marketing strategies and campaigns
8. **Career Coaching** - Career development and job search
9. **Personal Development** - Personal growth and coaching
10. **Real Estate Advice** - Property and real estate guidance
11. **IT Solutions** - IT infrastructure and support
12. **Graphic Design** - Design consultation and services
13. **Parenting Support** - Parenting advice and guidance

---

##  Environment Variables

### Backend Configuration
Create or update `src/main/resources/application.properties`:

```properties
# ========== Server Configuration ==========
server.port=you_port
server.servlet.context-path=/api

# ========== Database ==========
spring.datasource.url= your_db_url
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# ========== JWT Configuration ==========
app.jwt.secret=your_very_secure_jwt_secret_key_at_least_256_bits
app.jwt.expiration=86400000
app.jwt.refresh-expiration=604800000

# ========== Redis ==========
spring.redis.host=localhost
spring.redis.port=your_port
spring.redis.database=0

# ========== Email Configuration ==========
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_specific_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
app.mail.from=noreply@consult21.com

# ========== CashFree Payment Gateway ==========
cashfree.merchant.id=your_merchant_id
cashfree.app.id=your_app_id
cashfree.secret.key=your_secret_key
cashfree.environment=PRODUCTION
```

### Frontend Configuration
Create `.env` file in `frontend/consult/`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_CASHFREE_PUBLIC_KEY=your_cashfree_public_key
VITE_APP_NAME=Consult21
VITE_APP_VERSION=0.0.1
```

### Environment-Specific Profiles
Create additional profile files for different environments:

**`application-dev.properties`** (Development)
```properties
spring.jpa.show-sql=true
logging.level.root=INFO
logging.level.com.consult=DEBUG
```

**`application-prod.properties`** (Production)
```properties
spring.jpa.show-sql=false
logging.level.root=WARN
spring.datasource.hikari.maximum-pool-size=20
```

Run with specific profile:
```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

---

##  Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/your-feature-name`
3. **Make your changes and commit:** `git commit -m "Add: Your feature description"`
4. **Push to branch:** `git push origin feature/your-feature-name`
5. **Open a Pull Request** with a clear description of changes

### Code Standards
- **Backend (Java):** Follow Google Java Style Guide
- **Frontend (React):** Follow Airbnb React Style Guide
- **Commit Messages:** Use conventional commits (feat:, fix:, docs:, etc.)
- **Testing:** Write unit tests for new features
- **Documentation:** Update README and API docs as needed

### Reporting Issues
If you find a bug or have a suggestion:
1. Check if the issue already exists
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Environment details

---

##  License

This project is open source. Usage and distribution follow standard open-source practices.

---

##  Author

**Aditya Yadav**
- GitHub: [@adityayadavms](https://github.com/adityayadavms)
- Repository: [Consult_21](https://github.com/adityayadavms/Consult_21)

---

##  Acknowledgments

- **Spring Boot Framework** - Robust backend development
- **React.js** - Modern frontend development
- **PostgreSQL** - Reliable data persistence
- **Redis** - High-performance caching
- **CashFree Payments** - Secure payment processing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server

---

