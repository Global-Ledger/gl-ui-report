<template>
  <div class="gl-progress">
    <div 
      class="gl-progress-value"
      :style="{ width: `${progress}%` }" 
    />
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0
    },
  },
}
</script>