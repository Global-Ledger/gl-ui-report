<template>
  <label
    :class="['gl-activate', {'gl-activate--checked': value}]"
    @click.prevent="updateValue"
  >
    <input
      v-bind="$attrs"
      :checked="!value"
      class="gl-activate__input"
      :disabled="disabled"
      type="checkbox"
      v-on="$listeners"
    >
    <span class="gl-activate__check" />
    <slot>{{ label }}</slot>
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateValue() {
      if (!this.disabled) this.$emit('input', !this.value)
    },
  },
}
</script>