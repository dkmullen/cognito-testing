<template>
  <v-container class="form-container">
    <div v-if="signedIn" class="signed-in-message">
      Signed in as {{ currentUser }}
      <span class="pseudo-link" @click="signOut">Sign out</span>
    </div>
    <v-form v-model="signUpIsValid" class="form" v-if="forms.signUpForm">
      <h2 class="center">Sign up</h2>
      <v-container>
        <BaseInput
          v-for="row in formData"
          :key="formData[row]"
          v-model="row.model"
          :required="row.required"
          :label="row.label"
          :type="row.type ? row.type : ''"
          :maxlen="row.maxlength"
          :id="row.id"
          :counter="false"
        />
        <div class="center">
          <v-btn
            color="primary"
            @click="signUp"
            :disabled="!signUpIsValid"
            :loading="submitting"
            >Sign up</v-btn
          >
          <div class="pseudo-link" @click="switchForms('signInForm')">
            Or sign in
          </div>
        </div>
      </v-container>
    </v-form>
    <v-form class="form" v-if="forms.confirmForm">
      <h2 class="center">Enter number</h2>
      <v-container>
        <BaseInput
          v-model="confirmNumber"
          required
          label="Confirmation Number"
          id="confirmNumber"
        />
        <div class="center">
          <v-btn color="primary" @click="confirm">Confirm</v-btn>
        </div>
      </v-container>
    </v-form>
    <v-form
      class="form"
      v-if="forms.signInForm"
      v-model="signInIsValid"
      ref="signInForm"
    >
      <h2 class="center">Sign in</h2>
      <v-container>
        <BaseInput
          v-model="user.username"
          required
          label="User Name"
          id="username"
          :counter="false"
        />
        <BaseInput
          v-model="user.password"
          required
          label="Password"
          id="password"
          type="password"
          :counter="false"
        />
        <div class="center">
          <v-btn color="primary" @click="signIn" :disabled="!signInIsValid"
            >Sign in</v-btn
          >

          <div class="pseudo-link" @click="switchForms('signUpForm')">
            Or sign up
          </div>

          <div class="pseudo-link" @click="googleIn" v-if="forms.signInForm">
            Sign in with Google
          </div>
        </div>
      </v-container>
    </v-form>
    <v-form class="form" v-if="forms.postForm" v-model="valid" ref="postForm">
      <h2 class="center">Post</h2>
      <v-container>
        <BaseTextArea
          v-model="post.quote"
          required
          label="Quote"
          id="quote"
          :counter="false"
          :disabled="submitting"
        />
        <BaseInput
          v-model="post.source"
          required
          label="Source"
          id="source"
          type="source"
          :disabled="submitting"
          :counter="false"
        />
        <div class="center">
          <v-btn
            color="primary"
            @click="doPost"
            :loading="submitting"
            :disabled="!valid"
            >Post</v-btn
          >
        </div>
      </v-container>
    </v-form>
    <div v-if="message" class="message center">{{ message }}</div>
    <div v-if="error" class="error center">{{ error }}</div>
  </v-container>
</template>

<script>
import * as auth from '../services/authservice';
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import jwt_decode from 'jwt-decode';

export default {
  name: 'QuotePoster',
  mounted() {
    this.checkForAuthenticatedUser();

    // This is a separate auth process for social sign-in (doesn't use signIn())
    const code = new URLSearchParams(window.location.search.substring(1)).get(
      'code'
    );
    if (code) {
      auth.getTokens(code);
      auth.eventBus.$on('tokensFromSocialSignin', (id_token) => {
        this.setIdToken(id_token);
        const decodedToken = jwt_decode(id_token);
        this.currentUser = decodedToken['email'];
        this.signedIn = true;
        this.switchForms('postForm');
      });
    }
  },
  computed: mapGetters(['authenticatedUser', 'idToken']),
  data: () => ({
    valid: true,
    signInIsValid: false,
    signUpIsValid: false,
    postFormValid: false,
    submitting: false,
    message: '',
    error: '',
    signedIn: false,
    currentUser: '',
    forms: {
      confirmForm: false,
      signUpForm: false,
      signInForm: true,
      postForm: false,
    },
    confirmNumber: '',
    confirmName: '',
    user: {
      username: '',
      password: '',
    },
    post: {
      quote: '',
      source: '',
    },
    formData: {
      username: {
        label: 'Username',
        model: '',
        maxlength: 50,
        required: true,
        id: 'username',
      },
      email: {
        label: 'Email',
        model: '',
        maxlength: 50,
        required: true,
        id: 'email',
        type: 'email',
      },
      password: {
        label: 'Password',
        model: '',
        required: true,
        id: 'password',
        maxlength: 20,
        type: 'password',
      },
    },
  }),
  methods: {
    ...mapActions(['setAuthenticatedUser', 'setIdToken']),
    signUp() {
      let user = {};
      for (let i in this.formData) {
        user[i] = this.formData[i].model;
      }
      auth.signUp(user);
      auth.eventBus.$on('signUpSuccess', (name) => {
        this.confirmName = name;
        this.switchForms('confirmForm');
      });
    },
    confirm() {
      auth.confirm(this.confirmName, this.confirmNumber);
      auth.eventBus.$on('confirmSuccess', () => {
        this.switchForms('signInForm');
      });
    },
    signIn() {
      auth.signIn(this.user);
      auth.eventBus.$on('signedIn', (res) => {
        this.currentUser = res.cognitoUser.username;
        this.setIdToken(res.token);
        this.signedIn = true;
        this.setAuthenticatedUser(res.cognitoUser);
        this.$refs.signInForm.reset();
        this.switchForms('postForm');
      });
    },
    async signOut() {
      const res = await auth.signOut();
      if (res) {
        this.signedIn = false;
        this.currentUser = '';
        this.setAuthenticatedUser(null);
        this.setIdToken('');
        this.switchForms('signInForm');
      }
    },
    switchForms(form) {
      for (let f in this.forms) {
        this.forms[f] = false;
      }
      this.forms[form] = true;
    },
    async doPost() {
      let data = {
        source: this.post.source,
        quote: this.post.quote,
      };
      this.submitting = true;
      let res = await axios
        .post(
          'https://h5uwr12hmi.execute-api.us-east-2.amazonaws.com/dev',
          data,
          {
            headers: {
              Authorization: this.idToken,
            },
          }
        )
        .catch((err) => {
          this.error = err;
          this.submitting = false;
        });
      if (res) {
        this.submitting = false;
        this.$refs.postForm.reset();
        this.message = 'Submitted';
        setTimeout(() => {
          this.message = '';
        }, 4000);
      }
    },
    async checkForAuthenticatedUser() {
      const res = await auth.getAuthenticatedUser();
      if (res) {
        this.signedIn = true;
        this.currentUser = res.username;
        this.switchForms('postForm');
      }
    },
    googleIn() {
      window.location.assign(
        'https://me-quote-poster.auth.us-east-2.amazoncognito.com/login?client_id=70snluik5pf9jenb07lumlbtd9&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+profile+phone&redirect_uri=https://dkmullen.com/poster/'
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.pseudo-link {
  color: #0c5b5b;
  cursor: pointer;
  font-size: small;
  margin-top: 10px;
}
.center {
  text-align: center;
}
.form-container {
  max-width: 500px;
}
.signed-in-message {
  font-size: small;
  text-align: right;
  margin-bottom: 2rem;
}
.message {
  color: #0c5b5b;
}
.error {
  color: red;
}
</style>
