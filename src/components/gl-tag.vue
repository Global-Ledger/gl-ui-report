<template>
  <div
    class="tag"
    :class="[{'tag__selected': isSelected}, {'tag__score--not-removable': score !== undefined && score !== null && !removable}]"
    :style="`border-color: ${findColor(score)}; background-color: ${hex2rgba(findColor(score), 0.25)}`"
    @click="selectTag"
  >
    <div
      v-if="score !== undefined && score !== null"
      class="mr-2 tag__score"
      :style="`background-color: ${findColor(score)}`"
    >
      {{ score }}
    </div>
    <div :class="[{'ml-1': score === undefined || score === null}]">
      {{ tag }}
    </div>
    <gl-icon
      v-if="removable"
      class="tag__close-icon"
      :height="16"
      name="tag-close"
      :width="16"
      @click="remove"
    />
  </div>
</template>

<script>
//Components
import GlIcon from '@/components/gl-icon'

import { riskScoreList } from "@/assets/js/riskScoreList";

export default {
  components: {
    GlIcon,
  },
  props: {
    tag: {
      type: String,
      default: '---',
      require: true,
    },
    score: {
      type: Number,
      default: null,
    },
    value: {
      type: [Number, String, Object],
      default: null
    },
    removable: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
       isSelected: false,
    }
  },
  methods: {
    selectTag() {
      this.isSelected = !this.isSelected
    },
    remove() {
      this.$emit('remove', this.value ? this.value : this.tag)
    },
    hex2rgba(hex, alpha = 1) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    },
    findColor(val) {
      if (val !== 0 && (!val || val < 0)) {
        return riskScoreList[0]
      } else if (val >= 0 && val <= 10) {
        return riskScoreList[1]
      } else if (val > 10 && val <= 20) {
        return riskScoreList[2]
      } else if (val > 20 && val <= 30) {
        return riskScoreList[3]
      } else if (val > 30 && val <= 40) {
        return riskScoreList[4]
      } else if (val > 40 && val <= 50) {
        return riskScoreList[5]
      } else if (val > 50 && val <= 60) {
        return riskScoreList[6]
      } else if (val > 60 && val <= 70) {
        return riskScoreList[7]
      } else if (val > 70 && val <= 80) {
        return riskScoreList[8]
      } else if (val > 80 && val <= 90) {
        return riskScoreList[9]
      } else if (val > 90) {
        return riskScoreList[10]
      } else {
        return riskScoreList[0]
      }
    },
  },
}
</script>

<style scoped>
.tag__close-icon {
  /*margin-right: 2px;*/
  margin-top: 1px;
  float: right;
  cursor: pointer;
  min-width: auto;
}

.tag {
  display: inline-flex;
  white-space: nowrap;
  font-size: 14px;
  border-radius: 20px;
  align-items: center;
  font-weight: 500;
  padding: 1px;
  padding-right: 4px;
  border: 1px solid var(--reflex-bluet);
}

.tag__score {
  color: #fff;
  border-radius: 20px;
  font-size: 12px;
  padding: 2px;
  min-width: 19px;
  text-align: center;
}

.tag__score--not-removable {
  padding-right: 3px;
}

/*.tag__selected {*/
/*  border: 2px solid var(--reflex-bluet);*/
/*}*/
</style>