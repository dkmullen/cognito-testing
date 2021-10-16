<template>
  <v-checkbox
    :rules="required ? requiredRule : []"
    :label="label"
    @change="updateValue"
    :class="required ? 'required' : ''"
    v-bind="$attrs"
    v-on="listeners"
    :value="value"
    :id="id"
    dense
  >
    <template v-slot:append-outer v-if="tooltip">
      <BaseTooltip :content="tooltip" />
    </template>
  </v-checkbox>
</template>

<script>
import { formFieldMixin } from '../../mixins/formFieldMixin';

export default {
  name: 'BaseCheckbox',
  mixins: [formFieldMixin],
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.updateValue,
      };
    },
  },
  props: {
    tooltip: { type: String, default: '' },
    id: { type: String, default: '' },
  },
};
</script>

<style></style>
