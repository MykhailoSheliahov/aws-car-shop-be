import { APIGatewayProxyHandler } from 'aws-lambda';

import { products } from "../../mocks/data";

export const handler: APIGatewayProxyHandler = async (_event, _context, _callback) => {
  try {
    if (!products) {
      throw new Error("No products");
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products, null, 2),
    };


  } catch (error: any) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: error.message }, null, 2),
    };
  }
};
