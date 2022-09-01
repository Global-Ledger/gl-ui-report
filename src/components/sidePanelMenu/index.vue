<template>
  <div
    class="side-bar"
    :class="{ 'side-bar__shrunk': isShrunk }"
  >
    <div class="side-bar__header">
      <template v-show="!isShrunk">
        <DarkLogo />
      </template>
      <gl-icon
        :class="{'sidebar-open-icon__shrunk': isShrunk}"
        height="24"
        name="sidebar-open"
        width="24"
        @click="setShrunk(!isShrunk)"
      />
    </div>
    <div class="flex column space-between side-bar__main--wrap">
      <div class="side-bar__main">
        <router-link
          v-tooltip.right="{ content: 'Risk Report', visible: isShrunk }"
          active-class="side-bar__nav-link--active"
          class="side-bar__nav-link"
          :class="{'side-bar__nav-link--shrunk': isShrunk}"
          to="/report"
        >
          <gl-icon
            height="24"
            name="risk-report"
            width="24"
          />
          <span
            v-show="!isShrunk"
            class="side-bar__nav-link--title"
          >
            Risk Report
          </span>
        </router-link>
      </div>
      <div class="side-bar__footer">
        <div class="flex space-between align-center">
          <gl-icon
            class="mr-4 ml-3 pointer"
            :height="24"
            name="logout"
            :width="24"
            @click="logoutUser"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import DarkLogo from '@/assets/svg/header/GLNewLogo.svg?inline'
import GlIcon from '@/components/gl-icon'
// Vuex
import {mapActions, mapState, mapMutations} from "vuex";
// Utils
import { alarmActiveTo } from "@/utils/profile";

export default {
  name: 'SidepanelMenu',

  components: {
    GlIcon,
    DarkLogo
  },

  data() {
    return {
      isAdminSubMenuOpen: false,
    }
  },
  computed: {
    ...mapState('sidebar', ['isShrunk']),
    ...mapState('user', ['userData']),
    adminPages() {
      return ['users','labeling', 'scoring', 'statistics'].includes(this.$route.name)
    },
  },
  watch: {
    $route: {
      async handler(val) {
        this.isAdminSubMenuOpen = !!(val && this.adminPages);
      },
      immediate: true,
    },
    '$store.state.analytics.searchValue': 'setSearchValue',
  },
  methods: {
    alarmActiveTo,
    ...mapActions('user', ['logout']),
    ...mapMutations({
      setShrunk: 'sidebar/SET_SHRUNK'
    }),
    setSearchValue(val) {
      this.search = val
    },
    openSubMenu() {
      if (this.isShrunk) {
        this.setShrunk(false)
        this.isAdminSubMenuOpen = true
        return
      }

      this.isAdminSubMenuOpen = !this.isAdminSubMenuOpen
    },
    contactSupport() {
      window.location.href = 'mailto:support@glprotocol.com'
    },
    logoutUser() {
      localStorage.removeItem('caseId')
      this.logout();
      window.location.assign('/');
    },
  }
};
</script>

<style scoped>
.side-bar {
  width: 230px;
  height: 100%;
  padding: 0 0 15px;
  transition: width 0.2s;
  overflow: hidden;
  background: #fff;
  box-shadow: 14px 0 31px -9px rgba(0,0,0,0.46);
}

.side-bar__shrunk {
  width: 50px;
  transition: width 0.2s;
}

.side-bar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e3e3e3;
}

.side-bar__footer {
  border-top: 1px solid #e3e3e3;
}

.side-bar__nav-link {
  align-items: center;
  display: flex;
  padding: 10px 10px 10px 5px;
  color: var(--dark);
  font-weight: 500;
  height: 50px;
  width: 100%;
  line-height: 1.14;
  font-size: 14px;
  position: relative;
  text-decoration: none;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.5s ease-out;
}

.side-bar__nav-link:hover {
  background-color: rgba(90, 120, 234, 0.25);
}

.side-bar__nav-link svg {
  margin: 0 8px;
}

.sub-menu__wrap {
  max-height: 0;
  transition: max-height 0.4s;
  overflow: hidden;
}

.sub-menu__open {
  max-height: 500px;
  transition: max-height 0.4s;
  overflow: hidden;
}

.side-bar__nav-link--active {
  font-weight: 600;
  border-left: 4px solid var(--reflex-bluet);
}

.side-bar__sub-nav-link {
  padding-left: 30px;
}

.side-bar__has-open-sub-item {
  /*background: #e6e6e6;*/
}

.alarm-active-date {
  height: 10px;
  width: 10px;
  border-radius: 10px;
  background: red;
  position: absolute;
  top: 10px;
  left: 32px;
}

.side-bar__main--wrap {
  height: calc(100% - 41px);
  padding-bottom: 15px;
}

.side-bar__nav-link--shrunk {
  padding-left: 0;
}

.side-bar__nav-link--title {
  margin-top: 3px;
}

.sidebar-open-icon__shrunk {
  margin-left: -3px;
}
</style>
