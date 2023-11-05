import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, './', '.env') });

const serverlessConfiguration = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-webpack', 'serverless-offline', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: process.env.REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamManagedPolicies: [
      'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: process.env.REGION,
      BUCKET: process.env.BUCKET,
      AWS_ACCOUNT_NUMBER: process.env.AWS_ACCOUNT_NUMBER,
      SQS_QUEUE_NAME: process.env.SQS_QUEUE_NAME,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          's3:PutObject',
          's3:GetObject',
          's3:ListAllMyBuckets',
          's3:ListBucket',
          's3:DeleteObject',
          's3:PutObjectAcl'
        ],
        Resource: '*'
      },
      {
        Effect: 'Allow',
        Action: ['sqs:SendMessage'],
        Resource: `arn:aws:sqs:${process.env.REGION}:${process.env.AWS_ACCOUNT_NUMBER}:${process.env.SQS_QUEUE_NAME}`
      }
    ],
  },
  resources: {
    "AWSTemplateFormatVersion": "2010-09-09",
    Resources: {
      "RestApi": {
        "Type": "AWS::ApiGateway::RestApi",
        "Properties": {
          "Name": "myRestApi"
        }
      },
      'GatewayResponse4XX': {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            "Ref": "RestApi"
          }
        }
      },
    },
  },
  functions: {
    importProductsFile: {
      handler: 'src/functions/importProductsFile/importProductsFile.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            authorizer: {
              name: 'basicAuthorizer',
              type: 'token',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              arn: `arn:aws:lambda:${process.env.REGION}:${process.env.AWS_ACCOUNT_NUMBER}:function:authorization-service-dev-basicAuthorizer`,
            },
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            responses: {
              200: {
                description: 'successful API Response',
                bodyType: 'File'
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
    importFileParser: {
      handler: 'src/functions/importFileParser/importFileParser.handler',
      events: [
        {

          s3: {
            bucket: process.env.BUCKET,
            event: 's3:ObjectCreated:*',
            rules: [{
              prefix: 'uploaded/'
            }],
            existing: true
          }
        },
      ],
    }
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      title: 'Import Service',
      typefiles: ['./src/types/file.d.ts', './src/types/error.d.ts'],
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
  }
}

module.exports = serverlessConfiguration;
