<template>
  <header class="header">
<!--    <div class="header__logo relative">-->
<!--      <gl-mark-->
<!--        v-if="!mode && userData && userData.role === 'admin'"-->
<!--        class="admin-mark"-->
<!--        color="#091540"-->
<!--        :label="'ADMIN'"-->
<!--        small-->
<!--      />-->
<!--      <gl-old-logo v-if="mode" />-->
<!--      <gl-logo v-else />-->
<!--    </div>-->
<!--    <gl-search-box-->
<!--      v-if="actionsAvailable && visualToolPages"-->
<!--      v-model="search"-->
<!--      dark-->
<!--      placeholder="Add wallet address or transaction hash here..."-->
<!--      @clear="clearValue"-->
<!--      @search="searching"-->
<!--    />-->
<!--    <nav-->
<!--      class="header__nav"-->
<!--    >-->
<!--      <template v-if="actionsAvailable && adminPages">-->
<!--        <router-link-->
<!--          class="header__nav-link"-->
<!--          to="/users"-->
<!--        >-->
<!--          <gl-icon-->
<!--            name="users"-->
<!--          />-->
<!--          Users-->
<!--        </router-link>-->
<!--        <router-link-->
<!--          :active-class="$route.name === 'labeling' ? 'active' : ''"-->
<!--          class="header__nav-link"-->
<!--          :to="{ path: 'labeling', query: { tab: 'labeling' }}"-->
<!--        >-->
<!--          <gl-icon-->
<!--            :height="24"-->
<!--            name="tagging"-->
<!--            :width="24"-->
<!--          />-->
<!--          Labeling-->
<!--        </router-link>-->
<!--        <router-link-->
<!--          :active-class="$route.name === 'statistics' ? 'active' : ''"-->
<!--          class="header__nav-link"-->
<!--          :to="{ path: 'statistics', query: { tab: 'clusters' }}"-->
<!--        >-->
<!--          <gl-icon-->
<!--            :height="24"-->
<!--            name="statistic"-->
<!--            :width="24"-->
<!--          />-->
<!--          Statistics-->
<!--        </router-link>-->
<!--        <router-link-->
<!--          class="header__nav-link"-->
<!--          :to="{ path: 'scoring'}"-->
<!--        >-->
<!--          <gl-icon-->
<!--            :height="24"-->
<!--            name="scoring"-->
<!--            :width="24"-->
<!--          />-->
<!--          Scoring-->
<!--        </router-link>-->
<!--      </template>-->
<!--    </nav>-->
<!--    <div class="flex">-->
<!--      <template v-if="userData && userData.role === 'admin'">-->
<!--        <div-->
<!--          v-if="$route.name === 'analytics'"-->
<!--          class="gl-user-dropdown__profile max-content pointer fs-14"-->
<!--          @click="$router.push('/users')"-->
<!--        >-->
<!--          <gl-icon-->
<!--            class="gl-user-dropdown__profile-icon"-->
<!--            :height="24"-->
<!--            name="admin-light"-->
<!--            :width="24"-->
<!--          />-->
<!--          <span>Admin Panel</span>-->
<!--        </div>-->
<!--        <div-->
<!--          v-else-->
<!--          class="gl-user-dropdown__profile max-content pointer fs-14"-->
<!--          @click="$router.push('/analytics')"-->
<!--        >-->
<!--          <gl-icon-->
<!--            class="gl-user-dropdown__profile-icon"-->
<!--            :height="24"-->
<!--            name="vision-light"-->
<!--            :width="24"-->
<!--          />-->
<!--          <span>Visual Tool</span>-->
<!--        </div>-->
<!--      </template>-->
<!--      <gl-user-dropdown-->
<!--        v-if="actionsAvailable"-->
<!--        class="profile fs-14"-->
<!--      />-->
<!--    </div>-->
  </header>
</template>

<script>
// Components
import GlLogo from '@/assets/svg/header/gl-logo.svg?inline'
import GlOldLogo from '@/assets/svg/header/gl-old-logo.svg?inline'
import GlSearchBox from '@/components/gl-search-box'
import GlIcon from '@/components/gl-icon'
import GlUserDropdown from './gl-user-dropdown'
import GlMark from '@/components/gl-mark'
// Libs
import { validate } from 'vee-validate'
// Vuex
import { mapMutations, mapState } from 'vuex'

