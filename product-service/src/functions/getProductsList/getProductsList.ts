import { APIGatewayProxyHandler } from 'aws-lambda';
import aws from 'aws-sdk'

import { ProductsController } from '../../controllers/productsController';
import { StocksController } from '../../controllers/stocksController';

export const handler: APIGatewayProxyHandler = async (_event, _context, _callback) => {
  try {
    console.log("EVENT\n" + JSON.stringify(_event, null, 2));

    const dynamo = new aws.DynamoDB.DocumentClient();

    const products = await ProductsController.getAll(dynamo);
    const stocks = await StocksController.getAll(dynamo);

    if (!products || !stocks) {
      throw new Error("No products");
    }

    const result = products.map(product => {
      const stockItem = stocks.find(stock => stock.product_id === product.id)

      product.count = stockItem
        ? stockItem.count
        : null

      return product
    })

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(result, null, 2),
    };


  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error, null, 2),
    };
  }
};
