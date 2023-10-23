import AWS from 'aws-sdk';
import path from 'path';
import * as dotenv from 'dotenv';

import { S3_UPLOADED_FOLDER, S3_PARSED_FOLDER } from './../constants';

dotenv.config({ path: path.join(__dirname, './', '.env') });

const s3 = new AWS.S3({ region: process.env.REGION, signatureVersion: 'v4' });

export const s3Controller = {
  async getSignedUrl(key: string): Promise<string> {
    console.log("EVENT s3Controller.getSignedUrl params\n" + JSON.stringify(key, null, 2));

    return s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.BUCKET,
      Key: `${S3_UPLOADED_FOLDER}/${key}`,
      ACL: 'public-read',
      Expires: 60,
      ContentType: 'text/csv'
    });
  },

  getReadableStream(key: string) {
    console.log("EVENT s3Controller.getReadableStream params\n" + JSON.stringify(key, null, 2));

    return s3.getObject({
      Bucket: process.env.BUCKET,
      Key: key,
    }).createReadStream();
  },

  async moveObject(key: string): Promise<void> {
    console.log("EVENT s3Controller.moveObject params\n" + JSON.stringify(key, null, 2));

    await s3.copyObject({
      Bucket: process.env.BUCKET,
      CopySource: `${process.env.BUCKET}/${key}`,
      Key: key.replace(S3_UPLOADED_FOLDER, S3_PARSED_FOLDER)
    }).promise();

    await s3.deleteObject({
      Bucket: process.env.BUCKET,
      Key: key
    }).promise();

    console.log(`EVENT s3Controller.moveObject File "${key}" moved to "${S3_PARSED_FOLDER}/" folder`);
  }
}
