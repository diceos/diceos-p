<template>
  <div class="content">
    <div class="pane-form">
      <AppLogo pos="center"/>
      <div class="username-entry entry pane">
        <input class="username-input entry-input" :placeholder="$t('pages.sign.username_placeholder')" v-model="username"/>
      </div>
      <div class="password-entry entry pane">
        <input type="password" class="username-input entry-input" :placeholder="$t('pages.sign.password_placeholder')" v-model="password"/>
      </div>
      <div class="button-wrapper">
        <button class="button" @click="onLogin">{{$t('pages.sign.login')}}</button>
      </div>
      <div class="hint">
        <nuxt-link class="link" title="Create free account" :to="'/' + $i18n.locale + '/signup'">{{$t('pages.sign.create_free_account')}}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppLogo from "~/components/AppLogo"
import APIHelper from '@/mixins/APIHelper'

export default {
  components: {
    AppLogo
  },
  mixins: [APIHelper],
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    onLogin () {
      this.apiLogin({
        username: this.username,
        password: this.password
      }).then((resp) => {
        console.log(resp)
        this.$store.commit('SET_PROFILE', resp)
        this.$router.push(`/${this.$i18n.locale}/`)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .content {
    padding: 10px;
  }
  .pane-form {
    margin: 0 auto;
    width: 320px;
    text-align: center;
    h1 {
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
  .hint {
    margin-top: 20px;
  }
</style>

