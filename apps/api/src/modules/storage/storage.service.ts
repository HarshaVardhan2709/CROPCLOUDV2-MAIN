import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { Injectable } from '@nestjs/common';

interface FileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class StorageService {
  async saveFile(file: FileType) {
    const dir = join(process.cwd(), 'uploads');
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}${extname(file.originalname)}`;
    await writeFile(join(dir, filename), file.buffer);
    return `/uploads/${filename}`;
  }
}
