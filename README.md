# MEDX - Healthcare Management System

A robust Node.js/Express.js backend API for healthcare management with dynamic role-based access control, JWT authentication, and comprehensive CRUD operations.

## 🏗️ Project Structure

```
MEDX/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── express.js       # Express middleware setup
│   │   └── constants.js     # Application constants
│   ├── controllers/         # Business logic controllers
│   │   ├── authController.js
│   │   ├── careUnitController.js
│   │   ├── userController.js
│   │   └── roleController.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   └── errorHandler.js # Global error handling
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   ├── CareUnit.js
│   │   └── Role.js
│   ├── routes/             # API route definitions
│   │   ├── auth.js
│   │   ├── careUnit.js
│   │   ├── user.js
│   │   └── role.js
│   ├── services/           # Business logic services
│   │   └── authService.js
│   ├── utils/              # Utility functions
│   │   └── createDefaultAdmin.js
│   └── validators/         # Input validation
│       ├── authValidator.js
│       ├── careUnitValidator.js
│       ├── userValidator.js
│       └── roleValidator.js
├── server.js               # Main application entry point
├── package.json
└── .env                    # Environment variables
```

## 🚀 Features

- **🔐 JWT Authentication** - Secure token-based authentication
- **👥 Dynamic Role-Based Access Control** - Flexible role and permission system
- **🏥 Care Unit Management** - Full CRUD operations for healthcare units
- **👤 User Management** - Complete user administration with role assignment
- **🎭 Role Management** - Create, update, and manage user roles with permissions
- **🛡️ Security** - Helmet, CORS, Rate limiting
- **✅ Input Validation** - Joi schema validation
- **📝 Error Handling** - Comprehensive error management
- **🗄️ MongoDB** - NoSQL database with Mongoose ODM

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MEDX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/medx
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=24h
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)

### Roles
- `GET /api/roles` - Get all roles (Admin only)
- `GET /api/roles/:id` - Get single role (Admin only)
- `POST /api/roles` - Create role (Admin only)
- `PUT /api/roles/:id` - Update role (Admin only)
- `DELETE /api/roles/:id` - Delete role (Admin only)
- `GET /api/roles/:id/permissions` - Get role permissions (Admin only)
- `PUT /api/roles/:id/permissions` - Update role permissions (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Care Units
- `GET /api/care-units` - Get all care units (Protected)
- `GET /api/care-units/:id` - Get single care unit (Protected)
- `POST /api/care-units` - Create care unit (Admin only)
- `PUT /api/care-units/:id` - Update care unit (Admin only)
- `DELETE /api/care-units/:id` - Delete care unit (Admin only)

### Health Check
- `GET /api/health` - Server health status

## 🔐 Authentication

### Login Request
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

### Response
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "admin",
    "role": {
      "id": "role_id",
      "name": "Admin",
      "description": "Full system administrator",
      "permissions": ["admin:all"]
    }
  }
}
```

### Using Protected Routes
Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 🎭 Role Management

### Create Role
```json
POST /api/roles
{
  "name": "Manager",
  "description": "Department manager with limited admin access",
  "permissions": [
    "user:read",
    "user:create",
    "care-unit:read",
    "care-unit:create",
    "care-unit:update"
  ]
}
```

### Update Role
```json
PUT /api/roles/:id
{
  "name": "Senior Manager",
  "description": "Updated description",
  "permissions": [
    "user:read",
    "user:create",
    "user:update",
    "care-unit:read",
    "care-unit:create",
    "care-unit:update"
  ]
}
```

### Update Role Permissions
```json
PUT /api/roles/:id/permissions
{
  "permissions": [
    "user:read",
    "care-unit:read",
    "care-unit:create"
  ]
}
```

## 👤 User Management

### Create User
```json
POST /api/users
{
  "username": "newuser",
  "password": "password123",
  "role": "role_id_here"
}
```

### Update User
```json
PUT /api/users/:id
{
  "username": "updateduser",
  "role": "new_role_id",
  "isActive": true
}
```

## 🏥 Care Unit Operations

### Create Care Unit
```json
POST /api/care-units
{
  "careUnit": "Emergency Department",
  "description": "24/7 emergency medical care"
}
```

### Update Care Unit
```json
PUT /api/care-units/:id
{
  "careUnit": "Updated Emergency Department",
  "description": "Updated description"
}
```

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Dynamic Role-Based Access** - Flexible permission system
- **Permission-Based Authorization** - Granular access control
- **Input Validation** - Joi schema validation
- **Rate Limiting** - 100 requests per 15 minutes
- **Security Headers** - Helmet middleware
- **CORS Protection** - Cross-origin resource sharing
- **Password Hashing** - bcryptjs encryption

## 📊 Database Models

### User Model
- `username` (String, required, unique)
- `password` (String, required, hashed)
- `role` (ObjectId, ref: Role, required)
- `isActive` (Boolean, default: true)
- `createdBy` (ObjectId, ref: User)
- `timestamps` (createdAt, updatedAt)

### Role Model
- `name` (String, required, unique)
- `description` (String, optional)
- `permissions` (Array of Strings)
- `isActive` (Boolean, default: true)
- `isSystem` (Boolean, default: false)
- `createdBy` (ObjectId, ref: User, required)
- `updatedBy` (ObjectId, ref: User)
- `timestamps` (createdAt, updatedAt)

### Care Unit Model
- `careUnit` (String, required)
- `description` (String, optional)
- `isActive` (Boolean, default: true)
- `createdBy` (ObjectId, ref: User, required)
- `updatedBy` (ObjectId, ref: User)
- `timestamps` (createdAt, updatedAt)

## 🔧 Available Permissions

- `user:read` - View users
- `user:create` - Create users
- `user:update` - Update users
- `user:delete` - Delete users
- `care-unit:read` - View care units
- `care-unit:create` - Create care units
- `care-unit:update` - Update care units
- `care-unit:delete` - Delete care units
- `role:read` - View roles
- `role:create` - Create roles
- `role:update` - Update roles
- `role:delete` - Delete roles
- `admin:all` - Full system access

## 🔧 Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server (if nodemon is installed)

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## 📝 Error Handling

The application includes comprehensive error handling:
- **Validation Errors** - Input validation failures
- **Authentication Errors** - Invalid tokens/credentials
- **Authorization Errors** - Insufficient permissions
- **Database Errors** - MongoDB connection issues
- **General Errors** - Unexpected server errors

## 🚀 Deployment

1. Set production environment variables
2. Ensure MongoDB is accessible
3. Run `npm start`
4. Monitor logs for any issues

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
- Role: `Admin` (with full permissions)

**Default Roles:**
- **Admin** - Full system access with all permissions
- **Staff** - Limited access (read care units and users) 