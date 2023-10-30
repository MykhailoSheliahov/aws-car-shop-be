import aws from 'aws-sdk'

import { ProductsController } from './../../controllers/productsController';
import { StocksController } from './../../controllers/stocksController';
import { snsController } from './../../controllers/snsController';
import { SQSProduct, ProductToSave } from './../../types/products.d';

export const handler = async (event) => {
  try {
    console.log('EVENT catalogBatchProcess Records\n' + JSON.stringify(event.Records, null, 2));
    const dynamo = new aws.DynamoDB.DocumentClient();

    const mappedProducts: ProductToSave[] = event.Records
      .map(record => {
        const item: SQSProduct = JSON.parse(record.body);
        return {
          title: item.title,
          description: item.description,
          price: +item.price,
          count: +item.count,
        };
      });

    const adaptedProducts = await Promise.all(mappedProducts.map(async (product) => {
      try {
        const id = Math.floor(Math.random() * 1000000000).toString();

        const products = {
          id,
          description: product.description,
          title: product.title,
          price: product.price,
        };

        const stock = {
          id: Math.floor(Math.random() * 1000000000).toString(),
          product_id: id,
          count: product.count
        };

        await StocksController.addStock(dynamo, stock)
        await ProductsController.addProduct(dynamo, products);

        await snsController.publish(`Products were parsed. Result: ${JSON.stringify(product)}`,
          {
            'count': {
              'DataType': 'Number',
              'StringValue': `${product.count}`
            }
          }
        );
        return product;

      } catch (err) {
        console.error(`Error during saving product: [${product}]: `, err);
        return err;
      }
    }))

    return {
      body: JSON.stringify({ products: adaptedProducts }, null, 2),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }, null, 2),
    };
  }
}
