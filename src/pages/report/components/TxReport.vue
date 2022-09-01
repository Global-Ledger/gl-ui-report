<template>
  <div>
    <div
      id="report"
      class="report"
    >
      <div class="flex">
        <div class="flex-1 mr-5">
          <div class="report-block__header">
            Transaction information
          </div>
          <div
            v-if="!txData.tx_hash && !txDataLoading"
            class="mb-4"
          >
            There are not transaction for this hash
          </div>
          <div class="wallet-tx-wrap mb-4">
            <InfoBlock
              class="mb-4 mr-3"
              label="TX HASH"
              :loading="txDataLoading"
              :value="txData.tx_hash"
            />
          </div>
          <div class="wrapper">
            <InfoBlock
              class="mb-4"
              label="total amount"
              :loading="txDataLoading"
              :value="txData
                && txData.inputsAmount
                && toComaSeparate(String(formatBtcAmount(txData.inputsAmount, true, 4))) || '0'"
            />
            <InfoBlock
              label="block"
              :loading="txDataLoading"
              :value="txData
                && txData.blockHeight
                && toComaSeparate(String(txData.blockHeight))"
            />
            <InfoBlock
              label="Total inputs"
              :loading="txDataLoading"
              :value="txData
                && txData.totalInputs"
            />
            <InfoBlock
              label="Total outputs"
              :loading="txDataLoading"
              :value="txData
                && txData.totalOutputs"
            />
            <InfoBlock
              label="TIMESTAMP"
              :loading="txDataLoading"
              :value="txData
                && txData.timestamp
                && formatDate(txData.timestamp * 1000, 'dd.MM.yyyy hh:mm a')"
            />
          </div>
        </div>
        <div class="report-risk-score">
          <div class="report-block__header">
            Risk score
          </div>
          <semi-circle-progress
            :percentage="Number(totalFunds.toFixed(0))"
            :stroke-bg-color="hex2rgba(findColorByTypeScore(totalFunds.toFixed(0)), 0.4)"
            :stroke-color="findColorByTypeScore(totalFunds.toFixed(0))"
            stroke-linecap="butt"
            :stroke-width="30"
          >
            <div class="total-funds-report">
              <div
                class="risk-score-value"
                :style="`color: ${findColorByTypeScore(totalFunds)}`"
              >
                {{ formatFunds(totalFunds, false) }}
              </div>
            </div>
          </semi-circle-progress>
          <div
            v-if="txRiskySources.length > 0"
            class="text-center mt-3"
          >
            <strong>{{ formatShare(percent*100) }}</strong> of funds comes from risky sources
          </div>
          <div
            v-else
            class="text-center mt-3"
          >
            No risky sources were found
          </div>
        </div>
      </div>
      <div
        v-if="!calculationLoading"
        class="mb-5"
      >
        <p
          v-if="percent * 100 > 0 || addressAreUnidentified || messages.length > 0"
          class="sidebar__analytics-label"
        >
          AML RISK DETECTED
        </p>
        <StatusBlock
          v-if="percent * 100 > 0"
          class="mb-2"
          :label="`${formatShare(percent * 100)} of funds in this transaction are from risky sources`"
        />
        <StatusBlock
          v-if="addressAreUnidentified"
          class="mb-2"
          label="More than 75% of sources for this transaction are unidentified"
        />
        <StatusBlock
          v-for="(msg, index) in messages"
          :key="index"
          class="mb-2"
          :label="msg"
        />
      </div>
      <div
        v-if="allDataSource.length > 0 && allDataSourceByOwner.length > 0"
        class="report-block__header"
      >
        Sources of Funds
      </div>
      <div class="flex mb-4 flex-wrap">
        <div class="flex-1">
          <PieDataList
            :data="allDataSource"
            :loading="calculationLoading"
            title="By Type"
            track-by-label="funds.type"
            track-by-label-support="funds.name"
          />
        </div>
        <div class="flex-1">
          <PieDataList
            :data="allDataSourceByOwner"
            :loading="calculationLoading"
            title="By Owner"
            track-by-label="owner"
          />
        </div>
      </div>
    </div>
    <txRiskyTable
      v-if="txRiskySources.length > 0 && !txDataLoading"
      class="mb-5"
      :data="txRiskySources"
      :loading="txDataLoading"
    />
    <txUnknownTable
      v-if="txUnknownSources.length > 0 && !txDataLoading"
      class="mb-5"
      :data="txUnknownSources"
      :loading="txDataLoading"
    />
    <txKnownTable
      v-if="txKnownSources.length > 0 && !txDataLoading"
      :data="txKnownSources"
      :loading="txDataLoading"
    />
  </div>
