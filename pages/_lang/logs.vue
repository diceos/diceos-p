<template>
  <div class="content">
    <app-nav></app-nav>
    <div class="article form">
      <h1 >Logs</h1>
      <h2 class="form-title">22 Nov, 2018</h2>
      <p>Listed DICEOS.</p>
      <p>Signed users will get some DICEOS TOKENs for each fast rolling (CNB and DICEOS excepted).</p>
      <h2 class="form-title">19 Nov, 2018</h2>
      <p>Listed BTC.</p>
      <h2 class="form-title">14 Nov, 2018</h2>
      <p>Fixed UI issues.</p>
    </div>
  </div>
</template>

<script>
import AppNav from '~/components/AppNav.vue'
import _ from 'lodash'

export default {
  components: {
    AppNav
  },
  mixins: [],
  data () {
    return {
      result: '',
    }
  },
  mounted () {
  },
  methods: {
    verifySample () {
      let result = this.verify(this.snapshotId)
      this.result = result
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

