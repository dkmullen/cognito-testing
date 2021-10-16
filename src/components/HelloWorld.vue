<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <BaseInput
            v-for="i in formData"
            :key="formData[i]"
            :id="i.id"
            :label="i.label"
            :model="i.model"
            :required="i.required"
            :maxlength="i.maxlength"
          />
        </v-col>
        <v-col cols="12" md="6"> </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'HelloWorld',

  data: () => ({
    valid: false,
    formData: {
      firstName: {
        label: 'First Name',
        model: '',
        maxlength: 50,
        required: true,
        id: 'firstName',
      },
      lastName: {
        label: 'Last Name',
        model: '',
        maxlength: 50,
        required: true,
        id: 'lastName',
      },
      email: {
        label: 'Email',
        model: '',
        maxlength: 50,
        required: true,
        id: 'email',
        type: 'email',
      },
      phone: {
        label: 'Email',
        model: '',
        required: true,
        id: 'phone',
        type: 'phone',
      },
    },
  }),
};
</script>
