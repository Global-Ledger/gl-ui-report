<template>
  <div>
    <button
      :class="['gl-menu-item',{'fullwidth': fullwidth}, { 'gl-menu-item__not-outline': notOutline }]"
      :disabled="disabled"
      v-on="$listeners"
    >
      <span
        v-if="badge"
        class="gl-menu-item__badge"
      >
        {{ badge }}
      </span>
      <slot name="icon">
        <gl-icon
          v-if="icon"
          :class="{'gl-menu-item__icon': label}"
          :disabled="disabled"
          :height="iconHeight"
          :light="light"
          :name="icon"
          :width="iconWidth"
        />
      </slot>
      <span
        class="gl-menu-item__label"
        :class="[{'gl-menu-item__label--light': light}, {'gl-menu-item__label--warn': warn}, {'gl-menu-item__label--link': isLink}]"
      >
        {{ label }}
      </span>
      <slot name="icon-after">
        <gl-icon
          v-if="iconAfter"
          :class="{'gl-menu-item__icon-after': label}"
          :disabled="disabled"
          :height="iconHeight"
          :name="iconAfter"
          :width="iconWidth"
        />
      </slot>
    </button>
    <slot />
  </div>
</template>

<script>
// Components
import GlIcon from '@/components/gl-icon'

export default {
  components: {
    GlIcon,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    notOutline: {
      type: Boolean,
      default: false,
    },
    warn: {
      type: Boolean,
      default: false,
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: [Number, String],
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    iconHeight: {
      type: Number,
      default: 16,
    },
    light: {
      type: Boolean,
      default: false,
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
    fullwidth: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
