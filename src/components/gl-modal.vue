<template>
  <div
    v-if="value"
    ref="modal"
    class="gl-modal"
    @click="closeOnClickaway($event)"
  >
    <div
      class="gl-modal__container"
      :class="[{'gl-modal__container--overflow': overflowing}]"
      :style="`width: ${width}px`"
    >
      <div
        v-if="loading"
        class="flex align-center justify-center modal-loader"
      >
        <gl-loader />
      </div>
      <div :class="[{'gl-modal__container--loading': loading}]">
        <h2
          class="gl-modal__title"
          :class="{ 'gl-modal__title--capitalize': capitalizeTitle }"
        >
          {{ title }}
        </h2>
        <gl-form
          v-if="!infoOnly"
          v-bind="$attrs"
          :cancel-title="cancelTitle"
          :full-buttons="fullButtons"
          :full-submit="fullSubmit"
          :loading="loading"
          :ok-only="okOnly"
          :side-valid="sideValid"
          @cancel="close"
          @submit="$emit('submit')"
        >
          <slot />
        </gl-form>
      </div>
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import GlForm from '@/components/gl-form'
import GlLoader from '@/components/gl-loader'

export default {
  components: {
    GlForm,
    GlLoader,
  },
  inheritAttrs: false,
  props: {
    closable: {
      type: Boolean,
      default: false,
    },
    okOnly: {
      type: Boolean,
      default: false,
    },
    sideValid: {
      type: Boolean,
      default: false
    },
    cancelTitle: {
      type: String,
      default: 'Cancel',
    },
    overflowing: {
      type: Boolean,
      default: false
    },
    capitalizeTitle: {
      type: Boolean,
      default: false,
    },
    fullSubmit: {
      type: Boolean,
      default: false,
    },
    fullButtons: {
      type: Boolean,
      default: false,
    },
    infoOnly: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '500'
    },
    value: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      // this.$emit('input', false)
      this.$emit('close')
    },
    closeOnClickaway(e) {
      if (this.closable && e.target === this.$refs.modal) this.close()
    },
  },
}
</script>
