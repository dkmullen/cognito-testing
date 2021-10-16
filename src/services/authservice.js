/* eslint-disable no-unused-vars */
import ENV from '../../.env.js';
import Vue from 'vue';
export const eventBus = new Vue();

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: ENV.UserPoolId,
  ClientId: ENV.ClientId,
};

let cognitoUser;
const userPool = new CognitoUserPool(poolData);

function signUp({ username, email, password }) {
  const attributeList = [];

  const emailAttribute = {
    Name: 'email',
    Value: email,
  };

  attributeList.push(new CognitoUserAttribute(emailAttribute));

  userPool.signUp(
    username,
    password,
    attributeList,
    null,
    function (err, result) {
      if (err) {
        eventBus.$emit('signUpError', err);
        console.log('oops', err);
        return;
      }
      cognitoUser = result.user;
      console.log('success', result);
      eventBus.$emit('signUpSuccess', cognitoUser.getUsername());
    }
  );
}
function confirm(username, number) {
  var userData = {
    Username: username,
    Pool: userPool,
  };

  var cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmRegistration(number, true, function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    console.log('call result: ' + result);
  });
}
export { signUp, confirm };
