import aws from 'aws-sdk'
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, './../../', '.env') });

export const ProductsController = {
  async getAll(dynamo: aws.DynamoDB.DocumentClient): Promise<aws.DynamoDB.DocumentClient.ItemList> {
    const results = await dynamo.scan({
      TableName: process.env.TABLE_PRODUCTS,
    }).promise()
    return results.Items;
  },

  async getById(dynamo: aws.DynamoDB.DocumentClient, id: string): Promise<aws.DynamoDB.DocumentClient.ItemList> {
    const result = await dynamo.query({
      TableName: process.env.TABLE_PRODUCTS,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': id }
    }).promise()

    return result.Items;
  },

  async addProduct(dynamo: aws.DynamoDB.DocumentClient, item: {
    id: string,
    title: string
    description: string
    price: number
  }) {
    return await dynamo.put({
      TableName: process.env.TABLE_PRODUCTS,
      Item: item
    }).promise();
  }
}
