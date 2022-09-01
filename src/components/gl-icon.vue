<template>
  <svg
    :class="['gl-icon', 
             `gl-icon--${name}`, 
             {'gl-icon--light': light, 
              'gl-icon--disabled': disabled, 
              'gl-icon--warn': warn,
              'gl-icon--dark': dark}]"
    :height="height"
    :width="width"
    v-on="$listeners"
  >
    <use :href="spriteHref" />
  </svg>
</template>

<script>
import iconSet from '@/assets/svg/icon-set.svg'

export default {
  name: 'GlIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    light: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    warn: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      default: 16,
    },
    width: {
      type: [Number, String],
      default: 16,
    },
  },
  computed: {
    spriteHref() {
      return `${ iconSet }#${ this.name }`
    },
    viewBox() {
      return `0 0 ${ this.width } ${ this.height }`
    },
  },
}
</script>
