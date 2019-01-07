<template>
  <div class="content">
    <AppLogo />
    <h1>DICEOS is down for scheduled maintenance.</h1>
    <div class="description">DICEOS will be back.</div>
    <div class="count-down">{{count}}</div>
  </div>
</template>

<script>
import moment from 'moment'
import AppLogo from "~/components/AppLogo"
export default {
  components: {
    AppLogo
  },
  mixins: [],
  data () {
    return {
      count: '00:00:00'
    }
  },
  mounted () {
    this.startTimer()
  },
  methods: {
    startTimer () {
      this.updateTimer()
    },
    updateTimer () {
      setTimeout(() => {
        let count = process.env.maintenanceEndTime - Date.now()
        if (count < 0) {
          this.count = '-almost done-'
        } else {
          let mom = moment.duration(count)
          this.count = `${mom.hours()}:${mom.minutes()}:${mom.seconds()}`
        }
        this.updateTimer()
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
  .content {
    padding: 10px 20px;
    margin: 0 auto;
    max-width: 660px;
    align-items: center;
    display: flex;
    flex-direction: column;
    padding-top: 80px;
  }
  h1 {
    margin: 10px 0 10px 0;
    font-size: 22px;
    text-align: center;
  }
  .description {
    font-size: 18px;
    opacity: 0.6;
  }
  .count-down {
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    margin-top: 20px;
    padding: 10px 20px;
    font-family: 'Roboto-Mono-Regular', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 40px;
  }
</style>

