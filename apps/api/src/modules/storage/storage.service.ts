import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  async saveFile(file: Express.Multer.File) {
    const dir = join(process.cwd(), 'uploads');
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}${extname(file.originalname)}`;
    await writeFile(join(dir, filename), file.buffer);
    return `/uploads/${filename}`;
  }
}
