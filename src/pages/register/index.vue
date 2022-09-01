<template>
  <div class="login">
    <div class="login__form">
      <div>
<!--        <DarkLogo-->
<!--          v-if="!mode"-->
<!--          class="login__form-logo"-->
<!--        />-->
        <h2 class="login__title">
          {{ resetToken ? 'Create New Password' : 'Sign Up' }}
        </h2>
        <div class="mt-3 mb-3 fs-14">
          Hello, <strong>{{ email }}!</strong><br>
          Create a strong password for your account:
        </div>
        <div class="mb-3">
          <validateBlock
            msg="At least 14 characters"
            :turn-on="Boolean(password)"
            :valid="password.length >= 14"
          />
          <validateBlock
            msg="Uppercase and lowercase letters"
            :turn-on="Boolean(password)"
            :valid="nameHere(password)"
          />
          <validateBlock
            msg="At least 1 digit"
            :turn-on="Boolean(password)"
            :valid="hasNumber(password)"
          />
          <validateBlock
            msg="At least 1 special character"
            :turn-on="Boolean(password)"
            :valid="checkSpecSymbol(password)"
          />
        </div>
        <gl-form
          full-submit
          ok-only
          :side-valid="!checkSpecSymbol(password)
            || !hasNumber(password)
            || !nameHere(password)
            || password.length < 14
            || password !== samePassword"
          :submit-title="resetToken ? 'save & sign in' : 'save & continue'"
          @submit="handleSubmit"
        >
          <gl-input
            v-model="password"
            autocomplete="current-password"
            class="login__input"
            :height="40"
            hide-control
            :label="resetToken ? 'create password' : 'password'"
            name="password"
            rules="required"
            type="password"
            vid="password"
          />
          <gl-input
            v-model="samePassword"
            autocomplete="current-password"
            class="login__input"
            :height="40"
            hide-control
            :label="'repeat password'"
            name="password_confirmation"
            rules="required|confirmed:password"
            type="password"
          />
        </gl-form>
      </div>
      <div class="login__link-block">
        Already have an account?
        <router-link to="/login">
          Login
        </router-link>
      </div>
    </div>
    <div class="login__wallpaper">
      <img
        alt="login"
        src="../../../public/assets/img/login.png"
      >
    </div>
  </div>
</template>

<script>
// Vuex
import {mapActions, mapMutations} from 'vuex'
// Components
import GlForm from '@/components/gl-form'
import DarkLogo from '@/assets/svg/header/dark-logo.svg?inline'
import GlInput from '@/components/gl-input'
import validateBlock from "@/pages/register/components/validateBlock";

export default {
  components: {
    GlForm,
    GlInput,
    DarkLogo,
    validateBlock,
  },
  data() {
    return {
      email: '',
      password: '',
      samePassword: '',
      invitationCode: '',
      resetToken: '',
    }
  },
  computed: {
    mode() {
      return process.env.VUE_APP_TEST_MODE
    },
  },
  created() {
    this.invitationCode = this.$route.query.code || ''
    this.email = this.$route.query.email || ''
    this.resetToken = this.$route.query.resetToken || ''
  },
  methods: {
    ...mapMutations({
      REMOVE_USER_TOKEN: 'user/REMOVE_USER_TOKEN',
      REMOVE_USER_ID: 'user/REMOVE_USER_ID'
    }),
    ...mapActions('user', ['register','getMe', 'resetPassword']),
    async handleSubmit() {
      await this.clearAuthData()
      if (this.resetToken) {
        await this.resetPassword({ email: this.email, password: this.password, resetToken: this.resetToken })
        await this.getMe()
        await this.$router.push({ name: 'analytics' })
      } else {
        await this.register({ email: this.email, password: this.password, invitationCode: this.invitationCode })
            .then(() => {
              this.getMe()
              this.$router.push({ name: 'analytics' })
            }).catch(({ response: { data } }) => {
              this.$toasted.global.error({message: data.data.message})
            })
      }
    },
    clearAuthData() {
      this.REMOVE_USER_TOKEN()
      this.REMOVE_USER_ID()
    },
    nameHere(str) {
      return Boolean(str.match(/[a-z]/) && str.match(/[A-Z]/));
    },
    hasNumber(myString) {
      return /\d/.test(myString);
    },
    checkSpecSymbol(str) {
      const re = /^(?=.*\d)(?=.*[!@#$%^/:&*])/;
      return re.test(str);
    }
  },
}
</script>
