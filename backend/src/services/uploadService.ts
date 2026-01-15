import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export class UploadService {
  private uploadDir = join(process.cwd(), 'uploads', 'avatars');

  async init() {
    // CREATE upload directory if not exists
    await mkdir(this.uploadDir, { recursive: true });
  }

  async uploadAvatar(file: File): Promise<string> {
    // VALIDATE file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, and WebP are allowed'
      );
    }

    // VALIDATE file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }

    // GENERATE unique filename
    const ext = file.name.split('.').pop();
    const filename = `${randomUUID()}.${ext}`;
    const filepath = join(this.uploadDir, filename);

    // SAVE file
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    return `/uploads/avatars/${filename}`;
  }

  async deleteAvatar(url: string): Promise<void> {
    // EXTRACT filename from URL
    const filename = url.split('/').pop();
    if (!filename) return;

    const filepath = join(this.uploadDir, filename);

    try {
      const fileExists = await Bun.file(filepath).exists();
      if (fileExists) {
        await import('fs/promises').then((fs) => fs.rm(filepath));
      }
    } catch (error) {
      console.error('Failed to delete avatar:', error);
    }
  }
}
