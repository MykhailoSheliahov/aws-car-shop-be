import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, './', '.env') });

const serverlessConfiguration = {
  service: 'product-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-auto-swagger', 'serverless-webpack', 'serverless-offline', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: {
    getProductsList: {
      handler: 'src/functions/getProductsList/getProductsList.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
            responses: {
              200: {
                description: 'successful API Response',
                bodyType: "Product"
              },
              404: {
                description: 'error API Response',
                bodyType: "Error"
              }
            }
          },
        },
      ],
      environment: {
        TABLE_PRODUCTS: process.env.TABLE_PRODUCTS,
        TABLE_STOCKS: process.env.TABLE_STOCKS
      }
    },
    getProductsById: {
      handler: 'src/functions/getProductsById/getProductsById.handler',
      events: [
        {
          http: {
            path: 'products/{id}',
            method: 'get',
            cors: true,

            request: {
              parameters: {
                paths: {
                  id: true
                }
              }
            },
            responses: {
              200: {
                description: 'successful API Response',
                bodyType: "Product"
              },
              404: {
                description: 'error API Response',
                bodyType: "Error"
              }
            }
          }
        }

      ],
      environment: {
        TABLE_PRODUCTS: process.env.TABLE_PRODUCTS,
        TABLE_STOCKS: process.env.TABLE_STOCKS
      }
    },
    createProduct: {
      handler: 'src/functions/createProduct/createProduct.handler',
      events: [
        {
          http: {
            path: 'products',
            method: 'post',
            cors: true,
            bodyType: "Product",
            responses: {
              200: {
                description: 'successful API Response',
                bodyType: "PostProduct"
              },
              404: {
                description: 'error API Response',
                bodyType: "Error"
              }
            }
          }
        }

      ],
      environment: {
        TABLE_PRODUCTS: process.env.TABLE_PRODUCTS,
        TABLE_STOCKS: process.env.TABLE_STOCKS
      }
    }
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      title: 'Product Service',
      typefiles: ['./src/types/products.d.ts', './src/types/error.d.ts', './src/types/stocks.d.ts'],
      apiType: 'http',
      swaggerPath: 'swagger',
      useStage: false,
      basePath: '/${sls:stage}',
      excludeStages: ['test', 'prod', 'production'],
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
