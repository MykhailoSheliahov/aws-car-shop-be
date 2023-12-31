import { APIGatewayProxyHandler } from 'aws-lambda';
import aws from 'aws-sdk'

import { ProductsController } from '../../controllers/productsController';
import { StocksController } from '../../controllers/stocksController';

export const handler: APIGatewayProxyHandler = async (event, _context, _callback) => {
  try {
    console.log("EVENT\n" + JSON.stringify(event, null, 2));

    const dynamo = new aws.DynamoDB.DocumentClient();

    const id = event.pathParameters.id;

    const product = await ProductsController.getById(dynamo, id);
    const stocks = await StocksController.getAll(dynamo);

    const result = product.map(product => {
      const stockItem = stocks.find(stock => stock.product_id === product.id)

      product.count = stockItem
        ? stockItem.count
        : null

      return product
    })[0]

    if (!result) {
      throw new Error("No product");
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(result, null, 2),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }, null, 2),
    };
  }
};
