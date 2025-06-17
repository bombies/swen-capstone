import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
	private readonly s3Client: S3Client;
	private readonly bucket: string;

	constructor(private readonly configService: ConfigService) {
		this.s3Client = new S3Client();
		this.bucket = this.configService.get<string>('BUCKET_NAME')!;
	}

	/**
	 * Generates a pre-signed URL for uploading a file
	 * @param key The object key in S3
	 * @param contentType The content type of the file
	 * @param expiresIn Time in seconds until the URL expires (default: 3600)
	 */
	async generatePresignedUploadUrl(
		key: string,
		contentType: string,
		expiresIn = 3600,
	): Promise<string> {
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			ContentType: contentType,
		});

		return getSignedUrl(this.s3Client, command, { expiresIn });
	}

	/**
	 * Generates a pre-signed URL for downloading a file
	 * @param key The object key in S3
	 * @param expiresIn Time in seconds until the URL expires (default: 3600)
	 */
	async generatePresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		return getSignedUrl(this.s3Client, command, { expiresIn });
	}

	/**
	 * Deletes an object from S3
	 * @param key The object key in S3
	 */
	async deleteObject(key: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		await this.s3Client.send(command);
	}

	/**
	 * Generates a unique object key for a file
	 * @param prefix The prefix for the object key (e.g., 'products', 'letters')
	 * @param filename The original filename
	 * @param objectId Optional object ID to include in the key
	 */
	generateObjectKey(prefix: string, filename: string, objectId: string = crypto.randomUUID()): string {
		const extension = filename.split('.').pop();
		return `${prefix}/${objectId}.${extension}`;
	}
}
