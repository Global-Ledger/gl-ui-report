<template>
  <div class="page-wrapper page-wrapper__large relative">
    <button
      v-if="hasReportData"
      class="save-сsv-button"
      @click="exportReportToCsv"
    >
      Export to csv
    </button>
    <button
      v-if="hasReportData && enableGeneratePdf"
      class="save-button"
      @click="exportToPdf"
    >
      Export to pdf
    </button>
    <div class="flex space-between mb-1">
      <h1 class="page-title">
        Risk Report
      </h1>
    </div>
    <div class="report">
      <div class="flex mb-4">
        <GlCoinSelect dark />
        <gl-search-box
          v-model="search"
          button-text="Search"
          class="fullwidth"
          dark-clear
          :disabled="!search"
          grey
          placeholder="Enter the address or tx hash"
          tagging
          @search="searchData"
        />
      </div>
      <div>
        <AddressReport
          v-if="isAddressReport"
          :address-data="addressInfo"
          :address-data-loading="addressDataLoading"
          :address-known-sources="addressKnownSources"
          :address-risky-sources="addressRiskySources"
          :address-unknown-sources="addressUnknownSources"
          :all-data-source="allDataSource"
          :all-data-source-by-owner="allDataSourceByOwner"
          :calculation-loading="calcLoading"
          :percent="addressRiskPercent"
          :total-funds="addressTotalFunds"
        />
        <TxReport
          v-else-if="isTxReport"
          :all-data-source="allDataSource"
          :all-data-source-by-owner="allDataSourceByOwner"
          :calculation-loading="calcLoading"
          :messages="messages"
          :percent="txRiskPercent"
          :total-funds="txTotalFunds"
          :tx-data="txInfo"
          :tx-data-loading="txDataLoading"
          :tx-known-sources="txKnownSources"
          :tx-risky-sources="txRiskySources"
          :tx-unknown-sources="txUnknownSources"
        />
        <EthTxReport
          v-else-if="isEthTxReport"
          :all-data-source="allDataSource"
          :all-data-source-by-owner="allDataSourceByOwner"
          :calculation-loading="calcLoading"
          :messages="messages"
          :percent="txRiskPercent"
          :symbol="symbol"
          :total-amount="totalAmount"
          :total-funds="txTotalFunds"
          :tx-data="txInfo"
          :tx-data-loading="txDataLoading"
          :tx-known-sources="txKnownSources"
          :tx-risky-sources="txRiskySources"
          :tx-unknown-sources="txUnknownSources"
        />
        <div
          v-else
          class="cyto-empty"
        >
          Type address or transaction hash in the search bar above to get sources of funds report.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Vuex
import {mapActions, mapMutations, mapState} from "vuex";
//Components
import GlSearchBox from '@/components/gl-search-box'
import AddressReport from "@/pages/report/components/AddressReport";
import TxReport from "@/pages/report/components/TxReport";
import GeneratePDF from "@/pages/report/components/GeneratePDF";
import GlCoinSelect from "@/components/gl-coin-select";
import EthTxReport from "@/pages/report/components/EthTxReport";
import GlLoader from "@/components/gl-loader";
// Utils
import {validate} from "vee-validate";
import axios from 'axios'
import {riskScoreList} from "@/assets/js/riskScoreList";
import {formatShare, formatter} from "@/utils/sourcesFormatter";
import { csvExportReport} from '@/utils/export-data'
import {isValidEthHash} from "@/utils/cytoskape-ui-rules";

