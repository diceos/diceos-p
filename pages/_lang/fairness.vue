<template>
  <div class="content">
    <app-nav></app-nav>
    <div class="article form">
      <h1 >Fairness</h1>
      <p>DICEOS uses a provably fair cryptographic system which means you don’t need to trust us blindly, each roll is cryptographically fair and can be easily verified.</p>
      <h2 class="form-title">Randomization</h2>
      <p>DICEOS uses the snapshot Id of the Mixin Network's transaction to generate bet result.</p>
      <p>A snapshot Id is a standard UUID string, which is randomly generated. You can find it by tapping the result text (<span class="sample-result-sqr win">WIN</span> or <span class="sample-result-sqr lose">LOSE</span> button).</p>
      <h2 class="form-title">Verify</h2>
      <p>
        The following code example can be used to verify a bet:
      </p>
      <pre>
    function verify (msg) {
      let digits = sha512.array(msg)
      let s = 0
      for (let i = 0; i &lt; digits.length; i += 1) {
        s += digits[i]
      }
      return s MOD 100 + 1
    }</pre>
      <p>Please also check our verifier:</p>
      <div class="verifier">
        <div class="entry"><label class="entry-label">Snapshot ID</label><input class="entry-input ta-right" v-model="snapshotId"/></div>
        <div class="entry"><label class="entry-label">Result</label><input class="entry-input ta-right" v-model="result" readonly/></div>
        <div class="button-wrapper"><button class="button" @click="verifySample">Verify</button></div>
      </div>
    </div>
  </div>
</template>

<script>
import APIHelper from '@/mixins/APIHelper'
import AppNav from '~/components/AppNav.vue'
import sha512 from 'js-sha512'
import _ from 'lodash'

export default {
  components: {
    AppNav
  },
  mixins: [APIHelper],
  data () {
    return {
      result: '',
      snapshotId: ''
    }
  },
  mounted () {
    this.verify('aaa')
  },
  methods: {
    verifySample () {
      let result = this.verify(this.snapshotId)
      this.result = result
    },
    verify (msg) {
      let digits = sha512.array(msg)
      let s = _.sum(digits)
      return s % 100 + 1
    }
  }
}
</script>

<style scoped lang="scss">
  @import '~/assets/scss/variables.scss';
  .article {
    line-height: 1.3;
    h1 {
      font-size: 38px;
      font-weight: bold;
    }
    p {
      font-size: 14px;
      margin: 0.8em 0;
    }
    h2 {
      margin: 20px 0 0px 0;
      font-size: 20px;
      font-weight: bold;
    }
    .sample-result-sqr.win {
      color: #fff;
      padding: 1px 4px;
      opacity: 1;
      border-radius: 3px;
      background: $color-success;
    }
    .sample-result-sqr.lose {
      color: #fff;
      padding: 1px 4px;
      opacity: 1;
      border-radius: 3px;
      background: #555;
    }
  }
  .form {
    padding: 10px 20px;
    margin: 0 auto;
  }
  .verifier {
    .button-wrapper {
      text-align: center;
    }
  }
</style>

