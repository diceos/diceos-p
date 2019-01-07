<template>
  <div class="content"></div>
</template>

<script>

export default {
  components: {
  },
  fetch ({ params, redirect }) {
    if (process.env.maintenance) {
      redirect(302, '/en/maintenance')
    } else {
      redirect(301, '/en/dice')
    }
  }
}
</script>

<style scoped lang="scss">
  
</style>