export default {
  components: {
    TxReport,
    EthTxReport,
    GlSearchBox,
    GeneratePDF,
    GlLoader,
    GlCoinSelect,
    AddressReport
  },
  data() {
    return {
      search: '',
      addressInfo: {},
      txInfo: {},
      isEthTxReport: false,
      isAddressReport: false,
      isTxReport: false,
      addressDataLoading: false,
      txDataLoading: false,
      calcLoading: false,
      allDataSource: [],
      allDataSourceByOwner: [],
      addressRiskySources: [],
      addressUnknownSources: [],
      addressKnownSources: [],
      txRiskySources: [],
      txUnknownSources: [],
      txKnownSources: [],
      messages: [],
      addressRiskPercent: 0,
      txRiskPercent: 0,
      addressTotalFunds: 0,
      txTotalFunds: 0,
      totalAmount: 0,
      symbol: '',
    }
  },
  computed: {
    ...mapState('user', ['userData']),
    ...mapState('analytics', ['coinType']),
    enableGeneratePdf() {
      return process.env.VUE_APP_PDF_GENERATOR
    },
    hasReportData() {
      return Object.keys(this.addressInfo).length !== 0 || Object.keys(this.txInfo).length !== 0 || this.allDataSource.length > 0
    },
  },
  mounted() {
    const { query } = this.$route

    if (query.type) {
      this.SET_COIN_TYPE(query.type)
    }

    if (query.address) {
      this.search = query.address
      this.searchData(query.address)
      return
    }

    if (query.tx) {
      this.search = query.tx
      this.searchData(query.tx)
    }
  },
  methods: {
    ...mapActions({
      getTxAMLInfo: 'analytics/getTxAMLInfo',
      getTxEthData: 'analytics/getTxEthData',
      getTxEthScore: 'analytics/getTxEthScore',
      getAddressData: 'analytics/getAddressData',
      getAddressRisk2: 'analytics/getAddressRisk2',
      getTransactionInfo: 'analytics/getTransactionInfo',
      getTransactionRisk2: 'analytics/getTransactionRisk2'
    }),
    ...mapMutations('analytics', ['SET_COIN_TYPE']),
    csvExportReport,
    formatter,
    formatShare,
    isValidEthHash,
    formatterDepthSortValue(value) {
      if (typeof value === 'number') {
        return value
      }

      if (value && value.minimum && value.maximum) {
        return value.minimum
      } else {
        return null
      }
    },
    exportToPdf() {
      axios({
        url: `${process.env.VUE_APP_DOCUMENT_GENERATOR_URL}/report/${this.isAddressReport ? 'address' : 'tx'}/${this.search}?userId=${this.userData.id}`,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report_${this.search}.pdf`);
        document.body.appendChild(link);
        link.click();
      });
    },
    async searchData(value) {
      this.clearData()

      if (this.$can('use','eth') && isValidEthHash(value)) {
        this.isEthTxReport = true
        this.txDataLoading = true
        this.calcLoading = true

        const a = this.getTxEthData({ tx: value }).then(({ data }) => {

          const localTxData = data.txs[0]

          this.txInfo = {
            ...localTxData,
            tx_hash: this.search
          }
          this.txDataLoading = false
        })
        const c = this.getTxEthScore({ tx: this.search })
          .then(({ sources, totalFunds, totalAmount, symbol }) => {
          this.totalAmount = totalAmount
          this.symbol = symbol
          this.txTotalFunds = totalFunds
          sources = sources.map((source) => ({
            ...source,
            depthSortValue: this.formatterDepthSortValue(source.depth)
          }))
          this.txRiskySources = sources.filter(source => source.listType === 'Risky sources')
          this.txUnknownSources = sources.filter(source => source.listType === 'Unknown sources')
          this.txKnownSources = sources.filter(source => source.listType === 'Known sources')

          const groupedSourcesByType = formatter(sources, 'funds.type')

          this.txRiskPercent = 0

          groupedSourcesByType.forEach(item => {
            if (item.funds.score >= 55) {
              this.txRiskPercent += item.share
            }
          })

          this.allDataSource = groupedSourcesByType.map(item => ({
            ...item,
            funds: {
              ...item.funds,
              default: Boolean(item.funds.default)
            },
            key: item.funds.type,
            tooltip: `${item.funds.type} ${formatShare(item.share)}`,
            pieValue: item.share,
            value: item.share,
            itemStyle: {color: item.funds.default ? this.findColor(-1) : this.findColor(item.funds.score)},
          }))

          const groupedSourcesByOwner = formatter(sources, 'owner')

          this.allDataSourceByOwner = groupedSourcesByOwner.map(item => ({
            ...item,
            funds: {
              ...item.funds,
              default: Boolean(item.funds.default)
            },
            key: item.owner,
            tooltip: `${item.owner} ${formatShare(item.share)}`,
            pieValue: item.share,
            value: item.share,
            itemStyle: {color: item.funds.default ? this.findColor(-1) : this.findColor(item.funds.score)},
          }))
          this.calcLoading = false
        })

        await Promise.allSettled([a, c])

        await this.$router.push({ name: 'report', query: { tx: value, type: this.coinType } })
        return
      }

      const hashValidationResult = await validate(value, 'txHash', { name: 'Search value' })
      if (hashValidationResult.valid) {
        this.isTxReport = true
        this.txDataLoading = true
        this.calcLoading = true

        const a = this.getTransactionInfo({ txHash: value }).then(({ data }) => {
          if (data.message) {
            this.calcLoading = false
            this.$toasted.global.error({message: `${data.message}`})
          }
          this.txInfo = data
          this.txDataLoading = false
        })
        const b = this.getTxAMLInfo({ tx_hash: value })
          .then(({ data }) => {
            this.messages = data.messages
          }).catch(({response: {data}}) => {
            if (data.statusCode && data.statusCode !== 500) {
              this.$toasted.global.error({message: `${data.message}`})
            }
          })
        const c = this.getTransactionRisk2(value).then(({ data: { sources, totalFunds } }) => {
          this.txTotalFunds = totalFunds
          sources = sources.map((source) => ({
            ...source,
            depthSortValue: this.formatterDepthSortValue(source.depth)
          }))
          this.txRiskySources = sources.filter(source => source.listType === 'Risky sources')
          this.txUnknownSources = sources.filter(source => source.listType === 'Unknown sources')
          this.txKnownSources = sources.filter(source => source.listType === 'Known sources')

          const groupedSourcesByType = formatter(sources, 'funds.type')

          this.txRiskPercent = 0

          groupedSourcesByType.forEach(item => {
            if (item.funds.score >= 55) {
              this.txRiskPercent += item.share
            }
          })

          this.allDataSource = groupedSourcesByType.map(item => ({
            ...item,
            funds: {
              ...item.funds,
              default: Boolean(item.funds.default)
            },
            key: item.funds.type,
            tooltip: `${item.funds.type} ${formatShare(item.share)}`,
            pieValue: item.share,
            value: item.share,
            itemStyle: {color: item.funds.default ? this.findColor(-1) : this.findColor(item.funds.score)},
          }))

          const groupedSourcesByOwner = formatter(sources, 'owner')

          this.allDataSourceByOwner = groupedSourcesByOwner.map(item => ({
            ...item,
            funds: {
              ...item.funds,
              default: Boolean(item.funds.default)
            },
            key: item.owner,
            tooltip: `${item.owner} ${formatShare(item.share)}`,
            pieValue: item.share,
            value: item.share,
            itemStyle: {color: item.funds.default ? this.findColor(-1) : this.findColor(item.funds.score)},
          }))
          this.calcLoading = false
        })

        await Promise.allSettled([a, b, c])

        await this.$router.push({ name: 'report', query: { tx: value, type: this.coinType } })
        return
      }
      const addressValidationResult = await validate(value, 'address:btc', { name: 'Search value' })
      if (addressValidationResult.valid) {
        this.isAddressReport = true
        this.addressDataLoading = true
        this.calcLoading = true
        this.getAddressData(value).then(({data, success}) => {
          if (!success) {
            this.$toasted.global.error({message: `${data.message}`})
            return
          }
          this.addressInfo = {
            ...data,
            assumedMeta: this.formattingScoringList(data) || []
          }
        })
        .finally(() => {
          this.addressDataLoading = false
        }),
        this.getAddressRisk2(value).then(({ data: { sources, totalFunds } }) => {
          this.addressTotalFunds = totalFunds
          sources = sources.map((source) => ({
            ...source,
            depthSortValue: this.formatterDepthSortValue(source.depth)
          }))
          this.addressRiskySources = sources.filter(source => source.listType === 'Risky sources')
          this.addressUnknownSources = sources.filter(source => source.listType === 'Unknown sources')
          this.addressKnownSources = sources.filter(source => source.listType === 'Known sources')

          const groupedSourcesByType = formatter(sources, 'funds.type')

          this.addressRiskPercent = 0

          groupedSourcesByType.forEach(item => {
            if (item.funds.score >= 55) {
              this.addressRiskPercent += item.share
            }
          })

          this.allDataSource = groupedSourcesByType.map(item => ({
            ...item,
            funds: {
              ...item.funds,
              default: Boolean(item.funds.default)
            },
            key: item.funds.type,
            tooltip: `${item.funds.type} ${formatShare(item.share)}`,
            pieValue: item.share,
            value: item.share,
            itemStyle: {color: item.funds.default ? this.findColor(-1) : this.findColor(item.funds.score)},
          })).sort((a, b) => ((a.share < b.share)) ? 1 : -1)

          const groupedSourcesByOwner = formatter(sources, 'owner')

          this.allDataSourceByOwner = groupedSourcesByOwner.map(item => ({
            ...item,
            funds: {
              ...item.funds,
              default: Boolean(item.funds.default)
            },
            key: item.owner,
            tooltip: `${item.owner} ${formatShare(item.share)}`,
            pieValue: item.share,
            value: item.share,
            itemStyle: {color: item.funds.default ? this.findColor(-1) : this.findColor(item.funds.score)},
          })).sort((a, b) => ((a.share < b.share)) ? 1 : -1)
        })
        this.calcLoading = false

        await this.$router.replace({ name: 'report', query: { address: value, type: this.coinType } }).catch((err) => err)
        return
      }
      this.$toasted.global.error({ message: 'Search value is not valid'})
    },
    formattingScoringList(data) {
      let SCORING_LIST = []

      if (data.tags) {
        SCORING_LIST = [...SCORING_LIST, ...data.tags]
      }

      if (data.clusterData && data.clusterData.tags) {
        SCORING_LIST = [...SCORING_LIST, ...data.clusterData.tags]
      }

      if (data.type) {
        SCORING_LIST = [...SCORING_LIST, data.type]
      }

      if (data.clusterData && data.clusterData.type) {
        SCORING_LIST = [...SCORING_LIST, data.clusterData.type]
      }

      SCORING_LIST = SCORING_LIST.filter((v,i,a)=>a.findIndex(t=>(t.name===v.name))===i)

      SCORING_LIST.sort((a, b) => ((a.score < b.score)) ? 1 : -1)

      return SCORING_LIST
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
    clearData() {
      this.isAddressReport = false
      this.isTxReport = false
      this.isEthTxReport = false

      this.allDataSource = []
      this.allDataSourceByOwner = []
      this.addressRiskySources = []
      this.addressUnknownSources = []
      this.addressKnownSources = []
      this.txRiskySources = []
      this.txUnknownSources = []
      this.txKnownSources = []

      this.addressRiskPercent = 0
      this.txRiskPercent = 0
      this.addressTotalFunds = 0
      this.txTotalFunds = 0
    },

    exportReportToCsv() {
      if (this.isAddressReport) {
        this.csvExportReport(
            this.addressRiskySources,
            this.addressKnownSources,
            this.addressUnknownSources,
            this.addressInfo,
            this.addressTotalFunds,
            'address',
            this.addressRiskPercent,
            `${this.search}_report`)
      } else if (this.isTxReport) {
        this.csvExportReport(
            this.txRiskySources,
            this.txKnownSources,
            this.txUnknownSources,
            this.txInfo,
            this.txTotalFunds,
            'tx_hash',
            this.txRiskPercent,
            `${this.search}_report`)
      }
    },
  }
}
</script>

<style>
.save-сsv-button {
  position: fixed;
  bottom: 50px;
  right: 180px;
  background-color: var(--reflex-bluet);
  border: none;
  border-radius: 3px;
  color: var(--white);
  cursor: pointer;
  font-weight: bold;
  line-height: 1.29;
  min-width: 100px;
  padding: 6px;
  text-align: center;
  text-transform: uppercase;
  z-index: 10;
}

.report {
  background: var(--white);
  border-radius: 3px;
  padding: 24px;
}

.report-block__header {
  align-items: center;
  display: flex;
  font-size: 24px;
  border-bottom: 2px solid var(--space-cadet);
  margin-bottom: 22px;
  padding-bottom: 12px;
  font-weight: 600;
}

.circle-progress svg {
  width: 100%;
}

/*.circle-progress svg path {*/
/*  stroke-width: px;*/
/*}*/

.a-circle-progress-wrapper .circle-progress {
  flex-direction: column;
}

.a-circle-progress-wrapper .circle-progress .progress-content .inner-default-percentage {
 align-items: flex-end;
}

.save-button {
  position: fixed;
  bottom: 50px;
  right: 50px;
  background-color: var(--reflex-bluet);
  border: none;
  border-radius: 3px;
  color: var(--white);
  cursor: pointer;
  font-weight: bold;
  line-height: 1.29;
  min-width: 100px;
  padding: 6px;
  text-align: center;
  text-transform: uppercase;
  z-index: 10;
}
</style>
