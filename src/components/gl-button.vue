<template>
  <button
    class="gl-button gl-button--global"
    :class="[{'gl-button--dark': dark},
             {'gl-button--transparent': transparent},
             {'gl-button--full': full},
             {'gl-button--loading': loading}]"
    :style="style"
    :disabled="disabled"
    @click="loading ? undefined : $emit('click')"
  >
    <div
      v-if="loading"
      class="spinner-wrapper"
    >
      <svg
        class="spinner"
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
    </div>
    {{ title }}
  </button>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      require: true,
      default: '-',
    },
    style: {
      type: String,
      default: '',
    },
    dark: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
  }
}
</script>

<style>
.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -7px 0 0 -7px;
  width: 12px;
  height: 12px;
}

.spinner-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
}

.spinner .path {
  stroke: #868686;
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

</style>