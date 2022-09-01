<template>
  <gl-modal
    v-bind="$attrs"
    capitalize-title
    info-only
    title="Restore Password"
    width="400"
    v-on="$listeners"
    @close="$emit('close')"
  >
    <template slot="content">
      <div class="gl-modal__row">
        Add your account email, and we will send you the link with further instructions.
      </div>
      <gl-form
        ref="resetForm"
        class="mb-2"
        submit-title="Restore"
        @cancel="$emit('close')"
        @submit="onSubmit"
      >
        <gl-input
          v-model="formData.email"
          autocomplete="email"
          class="login__input"
          :height="40"
          label="user email"
          name="email"
          rules="required|email"
        />
      </gl-form>
    </template>
  </gl-modal>
</template>

<script>
// Components
import GlModal from '@/components/gl-modal'
import GlInput from '@/components/gl-input'
import GlForm from '@/components/gl-form'
import {mapActions} from "vuex";

export default {
  components: {
    GlModal,
    GlInput,
    GlForm,
  },
  inheritAttrs: false,
  props: {
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      formData: {
        email: '',
      },
    }
  },
  mounted() {
    this.formData = {
      email: this.email
    }
  },
  methods: {
    ...mapActions('users', ['resetPassword']),
    async onSubmit() {
      if (this.formData.email) {
        this.resetPassword(this.formData.email)
          .then(({ success }) => {
            if (success) {
              this.$toasted.global.success({ message: `We’ve sent you password restoration link to ${this.formData.email}` })
              this.$emit('submit')
            }
          })
          .catch(({response: { data }}) => {
            this.$refs.resetForm.setErrors({
              email: data.data.message
            })
          })
      }
    },
  },
}
</script>
