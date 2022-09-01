<template>
  <router-link
      v-if="!children || !children.length"
      v-slot="{ isActive, navigate, href }"
      :exact="link === '/'"
      :to="link"
  >
    <li
        class="sidepanel-menu-item"
        :class="{ 'sidepanel-menu-item--active': isActive
        || href.includes('users')
        && $route.name
        && $route.name.includes('users')}"
    >
      <a
          v-tooltip.top-end="{
          content: isShrunk ? text : '',
          classes: 'sidepanel-menu-item__tooltip',
        }"
          class="sidepanel-menu-item__inner"
          :class="{'sidepanel-menu-item__inner--shrunk': isShrunk}"
          :href="href"
          @click="navigate"
      >
        <div
            v-show="!isShrunk"
            class="sidepanel-menu-item__title"
        >
          {{ text }}
        </div>
      </a>
    </li>
  </router-link>
  <li
      v-else-if="children.length"
      class="sidepanel-menu-item"
      :class="{ 'sidepanel-submenu-item--active': isActive }"
  >
    <div
        v-tooltip.top-end="{
        content: isShrunk ? text : '',
        classes: 'sidepanel-menu-item__tooltip',
      }"
        class="sidepanel-menu-item__inner"
        :class="{ 'sidepanel-menu-item__inner--shrunk': isShrunk }"
        @click="toggleSubmenu"
    >
      <transition name="g-slide-down">
        <div
            v-show="!isShrunk"
            class="sidepanel-menu-item__title"
        >
          {{ text }}
        </div>
      </transition>
    </div>
    <!--    <transition name="g-slide-down">-->
    <!--      <SidepanelSubmenu-->
    <!--          v-show="!isShrunk && isSubmenuOpen"-->
    <!--          :items="children"-->
    <!--          class="sidepanel-menu-item__submenu"-->
    <!--      />-->
    <!--    </transition>-->
  </li>
</template>

<script>

export default {
  name: 'SidepaneMenulItem',

  // components: {
  //   SidepanelSubmenu: () => import('./SidepanelSubmenu'),
  // },

  props: {
    text: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      default: null,
    },

    children: {
      type: Array,
      default: null,
    },

    isShrunk: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    isSubmenuOpen: false,
  }),

  computed: {
    activePage() {
      return this.$route.path;
    },

    isActive() {
      return this.activePage === this.link || (this.hasActiveChildren && this.isShrunk);
    },

    hasActiveChildren() {
      return this.children && this.children.some(item => item.link === this.activePage);
    },
  },

  created() {
    if (this.hasActiveChildren) {
      this.isSubmenuOpen = true;
    }
  },

  methods: {
    toggleSubmenu() {
      this.isSubmenuOpen = !this.isSubmenuOpen;

      if (!this.isSubmenuOpen) {
        this.$emit('open-children');
      }

      if (this.isShrunk) {
        this.$emit('unshrunk-menu');
        this.isSubmenuOpen = true;
      }
    },
  },
};
</script>