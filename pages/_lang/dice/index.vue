<template>
  <div class="">
    <app-nav></app-nav>
    <template v-if="!isSigned">
      <div class="notify-bannar pane" @click="goSignup">Sign up and roll to get DICEOS bonus »</div>
    </template>
    <div class="dice-container">
      <div class="game-table">
        <div class="pane switch-pane">
          <div class="switch-low switch-item" :class="isRollLow ? 'active' : '' " @click="onChangeSwitch('low')">{{$t('pages.dice.switch_item_low')}}</div>
          <div class="switch-high switch-item" :class="isRollLow ? '' : 'active' " @click="onChangeSwitch('high')">{{$t('pages.dice.switch_item_high')}}</div>
        </div>
        <div class="pane">
          <div class="pane-title">{{$t('pages.dice.pane_title_choose_a_number')}}</div>
          <div class="number-slider">
            <no-ssr>
              <vue-slider v-if="showSlider" ref="slider" v-model="sliderValue"
                :min="slideMinValue" :max="slideMaxValue" 
                :slider-style="sliderStyle" :process-style="processStyle"
                :reverse="!isRollLow">
                <div class="tooltip" slot="tooltip" slot-scope="{ value }">
                  <span class="dir">
                    {{ isRollLow ? $t('pages.dice.less_than')  : $t('pages.dice.more_than')  }}
                  </span> <em>{{ isRollLow ? value + 1: 100 - value }}</em>
                </div>  
              </vue-slider>
            </no-ssr>
          </div>
        </div>
        <div class="pane">
          <div class="pane-title">{{$t('pages.dice.pane_title_bet_number')}}</div>
          <div class="bet-content">
            <div class="bet-entry entry">
              <div class="coin-chooser">
                <div class="coin-chooser-icon" @click="showChooseAssetModal">
                  <img :src="currentAsset.icon"/>
                </div>
              </div>
              <input class="bet-input entry-input" v-model="betValue" @focus="$event.target.select()"/>
              <span class="bet-unit">{{currentAsset.symbol}}</span>
            </div>
            <div class="quick-ops">
              <div class="quick-op op-min" @click="setBet('min')">{{$t('pages.dice.quick_ops_min')}}</div>
              <div class="quick-op op-2x" @click="setBet(2)">{{$t('pages.dice.quick_ops_2x')}}</div>
              <div class="quick-op op-5x" @click="setBet(5)">{{$t('pages.dice.quick_ops_5x')}}</div>
              <div class="quick-op op-10x" @click="setBet(10)">{{$t('pages.dice.quick_ops_10x')}}</div>
              <div class="quick-op op-max" @click="setBet('max')">{{$t('pages.dice.quick_ops_max')}}</div>
            </div>
          </div>
        </div>
        <div class="pane summary-pane">
          <div class="form-hint">
            {{$t('pages.dice.summary_hint_beg')}}<strong>{{summary.chance}}%</strong>{{$t('pages.dice.summary_hint_mid')}}<strong>{{summary.profit}}</strong> {{currentAsset.symbol}}{{$t('pages.dice.summary_hint_end')}}
          </div>
          <div class="summary-cols">
            <div class="summary-col">
              <div class="col-title">{{$t('pages.dice.summary_col_payout')}}</div>
              <div class="col-value">{{summary.payout}}{{$t('pages.dice.summary_col_payout_unit')}}</div>
            </div>
            <div class="summary-col">
              <div class="col-title">{{$t('pages.dice.summary_col_chance')}}</div>
              <div class="col-value">{{summary.chance}}%</div>
            </div>
            <div class="summary-col">
              <div class="col-title">{{$t('pages.dice.summary_col_profit')}}</div>
              <div class="col-value">{{summary.profit}} {{currentAsset.symbol}}</div>
            </div>
          </div>
        </div>
        <div v-if="getPaid" class="pane status-pane">
          <div class="status">{{$t('pages.dice.status_title_checking')}}</div>
          <div class="status-hint">{{$t('pages.dice.status_hint_checking')}}</div>
          <div class="button-wrapper">
            <button class="button alt" @click="onGoBack">{{$t('pages.dice.btn_go_back')}}</button>
          </div>
        </div>
        <div v-else class="pane order-pane">
          <template v-if="hasEnoughAssets">
            <tabs class="tabs" :options="{ defaultTabHash: this.isSigned ? 'fast' : 'scan' }" @changed="tabChanged">
              <tab id="fast" :name="$t('pages.dice.pay_way_1')">
                <template v-if="this.isSigned">
                  <template v-if="currentMyAsset">
                    <h3 class="asset-title"><span>Balance</span></h3>
                    <asset-item :asset="currentMyAsset" @click="showChooseAssetModal"></asset-item>
                  </template>
                  <template v-if="currentMyAsset && currentMyAsset.balance >= betValue">
                    <div class="button-wrapper button-wrapper-roll">
                      <button class="button" :disabled="isRolling" @click="onRoll">{{  isRolling ? $t('common.rolling') : $t('common.roll')}}</button>
                    </div>
                  </template>
                  <template v-else-if="currentMyAsset && currentMyAsset.balance < betValue">
                    <div class="form-hint">
                      {{$t('pages.dice.order_hint_empty_prefix')}} <nuxt-link :to="`/${$i18n.locale}/asset?assetId=${currentMyAsset.assetId}`">{{$t('pages.dice.order_link_deposite')}}</nuxt-link>.
                    </div>
                  </template>
                  <template v-else>
                    <div class="form-hint">
                      {{$t('pages.dice.order_hint_empty_prefix')}} <nuxt-link :to="`/${$i18n.locale}/profile`">{{$t('pages.dice.order_link_deposite')}}</nuxt-link>.
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div class="form-hint">
                    {{$t('pages.dice.order_hint_sign')}}
                  </div>
                  <div class="button-wrapper button-wrapper-signup">
                    <button class="button" @click="goSignup">{{$t('common.signup')}}</button>
                  </div>
                  <div class="button-wrapper button-wrapper-login">
                    <button class="button alt" @click="goLogin">{{$t('common.login')}}</button>
                  </div>
                </template>
              </tab>
              <tab id="scan" :name="$t('pages.dice.pay_way_2')">
                <template v-if="tooMuch">
                  <div class="form-hint">
                    <p>Incorrect bet amount.</p>
                  </div>
                </template>
                <template v-else>
                  <template v-if="isMobile">
                    <div class="button-wrapper">
                      <button class="button" @click="onMixinPay">{{$t('pages.dice.btn_mixin_pay')}}</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="qrcode">
                      <no-ssr>
                        <vue-qr :value="paymentUrl"></vue-qr>
                      </no-ssr>
                    </div>
                    <div class="hint">
                      <p>{{$t('pages.dice.order_hint', {app: 'Mixin Messenger'})}}</p>
                    </div>
                  </template>
                  <div class="hint">
                    <div>{{$t('common.or')}}</div>
                    <p><a :href="'/' + $i18n.locale + '/signup'" title="sign up">{{$t('pages.dice.order_link_join')}}</a></p>
                  </div>
                  <div class="button-wrapper button-wrapper-paid">
                    <button class="button alt" @click="onPaid">{{$t('pages.dice.btn_paid')}}</button>
                  </div>
                </template>
              </tab>
            </tabs>
          </template>
          <template v-else>
            <div class="empty-hint">
              {{$t('pages.dice.empty_hint', {coin: currentAsset.symbol}) }}
            </div>
          </template>
        </div>
      </div>
      <div class="right">
        <div class="history pane">
          <div class="record-header">
            <!-- <div class="record-field record-field-asset">{{$t('pages.dice.record_header_asset')}}</div> -->
            <div class="record-field record-field-time">{{$t('pages.dice.record_header_time')}}</div>
            <div class="record-field record-field-result">{{$t('pages.dice.record_header_result')}}</div>
            <div class="record-field record-field-bet">{{$t('pages.dice.record_header_bet')}}</div>
            <div class="record-field record-field-amount">{{$t('pages.dice.record_header_amount')}}</div>
            <div class="record-field record-field-rewards">{{$t('pages.dice.record_header_reward')}}</div>
          </div>
          <div class="records">
            <div class="record" :class="(isWon(record) ? 'win' : 'lose')" v-bind:key="record.snapshotId" v-for="record in historyRecords">
              <div class="record-icon" :class="record.asset.symbol"></div>
              <div class="record-field record-field-time">
                <span class="bet-time">{{recordTimeDisplayed(record)}}</span>
                <span class="bet-date">{{recordDateDisplayed(record)}}</span>
              </div>
              <div class="result record-field record-field-result">
                <span>{{record.result}}</span>
                <span><a :href="'https://mixin.one/snapshots/' + record.snapshotId">{{isWon(record) ? $t('common.win') : $t('common.lose')}}</a></span>
              </div>
              <div class="record-field record-field-bet">
                <span class="bet-num">{{getBetDir(record)}}{{record.bet.num}}</span>
                <span class="bet-payout">{{getBetPayout(record).toFixed(2)}}{{$t('common.payout')}}</span>
              </div>
              <div class="amount record-field record-field-amount">
                <span>{{record.amount}}</span>
                <span>{{record.asset.symbol}}</span>
              </div>
              <div class="reward record-field record-field-rewards">
                <template v-if="isWon(record)">
                  <span>{{record.reward}}</span>
                  <span>{{record.asset.symbol}}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="chat">
          <div class=""></div>
        </div>
      </div>
    </div>
    <result-modal ref="resultModal" :record="resultRecord" :rollWay="rollWay"></result-modal>
    <choose-asset-modal ref="chooseAssetModal" :assets="assets" @onChoose="onAssetChoose"></choose-asset-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import uuidV4 from 'uuid/v4'
