<template>
  <div class="gl-tabs">
    <div
      v-for="item in items"
      :key="item.value"
      :class="['gl-tabs__item', { 'gl-tabs__item--active': item.value === value }]"
      @click="$emit('input', item.value)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
}
</script>
