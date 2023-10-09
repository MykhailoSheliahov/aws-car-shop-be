// import type { AWS } from '@serverless/typescript';

const serverlessConfiguration = {
  service: 'product-service',
  frameworkVersion: '3',
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
      ]
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

      ]
    }
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      typefiles: ['./src/types/products.d.ts', './src/types/error.d.ts'],
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      swaggerPath: 'swagger',
      useStage: false,
      basePath: '/${sls:stage}',
      schemes: ['http', 'https'],
      excludeStages: ['test', 'prod', 'production'],
      useRedirectUI: true
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
