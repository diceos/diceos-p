<template>
  <div class="content">
    <app-nav></app-nav>
    <div class="pane-form">
      <div class="form-top">
        <button class="button alt" @click="back">Back to Profile</button>
      </div>
      <h3 class="form-title">Balance</h3>
      <template v-if="asset && asset.symbol">
        <div class="asset">
          <div class="icon">
            <img :src="asset.icon"/>
          </div>
          <div class="body">
            <div class="symbol">{{asset.symbol}}</div>
            <div class="name">{{asset.name}}</div>
          </div>
          <div class="balance">{{asset.balance.toFixed(4)}}</div>
        </div>
      </template>
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
      <h3 class="form-title">Withdraw</h3>
      <div class="withdraw">
      
      </div>
    </div>
    <notifications group="sys" position="top center" />
  </div>
</template>

<script>
import APIHelper from '@/mixins/APIHelper'
import AppNav from '~/components/AppNav.vue'

export default {
  components: {
    AppNav
  },
  mixins: [APIHelper],
  data () {
    return {
      username: '',
      password: '',
      token: '',
      asset: {name: '', symbol: '', balance: 0, icon: ''}
    }
  },
  mounted () {
    if (!this.$store.state.profile.hasOwnProperty('token') || this.$store.state.profile.token === '') {
      this.$router.push(`/`)
    }
    this.token = this.$store.state.profile.token 
    this.apiGetAccountAssetDetail({assetId: this.$route.params.uid, token: this.token}).then((resp) => {
      this.asset = resp.asset
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
  .deposite {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .form-hint {
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
</style>

