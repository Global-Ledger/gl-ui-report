<template>
  <div
    v-on-clickaway="closeDropdown"
    class="gl-user-dropdown"
  >
    <div
      :class="['gl-user-dropdown__profile', { 'gl-user-dropdown__profile--focused': isOpen }]"
      @click="isOpen = !isOpen"
    >
      <gl-icon
        class="gl-user-dropdown__profile-icon"
        :height="24"
        name="settings"
        :width="24"
      />
      <span>Settings</span>
    </div>
    <div
      v-if="isOpen"
      class="gl-user-dropdown__list"
    >
      <gl-menu-item
        class="gl-user-dropdown__list-item"
        fullwidth
        icon="support"
        :icon-height="24"
        :icon-width="24"
        label="Contact Support"
        @click="contactSupport"
      />
      <gl-menu-item
        class="gl-user-dropdown__list-item"
        fullwidth
        icon="logout"
        :icon-height="24"
        :icon-width="24"
        label="Log Out"
        @click="logoutUser"
      />
    </div>
  </div>
</template>

<script>
// Libs
import { mixin as clickaway } from 'vue-clickaway'
// Components
import GlIcon from '@/components/gl-icon'
import GlMenuItem from '@/components/gl-menu-item'
// Vuex
import { mapActions } from 'vuex'

export default {
  components: {
    GlIcon,
    GlMenuItem,
  },
  mixins: [clickaway],
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    closeDropdown() {
      this.isOpen = false
    },
    async goToPage(url) {
      await  this.closeDropdown()
      await this.$router.push(url)
    },
    logoutUser() {
      this.closeDropdown()
      this.logout();
      window.location.assign('/');
    },
    contactSupport() {
      window.location.href = 'mailto:support@glprotocol.com'
      this.closeDropdown()
    },
  },
}
</script>
