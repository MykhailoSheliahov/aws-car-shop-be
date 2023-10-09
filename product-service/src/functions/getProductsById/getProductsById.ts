import { APIGatewayProxyHandler } from 'aws-lambda';

import { products } from "./../../mocks/data";

export const handler: APIGatewayProxyHandler = async (event, _context, _callback) => {
  try {
    const id = event.pathParameters.id;

    const filteredItem = products.find((product) => product.id === id);

    if (!filteredItem) {
      throw new Error(`There is no such product  with id - ${id}`);
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(filteredItem, null, 2),
    };
  } catch (error: any) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: error.message }, null, 2),
    };
  }
};
