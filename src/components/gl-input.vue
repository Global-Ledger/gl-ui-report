<template>
  <ValidationProvider
    ref="input"
    v-slot="{ errors, required, ariaInput, ariaMsg, reset }"
    class="gl-input__wrapper"
    :class="{'gl-input__wrapper--full': fullWidth}"
    :name="name || label"
    :rules="rules"
    tag="div"
    :vid="vid"
  >
    <div
      v-if="label || maxLength"
      class="flex space-between mb-1"
    >
      <label
        class="gl-input__label"
        :class="{ 'gl-input__label--invalid': errors[0] }"
        :for="name"
      >
        {{ label || name }}
      </label>
      <div
        v-if="rules.includes('max') && maxLength"
        class="gl-input__label gl-modal__title--capitalize"
      >
        {{ value.length }} / {{ maxLength }} Symbols
      </div>
    </div>
    <input
      :id="name"
      class="gl-input__input"
      :class="[{ 'gl-input__input--invalid': errors[0] }, {'gl-input__input--light': isLight}]"
      :disabled="disabled"
      :min="min"
      :placeholder="placeholder"
      :style="`height: ${height}${units}; margin-bottom: ${extraMarginBottom}`"
      :type="type"
      :value.prop="value"
      @blur="$emit('blur')"
      @change="$emit('change', $event.target.value)"
      @focus="$emit('focus')"
      @input="handleInput"
      @keydown.enter.prevent="$emit('enter', $event.target.value)"
    >
    <transition name="fade">
      <gl-icon
        v-if="value && clearable"
        class="gl-search-box__clear-icon"
        :class="[{ 'gl-search-box__clear-icon--labeled': label || name }]"
        :height="24"
        name="clear-large-dark"
        :width="24"
        @click="clearValue"
      />
    </transition>
    <div
      class="gl-input__input--password-icon"
      @click="toggleVisible"
    >
      <gl-icon
        v-if="hideControl"
        :height="24"
        :name="hide ? 'hide' : 'unhide'"
        :width="24"
      />
    </div>
    <span
      v-if="errors[0]"
      v-bind="ariaMsg"
      class="gl-input__error"
      :class="{'gl-input__error--block': isBlockErrorStyle}"
    >{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import GlIcon from '@/components/gl-icon'

export default {
  name: 'GlInput',
  components: {
    ValidationProvider,
    GlIcon,
  },
  inheritAttrs: false,
  props: {
    vid: {
      type: String,
      default: undefined,
    },
    maxLength: {
      type: String,
      default: '',
    },
    isBlockErrorStyle: {
      type: Boolean,
      default: false,
    },
    isLight: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    units: {
      type: String,
      default: 'px',
    },
    extraMarginBottom: {
      type: String,
      default: '0',
    },
    min: {
      type: String,
      default: '0',
    },
    height: {
      type: Number,
      default: 30,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number],
      default: null,
    },
    hideControl: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      innerValue: this.value,
      hide: false,
    }
  },
  // watch: {
  //   innerValue(value) {
  //     this.$emit('input', value)
  //   },
  //   value(val) {
  //     if (val !== this.innerValue) {
  //       this.innerValue = val
  //     }
  //   },
  // },
  methods: {
    toggleVisible() {
      this.hide = !this.hide
      !this.hide ? this.type = 'password' : this.type = 'text'
      this.$emit('toggle')
    },
    handleInput(event) {
      this.$emit('input', event.target.value);
    },
    clearValue() {
      this.value = ''
      this.$emit('clear')
    },
    resetError() {
      this.$refs.input.reset()
    }
  },
}
</script>

<style>
.gl-input__wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