export default {
  components: {
    GlLogo,
    GlOldLogo,
    GlMark,
    GlIcon,
    GlSearchBox,
    GlUserDropdown,
  },
  data() {
    return {
      search: '',
    }
  },
  computed: {
    ...mapState('user', ['userData']),
    ...mapState('analytics', ['searchValue']),
    actionsAvailable() {
      return !['main','login', 'register', '404'].includes(this.$route.name)
    },
    adminPages() {
      return ['users','labeling', 'scoring', 'statistics'].includes(this.$route.name)
    },
    visualToolPages() {
      return ['analytics'].includes(this.$route.name)
    },
    mode() {
      return process.env.VUE_APP_TEST_MODE
    },
  },
  watch: {
    $route: {
      async handler(val, from) {
        if ((!val || !val.name || val.name === 'analytics') && (!from || !from.name || from.name === 'analytics')) {
          if (val.query.tx) {
            this.search = val.query.tx;
            const hashValidationResult = await validate(this.search, 'txHash', {name: 'Search value'})
            if (this.search && hashValidationResult.valid) {
              this.SET_VALIDATE_HASH(true)
              this.SET_VALIDATE_ADDRESS(false)
            }
          }

          if (val.query.address) {
            this.search = val.query.address;
            const addressValidationResult = await validate(this.search, 'address:btc', { name: 'Search value' })
            if (this.search && addressValidationResult.valid) {
              this.SET_VALIDATE_HASH(false)
              this.SET_VALIDATE_ADDRESS(true)
            }
          }
        }

        if (!val.query.address && !val.query.tx && !this.searchValue) {
          this.search = ''
          this.SET_VALIDATE_HASH(false)
          this.SET_VALIDATE_ADDRESS(false)
        }
      },
      immediate: true,
    },
    // '$store.state.analytics.searchValue': 'setSearchValue',
  },
  methods: {
    ...mapMutations({
      SET_VALIDATE_HASH: 'analytics/SET_VALIDATE_HASH',
      SET_VALIDATE_ADDRESS: 'analytics/SET_VALIDATE_ADDRESS',
      SET_SEARCH_VALUE: 'analytics/SET_SEARCH_VALUE',
      SET_STEPPED_STATE: 'analytics/SET_STEPPED_STATE',
      SET_SEARCH_TYPE: 'analytics/SET_SEARCH_TYPE',
    }),
    clearValue() {
      this.SET_VALIDATE_HASH(false)
      this.SET_VALIDATE_ADDRESS(false)
      this.$router.replace('analytics')
    },
    setSearchValue(val) {
      this.search = val
    },
    async searching(value) {
      if (value) {
        this.SET_SEARCH_VALUE(value)
      }

      if (value) {
        this.$root.$emit('search');
        this.SET_STEPPED_STATE({ undo: false, redo: false })
        const hashValidationResult = await validate(value, 'txHash', { name: 'Search value' })
        if (hashValidationResult.valid) {
          this.SET_VALIDATE_HASH(true)
          this.SET_VALIDATE_ADDRESS(false)
          this.SET_SEARCH_TYPE('tx')
          //TODO remove this
          await this.$router.push({ name: 'analytics', query: { tx: value, 'search-id': (Math.random() * 1000).toFixed(0).toString() } })
          return
        }
        const addressValidationResult = await validate(value, 'address:btc', { name: 'Search value' })
        if (addressValidationResult.valid) {
          this.SET_VALIDATE_HASH(false)
          this.SET_VALIDATE_ADDRESS(true)
          this.SET_SEARCH_TYPE('address')
          await this.$router.replace({ name: 'analytics', query: { address: value, 'search-id': (Math.random() * 1000).toFixed(0).toString() } })
          return
        }
        this.$toasted.global.error({ message: 'Search value is not valid'})

        this.SET_VALIDATE_HASH(false)
        this.SET_VALIDATE_ADDRESS(false)
      }
    },
  },
}
</script>

<style>
.admin-mark  {
  position: absolute;
  left: 95px;
}
</style>
