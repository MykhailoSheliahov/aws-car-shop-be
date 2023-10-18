
import { APIGatewayProxyHandler } from 'aws-lambda';
import aws from 'aws-sdk'

import { ProductsController } from '../../controllers/productsController';
import { StocksController } from '../../controllers/stocksController';

export const handler: APIGatewayProxyHandler = async (event, _context, _callback) => {
  try {
    console.log("EVENT\n" + JSON.stringify(event, null, 2));

    const dynamo = new aws.DynamoDB.DocumentClient();

    const body = JSON.parse(event.body);

    const id = Math.floor(Math.random() * 1000000000).toString();

    const product = {
      id,
      description: body.description,
      title: body.title,
      price: body.price,
    };

    const stock = {
      id: Math.floor(Math.random() * 1000000000).toString(),
      product_id: id,
      count: body.count
    };

    await Promise.all([
      ProductsController.addProduct(dynamo, product),
      StocksController.addStock(dynamo, stock)
    ]);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: 'Product added',
        product
      }, null, 2),
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error, null, 2),
    };
  }
}