<template>
  <div
    v-if="value"
    ref="modal"
    class="gl-modal"
    @click="closeOnClickaway($event)"
  >
    <div class="gl-modal__container">
      <h2 class="gl-modal__title">
        {{ title }}
      </h2>
      <gl-form
        @cancel="$emit('cancel')"
        @submit="$emit('confirm')"
      >
        <p>{{ message }}</p>
      </gl-form>
    </div>
  </div>
</template>

<script>
import GlForm from '@/components/gl-form'

export default {
  components: {
    GlForm,
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    message:{
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    closeOnClickaway(e) {
      if (e.target === this.$refs.modal) this.close()
    },
  },
}
</script>
