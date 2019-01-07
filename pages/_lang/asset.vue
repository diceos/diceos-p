<template>
  <div class="content">
    <app-nav></app-nav>
    <div class="pane-form">
      <div class="form-top">
        <button class="button alt" @click="back">Back to Profile</button>
      </div>
      <h3 class="form-title">Balance</h3>
      <template v-if="asset && asset.symbol">
        <asset-item :asset="asset" width="100%"></asset-item>
      </template>
      <div class="deposite-and-withdraw">
        <div class="deposite-wrapper">
          <h3 class="form-title">Deposite</h3>
          <div class="deposite">
            <template v-if="asset.publicKey">
              <div class="qrcode">
                <no-ssr>
                  <vue-qr :value="asset.publicKey"></vue-qr>
                </no-ssr>
              </div>
              <div class="address"><a @click="copyToClipboard(asset.publicKey)">{{asset.publicKey}}</a></div>
              <div class="form-hint">
                <p>Scan the QRCode or use the address aboved to deposite</p>
                <p>To keep safe, it may take more time than normal to confirm. Don't worry.</p>
              </div>
            </template>
            <template v-else-if="asset.accountName">
              <div class="address-wrapper">Account: <span class="address" @click="copyToClipboard(asset.accountName)">{{asset.accountName}}</span></div>
              <div class="address-wrapper">Memo: <span class="address" @click="copyToClipboard(asset.accountTag)">{{asset.accountTag}}</span></div>
              <div class="form-hint">
                <p>Use the account name and memo aboved to deposite</p>
                <p>To keep safe, it may take more time than normal to confirm. Don't worry.</p>
              </div>
            </template>
            <template v-else>
              <div class="form-hint">Loading...</div>
            </template>
          </div>
        </div>
        <div class="withdraw-wrapper">
          <h3 class="form-title">Withdraw</h3>
          <div class="withdraw">
            <div class="address-wrapper entry"><label class="entry-label">Amount</label><input class="entry-input" v-model="withdrawAmount"/></div>
            <template v-if="asset.publicKey">
              <div class="address-wrapper entry"><label class="entry-label">Address</label><input class="entry-input" v-model="withdrawAddress"/></div>
            </template>
            <template v-else-if="asset.accountName">
              <div class="address-wrapper entry"><label class="entry-label">Account</label><input class="entry-input" v-model="withdrawAccount"/></div>
              <div class="address-wrapper entry"><label class="entry-label">Memo</label><input class="entry-input" v-model="withdrawMemo"/></div>
            </template>
              <div class="form-hint">
                <p>To keep safe, it may take more time than normal to confirm. Don't worry.</p>
                <p>You may need small amount ETH for gas to withdraw ERC20 based tokens.</p>
              </div>
            <button class="button" @click="withdraw">Withdraw</button>
          </div>
        </div>
      </div>
    </div>
    <notifications group="sys" position="top center" />
  </div>
</template>

<script>
import APIHelper from '@/mixins/APIHelper'
import AssetHelper from '@/mixins/AssetHelper'
import AppNav from '~/components/AppNav.vue'
import AssetItem from '~/components/AssetItem.vue'
import uuidV4 from 'uuid/v4'

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
      asset: {name: '', symbol: '', balance: 0, icon: ''},
      withdrawAmount: '',
      withdrawAccount: '',
      withdrawMemo: '',
      withdrawAddress: ''
    }
  },
  mounted () {
    if (!this.$store.state.profile.hasOwnProperty('token') || this.$store.state.profile.token === '') {
      this.$router.push(`/`)
    }
    this.token = this.$store.state.profile.token 
    this.apiGetAccountAssetDetail({assetId: this.$route.query.assetId, token: this.token}).then((resp) => {
      let asset =  resp.asset
      asset.icon = this.assetCoinProp(asset.symbol, 'icon', asset.icon)
      this.asset = asset
    })
  },
  methods: {
    back () {
      this.$router.back()
    },
    showNotify (text) {
      this.$notify({
        group: 'sys',
        title: text
      })
    },
    copyToClipboard (text) {
      if (!process.server) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            clipboardData.setData("Text", text)

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
          var textarea = document.createElement("textarea")
          textarea.textContent = text
          textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
          document.body.appendChild(textarea)
          textarea.select()
          try {
              document.execCommand("copy");  // Security exception may be thrown by some browsers.
          } catch (ex) {
              console.warn("Copy to clipboard failed.", ex)
          } finally {
              document.body.removeChild(textarea)
          }
        }
        this.showNotify('Copied.')
      }
    },
    withdraw () {
      let payload = {
        assetId: this.asset.assetId,
        traceId: uuidV4(),
        amount: this.withdrawAmount
      }
      if (isNaN(parseFloat(payload.amount)) || parseFloat(payload.amount) < 0) {
        alert('Incorrect Amount!')
        return
      }
      if (this.asset.publicKey) {
        payload.publicKey = this.withdrawAddress
      } else {
        payload.publicKey = this.withdrawAccount
        payload.memo = this.withdrawMemo
      }
      this.apiPostAccountWithdraw({payload: payload, token: this.token}).then((resp) => {
        this.showNotify('Request sent.')
      }).catch((err) => {
        if (err.response && err.response.data && err.response.data.err) {
          alert('Error: ' + err.response.data.err)
        } else {
          console.log(err)
          alert('Unknown Error')
        }
      })
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
  }
  .form-top {
    margin-bottom: 40px;
  }
  .asset {
    width: 100%;
  }
  .deposite-and-withdraw {
    display: flex;
    flex-direction: row;
    .deposite-wrapper, .withdraw-wrapper {
      flex: 1;
    }
    .deposite-wrapper {
      margin-right: 40px;
    }
  }
  .deposite {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .address-wrapper {
    flex: 1;
    width: 100%;
  }
  .address {
    padding: 8px 10px;
    background: rgba(0,0,0,0.3);
    display: inline-block;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    font-size: 14px;
    margin: 10px;
    word-wrap:break-word;
    font-family: 'Roboto-Mono-Regular','Courier New', Courier, monospace;
  }
  .qrcode {
    margin: 10px auto;
    text-align: center;
    display: inline-block;
    padding: 10px;
    background: white;
    border-radius: 8px;
    canvas {
      margin: 0 auto;
      width: 140px;
      background: white;
    }
  }
  .withdraw {
    max-width: 660px;
    margin: 0 auto;
    text-align: center;
  }
  @media (max-width: 736px) {
    .deposite-and-withdraw {
      flex-direction: column;
      .deposite-wrapper {
        margin-right: 0;
      }
    }
  }
</style>

