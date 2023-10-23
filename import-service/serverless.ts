import type { AWS } from '@serverless/typescript'
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
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamManagedPolicies: [
      "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    ],
    iamRoleStatements: [
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListAllMyBuckets",
          "s3:ListBucket",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ],
        "Resource": "*"
      },
    ],
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
                bodyType: "File"
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
        BUCKET: process.env.BUCKET,
        REGION: process.env.REGION,
      }
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
      environment: {
        BUCKET: process.env.BUCKET,
        REGION: process.env.REGION,
      }
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