</template>

<script>
// Components
import InfoBlock from '../../analytics/analytics-info-blocks/components/info-block'
import StatusBlock from "@/pages/report/components/StatusBlock";
import PieDataList from'../components/PieDataList'
import GlTag from '@/components/gl-tag'
import txRiskyTable from "@/pages/report/components/TxRiskyTable";
import txKnownTable from "@/pages/report/components/TxKnownTable";
import txUnknownTable from "@/pages/report/components/TxUnknownTable";
import semiCircleProgress from 'vue-pithy-progress/lib/semi-circle-progress.umd.min.js'
import 'vue-pithy-progress/lib/semi-circle-progress.css'
// Utils
import {formatDate} from "@/utils/format-date";
import {toComaSeparate} from "@/utils/formatNumber";
import {formatBtcAmount} from "@/utils/format-btc-amount";
import {capitalizeFirstLetter} from "@/utils/text-formatter";
import {findColorByTypeScore, hex2rgba} from "@/utils/cytoskape-ui-rules";
import { formatFunds } from "@/utils/report-data-formatter";

export default {
  components: {
    InfoBlock,
    StatusBlock,
    PieDataList,
    txRiskyTable,
    txUnknownTable,
    txKnownTable,
    semiCircleProgress,
    GlTag
  },
  props: {
    txData: {
      type: Object,
      default: () => ({})
    },
    allDataSource: {
      type: Array,
      default: () => []
    },
    txRiskySources: {
      type: Array,
      default: () => []
    },
    txKnownSources: {
      type: Array,
      default: () => []
    },
    txUnknownSources: {
      type: Array,
      default: () => []
    },
    allDataSourceByOwner: {
      type: Array,
      default: () => []
    },
    messages: {
      type: Array,
      default: () => []
    },
    txDataLoading: {
      type: Boolean,
      default: false
    },
    calculationLoading: {
      type: Boolean,
      default: false
    },
    percent: {
      type: [Number, String],
      default: 0
    },
    totalFunds: {
      type: [Number, String],
      default: 0
    },
  },
  data() {
    return {
      RISK_POINT: 55
    }
  },
  computed: {
    addressIsOwnerByHightRisk() {
      return (this.addressData.tags && this.addressData.tags.find(tag => tag.score >= this.RISK_POINT))
          || (this.addressData.clusterData.tags && this.addressData.clusterData.tags.find(tag => tag.score >= this.RISK_POINT))
          || this.addressData.type && this.addressData.type.score >= this.RISK_POINT
          || (this.addressData.clusterData.type && this.addressData.clusterData.type.score >= this.RISK_POINT)
    },
    hasDirectlyMixing() {
      return (this.addressData.type && this.addressData.type.name === 'mixing')
          || (this.addressData.clusterData.type && this.addressData.clusterData.type.name === 'mixing')
          || (this.addressData.tags && this.addressData.tags.find(tag => tag.name === 'coin join participant'))
          || (this.addressData.clusterData.tags && this.addressData.clusterData.tags.find(tag => tag.name === 'coin join participant'))
    },
    hasTagMoreRiskPoint() {
      return (this.addressData.tags && this.addressData.tags.find(tag => tag.score >= this.RISK_POINT))
          || (this.addressData.clusterData.tags && this.addressData.clusterData.tags.find(tag => tag.score >= this.RISK_POINT))
    },
    addressAreUnidentified() {
      const sum = this.txUnknownSources.reduce((acc, { share }) => acc + share, 0)

      return sum * 100 >= 75
    },
  },
  methods: {
    formatDate,
    toComaSeparate,
    formatFunds,
    capitalizeFirstLetter,
    formatBtcAmount,
    findColorByTypeScore,
    hex2rgba,
    explore(tx) {
      const { href } = this.$router.resolve({ name: 'analytics', query: { tx } })
      window.open(href, '_blank')
    },
    formatShare(share) {
      const formatted = (share).toFixed(2)
      return formatted === '0.00' ? '< 0.01%' : formatted + '%'
    },
  },
}
</script>

<style>
.wallet-tx-wrap {
  display: grid;
  grid-template-columns: 2fr 2fr;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
@media screen and (min-width: 1450px) {
  .wrapper {
    grid-template-columns: repeat(4, 2fr);
  }
}

.report-risk-score {
  width: 350px;
}
</style>
