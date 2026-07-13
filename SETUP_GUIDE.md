# Ecommerce Backend - Technical Setup & Architecture Guide

## 📚 Quick Reference Guide

### Directory Structure Overview

```
ecommerceBackend/
├── config/                    # Configuration & Database
│   ├── server.js             # Entry point
│   ├── app.js                # Express app + Sequelize init
│   ├── db.js                 # MySQL connection
│   ├── association.js        # Model relationships
│   └── config.json           # Environment config
├── dataBase/
│   ├── models/               # Sequelize ORM models
│   ├── migrations/           # Schema versioning
│   └── seeders/              # Initial data
├── src/
│   ├── auth/                 # Authentication logic
│   │   ├── userController.js # Request handlers
│   │   ├── userService.js    # Business logic
│   │   └── userValidation.js # Joi schemas
│   ├── helper/               # Utility functions
│   ├── middleweare/          # Express middleware
│   ├── routes/               # API routes
│   └── utility/              # External services
└── package.json
```

---

## 🔌 Core Architecture

### 1. **Request Flow**

```
Client Request
    ↓
Express Router
    ↓
Middleware (Auth, Validation)
    ↓
Controller (Handler)
    ↓
Service (Business Logic)
    ↓
Model (Database Query)
    ↓
Response Handler → Client
```

### 2. **Database Schema**

```sql
-- USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phoneNo VARCHAR(20),
    avatar VARCHAR(255),
    otp INT,
    otp_expire DATETIME,
    is_verified BOOLEAN DEFAULT false,
    role_Id INT,
    is_mobile_notification_active BOOLEAN DEFAULT true,
    social_id VARCHAR(255),
    otp_type ENUM('EMAIL_VERIFICATION', 'FORGOT_PASSWORD'),
    provider ENUM('LOCAL', 'GOOGLE', 'FACEBOOK', 'GITHUB'),
    deletedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_Id) REFERENCES roles(id)
);

-- ROLES TABLE
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- USER_DEVICES TABLE
CREATE TABLE user_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_Id INT NOT NULL,
    device_id VARCHAR(255),
    device_token TEXT,
    device_type SMALLINT DEFAULT 1,
    is_login BOOLEAN DEFAULT true,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    logout_time DATETIME,
    session_id VARCHAR(100),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_Id) REFERENCES users(id)
);
```

---

## 🛠 Installation Steps

### Prerequisites

```bash
# Check Node version (requires >= 20.0.0)
node --version

# Check npm version
npm --version

# Ensure MySQL is running
mysql --version
```

### 1. Setup Environment

```bash
cd /home/softradix/Desktop/EcommercePlatform/ecommerceBackend

# Create .env file
touch .env

# Copy environment variables
cat > .env << 'EOF'
# Server
PORT=8085
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Cloudinary (Image Upload)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Brevo (Email Service)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@ecommerce.com

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
EOF
```

### 2. Install Dependencies

```bash
# Install all packages
npm install

# Verify installations
npm list | head -20
```

### 3. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE ecommerce_db;

# Select database
USE ecommerce_db;

# Exit MySQL
EXIT;

# Run Sequelize migrations
npx sequelize-cli db:migrate

# Run seeders (populate initial roles)
npx sequelize-cli db:seed:all
```

### 4. Verify Setup

```bash
# Start server
npm start

# Expected output:
# Data Base Connected Successfully
# Server is running on port 8085
```

---

## 🚀 Running the Application

### Development Mode

```bash
# Terminal 1: Start with auto-reload
npm start

# Nodemon watches for changes and restarts server
```

### Production Mode

```bash
npm run server
```

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start config/server.js --name "ecommerce-api"

# View logs
pm2 logs ecommerce-api

# Stop
pm2 stop ecommerce-api
```

---

## 🔐 Authentication Implementation

### JWT Token Generation

```javascript
import jwt from "jsonwebtoken";

// Generate token
const token = jwt.sign(
  { id: user.id, email: user.email, roleId: user.role_Id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE },
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded); // { id: 1, email: '...', iat: ..., exp: ... }
```

### Password Hashing (Bcrypt)

```javascript
import bcrypt from "bcrypt";

// Hash password (before saving)
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password (during login)
const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
```

### Authorization Middleware

```javascript
// Usage in routes:
import authorize from "../middleweare/authmiddleweare.js";

router.get("/api/users", authorize, getUsersController);
// Only logged-in users can access
```

### Role-Based Access Control

```javascript
import checkRole from "../middleweare/roleBasemiddleweare.js";

// Only Admin can access
router.delete(
  "/api/roles/:id",
  authorize,
  checkRole("Admin"),
  deleteRoleController,
);

// Multiple roles allowed
router.get(
  "/api/reports",
  authorize,
  checkRole("Admin", "Manager"),
  getReportsController,
);
```

---

## 📤 File Upload with Cloudinary

### Configuration

```javascript
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce/avatars",
    format: async (req, file) => "png",
    public_id: (req, file) => `user_${req.user.id}_${Date.now()}`,
  },
});

const upload = multer({ storage });

// Usage in route
router.post(
  "/api/users/:id/avatar",
  authorize,
  upload.single("avatar"),
  uploadAvatarController,
);
```

---

