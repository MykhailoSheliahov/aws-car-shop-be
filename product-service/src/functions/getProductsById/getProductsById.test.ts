import { APIGatewayProxyEvent } from "aws-lambda";

import { products } from "../../mocks/data";
import { handler } from "./getProductsById";

describe("getProductsById", () => {
  const idMatch = "1";
  const idError = "100";

  const eventSuccess: APIGatewayProxyEvent = {
    pathParameters: {
      id: idMatch
    }
  } as any

  const eventError: APIGatewayProxyEvent = {
    pathParameters: {
      id: idError
    }
  } as any

  const responseSuccess = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(products[0], null, 2),
  };

  const responseError = {
    statusCode: 404,
    body: JSON.stringify(
      { error: `There is no such product  with id - ${idError}` },
      null,
      2
    ),
  };

  it("should return correct data", async () => {
    await expect(
      handler(eventSuccess, {} as any, {} as any)
    ).resolves.toStrictEqual(responseSuccess);
  });

  it("should return error data", async () => {
    await expect(
      handler(eventError, {} as any, {} as any)
    ).resolves.toStrictEqual(responseError);
  });
});
