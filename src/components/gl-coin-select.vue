<template>
  <vSelect
    v-if="hasMultyCoin"
    v-model="coin"
    class="coin-select-base mr-2"
    :class="[{'coin-select-base__dark': dark}]"
    :clearable="false"
    label="label"
    :options="currencyList"
    @input="handleCoinSelect"
  />
</template>

<script>
import vSelect from 'vue-select'
import {mapMutations, mapState} from "vuex";

export default {
  components: {
    vSelect,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: null,
    },
    iconHeight: {
      type: Number,
      default: 16,
    },
    iconWidth: {
      type: Number,
      default: 16,
    },
    iconAfter: {
      type: String,
      default: '',
    },
    dark: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    padder: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
      coin: {
        key: 'btc',
        path: 'tx',
        label: 'BTC'
      },
      currencyList: [
        {
          key: 'btc',
          path: 'tx',
          label: 'BTC'
        },
        {
          key: 'eth',
          path: 'ethVision',
          label: 'ETH'
        }
      ],
    }
  },
  computed: {
    hasMultyCoin() {
      return process.env.VUE_APP_COIN_TYPE
    },
    ...mapState('analytics', ['coinType'])
  },
  watch: {
    coinType: {
      handler(coin) {
        this.SET_COIN_TYPE(coin)
        this.coin = this.currencyList.find(item => item.path === coin) || 'tx'
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations({
      SET_COIN_TYPE: 'analytics/SET_COIN_TYPE',
    }),
    handleCoinSelect({ path }) {
      this.SET_COIN_TYPE(path)
      this.$emit('change')
    },
  },
}
</script>

<style>
.coin-select-base .vs__dropdown-toggle{
  background: #fff;
  border: 1px solid #f5f5f5 !important;
  /*height: 35px !important;*/
  min-height: 40px;
  width: 150px !important;
}

.coin-select-base__dark .vs__dropdown-toggle{
  background: var(--pale-grey);
  border: 1px solid #f5f5f5 !important;
  /*height: 35px !important;*/
  min-height: 40px;
  width: 150px !important;
}
</style>
