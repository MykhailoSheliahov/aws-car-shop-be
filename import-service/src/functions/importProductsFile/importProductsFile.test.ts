

import { handler } from './importProductsFile';
import { HEADERS } from './../../constants'
import * as s3Service from './../../controllers/s3Controller';

jest.mock('./../../controllers/s3Controller.ts')

describe('importProductsFile', () => {
  const fileMockName = 'mockName.csv';
  const validMockEvent = { queryStringParameters: { name: fileMockName } }
  const s3FileLink = `https://aws-import-service-bucket.s3.eu-west-1.amazonaws.com/uploaded/${fileMockName}`;

  const successfulResponse = {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify(s3FileLink, null, 2)
  };

  const errorResponse = {
    statusCode: 500,
    body: JSON.stringify({ error: 'Query parameter "name" is missed' }, null, 2)
  };

  it('should return url to file in 3 bucket', async () => {
    // @ts-ignore
    s3Service.s3Controller.getSignedUrl.mockResolvedValue(s3FileLink);
    expect(await handler(validMockEvent as any, {} as any, {} as any)).toEqual(successfulResponse)
  });

  it('should return error', async () => {
    const mockEvent = { queryStringParameters: {} };
    expect(await handler(mockEvent as any, {} as any, {} as any)).toEqual(errorResponse)
  });
});
