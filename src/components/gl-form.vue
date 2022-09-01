<template>
  <ValidationObserver
    ref="form"
    v-slot="{ handleSubmit }"
    slim
  >
    <form
      @reset.prevent="onCancel"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <slot />
      <div :class="['gl-form__actions', {'gl-form__actions--centered': okOnly} ]">
        <button
          v-if="!okOnly"
          class="gl-button gl-button--light gl-form__button gl-button--padder"
          :class="{ 'full-submit': fullButtons, 'mr-4': fullButtons }"
          :disabled="loading"
          type="reset"
        >
          {{ cancelTitle }}
        </button>
        <button
          class="gl-button gl-button--dark gl-form__button gl-button--padder"
          :class="{ 'full-submit': fullSubmit || fullButtons }"
          :disabled="sideValid || loading"
          type="submit"
        >
          {{ submitTitle }}
        </button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'GlForm',
  components: {
    ValidationObserver,
  },
  props: {
    cancelTitle: {
      type: String,
      default: 'Cancel',
    },
    submitTitle: {
      type: String,
      default: 'Submit',
    },
    loading: {
      type: Boolean,
      default: false
    },
    okOnly: {
      type: Boolean,
      default: false
    },
    sideValid: {
      type: Boolean,
      default: false
    },
    fullButtons: {
      type: Boolean,
      default: false,
    },
    fullSubmit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setErrors(errors) {
      this.$refs.form.setErrors(errors)
    },
    onSubmit() {
      this.$emit('submit')
    },
    onCancel() {
      this.$emit('cancel')
    },
  },
}
</script>