## 💌 Email Sending with Brevo

### Configuration

```javascript
import brevoClient from "../utility/brevoClient.js";

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.BREVO_SENDER_EMAIL,
      pass: process.env.BREVO_API_KEY,
    },
  });

  await transporter.sendMail({
    from: process.env.BREVO_SENDER_EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 15 minutes</p>`,
  });
};
```

---

## 📝 Database Migrations & Seeders

### Create New Migration

```bash
# Generate migration file
npx sequelize-cli migration:generate --name add_status_to_users

# File: dataBase/migrations/XXXXXXX-add_status_to_users.cjs
# Edit the file and add your schema changes
# npx sequelize-cli db:migrate

# Undo last migration
# npx sequelize-cli db:migrate:undo
```

### Create Seeder

```bash
# Generate seeder
npm run create_seeder add_admin_user

# Edit: dataBase/seeders/XXXXXXX-add_admin_user.cjs
# Run seeder
npm run run_seeder dataBase/seeders/XXXXXXX-add_admin_user.cjs
```

### Example Seeder

```javascript
// dataBase/seeders/XXXXXXX-role-seeder.cjs
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [
      { name: "Admin", createdAt: new Date(), updatedAt: new Date() },
      { name: "User", createdAt: new Date(), updatedAt: new Date() },
      { name: "Manager", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
```

---

## 🧪 Testing Endpoints

### Using cURL

#### Register User

```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "phoneNo": "+1234567890"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
# Response includes token
```

#### Get User (with token)

```bash
curl -X GET http://localhost:8085/api/users/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Upload Avatar

```bash
curl -X POST http://localhost:8085/api/users/1/avatar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

### Using Postman

1. Import [SWAGGER.yaml](./SWAGGER.yaml) into Postman
2. Set collection variable: `{{token}}` from login response
3. Test all endpoints with pre-configured requests

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Import `SWAGGER.yaml`
3. Execute requests directly from VS Code

---

## 🛡 Validation with Joi

### User Registration Schema

```javascript
import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  lastname: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).pattern(/[A-Z]/).pattern(/[0-9]/),
  phoneNo: Joi.string()
    .optional()
    .pattern(/^[+]?[\d\s\-()]{7,}$/),
  address: Joi.string().optional().max(500),
});

// Validate in controller
const { error, value } = registerSchema.validate(req.body);
if (error) {
  return res.status(422).json({ errors: error.details.map((d) => d.message) });
}
```

---

## 📊 Response Format

### Success Response

```javascript
{
  "statusCode": 200,
  "message": "Success message",
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  }
}
```

### Error Response

```javascript
{
  "statusCode": 400,
  "message": "Error message",
  "errors": ["Error detail 1", "Error detail 2"]
}
```

### Pagination Response

```javascript
{
  "statusCode": 200,
  "message": "Users retrieved",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## 🐛 Debugging

### Enable Debug Logging

```javascript
// In config/db.js
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log, // Enable SQL logging
  },
);
```

### Monitor Requests

```javascript
// In config/app.js
import morgan from "morgan";

app.use(morgan("dev")); // Log all HTTP requests
```

### Error Stack Traces

```bash
# Enable detailed error messages
NODE_ENV=development npm start
```

---

## 📦 Dependency Management

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update bcrypt

# Update all packages
npm update

# Install specific version
npm install bcrypt@6.0.1
```

### Remove Unused Dependencies

```bash
# Identify unused packages
npm prune

# Check dependency size
npm size
```

---

## 🔄 Git Workflow

### Initialize Repository

```bash
cd ecommerceBackend
git init
git add .
git commit -m "Initial commit: E-commerce backend setup"
```

### Ignore Node Modules

```bash
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
logs/
*.log
.vscode/
.DS_Store
EOF

git add .gitignore
git commit -m "Add .gitignore"
```

---

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8085
lsof -i :8085

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check MySQL service
sudo service mysql status

# Start MySQL (if stopped)
sudo service mysql start

# Test connection
mysql -u root -p
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied (Cloudinary/Brevo)

```bash
# Verify .env file has correct credentials
cat .env | grep CLOUDINARY

# Check Cloudinary dashboard for API keys
```

---

## 📋 Development Checklist

- [ ] Node.js >= 20.0.0 installed
- [ ] MySQL running locally
- [ ] `.env` file created with all variables
- [ ] `npm install` completed
- [ ] Database migrations run
- [ ] Seeders executed
- [ ] Server starts without errors
- [ ] API endpoints responding
- [ ] Cloudinary credentials working
- [ ] Email service configured
- [ ] JWT tokens generating

---

## 🎯 Next Steps

1. **API Routes**: Create routes in `src/routes/`
2. **Controllers**: Implement business logic in `src/auth/`
3. **Validation**: Add Joi schemas in `userValidation.js`
4. **Services**: Extend services in `userService.js`
5. **Tests**: Add unit tests with Jest
6. **Documentation**: Keep Swagger updated

---

## 📞 Support

For issues:

1. Check `.env` configuration
2. Review error logs in terminal
3. Consult [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
4. Check [SWAGGER.yaml](./SWAGGER.yaml) for endpoint specs

---

**Version:** 1.0.0  
**Last Updated:** July 13, 2026
