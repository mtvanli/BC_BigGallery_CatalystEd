import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadToS3(file: File): Promise<string> {
  if (!process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME) {
    throw new Error("AWS S3 bucket name is not defined");
  }

  const fileName = `${Date.now()}-${file.name}`;
  const fileBuffer = await file.arrayBuffer();

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(fileBuffer),
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}
