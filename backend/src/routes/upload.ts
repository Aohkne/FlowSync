import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import { UploadService } from '../services/uploadService';

const uploadService = new UploadService();
await uploadService.init();

export const uploadRoutes = new Elysia({ prefix: '/upload' })
  .use(authMiddleware)

  // UPLOAD AVATAR
  .post(
    '/avatar',
    async ({ body, set }) => {
      try {
        const url = await uploadService.uploadAvatar(body.file);
        set.status = 201;
        return { url };
      } catch (error) {
        set.status = 400;
        return {
          error: error instanceof Error ? error.message : 'Upload failed',
        };
      }
    },
    {
      body: t.Object({
        file: t.File({
          type: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          maxSize: '5m',
        }),
      }),
      detail: {
        tags: ['Upload'],
        summary: 'Upload avatar image',
        description: 'Upload user avatar (max 5MB, JPEG/PNG/WebP)',
        security: [{ bearerAuth: [] }],
      },
    }
  );
