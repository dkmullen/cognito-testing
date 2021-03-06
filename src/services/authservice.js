/* eslint-disable no-unused-vars */
import ENV from '../../.env.js';
import Vue from 'vue';
import axios from 'axios';

export const eventBus = new Vue();

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: ENV.UserPoolId,
  ClientId: ENV.ClientId,
};

let cognitoUser;
const userPool = new CognitoUserPool(poolData);

//////
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
        return;
      }
      cognitoUser = result.user;
      eventBus.$emit('signUpSuccess', cognitoUser.getUsername());
    }
  );
}

//////
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
    eventBus.$emit('confirmSuccess');
  });
}

//////
function signIn({ username, password }) {
  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      const idToken = result.getIdToken().getJwtToken();
      eventBus.$emit('signedIn', {
        token: idToken,
        cognitoUser,
      });
      cognitoUser.getUserData(function (err, userData) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
      });
    },
    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
    },
    mfaSetup: function (challengeName, challengeParameters) {
      cognitoUser.associateSoftwareToken(this);
    },
    associateSecretCode: function (secretCode) {
      console.log('qr code', secretCode);
      setTimeout(() => {
        var challengeAnswer = prompt('Please input the TOTP code.', '');
        cognitoUser.verifySoftwareToken(
          challengeAnswer,
          'My TOTP device',
          this
        );
      }, 1000);
    },
    totpRequired: function (secretCode) {
      var challengeAnswer = prompt(
        'Please input the TOTP code from your authentication app.',
        ''
      );
      cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
    },
  });
}

async function signOut() {
  const user = await getAuthenticatedUser();
  if (user) {
    user.signOut();
    return 'SUCCESS';
  }
}

async function getAuthenticatedUser() {
  return userPool.getCurrentUser();
}

async function getTokens(code) {
  const params = {
    grant_type: 'authorization_code',
    code,
    client_id: ENV.ClientId,
    redirect_uri: ENV.RedirectUri,
  };

  const data = Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data,
    url: `${ENV.AppUrl}/oauth2/token`,
  };

  const response = await axios(options);
  eventBus.$emit('tokensFromSocialSignin', response.data.id_token);
}

export { signUp, confirm, signIn, signOut, getAuthenticatedUser, getTokens };
