import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'us-east-2' });
const BUCKET = process.env.BUCKET_NAME;

export const handler = async () => {
    try{
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
                'Access-Control-Allow-Origin': '*', // ✅ Allow local testing — restrict in prod
                'Access-Control-Allow-Credentials': false,
                'Content-Type': 'application/json',
            },
          };
    } catch(error){
        return {
            statusCode: 500,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': false,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Something went wrong' }),
          };
    }
  
};
