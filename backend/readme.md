# 🚀 FlowSync Backend API

> Real-time collaborative task board backend built with Elysia, Bun, PostgreSQL, and Drizzle ORM

## 🛠️ Technology Stack

### Runtime & Framework

| Technology | Description |
|-----------|-------------|
| ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white) | Ultra-fast JavaScript runtime |
| ![Elysia](https://img.shields.io/badge/Elysia-1E40AF?style=for-the-badge&logo=elysia&logoColor=white) | High-performance web framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Type-safe JavaScript |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) | API documentation & testing |

### Database & ORM

| Technology | Description |
|-----------|-------------|
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) | Relational database |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) | Database containerization |
| ![Drizzle ORM](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black) | Type-safe ORM for TypeScript |

### Authentication & Security

| Technology | Description |
|-----------|-------------|
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | Token-based authentication |
| ![bcrypt](https://img.shields.io/badge/bcrypt-338033?style=for-the-badge&logo=letsencrypt&logoColor=white) | Password hashing |

### Real-time & Features

| Technology | Description |
|-----------|-------------|
| ![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white) | Real-time communication |
| ![Static Files](https://img.shields.io/badge/Static_Files-FF6B6B?style=for-the-badge&logo=files&logoColor=white) | File upload & serving |

---

## 📂 Project Structure

```
📁 backend/
│
├── 📁 drizzle/                  # Auto-generated migration files
│   ├── 📄 0000_*.sql            # Migration scripts
│   └── 📄 seed.sql              # Sample data seeding script
│
├── 📁 uploads/                  # Uploaded files storage
│   └── 📁 avatars/              # User avatar images
│
├── 📁 src/                      # Source code
│   ├── 📁 config/               # Configuration files
│   │   └── 📄 database.ts       # Database connection config
│   │
│   ├── 📁 controllers/          # Request handlers
│   │   ├── 📄 authController.ts      # Authentication logic
│   │   ├── 📄 boardController.ts     # Board CRUD logic
│   │   ├── 📄 taskController.ts      # Task management logic
│   │   ├── 📄 commentController.ts   # Comment system logic
│   │   └── 📄 index.ts               # Export all controllers
│   │
│   ├── 📁 db/                   # Database layer
│   │   ├── 📄 schema.ts         # Drizzle schema definitions
│   │   └── 📄 index.ts          # Database connection instance
│   │
│   ├── 📁 lib/                  # Utility libraries
│   │   ├── 📄 auth.ts           # JWT & bcrypt utilities
│   │   ├── 📄 validation.ts     # Zod validation schemas
│   │   └── 📄 utils.ts          # Helper functions
│   │
│   ├── 📁 middleware/           # Custom middlewares
│   │   ├── 📄 auth.ts           # JWT authentication middleware
│   │   ├── 📄 errorHandler.ts   # Global error handling
│   │   └── 📄 rateLimit.ts      # Rate limiting middleware
│   │
│   ├── 📁 routes/               # API route definitions
│   │   ├── 📄 auth.ts           # Auth endpoints
│   │   ├── 📄 boards.ts         # Board management
│   │   ├── 📄 columns.ts        # Column operations
│   │   ├── 📄 tasks.ts          # Task CRUD & drag-drop
│   │   ├── 📄 comments.ts       # Comment system
│   │   ├── 📄 members.ts        # Board member management
│   │   ├── 📄 activities.ts     # Activity logging
│   │   ├── 📄 upload.ts         # File upload handling
│   │   ├── 📄 search.ts         # Search & filters
│   │   └── 📄 notifications.ts  # Notification system
│   │
│   ├── 📁 services/             # Business logic layer
│   │   ├── 📄 authService.ts    # Auth business logic
│   │   ├── 📄 boardService.ts   # Board business logic
│   │   ├── 📄 taskService.ts    # Task business logic
│   │   ├── 📄 uploadService.ts  # File upload handling
│   │   ├── 📄 notificationService.ts  # Notification logic
│   │   └── 📄 index.ts          # Export all services
│   │
│   ├── 📁 types/                # TypeScript type definitions
│   │   ├── 📄 index.ts          # Shared type definitions
│   │   ├── 📄 api.ts            # API request/response types
│   │   └── 📄 database.ts       # Database model types
│   │
│   ├── 📄 websocket.ts          # WebSocket server setup
│   └── 📄 index.ts              # Application entry point
│
├── 📄 Dockerfile                # Docker container configuration
├── 📄 .dockerignore             # Docker ignore patterns
├── 📄 .env                      # Environment variables (not in Git)
├── 📄 .env.example              # Environment template
├── 📄 .gitignore                # Git ignore rules
├── 📄 package.json              # Project dependencies & scripts
├── 📄 bun.lockb                 # Bun lock file
├── 📄 drizzle.config.ts         # Drizzle ORM configuration
├── 📄 tsconfig.json             # TypeScript configuration
└── 📄 README.md                 # This file
```

---

## ⚙️ Environment Variables

Create a `.env` file in the backend root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://flowsync_user:flowsync_pass@localhost:5432/flowsync_db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.1.0
- [Docker](https://www.docker.com/) & Docker Compose (recommended)
- [DataGrip](https://www.jetbrains.com/datagrip/) or any PostgreSQL client (optional)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Aohkne/FlowSync.git
cd flowSync/backend
```

#### 2. Install dependencies

```bash
bun install
```

#### 3. Start PostgreSQL with Docker

```bash
# From project root
docker-compose up -d db

# Or start just PostgreSQL
docker run -d \
  --name flowsync-postgres \
  -e POSTGRES_USER=flowsync_user \
  -e POSTGRES_PASSWORD=flowsync_pass \
  -e POSTGRES_DB=flowsync_db \
  -p 5432:5432 \
  postgres:16-alpine
```

#### 4. Setup environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

#### 5. Generate and push database schema

```bash
# Generate migration files
bun run db:generate

# Push schema to database (development)
bun run db:push

# Or run migrations (production)
bun run db:migrate
```

#### 6. Seed sample data (optional)

```bash
# Seed database with sample users, boards, tasks
bun run db:seed

# Or manually using Docker
docker exec -i flowsync_db psql -U flowsync_user -d flowsync_db < drizzle/seed.sql
```

#### 7. Start development server

```bash
bun run dev
```

Server will be running at:

- 🌐 **API**: http://localhost:3000
- 📚 **Swagger Docs**: http://localhost:3000/swagger
- 🔌 **WebSocket**: ws://localhost:3000/ws/:boardId

---

## 📜 Available Scripts

```bash
# Development
bun run dev          # Start development server with hot reload
bun run start        # Start production server

# Database
bun run db:generate  # Generate Drizzle migration files
bun run db:migrate   # Run migrations (production)
bun run db:push      # Push schema to database (development)
bun run db:studio    # Open Drizzle Studio (database GUI)
bun run db:seed      # Seed sample data

# Code Quality
bun run typecheck    # Run TypeScript type checking
bun run lint         # Run ESLint
bun run format       # Format code with Prettier

# Testing
bun test             # Run tests
bun test:watch       # Run tests in watch mode
bun test:coverage    # Run tests with coverage
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PATCH | `/api/auth/profile` | Update user profile | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Boards

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/boards` | Get all user boards | Yes |
| POST | `/api/boards` | Create new board | Yes |
| GET | `/api/boards/:id` | Get board by ID | Yes |
| PATCH | `/api/boards/:id` | Update board | Yes |
| DELETE | `/api/boards/:id` | Delete board | Yes |

### Columns

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/columns` | Create column | Yes |
| GET | `/api/columns/board/:boardId` | Get board columns | Yes |
| PATCH | `/api/columns/:id` | Update column | Yes |
| PATCH | `/api/columns/:id/reorder` | Reorder column position | Yes |
| DELETE | `/api/columns/:id` | Delete column | Yes |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks/:id` | Get task details | Yes |
| PATCH | `/api/tasks/:id` | Update task | Yes |
| PATCH | `/api/tasks/:id/move` | Move task (drag & drop) | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Comments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/comments` | Create comment | Yes |
| GET | `/api/comments/task/:taskId` | Get task comments | Yes |
| PATCH | `/api/comments/:id` | Update comment | Yes |
| DELETE | `/api/comments/:id` | Delete comment | Yes |

### Members

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/members/board/:boardId` | Get board members | Yes |
| POST | `/api/members` | Add member to board | Yes |
| PATCH | `/api/members/:id` | Update member role | Yes |
| DELETE | `/api/members/:id` | Remove member | Yes |

### Activities

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/activities/board/:boardId` | Get board activity log | Yes |

### Search & Filters

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/search/tasks` | Search tasks with filters | Yes |

**Query Parameters:**
- `boardId` - Filter by board ID
- `q` - Search query (title, description)
- `priority` - Filter by priority (low/medium/high)
- `assignedTo` - Filter by assigned user ID
- `columnId` - Filter by column ID
- `createdBy` - Filter by creator user ID
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset (default: 0)

### Notifications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get user notifications | Yes |
| PATCH | `/api/notifications/:id/read` | Mark notification as read | Yes |
| PATCH | `/api/notifications/read-all` | Mark all as read | Yes |

### File Upload

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload/avatar` | Upload avatar image | Yes |

**Accepted formats**: JPEG, PNG, WebP  
**Max file size**: 5MB

### WebSocket

| Event | Endpoint | Description | Auth |
|-------|----------|-------------|------|
| WS | `/ws/:boardId` | Real-time board updates | Yes |

**Events emitted:**
- `user_joined` - User joined board
- `user_left` - User left board
- `task_created` - New task created
- `task_updated` - Task updated
- `task_moved` - Task moved between columns
- `comment_added` - New comment added
- `notification` - New notification

---

## 🐳 Docker Commands

```bash
# Start PostgreSQL only
docker-compose up -d db

# Stop PostgreSQL
docker-compose down

# View database logs
docker-compose logs -f db

# Connect to PostgreSQL CLI
docker exec -it flowsync_db psql -U flowsync_user -d flowsync_db

# Backup database
docker exec flowsync_db pg_dump -U flowsync_user flowsync_db > backup.sql

# Restore database
docker exec -i flowsync_db psql -U flowsync_user flowsync_db < backup.sql

# Remove database (DELETES ALL DATA!)
docker-compose down -v
```

---

## 📊 Database Management

### Using Drizzle Studio

```bash
bun run db:studio
```

Open **http://localhost:4983** to:
- View all tables and relationships
- Edit records directly
- Run custom SQL queries
- Visualize schema

### Using DataGrip / pgAdmin

**Connection Settings:**

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `flowsync_db`
- **User**: `flowsync_user`
- **Password**: `flowsync_pass`

### Database Schema

```sql
-- Users (Profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Boards
CREATE TABLE boards (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Board Members
CREATE TABLE board_members (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(board_id, user_id)
);

-- Columns
CREATE TABLE columns (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  column_id UUID REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activities
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 Testing with Swagger

### Step-by-Step Guide

1. **Navigate to Swagger UI**: http://localhost:3000/swagger

2. **Register a new user**:
   - Find `POST /api/auth/register`
   - Click "Try it out"
   - Enter user details
   - Click "Execute"

3. **Login**:
   - Find `POST /api/auth/login`
   - Enter credentials
   - Copy the `token` from response

4. **Authorize**:
   - Click 🔒 **Authorize** button
   - Enter: `Bearer <your-token>`
   - Click "Authorize"

5. **Test protected endpoints**:
   - All endpoints now include your authentication token
   - Try creating a board, adding tasks, etc.

---

## ✨ Key Features

### Authentication & Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (10 rounds)
- Protected routes with middleware
- Role-based access control (Owner/Editor/Viewer)
- Rate limiting (100 requests/minute per IP)
- CORS protection

### Real-time Collaboration

- WebSocket server for live updates
- Online users tracking
- Real-time task movements
- Instant comment updates
- Live notifications

### Task Management

- Drag & drop with position tracking
- Priority levels (Low/Medium/High)
- Task assignment
- @mentions in comments
- Full-text search
- Advanced filtering

### Activity Tracking

- Complete audit trail
- User action logging
- Filtered activity views
- Metadata storage (JSONB)

### File Upload

- Avatar image upload
- File validation (type & size)
- Secure file storage
- Image optimization (future)

### API Documentation

- Auto-generated Swagger UI
- Interactive endpoint testing
- Request/response schemas
- Authentication testing

---
