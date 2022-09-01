<template>
  <label
    :class="['gl-radio', {'gl-radio--checked': isSelected}]"
    @click.prevent="updateValue"
  >
    <input
      v-bind="$attrs"
      :checked="modelValue === value"
      class="gl-radio__input"
      :disabled="disabled"
      type="radio"
      v-on="$listeners"
    >
    <span class="gl-radio__check" />
    <slot>{{ label }}</slot>
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number, Boolean],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: null,
    },
  },
  computed: {
    isSelected() {
      return this.modelValue === this.value
    },
  },
  methods: {
    updateValue() {
      if (!this.disabled) this.$emit('change', this.value)
    },
  },
}
</script>