import { Base64 } from 'js-base64'
import msgpack from "msgpack-lite"
import NoSSR from 'vue-no-ssr'
import APIHelper from '@/mixins/APIHelper'
import AssetHelper from '@/mixins/AssetHelper'
import moment from 'moment'
import {mapGetters, mapActions, mapState} from 'vuex'
import AppNav from '~/components/AppNav.vue'
import AssetItem from '~/components/AssetItem.vue'
import ResultModal from '~/components/ResultModal.vue'
import chooseAssetModal from '~/components/chooseAssetModal.vue'

const HOUSE_EDGE = 0.02
let components = {
  'no-ssr': NoSSR,
  'app-nav': AppNav,
  'asset-item': AssetItem,
  'ResultModal': ResultModal,
  'chooseAssetModal': chooseAssetModal
}
if (process.browser) {
  let VueSlider = require('vue-slider-component')
  components['vue-slider'] = VueSlider
}

export default {
  head () {
    return {
      title: this.$t('seo.title'),
      meta: [
        { hid: 'title', name: 'title', content: this.$t('seo.title') },
        { hid: 'description', name: 'description', content: this.$t('seo.description') },
        { hid: 'keywords', name: 'keywords', content: this.$t('seo.keywords') },
        { hid: 'twitter:title', name: 'twitter:title', content: this.$t('seo.title') },
        { hid: 'twitter:description', name: 'twitter:description', content: this.$t('seo.description') },
        { hid: 'og:title', name: 'og:title', property: 'og:title', content: this.$t('seo.title') },
        { hid: 'og:description', name: 'og:description', property: 'og:description', content: this.$t('seo.description') }
      ]
    }
  },

  data () {
    return {
      betValue: 100,
      loading: false,
      slideMinValue: 5,
      slideMaxValue: 95,
      sliderValue: 50,
      dir: 'high',
      rollWay: 'scan',
      showSlider: true,
      historyRecords: [],
      traceId: '',
      getPaid: false,
      betResult: -1,
      isSigned: false,
      token: '',
      isRolling: false,
      resultRecord: null,
      currentAsset: {},
      myAssets: [],
      assets: []
    }
  },
  mixins: [AssetHelper, APIHelper],
  components: components,
  watch: {
    sliderValue (old, newValue) {
      this.betValue = this.currentAsset.min
    }
  },
  computed: {
    isMobile () {
      let os = this.getOperatingSystem()
      return os === 'android' || os === 'ios'
    },
    tooMuch () {
      let max = this.getMaxBetValue(this.currentAsset, this.payout)
      return max + this.currentAsset.min < parseFloat(this.betValue)
    },
    hasEnoughAssets () {
      if (this.currentAsset.balance * HOUSE_EDGE >= this.betValue) {
        return true
      }
      return false
    },
    isRollLow () {
      return this.dir === 'low'
    },
    sliderNumberDisplayed () {
      return this.isRollLow ? this.sliderValue + 1 : 100 - this.sliderValue
    },
    sliderStyle () {
      let lowStyle = {
        'background-image': 'linear-gradient(-152deg, #E53726 0%, #FF7330 100%)',
        'box-shadow': '0 0 10px 8px rgba(248,0,0,0.20), 0 0 0 4px rgba(254,4,0,0.20), 0 0 0 8px rgba(254,4,0,0.20)'
      }
      let highStyle = {
        'background-image': 'linear-gradient(-152deg, #30D3FF 0%, #269EE5 100%)',
        'box-shadow': '0 0 10px 6px rgba(0,193,248,0.20), 0 0 0 4px rgba(0,186,254,0.10), 0 0 0 8px rgba(0,136,254,0.10)'
      }
      return this.isRollLow ? lowStyle : highStyle
    },
    processStyle () {
      let lowStyle = {
        'background-image': 'linear-gradient(-154deg, #E53726 0%, #FF7330 100%)',
        'border-radius': '5px'
      }
      let highStyle = {
        'background-image': 'linear-gradient(-154deg, #264EE5 0%, #30BAFF 100%)',
        'border-radius': '5px'
      }
      return this.isRollLow ? lowStyle : highStyle
    },
    statusText () {
      if (this.betResult === -1) {
        return [this.$i18n.t('pages.dice.status_title_checking'), this.$i18n.t('pages.dice.status_hint_checking')]
      } else if (this.betResult === 0) {
        return [this.$i18n.t('pages.dice.status_title_lose', {result: this.resultRecord.result}), this.$i18n.t('pages.dice.status_hint_lose', {dir: this.isRollLow ? this.$i18n.t('pages.dice.less_than') : this.$i18n.t('pages.dice.more_than') , num: this.sliderNumberDisplayed, result: this.resultRecord.result})]
      } else {
        return [this.$i18n.t('pages.dice.status_title_win', {result: this.resultRecord.result}), this.$i18n.t('pages.dice.status_hint_win', {reward: this.resultRecord.reward, symbol: this.resultRecord.asset.symbol})]
      }
    },
    chance () {
      return this.sliderValue
    },
    payout () {
      return this.calPayout(this.isRollLow ? this.chance + 1: this.chance)
    },
    summary () {
      return {
        chance: this.chance.toFixed(0),
        payout: this.payout.toFixed(2),
        profit: (this.betValue * this.payout).toFixed(4)
      }
    },
    paymentUrl () {
      let memo = {'Num': this.sliderNumberDisplayed, 'Op': this.dir === 'high' ? '>' : '<' }
      memo = msgpack.encode(memo)
      let url = this.createPayment({'symbol': this.currentAsset.symbol, 'recipient':'8f492936-2c0f-4667-92c1-e43babafda75', traceId: this.traceId, 'amount': this.betValue, 'memo': memo})
      return url
    },
    currentMyAsset () {
      for (let i = 0; i < this.myAssets.length; i += 1) {
        if (this.currentAsset.assetId === this.myAssets[i].assetId) {
          return this.myAssets[i]
        }
      }
      return null
    }
  },
  fetch ({ params, redirect }) {
    if (process.env.maintenance) {
      redirect(302, '/en/maintenance')
    }
  },
  mounted () {
    if (this.$store.state.profile.hasOwnProperty('token') && this.$store.state.profile.token !== '') {
      this.isSigned = true
      this.token = this.$store.state.profile.token 
    }
    this.rollWay = this.isSigned ? 'fast' : 'scan'
    this.fetchMyAssets()
    this.apiGetRecords().then((resp) => {
      this.historyRecords = resp.records.map((x) => {
        x.reward = this.stripeNumber(x.reward, 4)
        x.amount = this.stripeNumber(x.amount, 4)
        return x
      })
    })
    this.apiGetAssets().then((resp) => {
      let assets = resp.assets.map((x) => {
        x.min = this.assetCoinMin(x.symbol)
        x.icon = this.assetCoinProp(x.symbol, 'icon', x.icon)
        x.order = this.assetCoinProp(x.symbol, 'order')
        return x
      })
      assets.sort((a, b) => { return a.order > b.order ? 1 : -1 })
      this.assets = assets.filter((x) => {
        if (x.balance * HOUSE_EDGE < x.min) {
          return false
        }
        return true
      })
      // filter
      this.currentAsset = this.assets[0]
      // get defaults
      for (let i = 0; i < this.assets.length; i += 1) {
        if (this.$store.state.defaultAsset === this.assets[i].assetId) {
          this.currentAsset = this.assets[i]
        }
      }
      this.traceId = uuidV4()
      this.betValue = this.currentAsset.min
    })
  },
  methods: {
    tabChanged (selectedTab) {
      this.rollWay = selectedTab.tab.id
    },
    onAssetChoose (asset) {
      this.currentAsset = asset
      this.betValue = asset.min
      this.$store.commit('SET_DEFAULT_ASSET', asset.assetId)
      this.hideChooseAssetModal()
    },
    fetchMyAssets () {
      if (this.isSigned && this.token) {
        this.apiGetAccountAssets({token: this.token}).then((resp) => {
          this.myAssets = resp.assets.map((x) => {
            x.icon = this.assetCoinProp(x.symbol, 'icon', x.icon)
            return x
          })
        })
      }
    },
    getOperatingSystem: function () {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera
      var OSName = 'unknown'
      if (/android/i.test(userAgent)) {
        OSName = 'android'
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        OSName = 'ios'
      } else if (userAgent.indexOf('Win') !== -1) {
        OSName = 'windows'
      } else if (userAgent.indexOf('Mac') !== -1) {
        OSName = 'macos'
      } else if (userAgent.indexOf('X11') !== -1) {
        OSName = 'linux'
      }
      return OSName
    },
    calPayout(chance) {
      /*
        payout = 
        when chance = 0.95, payout = 1/0.95 * (1 - 0.02) = 1.03
        when chance = 0.05, payout = 1/0.05 * (1 - 0.02) = 19.6
        payout = 1/chance * (1 - houseEdge)
       */
      return (1 / (chance / 100)) * (1 - HOUSE_EDGE)
    },
    stripeNumber (x, n) {
      let dotPos = x.indexOf('.')
      if (dotPos !== -1) {
        x = x.substring(0, dotPos + n + 1)
      }
      return x
    },
    onPlayAgain () {
      if (process.browser) {
        window.location.reload()
      }
      // this.getPaid = false
      // this.traceId = ''
      // this.betResult = -1
    },
    onGoBack () {
      this.getPaid = false
      this.isRolling = false
    },
    onMixinPay () {
      if (process.browser) {
        window.location.href = this.paymentUrl
      }
    },
    onPaid () {
      this.getPaid = true
      setTimeout(() => {
        this.checkTraceStatus(this.traceId)
      }, 1000)
    },
    onRoll () {
      let memo = {'Num': this.sliderNumberDisplayed, 'Op': this.dir === 'high' ? '>' : '<' }
      memo = msgpack.encode(memo)
      this.traceId = uuidV4()
      let payload = this.createPayment({'symbol': this.currentAsset.symbol, 'recipient':'', 'amount': this.betValue, traceId: this.traceId, 'memo': memo, output: 'object'})
      this.isRolling = true
      this.apiPostAccountRoll({payload: payload, token: this.token}).then((resp) => {

        let traceId = resp.snapshot.traceId
        this.getPaid = true
        setTimeout(() => {
          this.checkTraceStatus(traceId)
        }, 1000)
      }).catch((err) => {
        if (err.response && err.response.data && err.response.data.err) {
          alert('Error: ' + err.response.data.err)
        } else {
          console.log(err)
          alert('Unknown Error')
        }
        this.isRolling = false
      })
    },
    showResultModal () {
      if (this.$refs.resultModal) {
        this.$refs.resultModal.show()
      }
    },
    hideModal () {
      if (this.$refs.resultModal) {
        this.$refs.resultModal.hide()
      }
    },
    showChooseAssetModal () {
      if (this.$refs.chooseAssetModal) {
        this.$refs.chooseAssetModal.show()
      }
    },
    hideChooseAssetModal () {
      if (this.$refs.chooseAssetModal) {
        this.$refs.chooseAssetModal.hide()
      }
    },
    checkRollResultInsta(record) {
      if (record.bet.op === '>') {
        return record.result > record.bet.num
      } else if (record.bet.op === '<=') {
        return record.result <= record.bet.num
      } else if (record.bet.op === '>=') {
        return record.result >= record.bet.num
      } else if (record.bet.op === '<') {
        return record.result < record.bet.num
      } else {
        return false
      }
    },
    goSignup () {
      this.$router.push(`/${this.$i18n.locale}/signup`)
    },
    goLogin () {
      this.$router.push(`/${this.$i18n.locale}/login`)
    },
    getAssetsBySymbol (symbol) {
      for (let i = 0; i < this.assets.length; i += 1) {
        if (this.assets[i].symbol === symbol) {
          return this.assets[i]
        }
      }
      return null
    },
    getBetDir (record) {
      switch (record.bet.op) {
        case '<': return '<'
        case '<=': return '≤'
        case '>': return '>'
        case '>=': return '≥'
        default: return '<'
      }
    },
    getBetPayout (record) {
      return this.calPayout(record.bet.op === '<=' || record.bet.op === '<' ? record.bet.num: 100 - record.bet.num)
    },
    recordDateDisplayed (record) {
      return moment(record.createdAt).format("MM.DD")
    },
    recordTimeDisplayed (record) {
      return moment(record.createdAt).format("hh:mm:ss")
    },
    isWon (record) {
      if (record.status === 3) {
        return true
      }
      return false
    },
    setBet (multiple) {
      let asset = this.currentAsset
      let max = this.getMaxBetValue(asset, this.payout)
      if (multiple === 'min') {
        this.betValue = asset.min
      } else if (multiple === 'max') {
        this.betValue = max.toFixed(4)
      } else {
        let newBetValue = this.betValue * multiple
        if (newBetValue > max) {
          newBetValue = max
        }
        this.betValue = newBetValue.toFixed(4)
      }
    },
    getMaxBetValue (asset, payout) {
      return (asset.balance / 250)
    },
    createPayment ({symbol, recipient, amount, traceId, memo='', output='url'}) {
      let base64Memo = '' //= Base64.encode(memo)
      if (process.browser) {
        base64Memo = btoa(String.fromCharCode.apply(null, memo))
        if (output === 'url') {
          base64Memo = encodeURIComponent(base64Memo)
        }
      }
      let asset = this.currentAsset
      if (asset) {
        if (output === 'url') {
          return `mixin://pay?amount=${amount}&asset=${asset.assetId}&memo=${base64Memo}&recipient=${recipient}&trace=${traceId}`        
        } else {
          return {
            assetId: asset.assetId,
            amount: amount+"",
            memo: base64Memo,
            traceId: this.traceId
          }
        }
      }
    },
    checkTraceStatus (traceId) {
      let again = () => {
        setTimeout(() => {
          this.checkTraceStatus(traceId)
        }, 1000)
      }
      if (this.getPaid === false) {
        return
      }
      if (this.traceId === '') {
        again()
        return
      }
      this.apiGetSingleRecord({traceId: traceId}).then((resp) => {
        if (resp.record) {
          if (resp.record.status === 3) { // win
            console.log('You Win!')
            this.betResult = 1
            this.showResultModal()            
          } else if (resp.record.status === 2) {
            console.log('You Lose')
            this.betResult = 0
            this.showResultModal()
          } else {
            console.log('Error', resp.record.status)
            this.betResult = -1
            alert('Incorrect bet amount. Fail to roll. Your bet will be refund.')
          }
          this.fetchMyAssets()
          this.traceId = uuidV4()
          this.getPaid = false
          this.isRolling = false
          if (resp.record.status === 3 || resp.record.status === 2) {
            this.resultRecord = resp.record
            this.historyRecords.unshift(resp.record)
          }
        } else {
          again()
        }
      }).catch((err) => {
        again()
      })
    },
    onChangeSwitch (dir) {
      if (this.dir !== dir) {
        this.showSlider = false
        this.dir = dir
        this.sliderValue = 100 - this.sliderValue
        // workaround for prop reverse.
        setTimeout(() => {
          this.showSlider = true
        }, 100)
      }
    }
  }
  
}
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables.scss';
  
