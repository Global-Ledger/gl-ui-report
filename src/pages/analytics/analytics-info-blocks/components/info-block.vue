<template>
  <div :class="{ 'stat-item': !full }">
    <div class="key mb-2">
      {{ label }}
    </div>
    <div class="value flex align-center">
      <VueSkeletonLoader
        v-if="loading"
        animation="wave"
        :color="'#bec3d8'"
        :height="20"
        :radius="'2'"
        type="rect"
      />
      <span v-else>
        {{ value || '--' }}
      </span>
      <div v-if="withCopy && value">
        <gl-menu-item
            class="sidebar__history-copy"
            icon="copy"
            :icon-height="24"
            :icon-width="24"
            @click="copy(value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
// Components
import VueSkeletonLoader from 'skeleton-loader-vue';
import GlMenuItem from '@/components/gl-menu-item'


export default {
  name: 'InfoBlock',
  components: {
    VueSkeletonLoader,
    GlMenuItem
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    withCopy: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    }
  },
  methods: {
    async copy(value) {
      await navigator.clipboard.writeText(value).then(() => {
        this.$toasted.global.success({ message: 'Copied!' })
      })
    },
  },
}
</script>

<style>
.key {
  font-size: 12px;
  font-weight: 500;
  color: var(--dark-grey-6-e);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.value {
  font-weight: 500;
  color: #091540;
}
</style>