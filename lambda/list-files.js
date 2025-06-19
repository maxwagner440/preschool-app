import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'us-east-2' });
const BUCKET = process.env.BUCKET_NAME;
const allowedOrigins = [
  'http://localhost:4200',
  'http://owl-preschool-host.s3-website.us-east-2.amazonaws.com',
];

export const handler = async (event) => {
    try{
      const origin = event.headers.origin;
      const ALLOWED_ORIGIN = allowedOrigins.includes(origin) ? origin : 'http://owl-preschool-host.s3-website.us-east-2.amazonaws.com';
    
        const command = new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: 'uploads/',
          });
        
          const data = await s3.send(command);
        
          const files = (data.Contents || []).map((file) => ({
            key: file.Key,
            uploadedAt: file.LastModified,
          }));
        
          return {
            statusCode: 200,
            body: JSON.stringify(files),
            headers: {
                'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
                'Access-Control-Allow-Credentials': false,
                'Content-Type': 'application/json',
            },
          };
    } catch(error){
        return {
            statusCode: 500,
            headers: {
              'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
              'Access-Control-Allow-Credentials': false,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Something went wrong' }),
          };
    }
  
};
