# Ecommerce Backend - Developer Quick Reference

## 🚀 Quick Start

```bash
# 1. Navigate to project
cd /home/softradix/Desktop/EcommercePlatform/ecommerceBackend

# 2. Install & Setup
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# 3. Run Server
npm start

# 4. Access API
http://localhost:8085
```

---

## 📚 Key Files Reference

| File                                     | Purpose                           |
| ---------------------------------------- | --------------------------------- |
| `config/server.js`                       | Entry point, starts HTTP server   |
| `config/app.js`                          | Express initialization & DB setup |
| `config/db.js`                           | MySQL connection with Sequelize   |
| `config/association.js`                  | Database model relationships      |
| `dataBase/models/*.js`                   | ORM data models                   |
| `src/auth/userController.js`             | Request handlers                  |
| `src/auth/userService.js`                | Business logic                    |
| `src/helper/responseHandler.js`          | API response formatting           |
| `src/middleweare/authmiddleweare.js`     | JWT verification                  |
| `src/middleweare/roleBasemiddleweare.js` | Role-based access                 |

---

## 🔗 Core Models

### User (User account)

```javascript
User.findByPk(1); // Get by ID
User.findOne({ where: { email } }); // Get by email
User.create({ name, email, password }); // Create new
User.update({ field }, { where }); // Update
User.destroy({ where }); // Soft delete
```

### Role (User roles)

```javascript
Role.findAll(); // Get all roles
Role.findByPk(1); // Get by ID
Role.create({ name }); // Create role
```

### UserDevice (Device tracking)

```javascript
UserDevice.create({ user_Id, device_id, device_token });
UserDevice.findAll({ where: { user_Id } });
UserDevice.update({ is_login: false }, { where });
```

---

## 🔐 Authentication Flow

```
1. User POST /auth/register → Create account
2. User POST /auth/login → Get JWT token
3. User includes token: Header: Authorization: Bearer {token}
4. Middleware verifies token
5. Access granted if valid, denied if expired/invalid
```

---

## 💻 Common Code Patterns

### Controller Pattern

```javascript
export const getUser = async (req, res) => {
  try {
    const user = await UserService.getById(req.params.userId);
    if (!user) {
      return respnseHandler(res, STATUS_CODE.NOT_FOUND, "User not found");
    }
    respnseHandler(res, STATUS_CODE.SUCCESS, "User found", user);
  } catch (error) {
    respnseHandler(res, STATUS_CODE.SERVER_ERROR, error.message);
  }
};
```

### Service Pattern

```javascript
export default class UserServices {
  async getById(id) {
    return await this.Model.Users.findByPk(id);
  }

  async create(data) {
    return await this.Model.Users.create(data);
  }
}
```

### Route Pattern

```javascript
import express from "express";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBasemiddleweare.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/users", authorize, checkRole("Admin"), getAllUsersController);

export default router;
```

---

## 🔒 Middleware Stack

```javascript
app.use(express.json()); // Parse JSON
app.use(logger); // Log requests
app.use(errorHandler); // Handle errors
app.use("/api", router); // Routes
```

---

## 📋 HTTP Status Codes

| Code | Message              |
| ---- | -------------------- |
| 200  | Success              |
| 201  | Created              |
| 400  | Bad Request          |
| 401  | Unauthorized         |
| 403  | Forbidden            |
| 404  | Not Found            |
| 409  | Conflict (duplicate) |
| 422  | Validation Error     |
| 500  | Server Error         |

---

## 🛠 Common Commands

```bash
# Server
npm start                    # Dev (with auto-reload)
npm run server              # Production

# Database
npx sequelize-cli db:migrate                  # Run migrations
npx sequelize-cli db:migrate:undo             # Undo last migration
npx sequelize-cli db:migrate:undo:all         # Undo all migrations
npm run create_seeder name                    # Create seeder
npm run run_seeder path                       # Run seeder
npm run seed_undo            # Undo all seeders

# Dependencies
npm install [package]        # Install package
npm update                   # Update packages
npm list                     # List installed
npm prune                    # Remove unused
```

---

## 🔑 Environment Variables (.env)

```env
PORT=8085
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BREVO_API_KEY=
```

---

## 🧪 API Test Examples

### Register

```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "Pass123456"
  }'
```

### Login (Get Token)

