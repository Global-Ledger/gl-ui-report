<template>
  <div
    class="mark"
    :class="{'mark__small': small}"
    :style="`color: ${color}`"
  >
    {{ label }}
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    small: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#fff'
    }
  }
}
</script>

<style scoped>
.mark {
  display: inline-block;
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 3px;
  color: #fff;
  background-color: #acacef;
}

.mark__small {
  padding: 4px 8px;
  font-size: 9px;
}
</style>