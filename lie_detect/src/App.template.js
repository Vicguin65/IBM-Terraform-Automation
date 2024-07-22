// In App.template.js

const poolData = {
  UserPoolId: "${user_pool_id}", // Placeholder for user pool id
  ClientId: "${client_id}"       // Placeholder for client id
};

const userPool = new CognitoUserPool(poolData);

