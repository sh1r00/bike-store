<template>
  <div>
    <app-store-grid :data="storedata" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppStoreGrid from '~/components/AppStoreGrid.vue'

export default {
  components: {
    AppStoreGrid
  },
  computed: {
    ...mapGetters(['storedata'])
  }
}
</script>

<style lang="scss" scoped>
</style>
