<template>
  <div>
    <div class="report-block__header">
      Unknown Sources
    </div>
    <div class="table-wrap table-wrap__unoverflow gl-table-unshadow report-table report-table__unknown">
      <o-table
        :class="{ 'o-table-has-pagination': data.length && data > 1 }"
        :data="data"
        hoverable
        :paginated="data.length > 10"
        per-page="10"
        striped
      >
        <o-table-column
          v-slot="props"
          field="owner"
          label="Address / Cluster ID"
          sortable
          width="320"
        >
          <div
            v-if="getOwnerByType(props.row).isLink"
            class="link"
            @click="openInNewTab(getOwnerByType(props.row).value, 'address')"
          >
            {{ getOwnerByType(props.row).owner }}
          </div>
          <div v-else>
            {{ getOwnerByType(props.row) || '--' }}
          </div>
        </o-table-column>
        <o-table-column
          v-slot="props"
          field="funds.score"
          label="type / tag"
          sortable
          width="320"
        >
          <GlTag
            v-if="props.row.funds && props.row.funds.name"
            :score="props.row.funds.score"
            :tag="capitalizeFirstLetter(props.row.funds.name)"
          />
          <GlTag
            v-else-if="props.row.funds && props.row.funds.type"
            :score="props.row.funds.score"
            :tag="capitalizeFirstLetter(props.row.funds.type)"
          />
          <GlTag
            v-else-if="props.row.typeData"
            :score="props.row.typeData.score"
            :tag="capitalizeFirstLetter(props.row.typeData.name)"
          />
          <div v-else>
            --
          </div>
        </o-table-column>
        <o-table-column
          v-slot="props"
          field="depthSortValue"
          label="Depth"
          sortable
          width="100"
        >
          {{ findMinMaxFields(props.row.depth) }}
        </o-table-column>
        <o-table-column
          v-slot="props"
          field="share"
          label="Share %"
          sortable
          width="100"
        >
          <div v-tooltip.top="`${props.row.share * 100}%`">
            {{ formatShare(roundShare(props.row.share)) }}
          </div>
        </o-table-column>
        <o-table-column
          v-slot="props"
          field="tx_hash"
          label="Tx hash"
          sortable
        >
          <div v-if="checkMultiple(props.row.tx_hash)">
            Multiple
          </div>
          <div
            v-else
            class="link"
            @click="openInNewTab(props.row.tx_hash)"
          >
            {{ props.row.tx_hash || '--' }}
          </div>
        </o-table-column>
        <template #empty>
          <div
            v-if="loading"
            class="flex align-center justify-center"
          >
            <gl-loader />
          </div>
          <div
            v-else
            class="empty-users-data flex column align-center"
          >
            <gl-icon
              :height="24"
              name="statistic"
              :width="24"
            />
            No data here yet
          </div>
        </template>
      </o-table>
    </div>
  </div>
</template>

<script>
// Components
import GlLoader from '@/components/gl-loader'
import GlIcon from '@/components/gl-icon'
import GlTag from '@/components/gl-tag'

// Utils
import { formatBtcAmount } from '@/utils/format-btc-amount'
import { capitalizeFirstLetter, trancateString } from "@/utils/text-formatter";
import { getOwnerByType, checkMultiple } from "@/utils/report-data-formatter";
import { findMinMaxFields } from "@/utils/model";
import { roundShare } from "@/utils/sourcesFormatter";
import {mapState} from "vuex";

export default {
  components: {
    GlLoader,
    GlIcon,
    GlTag
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapState('analytics', ['coinType']),
  },
  methods: {
    formatBtcAmount,
    findMinMaxFields,
    checkMultiple,
    roundShare,
    capitalizeFirstLetter,
    trancateString,
    getOwnerByType,
    formatShare(share) {
      const formatted = (share * 100).toFixed(2)
      return formatted === '0.00' ? '< 0.01%' : formatted + '%'
    },
    openInNewTab(val, type = 'tx') {
      const { href } = this.$router.resolve({ name: 'analytics', query: { [type]: val, type: this.coinType } })
      window.open(href, '_blank')
    },
  },
}
</script>

<style>
.report-table__unknown .o-table .o-table__th:first-child {
  border-left: 4px solid #d3d3d3 !important;
}

.report-table__unknown .o-table .o-table__td:first-child {
  border-left: 4px solid #d3d3d3 !important;
}
</style>
