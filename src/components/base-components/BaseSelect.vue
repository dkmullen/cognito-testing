<template>
  <v-container>
    <label :for="id">{{ label }}</label>
    <v-select
      :rules="required ? requiredRule : ''"
      :items="items"
      @input="updateValue"
      :class="required ? 'required' : ''"
      v-bind="$attrs"
      v-on="$listeners"
      :value="value"
      :tooltip="tooltip"
      attach
      filled
    >
      <template v-slot:append-outer v-if="tooltip">
        <BaseTooltip :content="tooltip" />
      </template>
    </v-select>
  </v-container>
</template>

<script>
import { formFieldMixin } from '../../mixins/formFieldMixin';

export default {
  name: 'BaseSelect',
  mixins: [formFieldMixin],
  props: {
    items: {
      type: Array,
      required: true,
    },
    tooltip: { type: String, default: '' },
    id: { type: String, default: '' },
  },
};
</script>

<style></style>
