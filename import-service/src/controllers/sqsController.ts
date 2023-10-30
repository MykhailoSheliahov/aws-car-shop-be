import AWS from 'aws-sdk';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, './../../', '.env') });

const sqs = new AWS.SQS({ region: process.env.REGION });
const queueUrl = `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_NUMBER}/${process.env.SQS_QUEUE_NAME}`;

export const sqsController = {
  async sendMessage(message: string | object) {
    console.log('Message to send to SQS: ', message);
    const messageToSend = typeof message === 'object'
      ? JSON.stringify(message)
      : message;
    return sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: messageToSend
    }).promise();
  }
};
