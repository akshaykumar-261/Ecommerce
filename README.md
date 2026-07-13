# Ecommerce Backend Documentation Index

## 📖 Complete Documentation Overview

Welcome to the Ecommerce Platform Backend! This directory contains comprehensive documentation for understanding, developing, and deploying the backend API.

---

## 📋 Documentation Files

### 1. **API_DOCUMENTATION.md** (Comprehensive API Reference)

Complete REST API documentation with all endpoints, request/response examples, authentication details, and error handling.

**Covers:**

- Project overview & technology stack
- Database models (User, Role, UserDevice)
- All API endpoints with examples
- Authentication & JWT flow
- Error handling & status codes
- Installation & setup
- Development workflow

**Start here if:** You need to understand available endpoints or integrate with the API.

---

### 2. **SWAGGER.yaml** (OpenAPI 3.0 Specification)

Machine-readable API specification compatible with Swagger UI, Postman, and other API tools.

**Includes:**

- Complete OpenAPI 3.0 schema
- All endpoints with parameters
- Request/response schemas
- Authentication configuration
- Status code definitions
- Example responses

**Start here if:** You want to import into Postman, Swagger UI, or Thunder Client.

**How to use:**

```bash
# Postman: Import > Import from file > Select SWAGGER.yaml
# Swagger UI: Paste content into https://editor.swagger.io
# Thunder Client (VS Code): File > Import > SWAGGER.yaml
```

---

### 3. **SETUP_GUIDE.md** (Technical Installation & Architecture)

Step-by-step setup instructions with technical details about architecture, configuration, and advanced topics.

**Covers:**

- Directory structure explanation
- Request flow architecture
- Database schema (SQL)
- Complete installation steps
- Running in development/production
- JWT & authentication implementation
- Cloudinary file upload setup
- Brevo email configuration
- Database migrations & seeders
- Testing endpoints with cURL
- Debugging techniques
- Git workflow

**Start here if:** You're setting up the project locally or need to understand the architecture.

---

### 4. **QUICK_REFERENCE.md** (Developer Cheat Sheet)

Quick reference guide for common tasks, code patterns, and frequently used commands.

**Includes:**

- Quick start (3 steps to run)
- Key files reference table
- Core models quick reference
- Authentication flow diagram
- Common code patterns
- Middleware stack
- HTTP status codes
- Common commands
- API test examples
- Debugging tips
- Adding new features guide
- Model relationships
- Testing checklist
- Dependencies table

**Start here if:** You need quick answers or code snippets.

---

## 🎯 Documentation by Use Case

### For New Developers

