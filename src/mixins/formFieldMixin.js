export const formFieldMixin = {
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    required: { type: Boolean },
    value: [String, Number],
    disabled: { type: Boolean },
  },
  methods: {
    updateValue(event) {
      this.$emit('input', event);
    },
  },
  data() {
    return {
      requiredRule: [(v) => !!v || 'This field is required.'],
    };
  },
};
