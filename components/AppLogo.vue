<template>
  <h1 class="logo" :class="pos">
    <nuxt-link to="/"><span class="logo-icon"></span><span class="logo-text">{{$t('seo.title')}}</span></nuxt-link>
  </h1>
</template>

<script>
export default {
  props: {
    pos: ''
  }
}
</script>


<style lang="scss">
.logo {
  a {
    display: flex;
    align-items: center;
  }
  .logo-text {
    font-size: 1px;
    text-indent: -10000em;
    color: #000000;
    letter-spacing: -0.56px;
    margin-right: 0;
    background: transparent url(~/assets/images/logo.png) center center no-repeat;
    background-size: contain;
    width: 130px;
    height: 60px;
  }
  .logo-icon {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background: transparent url(~/assets/images/logo-icon.png) center center no-repeat;
    background-size: contain;
  }
}
.logo.center {
  a {
    background-position-x: 0;
    margin: 0 auto;
  }
}
</style>

