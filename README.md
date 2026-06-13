<div align="center">
  <h1> Enviro365 Investment Management System</h1>
  <p>
    <strong>Full-Stack Technical Assessment — Junior Developer 2026</strong>
  </p>
  <p>
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-business-rules">Business Rules</a> •
    <a href="#-screenshots">Screenshots</a>
  </p>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.6-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=java&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/H2%20Database-In--Memory-003B57?style=for-the-badge&logo=h2&logoColor=white" alt="H2">
</div>

 Overview
Enviro365 is a full-stack investment management application built as a junior developer assessment for eTalente. The system automates the withdrawal notice process, allowing investors to:

 View portfolio details and investment products

 Submit withdrawal notices with real-time validation

 Track transaction history

 Download CSV statements with date filtering

Assessment: Junior Developer Assessment June 2026
Organization: eTalente
Author: Teboho Thulani Nyombolo

 Tech Stack
Backend
Table
Technology	Version	Purpose
Spring Boot	4.0.6	Application framework
Spring Security	7.0.7	Authentication & authorization
Java	21	Programming language
Maven	3.x	Build tool
H2 Database	In-Memory	Development database

Frontend
Table
Technology	Version	Purpose
Angular	17+	Frontend framework
TypeScript	5.x	Type-safe JavaScript
NgRx	17+	State management
Tailwind CSS	3.x	Styling

 Getting Started
Prerequisites
Before you begin, ensure you have the following installed:

 Java 21 JDK
 Maven 3.9+
 Node.js 20+
 Angular CLI 17+
 Git

Backend Setup
bash

# 1. Navigate to the backend directory
cd backend

# 2. Build the project with Maven
mvn clean install

# 3. Start the Spring Boot application
mvn spring-boot:run
The backend API will be available at:

 http://localhost:8080
 H2 Console: Access the in-memory database at http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:enviro365db | Username: sa | Password: (leave blank)

Frontend Setup
bash

# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install / 
npm install --legacy-peer-deps

# 3. Start the Angular development server
ng serve
The frontend application will be available at:
 http://localhost:4200
 Authentication

The application uses HTTP Basic Authentication with BCrypt password encoding.

Login Flow:
Investor submits email and password via the Angular login form
Frontend encodes credentials as Base64: btoa(email + ':' + password)
Credentials are stored in localStorage as auth_credentials
Angular HTTP interceptor automatically attaches Authorization: Basic <credentials> to every request
Spring Security validates credentials against BCrypt-hashed passwords in the H2 database
 API Documentation
 Authentication Endpoints
Table
Method	Endpoint	Description	Access
POST	/api/auth/register	Register a new investor	Public
POST	/api/auth/login	Authenticate an investor	Public
Register Request
JSON
{
  "firstName": "Thulani",
  "lastName": "Nyombolo",
  "email": "thulaninyombolo@gmail.com",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "0812345678",
  "address": "123 Main Street"
}
Login Request
JSON
{
  "email": "thulaninyombolo@gmail.com",
  "password": "password123"
}

 Portfolio Endpoints
Table
Method	Endpoint	Description
GET	/api/portfolios/{investorId}	Get investor portfolio details and products
POST	/api/portfolios	Create a new portfolio
PUT	/api/portfolios/{id}	Update an existing portfolio
Portfolio Response
JSON
{
  "id": 1,
  "investorId": 1,
  "totalBalance": 15000.00,
  "totalInvestments": 3,
  "products": [
    {
      "id": 1,
      "productName": "Rainy Days",
      "productType": "SAVINGS",
      "amount": 5000.00,
      "balance": 5000.00,
      "status": "ACTIVE"
    }
  ]
}

 Investment Endpoints
Table
Method	Endpoint	Description
GET	/api/investments	Get all investments
GET	/api/investments/{id}	Get investment by ID
POST	/api/investments	Create a new investment
PUT	/api/investments/{id}	Update an investment
DELETE	/api/investments/{id}	Delete an investment
Create Investment Request
JSON
{
  "investorId": 1,
  "productName": "Rainy Days",
  "productType": "SAVINGS",
  "amount": 1000.00
}

 Withdrawal Endpoints
