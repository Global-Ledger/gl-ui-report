<template>
  <div
    id="app"
    :class="{'clear-layout': isClearHeader}"
  >
    <div class="flex">
      <div>
        <Sidebar :class="{'hide-header': isClearHeader}" />
      </div>
      <div class="app-root">
        <gl-header :class="{'hide-header': isClearHeader}" />
        <keep-alive include="Analytics">
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
// Vuex
import { mapState } from 'vuex'

import GlHeader from '@/components/layout/gl-header'
import Sidebar from '@/components/sidePanelMenu'
import defineAbilityFor from "@/services/defineAbilityFor";

export default {
  components: {
    GlHeader,
    Sidebar,
  },
  data() {
    return {
      isClearHeader: false,
    }
  },
  watch: {
    coinType: {
      handler(role) {
        this.updateAbilities(role)
      },
      immediate: true,
    },
    $route: {
      handler(route) {
        this.isClearHeader = route.name === 'register' || route.name === 'login'
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState('analytics', ['coinType'])
  },
  async created() {
    await this.updateAbilities(this.coinType)
  },
  methods: {
    updateAbilities() {
      this.$ability.update(defineAbilityFor(this.coinType).rules);
    },
  },
}
</script>
