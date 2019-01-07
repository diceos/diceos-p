<template>
  <div class="asset" v-if="asset && asset.symbol" :style="'width: ' + autoWidth "  @click="onclick(asset)">
    <div class="icon">
      <img :src="asset.icon"/>
    </div>
    <div class="body">
      <div class="symbol">{{asset.symbol}}</div>
      <div class="name">{{asset.name}}</div>
    </div>
    <div class="balance" :class="parseFloat(asset.balance) < 0.001 ? 'small' : '' ">{{stripeNumber(asset.balance, fixedNumber)}}</div>
  </div>
</template>

<script>
import AssetHelper from '~/mixins/AssetHelper'

export default {
  components: {
  },
  mixins: [AssetHelper],
  props: {
    asset: {
      default: {}
    },
    width: {
      default: '100%'
    },
    fixedNumber: {
      default: 4
    }
  },
  data: function () {
    return {
      isOpen: false
    }
  },
  computed: {
    autoWidth () {
      if (!process.server) {
        if (window.innerWidth < 736) {
          return '100%'
        }
      }
      return this.width
    }
  },
  methods: {
    onclick (asset) {
      this.$emit('click', asset)
    }
  }
}
</script>


<style scoped lang="scss">

.asset {
  // flex: 1;
  background: rgba(0,0,0,0.2);
  border-radius: 16px;
  width: 48%;
  padding: 10px 14px;
  display: flex;
  margin: 0 10px 10px 0;
  .icon {
    margin-right: 14px;
    img {
      width: 48px;
      height: 48px;
      border-radius: 99em;
    }
  }
  .balance {
    flex: 3;
    text-align: right;
    flex-direction: column;
    justify-content: center;
    display: flex;
    font-family: 'Roboto-Mono-Regular', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .balance {
    font-family: 'Roboto-Mono-Regular', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .balance.small {
    opacity: 0.4;
  }
  .body {
    display: flex;
    flex-direction: column;
    flex: 7;
    justify-content: center;
    align-items: flex-start;
    .symbol {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 4px;
    }
    .name {
      opacity: 0.6;
    }
  }
}
@media (max-width: 736px) {
  .asset {
    width: 100%;
    margin: 0 0px 10px 0;
  }
}
</style>

