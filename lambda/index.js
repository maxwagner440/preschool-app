import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-2" });
const allowedOrigins = [
  'http://localhost:4200',
  'http://owl-preschool-host.s3-website.us-east-2.amazonaws.com',
];

export const handler = async (event) => {
  try {
    const origin = event.headers.origin;
    const ALLOWED_ORIGIN = allowedOrigins.includes(origin) ? origin : 'http://owl-preschool-host.s3-website.us-east-2.amazonaws.com';
  
    const { fileName, contentType } = JSON.parse(event.body);

    const command = new PutObjectCommand({
      Bucket: "image-bucket-owl-preschool",
      Key: `uploads/${fileName}`,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({ signedUrl })
    };
  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 500, body: JSON.stringify({ message: "Error generating URL" }) };
  }
};
