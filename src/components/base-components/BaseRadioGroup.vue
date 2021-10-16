<template>
  <fieldset>
    <v-radio-group
      :row="row ? row : null"
      v-bind="$attrs"
      :label="groupLabel"
      :value="value"
      :rules="required ? requiredRule : []"
      @change="updateValue"
      :tooltip="tooltip"
      :id="id"
    >
      <br />
      <v-radio
        v-for="(button, index) in buttons"
        :key="index"
        :label="button.label"
        :value="button.value"
        :class="button.buttonclass ? button.buttonclass : ''"
        :disabled="button.disabled"
      ></v-radio>
      <template v-slot:append v-if="tooltip">
        <BaseTooltip :content="tooltip" />
      </template>
    </v-radio-group>
  </fieldset>
</template>

<script>
import { formFieldMixin } from '../../mixins/formFieldMixin';

export default {
  name: 'BaseRadioGroup',
  mixins: [formFieldMixin],
  props: {
    buttons: {
      label: { type: String },
      value: { type: String },
      buttonclass: { type: String },
    },
    row: { type: String, default: '' },
    groupLabel: { type: String },
    tooltip: { type: String, default: '' },
    id: { type: String, default: '' },
  },
};
</script>

<style>
.v-input--radio-group legend.v-label {
  width: 100%;
  font-size: unset;
}
</style>
