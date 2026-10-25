import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { envs } from '../config/envs';

@Injectable()
export class StorageService {
  private readonly client = new S3Client({ region: envs.awsRegion });

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const mimeExtensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };
    const extension = mimeExtensions[file.mimetype];
    if (!extension) throw new Error('Formato de imagen no permitido');
    const prefix = folder.replace(/^\/+|\/+$/g, '');
    const key = `${prefix}/${randomUUID()}${extension}`;
    await this.client.send(new PutObjectCommand({
      Bucket: envs.awsBucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));
    const base = envs.awsPublicBaseUrl || `https://${envs.awsBucket}.s3.${envs.awsRegion}.amazonaws.com`;
    return `${base.replace(/\/$/, '')}/${key}`;
  }
}
