<template>
  <div class="flex align-center">
    <gl-icon
      class="mr-2"
      :height="24"
      name="attention"
      :width="24"
    />
    <div class="fs-14">
      {{ label }}
    </div>
  </div>
</template>

<script>
import GlIcon from '@/components/gl-icon'

export default {
  name: 'StatusBlock',
  components: {
    GlIcon
  },
  props: {
    label: {
      type: String,
      default: '',
      require: true
    },
  },
}
</script>