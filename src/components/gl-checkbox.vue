<template>
  <label
    :class="['gl-checkbox', {'gl-checkbox--checked': value}]"
    @click.prevent="updateValue"
  >
    <input
      v-bind="$attrs"
      :checked="value"
      class="gl-checkbox__input"
      :disabled="disabled"
      type="checkbox"
      v-on="$listeners"
    >
    <span class="gl-checkbox__check" />
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
