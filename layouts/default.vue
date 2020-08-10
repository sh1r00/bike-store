<template>
  <div>
    <app-nav />
    <main>
      <nuxt />
    </main>
    <app-footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppFooter from '~/components/AppFooter.vue'
import AppNav from '~/components/AppNav.vue'

export default {
  components: {
    AppFooter,
    AppNav
  },
  computed: {
    ...mapState(['loading'])
  },
  mounted() {
    if (process.browser) {
      const domElement = document.createElement('script')
      domElement.setAttribute('src', 'https://js.stripe.com/v3/')
      domElement.onload = () => {
        this.loadedStripe = true
      }
      document.body.appendChild(domElement)
    }
  },
  created() {
    this.$store.dispatch('loadData')
  }
}
</script>

<style>
body {
  border: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.4;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

main {
  padding: 0;
  width: 95vw;
  margin-left: 2vw;
}

button {
  min-height: 60px;
  min-width: 60px;
}

@media screen and (min-width: 1000px) {
  main {
    padding: 40px;
    width: 80vw;
    margin-left: 7vw;
  }
}
</style>
