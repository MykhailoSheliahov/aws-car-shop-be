import AWS from 'aws-sdk';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, './../../', '.env') });

const sns = new AWS.SNS({ region: process.env.REGION });

export const snsController = {
  publish(message: string, attributes: {}) {
    return sns.publish({
      Message: message,
      TopicArn: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${process.env.SNS_TOPIC_NAME}`,
      MessageAttributes: attributes
    }).promise()
  }
} 
