<template>
  <div>
    <template v-if="loading">
      <div class="mb-4 mt-3">
        <VueSkeletonLoader
          animation="wave"
          :color="'#bec3d8'"
          :height="20"
          :radius="'2'"
          type="rect"
        />
      </div>
      <div class="flex">
        <VueSkeletonLoader
          animation="wave"
          class="pie-circle-loader mr-4"
          type="circle"
        />
        <div class="flex column test">
          <div
            v-for="(index) in 5"
            :key="index"
            class="flex align-center mb-2 space-between test"
          >
            <VueSkeletonLoader
              animation="wave"
              :color="'#bec3d8'"
              :height="20"
              :radius="'2'"
              type="rect"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="pieData.length > 0">
      <div class="bold mb-4">
        <h4>{{ title }}</h4>
      </div>
      <div class="flex">
        <gl-pie :data-source="pieData" />
        <div class="flex column">
          <div
            v-for="(item, index) in data"
            :key="index"
            class="flex align-center mb-2 space-between"
          >
            <div class="flex align-center">
              <div
                class="graph-marker mr-2"
                :style="{ 'background-color': item.itemStyle.color }"
              />
              <div class="mr-4 capitalize">
                {{ formatLabel(item) }}
              </div>
            </div>
            <div class="bold">
              <div v-if="data.length === 1">
                {{ formatShare(1) }}
              </div>
              <div
                v-else
              >
                {{ formatShare(roundShare(item.share)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// Components
import GlPie from '@/components/gl-sof-pie'
import VueSkeletonLoader from 'skeleton-loader-vue';
import _ from "lodash";
import {formatShare, roundShare} from "@/utils/sourcesFormatter";

export default {
  name: 'PieDataList',
  components: {
    GlPie,
    VueSkeletonLoader,
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    },
    title: {
      type: String,
      default: 'All Sources'
    },
    trackByLabel: {
      type: String,
      default: 'owner'
    },
    trackByLabelSupport: {
      type: String,
      default: 'owner'
    },
  },
  data() {
    return {
      pieData: []
    }
  },
  watch: {
    data: {
      handler() {
        this.sortedPieData()
      },
      immediate: true,
    },
  },
  methods: {
    formatShare,
    roundShare,
    sortedPieData() {
      this.pieData = _.cloneDeep(this.data)
      this.pieData = this.pieData
          .sort((a, b) => ((a.funds.score > b.funds.score)) ? 1 : -1)
          .sort((a, b) => ((a.funds.default > b.funds.default)) ? 1 : -1)
    },
    formatLabel(item) {
      return _.get(item, this.trackByLabel) ? _.get(item, this.trackByLabel) : _.get(item, this.trackByLabelSupport) || ''
    },
  }
}
</script>

<style scoped>
.pie-circle-loader {
  border-radius: 50% !important;
  width: 180px !important;
  height: 180px !important;
  margin-left: 30px;
}

.graph-marker {
  min-width: 10px;
  height: 10px;
  border-radius: 5px;
}

.test {
  min-height: 20px;
  width: 60%;
}
</style>
