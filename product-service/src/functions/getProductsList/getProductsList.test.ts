import { handler } from "./getProductsList";
import { products } from "../../mocks/data";

describe("getProductsList", () => {
  const responseSuccess = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(products, null, 2),
  };

  it("should resolves correct data", async () => {
    await expect(handler({} as any, {} as any, {} as any)).resolves.toStrictEqual(responseSuccess);
  });
});
