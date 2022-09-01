<template>
  <li class="mb">
    <gl-menu-item
      :class="{ bold: isFolder }"
      :disabled="disabled"
      :icon="item.icon"
      :icon-after="isFolder ? 'right' : ''"
      :icon-height="item.iconHeight || 24"
      :icon-width="item.iconWidth || 24"
      :label="item.label"
      @click="toggle(item)"
    >
      <ul
        v-if="isFolder"
        v-show="isOpen"
        :class="{ child: item.children }"
      >
        <tree-item
          v-for="(child, index) in item.children"
          :key="index"
          :disabled="disabled"
          class="item"
          :item="child"
          @edge="handleEdgeBehavior($event)"
        />
      </ul>
    </gl-menu-item>
  </li>
</template>

<script>
import GlMenuItem from '@/components/gl-menu-item';
export default {
  name: "TreeItem",
  components: {GlMenuItem},
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    iconHeight: {
      type: Number,
      default: 16,
    },
    iconWidth: {
      type: Number,
      default: 16,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      isOpen: false,
    };
  },
  computed: {
    isFolder: function () {
      return this.item.children && this.item.children.length;
    },
  },
  methods: {
    toggle(item) {
      if (item.disabled) return
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }

      this.$emit('edge', item.name)
    },

    handleEdgeBehavior(name) {
      this.$emit("edge", name);
    },
  },
};
</script>

<style>
ul, li {
  list-style: none;
}
.item {
  position: relative;
}
.mb:not(:last-child) {
  margin-bottom: 8px;
}
.child {
  border-radius: 3px;
  /*position: absolute;*/
  left: calc(100% + 10px);
  top: 0;
  min-width: max-content;
  padding: 16px;
  box-shadow: 0 5px 8px 0 rgba(204, 212, 242, 0.62);
  background-color: var(--white);
}
</style>