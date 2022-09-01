<template>
  <div class="relative">
    <svg
      class="spinner-loader"
      viewBox="0 0 50 50"
    >
      <circle
        class="path"
        cx="25"
        cy="25"
        fill="none"
        r="20"
        stroke-width="5"
      />
    </svg>
<!--    <div-->
<!--      v-if="percent"-->
<!--      class="percent-value"-->
<!--    >-->
<!--      {{ percent }}%-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
}
</script>

<style>
.spinner-loader {
  animation: rotate 2s linear infinite;
  z-index: 2;
  width: 36px;
  height: 36px;
}

.spinner-loader .path {
  stroke: hsl(210, 70%, 75%);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.percent-value {
  position: absolute;
  top: 12px;
  font-size: 9px;
  left: 50%;
  transform: translateX(-50%);
}

</style>