1. Read: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Overview
2. Follow: [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation
3. Explore: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Endpoints
4. Test: [SWAGGER.yaml](./SWAGGER.yaml) - In Postman

### For API Integration

1. Review: [SWAGGER.yaml](./SWAGGER.yaml) - Endpoint specs
2. Reference: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Detailed examples
3. Test: Import SWAGGER.yaml into Postman

### For Setting Up Local Environment

1. Follow: [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation steps
2. Configure: .env file setup
3. Verify: Test endpoints from [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### For Adding Features

1. Check: [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Architecture section
2. Reference: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Adding new features
3. Example: Database models in [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🏗️ Project Structure

```
ecommerceBackend/
├── 📄 API_DOCUMENTATION.md      ← Comprehensive API reference
├── 📄 SWAGGER.yaml              ← OpenAPI specification
├── 📄 SETUP_GUIDE.md            ← Installation & architecture
├── 📄 QUICK_REFERENCE.md        ← Developer cheat sheet
├── 📄 README.md                 ← This file
├── package.json                 ← Dependencies
├── .env                         ← Environment variables
├── config/
│   ├── server.js               ← Entry point
│   ├── app.js                  ← Express initialization
│   ├── db.js                   ← Database connection
│   ├── association.js          ← Model relationships
│   └── config.json
├── dataBase/
│   ├── models/                 ← ORM models
│   ├── migrations/             ← Schema versions
│   └── seeders/                ← Initial data
└── src/
    ├── auth/                   ← Authentication
    ├── helper/                 ← Utilities
    ├── middleweare/            ← Middleware
    ├── routes/                 ← API routes
    └── utility/                ← External services
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd ecommerceBackend
npm install
```

### 2. Configure Environment

```bash
# Copy .env template
cat > .env << 'EOF'
PORT=8085
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
BREVO_API_KEY=your_key
EOF
```

### 3. Setup Database

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Run Server

```bash
npm start
# Server running on http://localhost:8085
```

### 5. Test API

```bash
# Register
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","lastname":"Doe","email":"john@example.com","password":"Pass123456"}'
```

---

## 📚 Technology Stack

| Layer      | Technology     |
| ---------- | -------------- |
| Runtime    | Node.js 20+    |
| Framework  | Express.js 5.2 |
| Database   | MySQL 8.0+     |
| ORM        | Sequelize 6.37 |
| Auth       | JWT + bcrypt   |
| Upload     | Cloudinary     |
| Email      | Brevo          |
| Validation | Joi            |
| Dev        | Nodemon        |

---

## 🔐 Key Features

✅ User Registration & Authentication  
✅ JWT Token Based Authorization  
✅ Role-Based Access Control (Admin, User, Manager)  
✅ Multi-Device Login Tracking  
✅ OTP Email Verification  
✅ Avatar Image Upload (Cloudinary)  
✅ Password Hashing (bcrypt)  
✅ Push Notification Support  
✅ Soft Delete (data retention)  
✅ Social Login Ready (Google, Facebook, GitHub)

---

## 🔌 Core API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP

### Users

- `GET /api/users` - Get all users (Admin)
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update profile
- `POST /api/users/{id}/avatar` - Upload avatar
- `DELETE /api/users/{id}` - Delete account

### Roles

- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create role (Admin)
- `PUT /api/roles/{id}` - Update role (Admin)
- `DELETE /api/roles/{id}` - Delete role (Admin)

### Devices

- `POST /api/devices` - Register device
- `GET /api/devices` - Get user devices
- `POST /api/devices/{id}/logout` - Logout device

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

---

## 💡 Common Tasks

### View Endpoints

→ See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) Section "API Endpoints"

### Test API in Postman

→ Import [SWAGGER.yaml](./SWAGGER.yaml) into Postman

### Setup Locally

→ Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) Installation section

### Quick Code Examples

→ Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) Common Patterns

### Database Schema

→ See [SETUP_GUIDE.md](./SETUP_GUIDE.md) Database Schema section

### Add New Feature

→ Follow [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) Adding New Feature section

### Authentication Details

→ Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) Authentication Implementation section

### Configure Cloudinary

→ See [SETUP_GUIDE.md](./SETUP_GUIDE.md) File Upload with Cloudinary

---

## 🛠️ Development Commands

```bash
# Development
npm start                          # Run with auto-reload
npm run server                     # Run production mode

# Database
npx sequelize-cli db:migrate       # Run migrations
npx sequelize-cli db:migrate:undo  # Undo migrations
npm run create_seeder name         # Create seeder
npm run run_seeder path            # Run seeder

# Dependencies
npm install                        # Install all
npm install package_name           # Install specific
npm update                         # Update packages
```

---

## 📧 Support Resources

| Question                       | Resource                                                          |
| ------------------------------ | ----------------------------------------------------------------- |
| How do I set up the project?   | [SETUP_GUIDE.md](./SETUP_GUIDE.md)                                |
| What endpoints are available?  | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)                    |
| I need quick command reference | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)                        |
| How do I test the API?         | [SWAGGER.yaml](./SWAGGER.yaml) + Postman                          |
| How does authentication work?  | [SETUP_GUIDE.md](./SETUP_GUIDE.md#-authentication-implementation) |
| Database schema details?       | [SETUP_GUIDE.md](./SETUP_GUIDE.md#2-database-schema)              |

---

## ✅ Before Deployment

- [ ] All dependencies installed
- [ ] `.env` configured with production values
- [ ] Database migrations run
- [ ] Cloudinary credentials verified
- [ ] Email service configured
- [ ] JWT secret set (strong, random)
- [ ] CORS configured for frontend domain
- [ ] HTTPS/SSL enabled
- [ ] Error logging configured
- [ ] Database backups scheduled

---

## 📊 Documentation Statistics

| Document             | Pages | Topics                      | Lines |
| -------------------- | ----- | --------------------------- | ----- |
| API_DOCUMENTATION.md | ~20   | 50+ endpoints               | 1000+ |
| SWAGGER.yaml         | ~15   | OpenAPI 3.0 spec            | 800+  |
| SETUP_GUIDE.md       | ~25   | Installation & architecture | 1200+ |
| QUICK_REFERENCE.md   | ~10   | Quick reference             | 500+  |

---

## 🎓 Learning Path

1. **Day 1**: Read [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) + Run [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. **Day 2**: Explore [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) endpoints
3. **Day 3**: Import [SWAGGER.yaml](./SWAGGER.yaml) into Postman and test
4. **Day 4**: Review code in `src/` folder
5. **Day 5**: Create your first custom endpoint

---

## 📝 Document Versions

| Document             | Version | Last Updated  |
| -------------------- | ------- | ------------- |
| API_DOCUMENTATION.md | 1.0     | July 13, 2026 |
| SWAGGER.yaml         | 3.0.0   | July 13, 2026 |
| SETUP_GUIDE.md       | 1.0     | July 13, 2026 |
| QUICK_REFERENCE.md   | 1.0     | July 13, 2026 |
| README.md            | 1.0     | July 13, 2026 |

---

## 🔗 Quick Links

- 📖 [API Documentation](./API_DOCUMENTATION.md)
- 🔌 [API Specification (Swagger)](./SWAGGER.yaml)
- 🛠️ [Setup Guide](./SETUP_GUIDE.md)
- ⚡ [Quick Reference](./QUICK_REFERENCE.md)
- 📦 [package.json](./package.json)

---

## 🎯 Next Steps

1. **Choose your role:**
   - New Developer? → Start with [SETUP_GUIDE.md](./SETUP_GUIDE.md)
   - API Integrator? → Check [SWAGGER.yaml](./SWAGGER.yaml)
   - Quick Lookup? → Use [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

2. **Get the server running:**

   ```bash
   npm install && npm start
   ```

3. **Test an endpoint:**
   - Use cURL, Postman, or Thunder Client
   - Examples in [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

4. **Explore the codebase:**
   - Start in `config/server.js`
   - Follow to `src/auth/` folder

---

## 📞 Need Help?

1. **Installation issues?** → See [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting)
2. **API questions?** → Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. **Need examples?** → Look in [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
4. **Want to test?** → Import [SWAGGER.yaml](./SWAGGER.yaml) into Postman

---

**Happy Coding! 🚀**

For any issues or questions, refer to the appropriate documentation file above or contact the development team.

**Ecommerce Platform Backend v1.0.0**  
Last Updated: July 13, 2026
