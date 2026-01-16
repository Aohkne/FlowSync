# 🚀 FlowSync Backend API

> Real-time collaborative task board backend built with Elysia, Bun, PostgreSQL, and Drizzle ORM

## 🛠️ Technology Stack

### Backend Framework

| Technology                                                                                               | Description                    |
| -------------------------------------------------------------------------------------------------------- | ------------------------------ |
| ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)             | Ultra-fast JavaScript runtime  |
| ![Elysia](https://img.shields.io/badge/Elysia-1E40AF?style=for-the-badge&logo=elysia&logoColor=white)    | High-performance web framework |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) | API documentation & testing    |

### Database & ORM

| Technology                                                                                                        | Description                  |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) | Relational database          |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)             | Database containerization    |
| ![Drizzle ORM](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)      | Type-safe ORM for TypeScript |

### Authentication & Security

| Technology                                                                                                 | Description                |
| ---------------------------------------------------------------------------------------------------------- | -------------------------- |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)     | Token-based authentication |
| ![bcrypt](https://img.shields.io/badge/bcrypt-338033?style=for-the-badge&logo=letsencrypt&logoColor=white) | Password hashing           |

### Real-time & File Handling

| Technology                                                                                                       | Description             |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------- |
| ![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white) | Real-time communication |
| ![Static Files](https://img.shields.io/badge/Static_Files-FF6B6B?style=for-the-badge&logo=files&logoColor=white) | File upload & serving   |

## 📂 Project Structure

```
📁 backend/
│
├── 📁 drizzle/                  # Auto-generated migration files
│
├── 📁 uploads/                  # Uploaded files (avatars)
│   └── 📁 avatars/              # User avatar images
│
├── 📁 src/                      # Source code chính
│   ├── 📁 config/               # Configuration files
│   │   └── 📄 database.ts       # Database connection setup
│   │
│   ├── 📁 controllers/          # Business logic controllers
│   │   ├── 📄 authController.ts # Auth controller
│   │   └── 📄 index.ts          # Export controllers
│   │
│   ├── 📁 db/                   # Database configuration
│   │   ├── 📄 schema.ts         # Drizzle schema definitions
│   │   └── 📄 index.ts          # Database connection
│   │
│   ├── 📁 lib/                  # Utility libraries
│   │   └── 📄 auth.ts           # JWT & bcrypt utilities
│   │
│   ├── 📁 middleware/           # Custom middlewares
│   │
│   ├── 📁 routes/               # API route definitions
│   │   ├── 📄 auth.ts           # Authentication endpoints
│   │   ├── 📄 boards.ts         # Board management
│   │   ├── 📄 columns.ts        # Column operations
│   │   ├── 📄 tasks.ts          # Task CRUD & drag-drop
│   │   ├── 📄 comments.ts       # Comment system
│   │   ├── 📄 members.ts        # Board member management
│   │   ├── 📄 activities.ts     # Activity logs
│   │   ├── 📄 upload.ts         # File upload
│   │   ├── 📄 search.ts         # Search & filters
│   │   └── 📄 notifications.ts  # Notifications
│   │
│   ├── 📁 services/             # Business logic services
│   │   ├── 📄 authService.ts    # Auth service
│   │   ├── 📄 uploadService.ts  # Upload handling
│   │   ├── 📄 notificationService.ts # Notifications
│   │   └── 📄 index.ts          # Export services
│   │
│   ├── 📁 types/                # TypeScript type definitions
│   │   └── 📄 index.ts          # Shared types
│   │
│   ├── 📄 websocket.ts          # WebSocket server
│   └── 📄 index.ts              # Server entry point
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/flowsync

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server
PORT=3000
NODE_ENV=development
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- [Docker](https://www.docker.com/) & Docker Compose
- [DataGrip](https://www.jetbrains.com/datagrip/) or any PostgreSQL client (optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Aohkne/FlowSync.git
cd backend
```

2. **Install dependencies**

```bash
bun install
```

3. **Start PostgreSQL with Docker**

```bash
docker-compose up -d
```

4. **Setup environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Generate database schema**

```bash
bun run db:generate
```

6. **Push schema to database**

```bash
bun run db:push
```

7. **Seed sample data (optional)**

```bash
# Main Seed
docker exec -i flowsync-db psql -U postgres -d flowsync < drizzle/seed.sql

# Just add Notifications:
docker exec -i flowsync-db psql -U postgres -d flowsync < drizzle/0001_add_notifications.sql
```

8. **Start development server**

```bash
bun run dev
```

Server will be running at:

- 🌐 API: http://localhost:3000
- 📚 Swagger Docs: http://localhost:3000/docs

## 📜 Available Scripts

```bash
bun run dev          # Start development server with hot reload
bun run start        # Start production server
bun run typecheck    # Run TypeScript type checking
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run migrations
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio (database GUI)
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PATCH /api/auth/profile` - Update profile (protected)

### Boards

- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get board by ID
- `PATCH /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Columns

- `POST /api/columns` - Create column
- `GET /api/columns/board/:boardId` - Get columns by board
- `PATCH /api/columns/:id` - Update column
- `PATCH /api/columns/:id/reorder` - Reorder column
- `DELETE /api/columns/:id` - Delete column

### Tasks

- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/move` - Move task (drag & drop)
- `DELETE /api/tasks/:id` - Delete task

### Comments

- `POST /api/comments` - Create comment
- `GET /api/comments/task/:taskId` - Get task comments
- `PATCH /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Members

- `GET /api/members/board/:boardId` - Get board members
- `POST /api/members` - Add member to board
- `PATCH /api/members/:id` - Update member role
- `DELETE /api/members/:id` - Remove member

### Activities

- `GET /api/activities/board/:boardId` - Get board activity log

### Search & Filters

- `GET /api/search/tasks` - Search tasks with filters
  - Query params: `boardId`, `q`, `priority`, `assignedTo`, `columnId`, `createdBy`, `limit`, `offset`

### Notifications

- `GET /api/notifications` - Get user notifications (protected)
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all as read

### File Upload

- `POST /api/upload/avatar` - Upload avatar image (protected)
  - Accepts: JPEG, PNG, WebP (max 5MB)

### WebSocket

- `WS /ws/:boardId` - Real-time board updates (protected)
  - Events: `user_joined`, `user_left`, `task_created`, `task_moved`, `comment_added`, `notification`

## 🐳 Docker Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f postgres

# Connect to PostgreSQL CLI
docker exec -it flowsync-db psql -U postgres -d flowsync

# Remove all data (destructive!)
docker-compose down -v
```

## 📊 Database Management

### Using Drizzle Studio

```bash
bun run db:studio
```

Open http://localhost:4983 to view/edit database

### Using DataGrip

Connection settings:

- Host: `localhost`
- Port: `5432`
- Database: `flowsync`
- User: `postgres`
- Password: `postgres123`

## 🧪 Testing with Swagger

1. Navigate to http://localhost:3000/docs
2. Register a new user via `POST /api/auth/register`
3. Login via `POST /api/auth/login` and copy the token
4. Click "Authorize" button (🔒 icon)
5. Enter: `Bearer <your-token>`
6. Now you can test all protected endpoints!

## ✨ Key Features

- **JWT Authentication** - Secure user authentication with bcrypt
- **Real-time Collaboration** - WebSocket support for live updates
- **Drag & Drop Tasks** - Move tasks between columns with position tracking
- **File Upload** - Avatar upload with validation (5MB limit)
- **Advanced Search** - Full-text search with multiple filters
- **Notifications** - Real-time notifications for assignments & mentions
- **Activity Logging** - Complete audit trail with filters
- **Rate Limiting** - Built-in protection (100 req/min)
- **Role-based Access** - Owner/Editor/Viewer permissions
- **Auto-generated API Docs** - Interactive Swagger UI

## 🙏 Acknowledgments

- [Elysia](https://elysiajs.com/) - Amazing web framework
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
- [Bun](https://bun.sh/) - Lightning fast runtime
