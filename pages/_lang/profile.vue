<template>
  <div class="content">
    <app-nav></app-nav>
    <div class="pane-form">
      <h2 class="">Hello {{$store.state.profile.name}}</h2>
      <div class="portfolio">
        <h3 class="form-title">My Assets</h3>
        <template v-if="assets.length !== 0">
          <div class="assets">
            <asset-item :asset="asset" :fixedNumber="4" width="48%" @click="onClickAsset(asset)" :key="asset.assetId" v-for="asset in assets"></asset-item>
          </div>
        </template>
        <template v-else>
          <div class="empty-hint">No asset yet.</div>
        </template>
      </div>
      <button class="button alt" @click="onLogout">Sign out</button>
    </div>
  </div>
</template>

<script>
import APIHelper from '@/mixins/APIHelper'
import AssetHelper from '@/mixins/AssetHelper'
import AppNav from '~/components/AppNav.vue'
import AssetItem from '~/components/AssetItem.vue'

export default {
  components: {
    AppNav, AssetItem
  },
  mixins: [APIHelper, AssetHelper],
  data () {
    return {
      username: '',
      password: '',
      token: '',
      assets: []
    }
  },
  mounted () {
    if (!this.$store.state.profile.hasOwnProperty('token') || this.$store.state.profile.token === '') {
      this.$router.push(`/`)
    }
    this.token = this.$store.state.profile.token 
    this.apiGetAccountAssets({token: this.token}).then((resp) => {
      this.assets = resp.assets.map((x) => {
        x.icon = this.assetCoinProp(x.symbol, 'icon', x.icon)
        return x
      })
    })
  },
  methods: {
    onClickAsset (asset) {
      // this.$router.push(`/${this.$i18n.locale}/assets/${asset.assetId}`)
      this.$router.push(`/${this.$i18n.locale}/asset/?assetId=${asset.assetId}`)
    },
    onLogout () {
      this.$store.commit('DEL_PROFILE')
      this.$router.push(`/`)
    }
  }
}
</script>

<style scoped lang="scss">
  .content {
  }
  .pane-form {
    padding: 10px 20px;
    margin: 0 auto;
    H2 {
      font-size: 20px;
      margin: 10px 0 40px 0;
    }
  }
  .button-wrapper {
    margin-top: 40px;
    .button {
      width: 100%;
    }
  }
  .portfolio {
    margin: 20px auto 40px auto;
    .empty-hint {
      margin: 20px auto;
    }
    .assets {
      display: flex;
      flex-wrap: wrap;
      .balance {
        font-family: 'Roboto-Mono-Regular', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .balance.small {
        opacity: 0.4;
      }
    }
  }
@media only screen and (max-device-width: 736px) {
  .portfolio {
    .assets {
      .asset {
        width: 100%;
        margin: 0 0px 10px 0;
      }
    }
  }
}
</style>

