<template>
  <div>
    <v-file-input
      chips
      :class="required ? 'required' : ''"
      :label="item.label"
      :loading="loading"
      :success="success"
      :prepend-icon="success ? 'mdi-check-bold' : 'mdi-paperclip'"
      :error="error"
      :error-messages="errorMessage"
      small-chips
      truncate-length="15"
      accept=".pdf"
      :rules="required ? requiredRule : noRule"
      @change="store($event)"
    >
      <template v-slot:prepend>
        <v-icon v-if="success">mdi-email</v-icon>
      </template>
      <template v-slot:append-outer>
        <BaseTooltip :content="item.helptext" />
      </template>
    </v-file-input>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { formFieldMixin } from '../../mixins/formFieldMixin';

export default {
  name: 'FileUploader',
  mixins: [formFieldMixin],
  computed: mapGetters(['attachmentList', 'applicationNumber']),
  props: ['item'],
  data() {
    return {
      loading: false,
      success: false,
      error: false,
      errorMessage: '',
      file: null,
      noRule: [],
    };
  },
  methods: {
    ...mapActions(['submitFile']),
    store(e) {
      this.file = e;
    },
    async upLoad() {
      if (this.file) {
        this.$emit('status', { file: this.item.label, state: 'uploading' });
        let f = new File(
          [this.file],
          `${this.applicationNumber}_${this.file.name}`,
          {
            type: this.file.type,
            lastModified: this.file.lastModified,
          }
        );
        this.loading = true;
        const response = await this.submitFile({
          file: f,
          applicationNumber: this.applicationNumber,
          name: this.item.name,
        }).catch(() => {
          this.loading = false;
          this.error = true;
          this.errorMessage = 'Error uploading this file';
          this.$emit('status', { file: this.item.label, state: 'error' });
        });
        if (response) {
          this.loading = false;
          this.success = true;
          this.done = true;
          this.$emit('status', { file: this.item.label, state: 'done' });
        }
      }
    },
  },
};
</script>
