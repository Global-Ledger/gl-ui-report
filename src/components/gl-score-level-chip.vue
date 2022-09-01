<template>
  <div>
    <div
      v-if="!score"
      class="chip"
      :style="`border: 1px solid ${findColorByTypeScore(level)}; background-color: ${hex2rgba(findColorByTypeScore(level), 0.25)}`"
    >
      {{ riskTitle }}
    </div>
    <div
      v-else
      class="chip"
      :style="`border: 1px solid ${findColorByTypeScore(level)}; background-color: ${findColorByTypeScore(level)}`"
    >
      {{ level }}
    </div>
  </div>
</template>

<script>
import { findColorByTypeScore } from "@/utils/cytoskape-ui-rules"

export default {
  props: {
    level: {
      type: [Number, String],
      default: 0
    },
    score: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      riskTitle: 'Low',
      color: '#fff'
    }
  },
  mounted() {
    this.calcScoreData()
  },
  methods: {
    findColorByTypeScore,
    hex2rgba(hex, alpha = 1) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    },
    calcScoreData() {
      if (this.level >= 0 && this.level <= 10) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.riskTitle = 'Low'
        this.color = "#95d439"
      } else if (this.level > 10 && this.level <= 50) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.riskTitle = 'Medium'
        this.color = "#fa9700"
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.riskTitle = 'Severe'
        this.color = "#ff2600"
      }
    },
  },
}
</script>

<style>
.chip {
  display: inline-block;
  border-radius: 40px;
  padding: 0 16px;
  font-size: 14px;
}
</style>