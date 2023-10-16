import aws from 'aws-sdk'
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, './../../', '.env') });

export const StocksController = {
  async getAll(dynamo: aws.DynamoDB.DocumentClient): Promise<aws.DynamoDB.DocumentClient.ItemList> {
    const results = await dynamo.scan({
      TableName: process.env.TABLE_STOCKS
    }).promise()
    return results.Items;
  },

  async addStock(dynamo: aws.DynamoDB.DocumentClient, item: {
    id: string,
    product_id: string
    count: number
  }) {
    return await dynamo.put({
      TableName: process.env.TABLE_STOCKS,
      Item: item
    }).promise();
  }
}
