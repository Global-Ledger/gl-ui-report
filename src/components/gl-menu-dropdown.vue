<template>
  <div v-on-clickaway="closeSelect">
    <slot name="label">
      <gl-menu-item
        :disabled="disabled"
        :icon="icon"
        :icon-after="iconAfter"
        :icon-height="iconHeight"
        :icon-width="iconWidth"
        :label="label"
        @click="toggleOpen"
      />
    </slot>
    <div
      v-if="isOpen"
      class="gl-menu-dropdown"
      :class="{'gl-menu-dropdown__padder': padder}"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import GlMenuItem from '@/components/gl-menu-item'

export default {
  components: {
    GlMenuItem,
  },
  mixins: [clickaway],
  props: {
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: null,
    },
    iconHeight: {
      type: Number,
      default: 16,
    },
    iconWidth: {
      type: Number,
      default: 16,
    },
    iconAfter: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    padder: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    closeSelect() {
      this.isOpen = false
    },
    toggleOpen() {
      this.isOpen = !this.isOpen
      this.$emit('toggle', this.isOpen)
    }
  },
}
</script>