.dice-container {
  padding: 10px 20px;
  display: flex;
}
.notify-bannar {
  background: rgba(204, 44, 74, 1);
  margin: 4px 20px;
  padding: 6px 10px 8px 10px;
  border-radius: 4px;
  // color: rgba(255, 84, 104, 1);
  a {
    color: rgba(204, 44, 74, 1);
    border-bottom: 1px solid;
  }
}
.right {
  @media (max-width: 1000px) {
    flex: 3;
  }
  flex: 4;
  margin-left: 20px;
}
.history {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
  .record {
    overflow: hidden;
    position: relative;
    span {
      font-family: 'Roboto-Mono-Regular', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
      color: inherit;
    }
    span:last-child {
      font-family: 'Roboto-Bold';
      opacity: 0.4;
    }
  }
  .record, .record-header {
    font-size: 14px;
    padding: 4px 10px 6px 10px;
    display: flex;
  }
  .record:nth-child(odd) {
    background: rgba(0,0,0,0.20);
  }
  .record.win {
    .record-field-result > span:last-child {
      color: #fff;
      padding: 1px 4px;
      opacity: 1;
      border-radius: 3px;
      background: $color-success;
    }
  }
  .record.lose {
    .record-field-result > span:last-child {
      color: #fff;
      padding: 1px 4px;
      opacity: 1;
      border-radius: 3px;
      background: #555;
    }
  }
  .record-icon {
    position: absolute;
    background: transparent none center center no-repeat;
    height: 100%;
    top: 0;
    bottom: 0;
    width: 28px;
    background-size: contain;
    opacity: 0.3;
  }
  .record-icon.EOS {
    background-image: url(~/assets/images/coins/eos.png);
  }
  .record-icon.XIN {
    background-image: url(~/assets/images/coins/xin.png);
  }
  .record-icon.CANDY {
    background-image: url(~/assets/images/coins/candy.png);
  }
  .record-icon.ZEN {
    background-image: url(~/assets/images/coins/zen.png);
  }
  .record-icon.DOGE {
    background-image: url(~/assets/images/coins/doge.png);
  }
  .record-icon.CNB {
    background-image: url(~/assets/images/coins/cnb.png);
  }
  .record-icon.DASH {
    background-image: url(~/assets/images/coins/dash.png);
  }
  .record-icon.ETH {
    background-image: url(~/assets/images/coins/eth.png);
  }
  .record-icon.BTC {
    background-image: url(~/assets/images/coins/btc.png);
  }
  .record-icon.DICEOS {
    background-image: url(~/assets/images/coins/diceos.png);
  }
  .record-field {
    display: flex;
    flex-direction: column;
    flex: 4;
    justify-content: center;
    align-items: center;
  }
  .record-field-time {
    padding-left: 40px;
    align-items: flex-start;
  }
  .record-field-result {
    align-items: flex-start;
    flex: 2;
    a {
      color: inherit;
    }
  }
  .record-field-asset {
    flex: 0;
    flex-basis: 20px;
  }
  .record-field-bet {
    flex: 2;
  }
  .record-field-amount {
    align-items: flex-end;
  }
  .record-field-rewards {
    align-items: flex-end;
  }
  .record-header {
    opacity: 0.7;
    padding: 6px 10px;
    .record-field {
      text-transform: uppercase;
      font-family: 'Roboto-Bold';
    }
  }
}
.game-table {
  flex: 2;
  // max-width: 400px;
  // margin: 0 auto;
}
.switch-pane {
  padding: 0;
  display: flex;
  .switch-item {
    padding: 10px;
    font-family: 'Roboto-Bold';
    text-transform: uppercase;
    flex: 1;
    text-align: center;
    opacity: 0.8;
  }
  .switch-low {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .switch-high {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .switch-item.active {
    opacity: 1;
  }
  .switch-low.active {
    background: #CC2C4A;
  }
  .switch-high.active {
    background: #2E76D7;
  }
}
.number-slider {
  margin: 0 40px;
  padding: 70px 0 10px 0;
  height: 92px;
  .tooltip {
    position: relative;
    background: rgba(0,0,0,0.80);
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.50);
    border-color: rgba(0,0,0,0.80);
    border-radius: 20px;
    padding: 8px 16px;
    white-space: nowrap;
    margin-bottom: 8px;
    .dir {
      opacity: 0.5;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: -0.53px;
      margin-right: 4px;
    }
    em {
      font-size: 22px;
      font-style: normal;
    }
    &::after {
      display: block;
      position: absolute;
      content: " ";
      width: 0;
      height: 0;
      border-color: rgba(0,0,0,0.80) transparent transparent transparent;
      border-width: 10px;
      border-style: solid;
      bottom: 0;
      margin-bottom: -16px;
      left: 50%;
      margin-left: -10px;
    }
  }
}
.bet-content {

}
.coin-chooser {
  position: relative;
  height: 32px;
  .coin-chooser-icon {
    border-radius: 99em;
    width: 32px;
    height: 32px;
    display: block;
    background: transparent;
    position: absolute;
    img {
      width: 100%;
      height: 100%;
      border-radius: 99em;
      background: transparent;
    }
  }
  .coin-chooser-select {
    position: absolute;
    font-size: 14px;
    padding-left: 40px;
    color: rgba(255, 255, 255, 0.6);
    height: 32px;
    opacity: 0;
    width: 100%;
  }
}
.bet-entry {
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  .coin-chooser {
    flex: 1;
    color: #FFFFFF;
  }
  .bet-input {
    text-align: right;
    flex: 1;
  }
  .bet-unit {
    text-align: right;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
    text-transform: uppercase;
    opacity: 0.6;
  }
}
.quick-ops {
  margin: 0 -10px -10px -10px;
  display: flex;
  flex-direction: row;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  .quick-op {
    padding: 8px 0;
    flex: 1;
    text-align: center;
    /* 2x: */
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: -0.27px;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  .quick-op:last-child {
    border-right: none;
  }
}
.summary-pane {
  padding: 0;
  .summary-cols {
    display: flex;
    flex-direction: row;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    .summary-col {
      flex: 1;
      padding: 10px 10px 10px 10px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    .summary-col:last-child {
      flex: 2;
      border-right: none;
    }
    .col-title {
      /* Payout: */
      opacity: 0.5;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: -0.27px;
      text-align: center;
      margin-bottom: 4px;
    }
    .col-value {
      /* 1.24x: */
      font-size: 18px;
      color: #FFFFFF;
      letter-spacing: -0.23px;
      text-align: center;
      text-shadow: 0 0 4px rgba(0,0,0,0.50);
    }
  }
}
.order-pane, .status-pane {
  text-align: center;
  .asset-title {
    font-size: 14px;
    margin: 10px 0 10px 0;
  }
  .asset-title {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background: rgba(0,0,0,0.2);
    margin: 0;
    padding: 0px 14px;
    span {
      display: block;
      padding: 6px 0;
      color: rgba(255,255,255,0.5);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
  }
  .asset {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    width: 100%;
  }
  .status {
    margin: 10px auto 10px auto;
    font-family: 'Roboto-Bold';
    font-size: 20px;
  }
  .status.win {
    color: $color-success;
  }
  .status-hint {
    font-size: 14px;
    opacity: 0.8;;
    margin-bottom: 10px;
  }
  .button-wrapper {
    padding: 14px 0;
    .button {
      width: 200px;
    }
  }
  .button-wrapper-paid {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .empty-hint {
    padding: 20px 0;
    font-weight: normal;
    opacity: 0.6;
    strong {
      text-transform: uppercase;
    }
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
  .hint {
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,0.60);
    letter-spacing: -0.27px;
    text-align: center;
    line-height: 16px;
    em, a {
      color: #fff;
      font-style: normal;
    }
    p {
      margin: 4px 0;
    }
  }
}
.order-pane {
  padding-top: 0;
}
@media (max-width: 736px) {
  .dice-container {
    flex-direction: column;
    .game-table {
    }
    .right {
      margin: 0;
    }
  }
  .history {
    .record, .record-header {
      font-size: 12px;
    }
    .record-icon {
      margin-left: -20px;
    }
    .record-field-time {
      padding-left: 0;
    }
  }
}
</style>

