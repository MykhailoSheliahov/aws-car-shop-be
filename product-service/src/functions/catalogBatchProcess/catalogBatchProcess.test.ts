import path from 'path';
import * as dotenv from 'dotenv';

import { handler } from './catalogBatchProcess';
import * as productService from './../../controllers/productsController';
import * as stockService from './../../controllers/stocksController';
import { snsController } from './../../controllers/snsController';

jest.mock('./../../controllers/productsController')
jest.mock('./../../controllers/stocksController')
jest.mock('./../../controllers/snsController')

dotenv.config({ path: path.join(__dirname, './../../../', '.env') });

const stockId = '';
const productId = '1'

const snsQueueRecordsMock = {
  title: 'Title mock',
  description: 'Description mock',
  price: 12,
  count: 10,
}

const mockProduct = {
  id: productId,
  title: snsQueueRecordsMock.title,
  description: snsQueueRecordsMock.description,
  price: snsQueueRecordsMock.price,
}

const mockStock = {
  id: stockId,
  product_id: productId,
  count: snsQueueRecordsMock.count
}

const mockEvent = { Records: [{ body: JSON.stringify(snsQueueRecordsMock) }] };
const mockEventSeveralProducts = { Records: [{ body: JSON.stringify(snsQueueRecordsMock) }, { body: JSON.stringify(snsQueueRecordsMock) }] };

describe('catalogBatchProcess handler', () => {
  beforeEach(() => {
    // @ts-ignore
    snsController.publish.mockClear()
    // @ts-ignore
    snsController.publish.mockReturnValue(null);
  })

  it('should return successful response', async () => {
    const successfulResponse = { body: JSON.stringify({ products: [snsQueueRecordsMock] }, null, 2) }
    // @ts-ignore
    productService.ProductsController.addProduct.mockReturnValue(mockProduct);
    // @ts-ignore
    stockService.StocksController.addStock.mockReturnValue(mockStock);


    expect(await handler(mockEvent)).toEqual(successfulResponse)
    expect(snsController.publish).toHaveBeenCalledTimes(1);
  })
  it('should save only valid products', async () => {
    const validationErrorResponse = {
      body: JSON.stringify({ products: [{}, snsQueueRecordsMock] }, null, 2)
    }

    // @ts-ignore
    productService.ProductsController.addProduct.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(await handler(mockEventSeveralProducts)).toEqual(validationErrorResponse)
    expect(snsController.publish).toHaveBeenCalledTimes(1);
  })
});
