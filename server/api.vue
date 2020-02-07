<script>
import axios from 'axios'
export default {
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
    // console.log(this.$store)
    this.$store.dispatch('loadData')
  },
  methods: {
    loadData({ commit }) {
      axios.get('/storedata').then(response => {
        // console.log(response.data, this)
        commit('updateStoredata', response.data)
      })
    }
  },
  submitReview(data) {
    const fs = require('fs')
    const fileName = require('../static/storedata.json')
    const file = fileName

    file.key = data.id

    fs.writeFile(fileName, JSON.stringify(file, null, 2), function(err) {
      // eslint-disable-next-line
      if (err) return console.log(err)
      // console.log(JSON.stringify(file))
      // console.log('writing to ' + fileName)
    })
  }
}
</script>
