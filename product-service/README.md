# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Test your service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/hello` route with `POST` method. The request body must be provided as `application/json`. The body structure is tested by API Gateway against `src/functions/hello/schema.ts` JSON-Schema definition: it must contain the `name` property.

- requesting any other path than `/hello` with any other method than `POST` will result in API Gateway returning a `403` HTTP error code
- sending a `POST` request to `/hello` with a payload **not** containing a string property named `name` will result in API Gateway returning a `400` HTTP error code
- sending a `POST` request to `/hello` with a payload containing a string property named `name` will result in API Gateway returning a `200` HTTP status code with a message saluting the provided name and the detailed event processed by the lambda

> :warning: As is, this template, once deployed, opens a **public** endpoint within your AWS account resources. Anybody with the URL can actively execute the API Gateway endpoint and the corresponding lambda. You should protect this endpoint with the authentication method of your choice.

### Locally

In order to test the hello function locally, run the following command:

- `npx sls invoke local -f hello --path src/functions/hello/mock.json` if you're using NPM
- `yarn sls invoke local -f hello --path src/functions/hello/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts      # `Hello` lambda source code
│   │   │   ├── index.ts        # `Hello` lambda Serverless configuration
│   │   │   ├── mock.json       # `Hello` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `Hello` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`


### Database DynamoDB

### Product Table

### Get all products

- aws dynamodb scan --table-name Products

### Add product

- aws dynamodb put-item --table-name Products --item '{ "id": { "S": "1" }, "title": { "S": "BMW" }, "description": { "S": "Short Product Description BMW" }, "price": { "N": "24" } } '
- aws dynamodb put-item --table-name Products --item '{ "id": { "S": "2" }, "title": { "S": "Volvo" }, "description": { "S": "Short Product Description Volvo" }, "price": { "N": "15" } } '
- aws dynamodb put-item --table-name Products --item '{ "id": { "S": "3" }, "title": { "S": "Tesla" }, "description": { "S": "Short Product Description Tesla" }, "price": { "N": "23" } } '
- aws dynamodb put-item --table-name Products --item '{ "id": { "S": "4" }, "title": { "S": "Porsche" }, "description": { "S": "Short Product Description Porsche" }, "price": { "N": "14" } } '
- aws dynamodb put-item --table-name Products --item '{ "id": { "S": "5" }, "title": { "S": "Volkswagen" }, "description": { "S": "Short Product Description Volkswagen" }, "price": { "N": "3" } } '
- aws dynamodb put-item --table-name Products --item '{ "id": { "S": "6" }, "title": { "S": "Nissan" }, "description": { "S": "Short Product Description Nissan" }, "price": { "N": "5" } } '
- aws dynamodb put-item --table-name Products --item '{ "id": { "S": "7" }, "title": { "S": "Toyota" }, "description": { "S": "Short Product Description Toyota" }, "price": { "N": "9" } } '
- aws dynamodb put-item --table-name Products --item '{ "id": { "S": "8" }, "title": { "S": "Alfa Romeo" }, "description": { "S": "Short Product Description Alfa Romeo" }, "price": { "N": "10" } }'


### Stocks Table

### Get all stocks

- aws dynamodb scan --table-name Stocks

### Add stock

- aws dynamodb put-item --table-name Stocks --item '{ "id": { "S": "1" }, "product_id": { "S": "1" }, "count": { "N": "5" } } '
- aws dynamodb put-item --table-name Stocks --item '{ "id": { "S": "2" }, "product_id": { "S": "2" }, "count": { "N": "10" } } '
- aws dynamodb put-item --table-name Stocks --item '{ "id": { "S": "3" }, "product_id": { "S": "3" }, "count": { "N": "15" } } '
- aws dynamodb put-item --table-name Stocks --item '{ "id": { "S": "4" }, "product_id": { "S": "4" }, "count": { "S": "20" } } '
- aws dynamodb put-item --table-name Stocks --item '{ "id": { "S": "5" }, "product_id": { "S": "5" }, "count": { "S": "25" } } '
- aws dynamodb put-item --table-name Stocks --item '{ "id": { "S": "6" }, "product_id": { "S": "6" }, "count": { "S": "30" } } '
- aws dynamodb put-item --table-name Stocks --item '{ "id": { "S": "7" }, "product_id": { "S": "7" }, "count": { "S": "35" } } '
- aws dynamodb put-item --table-name Stocks --item '{ "id": { "S": "8" }, "product_id": { "S": "8" }, "count": { "S": "40" } } '


