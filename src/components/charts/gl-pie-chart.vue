<template>
  <div
    class="relative"
    :style="{ height: height + 'px', width: width }"
  >
    <v-chart
      autoresize
      :options="options"
      @click="clickOnSection"
      @mousemove="hover"
      @mouseout="$emit('mouseout')"
    />
    <slot name="tooltip" />
  </div>
</template>

<script>
import VChart from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

export default {
  components: {
    VChart,
  },
  props: {
    dataSource: {
      type: Array,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 400
    },
    activator: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 400
    },
  },
  computed: {
    options() {
      return {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: (data) => data.tooltip,
        //   extraCssText:
        //       'text-align: center;box-shadow: 3px 3px 10px 0 rgba(170, 187, 251, 0.55);text-transform: capitalize;',
        //   backgroundColor: 'var(--white)',
        //   borderColor: 'var(--soft-blue)',
        //   borderWidth: 1,
        //   position: [10, 10],
        //   textStyle: {
        //     color: 'var(--dark)',
        //     fontWeight: 500,
        //     fontFamily: 'Montserrat',
        //   },
        // },
        // legend: {
        //   x: 'center',
        //   y: '80%',
        // },
        series: [
          {
            // color: colorsPalette,
            type: 'pie',
            center: ['50%', '40%'],
            radius: ['25%', '45%'],
            data: this.dataSource,
            label: {
              show: true,
              textBorderType: [5, 10],
              textStyle: {
              fontSize: 14,
              color: '#000',
              fontWeight: 500,
              fontFamily: 'Montserrat',
            }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
        ],
      }
    },
  },
  methods: {
    clickOnSection($event) {
      this.$emit('click', $event)
    },
    hover($event) {
      this.$emit('move', $event)
    },
  },
}
</script>

<style scoped>
.chart-wrapper {
  width: 340px;
  height: 340px;
}

.echarts {
  width: 100%;
  height: 100%;
}
</style>