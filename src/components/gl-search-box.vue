<template>
  <div :class="['gl-search-box', { 'gl-search-box__tagging' : tagging }, {'gl-search-box__full': full}]">
    <div class="gl-search-box__input-wrapper">
      <input
        v-model="innerValue"
        :class="['gl-input__input', 'gl-search-box__input', {'gl-input__input--dark': dark}, {'gl-input__input--grey': grey}]"
        :disabled="disabledField"
        :placeholder="placeholder"
        :style="[{ height: tagging ? '40px' : '30px' }, { minWidth: minWidth }]"
        type="text"
        @keyup.enter="searchValue"
      >
      <transition name="fade">
        <gl-icon
          v-if="hasValue"
          class="gl-search-box__clear-icon"
          :height="24"
          :name="darkClear ? 'clear-large-dark' : 'clear-large'"
          :width="24"
          @click="clearValue"
        />
      </transition>
      <div
        v-if="independent"
        class="gl-search-box__independent-button"
        :class="{'gl-search-box__independent-button--disables': disabled}"
        @click="searchValue"
      >
        <gl-icon
          v-if="!hasValue"
          :height="24"
          name="find"
          :width="24"
        />
      </div>
    </div>
    <button
      v-if="!independent"
      aria-hidden="true"
      :class="['gl-button', 'gl-button--dark', 'gl-search-box__button', {'gl-search-box__tagging-button': tagging }]"
      :disabled="disabled"
      name="clear"
      type="button"
      @click="searchValue"
    >
      {{ buttonText }}
    </button>
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
    dark: {
      type: Boolean,
      default: false,
    },
    darkClear: {
      type: Boolean,
      default: false,
    },
    grey: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'search',
    },
    minWidth: {
      type: String,
      default: 'auto',
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledField: {
      type: Boolean,
      default: false
    },
    tagging: {
      type: Boolean,
      default: false
    },
    independent: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      innerValue: this.value,
    }
  },
  computed: {
    hasValue() {
      return Boolean(this.innerValue)
    },
  },
  watch: {
    innerValue(value) {
      this.$emit('input', value)
    },
    value(val) {
      if (val !== this.innerValue) {
        this.innerValue = val
      }
    },
  },
  methods: {
    clearValue() {
      this.innerValue = ''
      this.$emit('clear')
    },
    searchValue() {
      this.innerValue = this.innerValue.trim()
      this.$emit('search', this.innerValue)
    },
  },
}
</script>
