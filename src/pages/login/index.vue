<template>
  <div class="login">
    <div class="login__form">
      <div>
        <h2 class="login__title">
          Log In
        </h2>
        <gl-form
          ref="form"
          class="mb-2"
          full-submit
          ok-only
          submit-title="Submit & continue"
          @submit="handleSubmit"
        >
          <gl-input
            v-model="email"
            autocomplete="email"
            class="login__input"
            :height="40"
            is-block-error-style
            label="email"
            name="email"
            rules="required|email"
          />
          <gl-input
            v-model="password"
            autocomplete="current-password"
            class="login__input"
            :height="40"
            label="password"
            name="password"
            rules="required"
            type="password"
          />
        </gl-form>
        <div class="flex align-center">
          <div class="fs-14">
            Forgot password?
          </div>
          <gl-menu-item
            class="gl-user-dropdown__list-item"
            fullwidth
            is-link
            label="Click here to restore"
            @click="resetPasswordModal = true"
          />
        </div>
      </div>
      <div class="login__support">
        <gl-menu-item
          class="gl-user-dropdown__list-item"
          fullwidth
          icon="support"
          :icon-height="24"
          :icon-width="24"
          label="Any troubles? Contact support"
          @click="contactSupport"
        />
      </div>
    </div>
    <div class="login__wallpaper">
      <img
        alt="login"
        src="../../../public/assets/img/login.png"
      >
    </div>
    <reset-password-modal
      v-if="resetPasswordModal"
      v-model="resetPasswordModal"
      :email="email"
      @close="resetPasswordModal = false"
      @submit="resetPasswordModal = false"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
// Components
import DarkLogo from '@/assets/svg/header/dark-logo.svg?inline'
import GlForm from '@/components/gl-form'
import GlInput from '@/components/gl-input'
import GlMenuItem from '@/components/gl-menu-item'
import ResetPasswordModal from './modals/resetPasswordModal'

export default {
  components: {
    GlForm,
    GlInput,
    GlMenuItem,
    DarkLogo,
    ResetPasswordModal,
  },
  data() {
    return {
      email: '',
      password: '',
      resetPasswordModal: false,
    }
  },
  computed: {
    mode() {
      return process.env.VUE_APP_TEST_MODE
    },
  },
  methods: {
    ...mapMutations({
      SET_USER_TOKEN: 'user/SET_USER_TOKEN',
      SET_USER_ID: 'user/SET_USER_ID',
      REMOVE_USER_TOKEN: 'user/REMOVE_USER_TOKEN',
      SET_USER_REFRESH_TOKEN: 'user/SET_USER_REFRESH_TOKEN',
      REMOVE_USER_ID: 'user/REMOVE_USER_ID'
    }),
    ...mapActions('user', ['login', 'getMe']),
    async handleSubmit() {
      await this.clearAuthData()
      await this.login({email: this.email, password: this.password}).then(({ data, success }) => {
        if (success) {
          this.SET_USER_TOKEN(data)
          this.SET_USER_REFRESH_TOKEN(data)
          this.SET_USER_ID(data)
          this.getMe()
          this.$router.push({ name: 'report' })
        } else {
          this.$refs.form.setErrors({
            email: data.message
          })
          this.$refs.form.setErrors({
            password: ' '
          })
        }
      }).catch(({ response: { data } }) => {
        this.$refs.form.setErrors({
          email: data.data.message,
        })
        this.$refs.form.setErrors({
          password: ' '
        })
      })
    },
    clearAuthData() {
      this.REMOVE_USER_TOKEN()
      this.REMOVE_USER_ID()
    },
    contactSupport() {
      window.location.href = 'mailto:support@glprotocol.com'
    },
  },
}
</script>
