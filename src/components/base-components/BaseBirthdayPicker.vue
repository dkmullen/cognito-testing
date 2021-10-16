<template>
  <v-container>
    <label :for="id">Date of birth</label>
    <v-menu
      ref="menu"
      :content-class="customClass"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          prepend-inner-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
          :disabled="recordFound"
          filled
          :id="id"
        ></v-text-field>
      </template>
      <v-date-picker
        ref="picker"
        v-model="date"
        min="1921-01-01"
        max="2021-12-31"
        @change="save"
      ></v-date-picker>
    </v-menu>
  </v-container>
</template>

<script>
import { formFieldMixin } from '../../mixins/formFieldMixin';

export default {
  name: 'BaseBirthdayPicker',
  // pass in custom class value from parent if needed for extra adjustments/style
  props: ['recordFound', 'customClass', 'id'],
  mixins: [formFieldMixin],
  data: () => ({
    date: null,
    menu: false,
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
      this.$emit('dateChange', date);
    },
  },
};
</script>

<style scoped>
.top300 {
  top: 300px !important;
}
</style>
