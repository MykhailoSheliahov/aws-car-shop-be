import { APIGatewayProxyHandler } from 'aws-lambda';

import { s3Controller } from '../../controllers/s3Controller';
import { HEADERS } from './../../constants';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("EVENT importProductsFile params\n" + JSON.stringify(event, null, 2));

    if (JSON.stringify(event.queryStringParameters) === '{}' || !event.queryStringParameters?.name) {
      throw new Error('Query parameter "name" is missed');
    }

    const { name } = event.queryStringParameters;

    const url = await s3Controller.getSignedUrl(name);

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(url, null, 2),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }, null, 2),
    }
  }
};
