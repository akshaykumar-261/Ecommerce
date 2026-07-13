# Ecommerce Platform Backend - Complete Documentation

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Running the Server](#running-the-server)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

The Ecommerce Platform Backend is a robust Node.js/Express REST API built for a complete e-commerce solution. It includes:

- **User Authentication**: Registration, login, OTP verification, social login (Google, Facebook, GitHub)
- **User Management**: Profile management, avatar uploads to Cloudinary
- **Role-Based Access Control**: Admin, User, Manager roles
- **Device Tracking**: Multi-device login management, push notifications
- **Data Validation**: Joi validation for all inputs
- **Error Handling**: Centralized error handling middleware
- **Security**: Password hashing with bcrypt, JWT authentication

---

## 🛠 Technology Stack

| Layer              | Technology                  |
| ------------------ | --------------------------- |
| **Runtime**        | Node.js >= 20.0.0           |
| **Web Framework**  | Express.js 5.2.1            |
| **ORM**            | Sequelize 6.37.8            |
| **Database**       | MySQL 2                     |
| **Authentication** | JWT, bcrypt                 |
| **File Upload**    | Cloudinary + Multer         |
| **Validation**     | Joi 18.2.3                  |
| **Email**          | Brevo (formerly Sendinblue) |
| **Dev Tools**      | Nodemon 3.1.14              |

---

## 📁 Project Structure

```
ecommerceBackend/
├── config/
│   ├── app.js                 # Express app initialization
│   ├── association.js         # Database model associations
│   ├── config.json            # Configuration settings
│   ├── db.js                  # Sequelize database connection
│   └── server.js              # Server entry point
├── dataBase/
│   ├── models/
│   │   ├── roleModel.js       # Role data model
│   │   ├── userModel.js       # User data model
│   │   └── user_deviceModel.js # Device tracking model
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders (role seeder)
├── src/
│   ├── auth/
│   │   ├── userController.js  # User request handlers
│   │   ├── userService.js     # Business logic layer
│   │   └── userValidation.js  # Request validation schemas
│   ├── helper/
│   │   ├── commonFunction.js  # Utility functions
│   │   ├── commanMessages.js  # Common messages
│   │   ├── responseHandler.js # API response formatting
│   │   └── statusCode.js      # HTTP status codes
│   ├── middleweare/
│   │   ├── authmiddleweare.js # JWT verification
│   │   ├── errorHandller.js   # Global error handler
│   │   └── roleBasemiddleweare.js # Role-based access control
│   ├── routes/                # API route definitions
│   └── utility/
│       └── brevoClient.js     # Email service client
├── package.json
└── SWAGGER.yaml               # API documentation
```

---

## 🗄 Database Models

### 1. **User Model**

Stores user account information and authentication details.

```javascript
{
  id: integer (PK, auto-increment),
  name: string (required),
  lastname: string (required),
  email: string (unique, required),
  password: string (hashed, required),
  address: string,
  phoneNo: string,
  avatar: string (Cloudinary URL),
  otp: integer,
  otp_expire: datetime,
  is_verified: boolean (default: false),
  role_Id: integer (FK to Role),
  is_mobile_notification_active: boolean (default: true),
  social_id: string,
  otp_type: ENUM('EMAIL_VERIFICATION', 'FORGOT_PASSWORD'),
  provider: ENUM('LOCAL', 'GOOGLE', 'FACEBOOK', 'GITHUB'),
  deletedAt: datetime (soft delete),
  createdAt: datetime,
  updatedAt: datetime
}
```

**Relationships:**

- `belongsTo` → Role (via role_Id)
- `hasMany` → UserDevice (via id as foreign key)

---

### 2. **Role Model**

Defines user roles for access control.

```javascript
{
  id: integer (PK, auto-increment),
  name: string (unique, required),
  createdAt: datetime,
  updatedAt: datetime
}
```

**Default Roles:**

- Admin (Full access)
- User (Customer)
- Manager (Product/Order management)

**Relationships:**

- `hasMany` → User (via role_Id)

---

### 3. **UserDevice Model**

Tracks user devices for multi-device login and push notifications.

```javascript
{
  id: integer (PK, auto-increment),
  user_Id: integer (FK to User, required),
  device_id: string (unique device identifier),
  device_token: string (FCM/push token),
  device_type: SMALLINT (1=Android, 2=iOS, 3=Web, default: 1),
  is_login: boolean (default: true),
  login_time: datetime,
  logout_time: datetime,
  session_id: string (100 chars),
  createdAt: datetime,
  updatedAt: datetime
}
```

**Relationships:**

- `belongsTo` → User (via user_Id)

---

## 🔌 API Endpoints

### Authentication Endpoints

#### 1. **Register New User**

```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phoneNo": "+1234567890",
  "address": "123 Main St"
}

Response (201 Created):
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "phoneNo": "+1234567890",
    "address": "123 Main St",
    "is_verified": false,
    "provider": "LOCAL"
  }
}
```

---

#### 2. **User Login**

```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200 OK):
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

---

#### 3. **Send OTP**

```http
POST /api/auth/send-otp
Content-Type: application/json

Request Body:
{
  "email": "john@example.com"
}

Response (200 OK):
{
  "statusCode": 200,
  "message": "OTP sent to your email",
  "data": {
    "expires_in": 900 // seconds
  }
}
```

---

#### 4. **Verify OTP**

```http
POST /api/auth/verify-otp
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "otp": 123456
}

