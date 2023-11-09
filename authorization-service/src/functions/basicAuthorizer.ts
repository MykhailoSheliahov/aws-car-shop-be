import { APIGatewayAuthorizerCallback, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

export const generatePolicy = (principalId, resource, effect = 'Allow') => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

export const handler = async (event: APIGatewayTokenAuthorizerEvent, _, callback: APIGatewayAuthorizerCallback) => {
  try {
    console.log("EVENT basicAuthorizer params\n" + JSON.stringify(event, null, 2));

    if (event.type !== 'TOKEN') {
      callback('Unauthorized');
      return;
    }

    const authorizationToken = event.authorizationToken;
    const encodedCreds = authorizationToken.split(' ')[1];

    const [username, password] = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(':');
    console.log(`EVENT username: ${username}, password: ${password}`);

    const storedUserPassword = process.env[username];
    console.log(`EVENT storedUserPassword: ${storedUserPassword}`);

    const effect = !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';
    console.log(`EVENT effect: ${effect}`);

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    console.log(`EVENT policy: ${JSON.stringify(policy)}, `);

    callback(null, policy)
  } catch (error) {
    console.log({ error: error.message });
    callback('Unauthorized')
    return;
  }
};
