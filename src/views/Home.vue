<template>
  <v-container>
    <v-form v-model="valid" class="form">
      <v-container>
        <v-row v-for="row in formData" :key="formData[row]">
          <BaseInput
            v-model="row.model"
            :required="row.required"
            :label="row.label"
            :type="row.type ? row.type : ''"
            :maxlen="row.maxlength"
            :id="row.id"
          />
        </v-row>
        <v-btn color="primary" @click="submit">Submit</v-btn>
      </v-container>
    </v-form>
    <v-form class="form" v-if="confirmationForm">
      <v-container>
        <v-row>
          <BaseInput
            v-model="confirmNumber"
            required
            label="Confirmation Number"
            id="confirmNumber"
          />
        </v-row>
        <v-btn color="primary" @click="confirm">Confirm</v-btn>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import * as auth from '../services/authservice';

export default {
  name: 'HelloWorld',
  data: () => ({
    valid: false,
    confirmationForm: false,
    confirmNumber: '',
    confirmName: '',
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
    submit() {
      let user = {};
      for (let i in this.formData) {
        user[i] = this.formData[i].model;
      }
      auth.signUp(user);
      auth.eventBus.$on('signUpSuccess', (name) => {
        this.confirmName = name;
        this.confirmationForm = true;
      });
    },
    confirm() {
      auth.confirm(this.confirmName, this.confirmNumber);
    },
  },
};
</script>

<style lang="scss" scoped></style>
