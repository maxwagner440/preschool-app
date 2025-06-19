const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({ region: 'us-east-2' });
const BUCKET = process.env.BUCKET_NAME;

exports.handler = async (event) => {
  const key = event.queryStringParameters?.key;

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
    headers: { 'Content-Type': 'application/json' },
  };
};