Table
Method	Endpoint	Description
GET	/api/withdrawals/history/{investorId}	Get withdrawal history
POST	/api/withdrawals	Submit a withdrawal notice
Create Withdrawal Request
JSON
{
  "investorId": 1,
  "amount": 500.00,
  "type": "NORMAL"
}
Withdrawal Types: NORMAL | RETIREMENT

 Deposit Endpoints
Table
Method	Endpoint	Description
GET	/api/deposits/history/{investorId}	Get deposit history
POST	/api/deposits	Make a deposit

 Export Endpoints
Table
Method	Endpoint	Description
GET	/api/export/withdrawals/{investorId}?from=2026-01-01&to=2026-12-31	Export CSV with date filtering

 Business Rules
The following validation rules are strictly enforced on all withdrawal requests:
Table
Rule	Validation	Error Message

 Retirement Age	Retirement withdrawals only allowed if investor age > 65	Retirement withdrawals only allowed if age > 65

 Balance Check	Withdrawal amount must not exceed available balance	Withdrawal amount exceeds available balance

 90% Limit	Withdrawal must not exceed 90% of total balance	Withdrawal cannot exceed 90% of total balance

Example Scenario
If an investor has a balance of R10,000:
 Maximum withdrawal: R9,000 (90% of R10,000)
 Retirement withdrawal: Only allowed if age > 65
 Withdrawal of R9,500: Rejected (exceeds 90% limit)
 Withdrawal of R15,000: Rejected (exceeds balance)

<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/b44272bb-c309-4e6b-9061-66b50de1928b" />


 Database Schema
