import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { testDatabaseConnection } from './config/database';

// ROUTES
import { authRoutes } from './routes/auth';
import { boardRoutes } from './routes/boards';
import { columnRoutes } from './routes/columns';
import { taskRoutes } from './routes/tasks';
import { commentRoutes } from './routes/comments';
import { memberRoutes } from './routes/members';
import { activityRoutes } from './routes/activities';
import { uploadRoutes } from './routes/upload';
import { searchRoutes } from './routes/search';
import { notificationRoutes } from './routes/notifications';

// WEBSOCKET
import { websocketPlugin } from './websocket';

// MIDDLEWARE
import { rateLimit } from './middleware/rateLimit';

// TEST: database connection
await testDatabaseConnection();

const app = new Elysia()
  // CORS
  .use(cors({ origin: true, credentials: true }))

  // Static files (for uploaded avatars)
  .use(staticPlugin({ assets: 'uploads', prefix: '/uploads' }))

  // Rate limiting (100 requests per minute)
  .use(rateLimit({ max: 100, window: 60 }))

  // Swagger
  .use(
    swagger({
      path: '/docs',
      documentation: {
        info: {
          title: 'FlowSync API',
          description: 'Real-time collaborative task board API',
          version: '1.0.0',
        },
        tags: [
          { name: 'Auth', description: 'Authentication' },
          { name: 'Boards', description: 'Board management' },
          { name: 'Columns', description: 'Column operations' },
          { name: 'Tasks', description: 'Task CRUD' },
          { name: 'Comments', description: 'Comments' },
          { name: 'Members', description: 'Board members' },
          { name: 'Activities', description: 'Activity logs' },
          { name: 'Upload', description: 'File uploads' },
          { name: 'Search', description: 'Search & filtering' },
          { name: 'Notifications', description: 'User notifications' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    })
  )

  // WebSocket
  .use(websocketPlugin)

  // Health check
  .get('/', () => ({
    message: 'FlowSync API v1.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'Authentication',
      'Boards & Tasks',
      'Real-time Collaboration',
      'File Upload',
      'Search & Filters',
      'Notifications',
    ],
  }))

  .get('/health', () => ({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
  }))

  // API Routes
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(boardRoutes)
      .use(columnRoutes)
      .use(taskRoutes)
      .use(commentRoutes)
      .use(memberRoutes)
      .use(activityRoutes)
      .use(uploadRoutes)
      .use(searchRoutes)
      .use(notificationRoutes)
  )

  // Error handling
  .onError(({ code, error, set }) => {
    console.error(`[${code}]`, error);

    const message = error instanceof Error ? error.message : String(error);

    if (code === 'VALIDATION') {
      set.status = 400;
      return { error: 'Validation failed', message };
    }

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: 'Not found', message };
    }

    set.status = 500;
    return {
      error: 'Internal server error',
      message:
        process.env.NODE_ENV === 'development'
          ? message
          : 'Something went wrong',
    };
  })

  .listen(process.env.PORT || 3000);

console.log(`
FlowSync API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server:   http://${app.server?.hostname}:${app.server?.port}
Docs:     http://${app.server?.hostname}:${app.server?.port}/docs
WebSocket: ws://${app.server?.hostname}:${app.server?.port}/ws/:boardId
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Features:
   - JWT Authentication
   - Real-time Collaboration (WebSocket)
   - File Upload (Avatars)
   - Advanced Search & Filters
   - Notifications System
   - Rate Limiting (100 req/min)
   - Activity Logging
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
