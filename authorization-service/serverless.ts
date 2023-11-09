import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, './', '.env') });

const serverlessConfiguration = {
  service: 'authorization-service',
  frameworkVersion: '3',
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
      REGION: process.env.REGION,
      mykhailosheliahov: process.env.mykhailosheliahov,
    },
  },
  functions: {
    basicAuthorizer: {
      handler: 'src/functions/basicAuthorizer.handler',
      events: [
        {
          responses: {
            200: {
              description: 'successful API Response',
              bodyType: 'Policy'
            },
            404: {
              description: 'error API Response',
              bodyType: 'Error'
            }
          }
        }
      ]
    },
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      title: 'Authorization Service',
      typefiles: ['./src/types/error.d.ts', './src/types/policy.d.ts'],
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
