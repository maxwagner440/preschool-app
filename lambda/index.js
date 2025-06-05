import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const { filename, contentType } = JSON.parse(event.body);

    const command = new PutObjectCommand({
      Bucket: "your-bucket-name", // 🔥 update this
      Key: `uploads/${filename}`,
      ContentType: contentType
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
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
