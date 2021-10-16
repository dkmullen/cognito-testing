<template>
  <div>
    <v-menu top offset-y v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          v-on="on"
          class="tt-icon"
          role="button"
          aria-label="More information"
        >
          mdi-information
        </v-icon>
      </template>
      <div class="tt" v-html="content ? content : lorem"></div>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: ['content'],
  data: () => ({
    menu: false,
    lorem: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
        eiusmod tempor <b>incididunt ut labore</b> et dolore magna aliqua. Ut enim ad minim 
        veniam, quis nostrud <a href="http://google.com" target="_blank" rel="noopener">
        exercitation</a> ullamco.`,
  }),
  methods: {},
};
</script>

<style lang="scss" scoped>
.tt {
  background-color: black;
  color: white;
  padding: 1rem;
  max-width: 400px;

  // a {
  //   color: #ffc107 !important;
  //   text-decoration: underline; (moved to root level)
  // }
}
</style>
