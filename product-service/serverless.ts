import * as dotenv from 'dotenv';
import path from 'path';
import { AWS } from '@serverless/typescript'

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
    region: process.env.REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_PRODUCTS: process.env.TABLE_PRODUCTS,
      TABLE_STOCKS: process.env.TABLE_STOCKS,
      REGION: process.env.REGION,
      AWS_ACCOUNT_NUMBER: process.env.AWS_ACCOUNT_NUMBER,
      SQS_QUEUE_NAME: process.env.SQS_QUEUE_NAME,
      SNS_TOPIC_NAME: process.env.SNS_TOPIC_NAME,
      SNS_SUBSCRIPTION_MAIN_EMAIL: process.env.SNS_SUBSCRIPTION_MAIN_EMAIL,
      SNS_SUBSCRIPTION_RESERVED_EMAIL: process.env.SNS_SUBSCRIPTION_RESERVED_EMAIL,
    },
    iamManagedPolicies: [
      'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
    ],
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: `arn:aws:sqs:${process.env.REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${process.env.SQS_QUEUE_NAME}`

      },
      {
        Effect: 'Allow',
        Action: [
          'sns:Publish'
        ],
        Resource: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${process.env.SNS_TOPIC_NAME}`
      }
    ],
  },
  resources: {
    Resources: {
      'productItemsQueue': {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: process.env.SQS_QUEUE_NAME,
        }
      },
      'createProductTopic': {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: process.env.SNS_TOPIC_NAME,
        }
      },
      'mainEmailSubscription': {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          TopicArn: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${process.env.SNS_TOPIC_NAME}`,
          Protocol: 'email',
          Endpoint: process.env.SNS_SUBSCRIPTION_MAIN_EMAIL,
          FilterPolicy: {
            "count": [
              {
                "numeric": [
                  ">=",
                  100
                ]
              }
            ]
          }
        }
      },
      'reservedEmailSubscription': {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          TopicArn: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${process.env.SNS_TOPIC_NAME}`,
          Protocol: 'email',
          Endpoint: process.env.SNS_SUBSCRIPTION_RESERVED_EMAIL,
          FilterPolicy: {
            "count": [
              {
                "numeric": [
                  "<",
                  100
                ]
              }
            ]
          }
        }
      }
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
                bodyType: 'Product'
              },
              404: {
                description: 'error API Response',
                bodyType: 'Error'
              }
            }
          },
        },
      ],
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
                bodyType: 'Product'
              },
              404: {
                description: 'error API Response',
                bodyType: 'Error'
              }
            }
          }
        }
      ],
    },
    createProduct: {
      handler: 'src/functions/createProduct/createProduct.handler',
      events: [
        {
          http: {
            path: 'products',
            method: 'post',
            cors: true,
            bodyType: 'Product',
            responses: {
              200: {
                description: 'successful API Response',
                bodyType: 'PostProduct'
              },
              404: {
                description: 'error API Response',
                bodyType: 'Error'
              }
            }
          }
        }
      ],
    },
    catalogBatchProcess: {
      handler: 'src/functions/catalogBatchProcess/catalogBatchProcess.handler',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: `arn:aws:sqs:${process.env.REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${process.env.SQS_QUEUE_NAME}`
          }
        }

      ],
    },
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
