# 🛠️ FlowSync - Setup & Support Guide

Complete guide for installation, configuration, and troubleshooting

## 📋 Table of Contents

- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#️-environment-variables)
- [Installation Methods](#-installation-methods)
  - [Docker Setup (Recommended)](#option-1-docker-setup-recommended)
  - [Manual Setup](#option-2-manual-setup)
- [Application URLs](#-application-urls)
- [Available Scripts](#-available-scripts)
- [Database Management](#-database-management)
- [Testing with Swagger](#-testing-with-swagger)
- [Docker Commands](#-docker-commands)
- [Contributing](#-contributing)
- [Support Contact](#-support-contact)

---

## 🛠️ Technology Stack

### Backend

| Technology                                                                                               | Version | Description                    |
| -------------------------------------------------------------------------------------------------------- | ------- | ------------------------------ |
| ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)             | 1.1+    | Ultra-fast JavaScript runtime  |
| ![Elysia](https://img.shields.io/badge/Elysia-1E40AF?style=for-the-badge&logo=elysia&logoColor=white)    | 1.0+    | High-performance web framework |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) | 16 | Relational database |
| ![Drizzle ORM](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black) | Latest | Type-safe ORM |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)     | Latest | Authentication |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) | Latest | API documentation |

### Frontend

| Technology                                                                                                        | Version | Description                     |
| ----------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------- |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)               | 18      | JavaScript library for UI       |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)                   | 5       | Fast build tool                 |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | 5+      | Type-safe JavaScript            |
| ![Zustand](https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge&logo=react&logoColor=white)             | Latest  | State management                |
| ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white) | v5 | Server state management |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | 3.4 | Utility-first CSS |
| ![DnD Kit](https://img.shields.io/badge/DnD_Kit-000000?style=for-the-badge&logo=react&logoColor=white)           | Latest  | Drag & drop toolkit             |

### DevOps

| Technology                                                                                     | Version | Description              |
| ---------------------------------------------------------------------------------------------- | ------- | ------------------------ |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) | Latest | Containerization |
| ![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white) | 3.8+ | Multi-container orchestration |

---

## 📋 Prerequisites

### For Docker Setup (Recommended)

- [Docker](https://www.docker.com/get-started) >= 20.10
- [Docker Compose](https://docs.docker.com/compose/install/) >= 1.29
- Git

### For Manual Setup

- [Bun](https://bun.sh/) >= 1.1.0
- [Node.js](https://nodejs.org/) >= 18 (optional, Bun can replace this)
- [PostgreSQL](https://www.postgresql.org/) >= 14
- Git

---

## ⚙️ Environment Variables

### Backend (.env)

Create `backend/.env` file:

```bash
# Database
DATABASE_URL=postgresql://flowsync_user:flowsync_pass@db:5432/flowsync_db

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please

# Server
PORT=3000
NODE_ENV=development

# CORS (Frontend URL)
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

Create `frontend/.env` file:

```bash
# API Base URL
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Installation Methods

### Option 1: Docker Setup (Recommended)

#### Step 1: Clone Repository

```bash
git clone https://github.com/Aohkne/FlowSync.git
cd flowSync
```

#### Step 2: Create Environment Files

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env

# Edit files if needed (optional for development)
nano backend/.env
nano frontend/.env
```

#### Step 3: Start All Services

```bash
# Start database, backend, and frontend
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

#### Step 4: Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/swagger
- **PostgreSQL**: localhost:5432

**That's it! 🎉 Your app is running!**

---

### Option 2: Manual Setup

**For developers who want more control.**

#### Prerequisites Check

```bash
# Check Bun version
bun --version  # Should be >= 1.1.0

# Check PostgreSQL
psql --version  # Should be >= 14
```

#### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
bun install

# 3. Create environment file
cp .env.example .env

# Edit .env file with your database credentials
nano .env

# 4. Start PostgreSQL (if not using Docker)
# Option A: Using Docker for DB only
docker run -d \
  --name flowsync-postgres \
  -e POSTGRES_USER=flowsync_user \
  -e POSTGRES_PASSWORD=flowsync_pass \
  -e POSTGRES_DB=flowsync_db \
  -p 5432:5432 \
  postgres:16-alpine

# Option B: Use local PostgreSQL
# Create database manually:
# createdb flowsync_db

# 5. Generate database schema
bun run db:generate

# 6. Push schema to database
bun run db:push

# 7. Seed sample data (optional)
bun run db:seed

# 8. Start development server
bun run dev
```

Server will be running at **http://localhost:3000**

#### Frontend Setup

Open a **new terminal window**:

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
bun install

# 3. Create environment file
cp .env.example .env

# Edit .env if backend runs on different port
nano .env

# 4. Start development server
bun run dev
```

Frontend will be running at **http://localhost:5173**

---

## 🔗 Application URLs

| Service              | URL                               | Description                  |
| -------------------- | --------------------------------- | ---------------------------- |
| **Frontend**         | http://localhost:5173             | React web application        |
| **Backend API**      | http://localhost:3000             | REST API server              |
| **Swagger Docs**     | http://localhost:3000/swagger     | Interactive API documentation |
| **PostgreSQL**       | localhost:5432                    | Database (credentials in .env) |
| **Drizzle Studio**   | http://localhost:4983             | Database GUI (run `bun run db:studio`) |

---

## 📜 Available Scripts

### Backend Scripts

```bash
# Development
bun run dev                    # Start dev server with hot reload

# Production
bun run start                  # Start production server
bun run build                  # Build for production

# Database
bun run db:generate            # Generate migration files
bun run db:migrate             # Run migrations
bun run db:push                # Push schema to database (dev)
bun run db:studio              # Open Drizzle Studio (DB GUI)
bun run db:seed                # Seed sample data

# Code Quality
bun run typecheck              # Run TypeScript type checking
bun run lint                   # Run ESLint
bun run format                 # Format code with Prettier
```

### Frontend Scripts

```bash
# Development
bun run dev                    # Start dev server with HMR

# Production
bun run build                  # Build for production
bun run preview                # Preview production build

# Code Quality
bun run lint                   # Run ESLint
bun run type-check             # Run TypeScript type checking
bun run format                 # Format code with Prettier
```

### Docker Scripts

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Rebuild and start
docker-compose up -d --build

# Remove all data (DANGER!)
docker-compose down -v
```

---

## 📊 Database Management

### Using Drizzle Studio (Recommended)

```bash
# Navigate to backend
cd backend

# Open Drizzle Studio
bun run db:studio
```

Open **http://localhost:4983** in your browser to:

- View all tables and data
- Edit records directly
- Run custom queries
- View relationships

### Using PostgreSQL CLI

```bash
# Connect to database (Docker)
docker exec -it flowsync_db psql -U flowsync_user -d flowsync_db

# Connect to database (Local)
psql -U flowsync_user -d flowsync_db

# Common commands:
\dt                    # List all tables
\d users               # Describe users table
SELECT * FROM users;   # Query users
\q                     # Quit
```

### Using DataGrip / DBeaver / pgAdmin

**Connection Settings:**

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `flowsync_db`
- **User**: `flowsync_user`
- **Password**: `flowsync_pass`

### Database Backup & Restore

```bash
# Backup (Docker)
docker exec flowsync_db pg_dump -U flowsync_user flowsync_db > backup_$(date +%Y%m%d).sql

# Restore (Docker)
docker exec -i flowsync_db psql -U flowsync_user flowsync_db < backup_20240115.sql

# Backup (Local)
pg_dump -U flowsync_user flowsync_db > backup.sql

# Restore (Local)
psql -U flowsync_user flowsync_db < backup.sql
```

---

## 🧪 Testing with Swagger

### Step 1: Access Swagger UI

Open **http://localhost:3000/swagger** in your browser

### Step 2: Register a New User

1. Find **POST /api/auth/register** endpoint
2. Click "Try it out"
3. Fill in the request body:

```json
{
  "email": "huukhoa@example.com",
  "password": "Login123@",
  "fullName": "Le Huu khoa"
}
```

4. Click "Execute"
5. You should get a `201 Created` response

### Step 3: Login

1. Find **POST /api/auth/login** endpoint
2. Click "Try it out"
3. Fill in credentials:

```json
{
  "email": "huukhoa@example.com",
  "password": "Login123@"
}
```

4. Click "Execute"
5. **Copy the `token` from the response**

### Step 4: Authorize

1. Click the **🔒 Authorize** button at the top
2. Enter: `Bearer <your-token>` (replace `<your-token>` with the actual token)
3. Click "Authorize"
4. Click "Close"

### Step 5: Test Protected Endpoints

Now you can test all protected endpoints! Try:

- **GET /api/boards** - Get your boards
- **POST /api/boards** - Create a new board
- **GET /api/auth/me** - Get your profile

---

## 🐳 Docker Commands

### Container Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart backend

# View running containers
docker-compose ps

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Database Commands

```bash
# Access PostgreSQL shell
docker exec -it flowsync_db psql -U flowsync_user -d flowsync_db

# Run SQL file
docker exec -i flowsync_db psql -U flowsync_user -d flowsync_db < script.sql

# Backup database
docker exec flowsync_db pg_dump -U flowsync_user flowsync_db > backup.sql

# Restore database
docker exec -i flowsync_db psql -U flowsync_user flowsync_db < backup.sql
```

### Cleanup Commands

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes (DELETES ALL DATA!)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a

# View Docker disk usage
docker system df
```

### Rebuild & Restart

```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and start (no cache)
docker-compose up -d --build --force-recreate

# Rebuild and start specific service
docker-compose up -d --build backend
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Clone your fork**:

```bash
git clone https://github.com/Aohkne/FlowSync.git
cd flowSync
```

3. **Create feature branch**:

```bash
git checkout -b feature/amazing-feature
```

4. **Make your changes** and test thoroughly
5. **Commit changes**:

```bash
git add .
git commit -m 'Add amazing feature'
```

6. **Push to your fork**:

```bash
git push origin feature/amazing-feature
```

7. **Open Pull Request** on GitHub

### Running Tests

```bash
# Backend
cd backend
bun test

# Frontend
cd frontend
bun test
```

---

## 📞 Support Contact

### Get Help

- **GitHub Issues**: [Create an issue](https://github.com/Aohkne/FlowSync/issues)
- **Discussions**: [Join discussions](https://github.com/Aohkne/FlowSync/discussions)
- **Email**: aohkne@gmail.com

### Useful Links

- **Repository**: https://github.com/Aohkne/FlowSync
- **Documentation**: [README.md](./README.md)
- **Backend Docs**: [backend/README.md](./backend/README.md)
- **Frontend Docs**: [frontend/README.md](./frontend/README.md)

---

## 📚 Additional Resources

### Learning Resources

- [Bun Documentation](https://bun.sh/docs)
- [Elysia Documentation](https://elysiajs.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [React Documentation](https://react.dev/)
- [TanStack Query Docs](https://tanstack.com/query)
- [Tailwind CSS Docs](https://tailwindcss.com/)

### Tools

- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) - Database GUI
- [DataGrip](https://www.jetbrains.com/datagrip/) - Database IDE
- [Postman](https://www.postman.com/) - API testing
- [VS Code](https://code.visualstudio.com/) - Recommended editor

---

**Happy coding! 🚀**

If you encounter any issues not covered here, please [open an issue](https://github.com/Aohkne/FlowSync/issues) on GitHub.