<template>
  <div>
    <v-container v-if="type !== 'tel'">
      <label :for="id">{{ label }}</label>
      <v-text-field
        :id="id"
        :rules="required ? requiredRule.concat(typeRule) : typeRule"
        :tooltip="tooltip"
        :type="showPW ? 'text' : type"
        @input="updateValue"
        :class="required ? 'required' : ''"
        clearable
        :disabled="disabled"
        v-bind="$attrs"
        v-on="listeners"
        :value="value"
        :counter="counter"
        :maxlength="maxlen"
        filled
      >
        <v-icon
          v-if="type === 'password'"
          slot="append"
          @click="togglePW"
          aria-label="toggle-password"
        >
          {{ pwIcon }}
        </v-icon>
        <template v-slot:append-outer v-if="tooltip">
          <BaseTooltip :content="tooltip" />
        </template>
      </v-text-field>
    </v-container>
    <v-container v-if="type === 'tel'">
      <label :for="id">{{ label }}</label>
      <v-text-field
        :id="id"
        :rules="required ? requiredRule.concat(typeRule) : typeRule"
        :tooltip="tooltip"
        type="tel"
        @input="updateValue"
        :class="required ? 'required' : ''"
        clearable
        :disabled="disabled"
        v-bind="$attrs"
        v-on="listeners"
        :value="value"
        v-mask="'+1 (XXX) XXX-XXXX'"
        placeholder="xxx-xxx-xxxx"
        maxlength="17"
        filled
      >
        <v-icon v-if="type === 'password'" slot="append" @click="togglePW">
          {{ pwIcon }}
        </v-icon>
        <template v-slot:append-outer v-if="tooltip">
          <BaseTooltip :content="tooltip" />
        </template>
      </v-text-field>
    </v-container>
  </div>
</template>

<script>
import { formFieldMixin } from '../../mixins/formFieldMixin';
import { mask } from 'vue-the-mask';

export default {
  name: 'BaseInput',
  mixins: [formFieldMixin],
  directives: { mask },

  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.updateValue,
      };
    },
  },
  props: {
    type: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    maxlen: { type: Number },
    counter: { type: Boolean, default: true },
    id: { type: String, default: '' },
  },
  data() {
    return {
      phoneHint: '(xxx) xxx-xxxx',
      phoneRule: [
        (v) =>
          !v ||
          /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(v) ||
          `Enter a ten-digit phone number - ${this.phoneHint}`,

        // Ten digits plus characters inserted by the mask
        (v) =>
          !v ||
          v.length === 17 ||
          `Enter a ten-digit phone number - ${this.phoneHint}`,
      ],
      emailRules: [
        (v) =>
          !v ||
          // eslint-disable-next-line
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
            v
          ) ||
          'Email must be valid',
      ],
      stateRules: [
        (v) =>
          (v && v.length === 2) || 'Enter the two character state code (TN).',
      ],
      zipRules: [
        (v) => /^\d+$/.test(v) || 'Please enter your five-digit zip code.',
        (v) =>
          (v && v.length === 5) || 'Please enter your five-digit zip code.',
      ],
      numbersOnlyRule: [
        (v) => /^\d+$/.test(v) || 'This field accepts numbers only.',
      ],
      typeRule: [],
      pwIcon: 'mdi-eye',
      showPW: false,
    };
  },
  methods: {
    togglePW() {
      this.showPW = !this.showPW;
      this.pwIcon = this.showPW ? 'mdi-eye-off' : 'mdi-eye';
    },
  },
  created() {
    switch (this.type) {
      case 'tel':
        return (this.typeRule = this.phoneRule);
      case 'email':
        return (this.typeRule = this.emailRules);
      case 'state':
        return (this.typeRule = this.stateRules);
      case 'zip':
        return (this.typeRule = this.zipRules);
      case 'num':
        return (this.typeRule = this.numbersOnlyRule);
    }
  },
};
</script>

<style lang="scss" scoped></style>
