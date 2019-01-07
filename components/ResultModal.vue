<template>
    <no-ssr>
      <modal name="result-modal" class="result-modal" :width="modalWidth">
        <div class="modal-inner" :class="isWon(record) ? 'win' : 'lose'">
          <div class="modal-bg"></div>
          <div class="image" :class="isWon(record) ? 'win' : 'lose'">
            Image
          </div>
          <div class="status" :class="isWon(record) ? 'win' : 'lose'">
            <h2>{{statusText[0]}}</h2>
          </div>
          <div class="status-hint">{{statusText[1]}}</div>
          <div class="button-wrapper">
            <button class="button" @click="onPlayAgain">{{$t('pages.dice.btn_play_again')}}</button>
          </div>
        </div>
      </modal>
    </no-ssr>
</template>


<script>
import _ from 'lodash'
export default {
  props: {
    rollWay: {
      type: String,
      default: 'fast'
    },
    record: {}
  },
  data () {
    return {}
  },
  computed: {
    statusText () {
      if (this.record) {
        if (this.record.status === -1) {
          return [this.$i18n.t('pages.dice.status_title_checking'), this.$i18n.t('pages.dice.status_hint_checking')]
        } else if (this.record.status === 2) {
          return [this.$i18n.t('pages.dice.status_title_lose', {result: this.record.result}), this.$i18n.t('pages.dice.status_hint_lose', {dir: this.isRollLow ? this.$i18n.t('pages.dice.less_than') : this.$i18n.t('pages.dice.more_than') , num: this.sliderNumberDisplayed, result: this.record.result})]
        } else if (this.record.status === 3) {
          let key = this.rollWay === 'fast' ? 'pages.dice.status_hint_win' : 'pages.dice.status_hint_win_alt'
          return [
            this.$i18n.t('pages.dice.status_title_win', {result: this.record.result}),
            this.$i18n.t(key, {reward: this.record.reward, symbol: this.record.asset.symbol})
          ]
        } else {
          return ['', '']
        }
      } else {
        return ['', '']
      }
    },
    modalWidth () {
      if (!process.server) {
        if (window.innerWidth > 736) {
          return '400px'
        } else {
          return '90%'
        }
      }
      return '80%'
    }
  },
  methods: {
    isWon (record) {
      if (record && record.status === 3) {
        return true
      }
      return false
    },
    onPlayAgain () {
      this.hide()
    },
    show () {
      this.$modal.show('result-modal');
    },
    hide () {
      this.$modal.hide('result-modal');
    }
  }
}
</script>

<style lang="scss" scoped>

.modal-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 10px 10px;
  border-radius: 10px;
  position: relative;
  .modal-bg {
    height: 140%;
    width: 140%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-top: -180px;
    margin-left: -80px;
  }
}
.modal-inner.win {
  .modal-bg {
    background: transparent none center no-repeat;
    background-image: url(~/assets/images/light-bg.png);
    background-size: contain;
    // transform-origin: 50% 0%;
    animation-name: rotateLight;
    animation-duration: 30s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
}
.image {
  padding-top: 20px;
  background: transparent none center -10px no-repeat;
  background-size: contain;
  text-indent: -10000px;
  overflow: hidden;
  flex: 3;
  width: 100%;
  margin-top: -100px;
  z-index: 2;
}
.image.win {
  background-image: url(~/assets/images/win-bg.png);
}
.image.lose {
  background-image: url(~/assets/images/lose-bg.png);
}
.status {
  font-size: 18px;
  flex: 1;
  h2 {
    font-weight: bold;
    text-align: center;
  }
}
.status.win {
  h2 {
    text-shadow: 0 0 40px rgba(255,255,255,0.5), 0 0 10px rgba(255, 206, 114, 0.6);
  }
}
.status.lose {
  h2 {
    text-shadow: 0 0 40px rgba(255,255,255,0.5), 0 0 10px rgba(255, 206, 114, 0.6);
  }
}
.status-hint {
  flex: 0;
  padding: 0 0 20px 0;
  text-align: center;
}
.button-wrapper {
  z-index: 2;
  flex: 1;
}
@keyframes rotateLight {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
