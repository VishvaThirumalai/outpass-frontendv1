# Create README.md
cat > README.md << 'EOF'
# MIT Hostel Outpass Management System

A comprehensive web-based outpass management system for hostel students built with Spring Boot and React.

## Features

### Student Features
- Login with roll number and password
- Apply for outpass with required details
- View and edit pending applications
- Track outpass status and history
- Cancel pending applications

### Warden Features
- Review pending outpass applications
- Approve or reject with comments
- View all outpass history
- Dashboard with statistics

### Security Features
- View approved outpasses
- Mark student departure and return
- Track active outpasses
- Generate reports

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.1.5, Spring Security, JPA/Hibernate
- **Frontend**: React 18, React Router, Axios
- **Database**: H2 (development), MySQL (production)
- **Authentication**: JWT tokens

## Prerequisites

- Java 17+
- Node.js 16+
- Maven 3.6+
- MySQL 8.0+ (for production)

## Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd outpass-management-system
```

### 2. Start Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console

## Default Login Credentials

### Students
- MIT2021001 / password123
- MIT2021002 / password123  
- MIT2021003 / password123

### Warden
- warden1 / password123

### Security
- security1 / password123

## Development

Open `outpass-management.code-workspace` in VS Code for best development experience.

### Backend Development
- Main class: `OutpassManagementApplication.java`
- API endpoints: `/api/**`
- Database console: http://localhost:8080/h2-console

### Frontend Development
- React components in `src/components/`
- Services in `src/services/`
- Styles in `src/styles/`

## Database Configuration

### Development (H2)
Default configuration uses in-memory H2 database. No additional setup required.

### Production (MySQL)
1. Install MySQL
2. Create database: `outpass_management`
3. Update `application.properties` with MySQL settings
4. Uncomment MySQL configuration in `application.properties`

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout

### Student Endpoints
- GET `/api/student/outpasses` - Get student's outpasses
- POST `/api/student/outpass` - Apply for outpass
- PUT `/api/student/outpass/{id}` - Edit outpass

### Warden Endpoints
- GET `/api/warden/outpasses/pending` - Get pending outpasses
- PUT `/api/warden/outpass/{id}/review` - Review outpass

### Security Endpoints
- GET `/api/security/outpasses/approved` - Get approved outpasses
- PUT `/api/security/outpass/{id}/departure` - Mark departure
- PUT `/api/security/outpass/{id}/return` - Mark return

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.
EOF

print_status "Created comprehensive README.md"