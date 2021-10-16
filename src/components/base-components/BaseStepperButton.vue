<template>
  <v-btn
    v-on="$listeners"
    v-bind="$attrs"
    :class="btnclass"
    :color="color"
    :disabled="disabled"
    :text="text"
  >
    <slot>{{ label ? label : 'Continue' }}</slot>
  </v-btn>
</template>

<script>
export default {
  name: 'BaseContinueButton',
  inheritAttrs: false,
  props: {
    type: { type: String },
    disabled: { type: Boolean },
  },
  data() {
    return {
      color: '',
      btnclass: '',
      label: '',
      text: null,
    };
  },
  created() {
    switch (this.type) {
      case 'continue':
        this.color = 'primary';
        this.btnclass = 'left-btn';
        this.label = 'Continue';
        break;
      case 'back':
        this.color = 'secondary';
        this.btnclass = 'left-btn';
        this.label = 'Back';
        break;
      case 'submit':
        this.color = 'secondary';
        this.btnclass = 'left-btn';
        this.label = 'Submit';
        break;
      case 'exit':
        this.color = '';
        this.btnclass = 'cancel-btn';
        this.label = 'Exit';
        this.text = 'text';
        break;
    }
  },
};
</script>