Investor Table
sql
CREATE TABLE investors (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    date_of_birth   DATE,
    phone_number    VARCHAR(20),
    address         TEXT,
    role            VARCHAR(20) DEFAULT 'INVESTOR',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

Portfolio Table
sql
CREATE TABLE portfolios (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    investor_id     BIGINT NOT NULL UNIQUE,
    total_balance   DECIMAL(15, 2) DEFAULT 0.00,
    total_investments INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investors(id)
);
I
nvestment Table
sql
CREATE TABLE investments (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    investor_id     BIGINT NOT NULL,
    product_name    VARCHAR(255) NOT NULL,
    product_type    ENUM('SAVINGS', 'STOCKS', 'BONDS') NOT NULL,
    amount          DECIMAL(15, 2) NOT NULL,
    balance         DECIMAL(15, 2) NOT NULL,
    status          ENUM('ACTIVE', 'CLOSED', 'PENDING') DEFAULT 'ACTIVE',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investors(id)
);

Withdrawal Table
sql
CREATE TABLE withdrawals (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    investor_id     BIGINT NOT NULL,
    amount          DECIMAL(15, 2) NOT NULL,
    type            VARCHAR(50) NOT NULL,
    status          VARCHAR(50) DEFAULT 'PENDING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investors(id)
);

Screenshots
 
 Login Page
<p align="center">
  <img width="1972" height="1202" alt="image" src="https://github.com/user-attachments/assets/73f02568-c92f-4faf-9063-3efa308ed487" />
</p>
<p align="center"><em>Investor authentication with email and password</em></p>
 Portfolio Dashboard
<p align="center">
<img width="1170" height="542" alt="image" src="https://github.com/user-attachments/assets/f2d78223-695e-4093-9276-e3a39bf1aa92" />
</p>
<p align="center"><em>Portfolio overview showing total balance and investment products</em></p>

 Withdrawal Form
<p align="center">
<img width="570" height="348" alt="image" src="https://github.com/user-attachments/assets/e6a53af5-da1e-4d34-affc-f4f72b0afb02" />
</p>
<p align="center"><em>Withdrawal submission with type selection and amount input</em></p>

 Withdrawal History
<p align="center">
<img width="1124" height="202" alt="image" src="https://github.com/user-attachments/assets/ad31ffeb-7aa2-4513-b047-3940de5c30d2" />
</p>
<p align="center"><em>Table showing all withdrawal transactions with status</em></p>

 CSV Export
<p align="center">
<img width="1294" height="308" alt="image" src="https://github.com/user-attachments/assets/00f2024b-b836-4a1e-b399-e435afc46ce3" />
</p>
<p align="center"><em>Download withdrawal statements with date filtering</em></p>

 Testing
Backend Tests
bash
# Run all unit tests
mvn test

# Run integration tests
mvn verify
Frontend Tests
bash
# Run unit tests
ng test

# Run end-to-end tests
ng e2e
 Deployment
Build Production Artifacts
bash
# Backend — generates JAR file
mvn clean package -DskipTests
# Output: target/enviro365-0.0.1-SNAPSHOT.jar


# Frontend — generates static files
ng build --configuration production
# Output: dist/frontend/browser/

 Troubleshooting
 401 Unauthorized on API Calls
[ ] Verify auth_credentials exists in browser localStorage
[ ] Check that the Base64 string is valid: atob(localStorage.getItem('auth_credentials'))
[ ] Ensure investor exists in database with BCrypt-encoded password
[ ] Confirm httpBasic() is configured in SecurityConfig
 CORS Errors
[ ] Verify cors.allowed-origins includes http://localhost:4200
[ ] Check that OPTIONS preflight requests are permitted
[ ] Ensure allowCredentials(true) is set in CORS configuration
 Bean Definition Conflicts
[ ] Remove duplicate @Service or @Component classes with same name
[ ] Use @Qualifier or rename beans if multiple implementations exist
 PasswordEncoder Not Found
[ ] Ensure PasswordEncoder bean is defined in a @Configuration class
[ ] Check that the config class is in a scanned package

 AI Usage Disclosure
 Transparency Notice: AI tools were used during the development of this assessment to assist with the following:
Table
Area	AI Assistance	Author Review
Code Structure & Architecture	Planning the Spring Boot backend structure and Angular frontend organization	

Reviewed & adapted
Spring Security Configuration	Setting up HTTP Basic Authentication, BCrypt password encoding, and CORS configuration	

Reviewed & adapted
Authentication Flow	Implementing the Basic Auth interceptor pattern between Angular and Spring Boot	

Reviewed & adapted
Troubleshooting	Resolving bean definition conflicts, 401 unauthorized errors, and CORS issues	

Reviewed & adapted
Business Logic	Implementing withdrawal validation rules (age checks, balance limits)	

Reviewed & adapted
Documentation	Structuring the README and API documentation	

Reviewed & adapted
All AI-assisted code was reviewed, understood, and adapted to fit the specific project requirements. The author can explain all design decisions and implementation details during follow-up discussions.

 Assessment Requirements Compliance

Mandatory Backend Features
[x] Retrieve investor portfolio (details + products)
[x] Create withdrawal notices (with balance calculations)
[x] Export CSV statements with filtering
Mandatory Frontend Features
[x] Portfolio dashboard
[x] Withdrawal form
[x] Withdrawal history table
[x] CSV download button
[x] UI connects to backend APIs
Business Rules
[x] Retirement withdrawals only allowed if age > 65
[x] Withdrawal must not exceed available balance
[x] Withdrawal must not exceed 90% of total balance
[x] Proper error handling and user feedback
Advanced Requirements (3 of 5)
[x] Global exception handling (GlobalExceptionHandler.java)
[x] DTO layer (LoginRequest, RegisterRequest, WithdrawalRequest)
[x] Input validation (@Valid, @NotNull, @Email)
[ ] Unit tests (recommended for higher score)
[x] UI validation (Angular form validators)
Submission Requirements
[x] Package: com.enviro.assessment.junior.tebohothulaninyombolo
[x] H2 database used
[x] REST best practices followed
[x] README with setup, API docs, AI usage, screenshots

 Development Notes
Code Style
Backend: Follow Google Java Style Guide
Frontend: Follow Angular Style Guide
General: Maintain consistent naming conventions
Git Workflow
bash
# Feature branch workflow
git checkout -b feature/withdrawal-validation

# Make changes and commit
git commit -m "feat: add withdrawal business rules"

# Push and create Pull Request
git push origin feature/withdrawal-validation
Commit Message Convention
Table
Prefix	Purpose
feat:	New feature
fix:	Bug fix
docs:	Documentation changes
style:	Code style changes (formatting)
refactor:	Code refactoring
test:	Adding or updating tests
chore:	Maintenance tasks

 License
This project was created for assessment purposes. All rights reserved.
<div align="center">
  <h3> Author</h3>
  <p><strong>Teboho Thulani Nyombolo</strong></p>
  <p>Junior Developer Assessment</p>
  <p>Enviro365 Investment Management System</p>
  <p><a href="https://www.etalente.co.za">eTalente</a> — June 2026</p>

  <p><em>Built with  for the eTalente Junior Developer Assessment</em></p>
</div>
