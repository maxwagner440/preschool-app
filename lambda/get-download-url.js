import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: 'us-east-2' });
const BUCKET = process.env.BUCKET_NAME;
const allowedOrigins = [
  'http://localhost:4200',
  'http://owl-preschool-host.s3-website.us-east-2.amazonaws.com',
];

export const handler = async (event) => {
  const key = event.queryStringParameters?.key;

  const origin = event.headers.origin;
  const ALLOWED_ORIGIN = allowedOrigins.includes(origin) ? origin : 'http://owl-preschool-host.s3-website.us-east-2.amazonaws.com';

  if (!key) {
    return {
      statusCode: 400,
      
      body: JSON.stringify({ message: 'Missing file key' }),
    };
  }

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: 900 }); // 15 mins

  return {
    statusCode: 200,
    body: JSON.stringify({ url }),
    headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Credentials': false,
    },
  };
};
