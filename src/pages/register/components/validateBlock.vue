<template>
  <div class="flex align-center mb-2">
    <gl-icon
      :height="24"
      :name="getIcon"
      :width="24"
    />
    <div
      class="ml-3 fs-14"
      :class="{'warning-text': !valid && turnOn}"
    >
      {{ msg }}
    </div>
  </div>
</template>

<script>
import GlIcon from '@/components/gl-icon'
export default {
  components: {
    GlIcon,
  },
  props: {
    msg: {
      type: String,
      default: '',
    },
    turnOn: {
      type: Boolean,
      default: false,
    },
    valid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getIcon() {
      if (!this.turnOn) {
        return 'def-report';
      }

      return this.valid ? 'succeed-report' : 'warn-report'
    },
  },
}
</script>