Response (200 OK):
{
  "statusCode": 200,
  "message": "OTP verified successfully",
  "data": {
    "is_verified": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### User Endpoints

#### 5. **Get All Users** (Admin only)

```http
GET /api/users?page=1&limit=10
Authorization: Bearer {token}

Response (200 OK):
{
  "statusCode": 200,
  "message": "Users retrieved",
  "data": [
    {
      "id": 1,
      "name": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "phoneNo": "+1234567890",
      "is_verified": true,
      "role_Id": 2
    },
    ...
  ]
}
```

---

#### 6. **Get User Profile**

```http
GET /api/users/{userId}
Authorization: Bearer {token}

Response (200 OK):
{
  "statusCode": 200,
  "message": "User found",
  "data": {
    "id": 1,
    "name": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "phoneNo": "+1234567890",
    "avatar": "https://cloudinary.com/user-avatar.jpg",
    "is_verified": true,
    "is_mobile_notification_active": true,
    "role_Id": 2,
    "provider": "LOCAL",
    "createdAt": "2026-07-13T10:00:00Z"
  }
}
```

---

#### 7. **Update User Profile**

```http
PUT /api/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "John",
  "lastname": "Smith",
  "phoneNo": "+9876543210",
  "address": "456 Oak Ave",
  "is_mobile_notification_active": false
}

Response (200 OK):
{
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {...}
}
```

---

#### 8. **Upload Avatar**

```http
POST /api/users/{userId}/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- avatar: [image file]

Response (200 OK):
{
  "statusCode": 200,
  "message": "Avatar uploaded successfully",
  "data": {
    "id": 1,
    "avatar": "https://res.cloudinary.com/..."
  }
}
```

---

#### 9. **Delete User Account**

```http
DELETE /api/users/{userId}
Authorization: Bearer {token}

Response (200 OK):
{
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": null
}
```

---

### Role Endpoints

#### 10. **Get All Roles**

```http
GET /api/roles
Authorization: Bearer {token}

Response (200 OK):
{
  "statusCode": 200,
  "message": "Roles retrieved",
  "data": [
    { "id": 1, "name": "Admin" },
    { "id": 2, "name": "User" },
    { "id": 3, "name": "Manager" }
  ]
}
```

---

#### 11. **Create Role** (Admin only)

```http
POST /api/roles
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "Moderator"
}

Response (201 Created):
{
  "statusCode": 201,
  "message": "Role created successfully",
  "data": { "id": 4, "name": "Moderator" }
}
```

---

#### 12. **Update Role** (Admin only)

```http
PUT /api/roles/{roleId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "SuperModerator"
}

Response (200 OK):
{
  "statusCode": 200,
  "message": "Role updated successfully",
  "data": { "id": 4, "name": "SuperModerator" }
}
```

---

#### 13. **Delete Role** (Admin only)

```http
DELETE /api/roles/{roleId}
Authorization: Bearer {token}

Response (200 OK):
{
  "statusCode": 200,
  "message": "Role deleted successfully",
  "data": null
}
```

---

### Device Endpoints

#### 14. **Register Device**

```http
POST /api/devices
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "device_id": "device_uuid_123",
  "device_token": "fcm_device_token_xyz",
  "device_type": 1
}

Response (201 Created):
{
  "statusCode": 201,
  "message": "Device registered successfully",
  "data": {
    "id": 1,
    "user_Id": 1,
    "device_id": "device_uuid_123",
    "device_token": "fcm_device_token_xyz",
    "device_type": 1,
    "is_login": true,
    "login_time": "2026-07-13T15:30:00Z"
  }
}
```

---

#### 15. **Get User Devices**

```http
GET /api/devices
Authorization: Bearer {token}

Response (200 OK):
{
  "statusCode": 200,
  "message": "Devices retrieved",
  "data": [
    {
      "id": 1,
      "device_id": "device_uuid_123",
      "device_type": 1,
      "is_login": true,
      "login_time": "2026-07-13T15:30:00Z"
    }
  ]
}
```

---

#### 16. **Logout Device**

```http
POST /api/devices/{deviceId}/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "statusCode": 200,
  "message": "Device logged out successfully",
  "data": {
    "id": 1,
    "is_login": false,
    "logout_time": "2026-07-13T16:00:00Z"
  }
}
```

---

## 💻 Installation & Setup

### Prerequisites

- Node.js >= 20.0.0
- MySQL Server running
- Cloudinary account (for image uploads)
- Brevo account (for email sending)

### Step 1: Clone and Install Dependencies

```bash
cd ecommerceBackend
npm install
```

### Step 2: Configure Environment Variables

Create `.env` file in root:

```env
PORT=8085
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_db
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@ecommerce.com

NODE_ENV=development
```

### Step 3: Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE ecommerce_db;
EXIT;

# Run migrations
npx sequelize-cli db:migrate

# Run seeders
npx sequelize-cli db:seed:all
```

---

## 🚀 Running the Server

### Development Mode (with auto-restart)

```bash
npm start
```

### Production Mode

```bash
npm run server
```

The server will start at `http://localhost:8085`

---

## 🔐 Authentication

### JWT Token Flow

1. **Register/Login** → Receive JWT token
2. **Include in Headers** → `Authorization: Bearer {token}`
3. **Token Expiration** → Use refresh token to get new token
4. **Logout** → Token invalidated on backend

### Token Payload

```javascript
{
  userId: 1,
  email: "user@example.com",
  roleId: 2,
  iat: 1689273000,
  exp: 1689878400
}
```

### Password Security

- Passwords hashed with bcrypt (10 rounds salt)
- Never stored in plain text
- Excluded from API responses

---

## ⚠️ Error Handling

### Standard Error Response

```javascript
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

### HTTP Status Codes Used

| Code | Meaning                        |
| ---- | ------------------------------ |
| 200  | Success                        |
| 201  | Created                        |
| 400  | Bad Request                    |
| 401  | Unauthorized (login required)  |
| 403  | Forbidden (role access denied) |
| 404  | Not Found                      |
| 409  | Conflict (duplicate resource)  |
| 422  | Validation Error               |
| 500  | Server Error                   |

---

## 🔧 Development Workflow

### Create New Migration

```bash
npx sequelize-cli migration:generate --name add_column_to_users
```

### Create New Seeder

```bash
npm run create_seeder your_seeder_name
npm run run_seeder your_seeder_name
```

### Database Commands

```bash
# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Undo specific migration
npx sequelize-cli db:migrate:undo --name migration_name
```

---

## 📊 Validation Schemas (Joi)

### User Registration

```javascript
{
  name: string().required().min(2),
  lastname: string().required().min(2),
  email: string().email().required(),
  password: string().required().min(8),
  phoneNo: string().optional(),
  address: string().optional()
}
```

### Login

```javascript
{
  email: string().email().required(),
  password: string().required()
}
```

---

## 🎁 Additional Features

### Email Notifications (Brevo)

- Account verification emails
- Password reset emails
- OTP delivery

### Cloudinary Integration

- Avatar image uploads
- Automatic image optimization
- CDN delivery

### Multi-Device Support

- Track multiple login devices
- Push notifications
- Session management

---

## 🆘 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:** Ensure MySQL is running and credentials in `.env` are correct

### Cloudinary Upload Failed

```
Error: Unable to upload to Cloudinary
```

**Solution:** Verify Cloudinary credentials in `.env`

### JWT Token Invalid

```
Error: Invalid token
```

**Solution:** Token may be expired, use refresh token endpoint

---

## 📝 API Testing with cURL

### Register User

```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get User Profile

```bash
curl -X GET http://localhost:8085/api/users/1 \
  -H "Authorization: Bearer your_token_here"
```

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [JWT Authentication](https://jwt.io/)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Brevo API](https://developers.brevo.com/)

---

## 📄 License

ISC

---

## 👥 Support

For issues or questions, contact: support@ecommerce.com

---

**Last Updated:** July 13, 2026
**Version:** 1.0.0