```bash
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Pass123456"
  }'
# Get token from response
```

### Authorized Request

```bash
curl -X GET http://localhost:8085/api/users/1 \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## 🐛 Debugging Tips

```javascript
// Console log with context
console.log("🔵 User found:", user);
console.log("🔴 Error:", error);
console.log("🟡 Request data:", req.body);

// Check token content
const decoded = jwt.decode(token);
console.log(decoded);

// Database query logging
// Enable in config/db.js: logging: console.log

// Check middleware execution
app.use((req, res, next) => {
  console.log("📍 Middleware:", req.method, req.path);
  next();
});
```

---

## 📂 Adding New Feature

### 1. Create Model (if needed)

```javascript
// dataBase/models/newModel.js
const NewModel = sequelize.define("newmodel", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  field: { type: DataTypes.STRING, allowNull: false },
});
export default NewModel;
```

### 2. Create Migration

```bash
npx sequelize-cli migration:generate --name create_newmodel
# Edit dataBase/migrations/XXXXX-create_newmodel.cjs
npx sequelize-cli db:migrate
```

### 3. Create Service

```javascript
// src/newfeature/newService.js
export default class NewService {
  async init(db) {
    this.Model = db.models;
  }
  async create(data) {
    return await this.Model.NewModel.create(data);
  }
}
```

### 4. Create Controller

```javascript
// src/newfeature/newController.js
export const create = async (req, res) => {
  try {
    const result = await NewService.create(req.body);
    respnseHandler(res, STATUS_CODE.CREATED, "Created", result);
  } catch (error) {
    respnseHandler(res, STATUS_CODE.SERVER_ERROR, error.message);
  }
};
```

### 5. Create Route

```javascript
// src/routes/newRoutes.js
import express from "express";
import authorize from "../middleweare/authmiddleweare.js";
import * as newController from "../newfeature/newController.js";

const router = express.Router();
router.post("/", authorize, newController.create);
export default router;
```

### 6. Register Route in App

```javascript
// config/app.js
import newRoutes from "../src/routes/newRoutes.js";
app.use("/api/new", newRoutes);
```

---

## 🔗 Model Relationships

```javascript
// One-to-Many: Role → Users
UserModel.belongsTo(RoleModel, { foreignKey: "role_Id" });
RoleModel.hasMany(UserModel, { foreignKey: "role_Id" });

// Query with relationship
User.findOne({
  include: [{ model: RoleModel, as: "role" }],
});

// One-to-Many: User → Devices
UserDeviceModel.belongsTo(UserModel, { foreignKey: "user_Id" });
UserModel.hasMany(UserDeviceModel, { foreignKey: "user_Id" });

// Query with nested data
User.findOne({
  include: [{ model: UserDeviceModel, as: "devices" }],
});
```

---

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] Database connects successfully
- [ ] Can register new user
- [ ] Can login and get token
- [ ] Can access protected routes with token
- [ ] Returns 401 without token
- [ ] Returns 403 for wrong role
- [ ] Can upload avatar to Cloudinary
- [ ] Emails send via Brevo
- [ ] Database queries work correctly

---

## 📞 Useful Links

- **API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Swagger**: [SWAGGER.yaml](./SWAGGER.yaml)
- **Setup**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Postman Docs**: Import SWAGGER.yaml

---

## 💾 Key Dependencies

| Package      | Version | Use              |
| ------------ | ------- | ---------------- |
| express      | 5.2.1   | Web framework    |
| sequelize    | 6.37.8  | ORM              |
| mysql2       | 3.22.6  | MySQL driver     |
| bcrypt       | 6.0.0   | Password hashing |
| jsonwebtoken | 9.0.3   | JWT tokens       |
| joi          | 18.2.3  | Validation       |
| cloudinary   | 1.41.3  | Image upload     |
| multer       | 2.2.0   | File handling    |
| dotenv       | 17.4.2  | Environment vars |
| nodemon      | 3.1.14  | Dev auto-reload  |

---

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com/
- **Sequelize**: https://sequelize.org/
- **JWT**: https://jwt.io/
- **bcrypt**: https://www.npmjs.com/package/bcrypt
- **Joi**: https://joi.dev/

---

**Quick Help**: See full documentation in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) and [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**Last Updated**: July 13, 2026
