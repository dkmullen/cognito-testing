<template>
  <v-container class="form-container">
    <div v-if="signedIn" class="signed-in-message">
      Signed in as {{ currentUser }}
      <span class="pseudo-link" @click="signOut">Sign out</span>
    </div>
    <v-form v-model="valid" class="form" v-if="forms.signUpForm">
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
        />
        <div class="center">
          <v-btn color="primary" @click="signUp">Sign up</v-btn>
          <div class="pseudo-link" @click="switchForms('signInForm')">
            Sign in
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
    <v-form class="form" v-if="forms.signInForm">
      <h2 class="center">Sign in</h2>
      <v-container>
        <BaseInput
          v-model="user.username"
          required
          label="User Name"
          id="username"
        />
        <BaseInput
          v-model="user.password"
          required
          label="Password"
          id="password"
          type="password"
        />
        <div class="center">
          <v-btn color="primary" @click="signIn">Sign in</v-btn>

          <div class="pseudo-link" @click="switchForms('signUpForm')">
            Sign up
          </div>
        </div>
      </v-container>
    </v-form>
    <v-form class="form" v-if="forms.postForm">
      <h2 class="center">Post</h2>
      <v-container>
        <BaseInput v-model="post.quote" required label="Quote" id="quote" />
        <BaseInput
          v-model="post.source"
          required
          label="Source"
          id="source"
          type="source"
        />
        <div class="center">
          <v-btn color="primary" @click="doPost">Post</v-btn>
        </div>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import * as auth from '../services/authservice';
import axios from 'axios';

export default {
  name: 'HelloWorld',
  mounted() {
    this.checkForAuthenticatedUser();
  },
  data: () => ({
    valid: false,
    signedIn: false,
    currentUser: '',
    token: '',
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
        this.currentUser = res.username;
        this.token = res.token;
        this.signedIn = true;
        this.switchForms('postForm');
      });
    },
    async signOut() {
      const res = await auth.signOut();
      if (res) {
        this.signedIn = false;
        this.currentUser = '';
        this.switchForms('signInForm');
      }
    },
    switchForms(form) {
      for (let f in this.forms) {
        this.forms[f] = false;
      }
      this.forms[form] = true;
    },
    doPost() {
      let data = {
        source: this.post.source,
        quote: this.post.quote,
      };
      console.log(data);
      auth.getAuthenticatedUser((err, user) => {
        if (err) {
          console.log(err);
        }
        console.log(user);
      });
      axios.post(
        'https://h5uwr12hmi.execute-api.us-east-2.amazonaws.com/dev',
        data,
        {
          headers: new Headers({
            Authorization: this.token,
          }),
        }
      );
    },
    async checkForAuthenticatedUser() {
      const res = await auth.getAuthenticatedUser();
      if (res) {
        console.log(res);
        this.signedIn = true;
        this.currentUser = res.username;
        this.switchForms('postForm');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pseudo-link {
  color: #0039b3;
  cursor: pointer;
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
</style>
