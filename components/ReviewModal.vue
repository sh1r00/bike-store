<template>
  <div class="container">
    <div class="form">
      <star-rating v-model="starRating" />
      <label for="name">
        <h1> Name </h1>
        <input id="name" v-model="name" type="text">
      </label>
      <label for="comment">
        <h1> Comment </h1>
        <input id="comment" v-model="comment" type="text">
      </label>
      <button @click.prevent="submitReview">
        Submit
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import StarRating from 'vue-star-rating/src/star-rating.vue'
import axios from '@nuxtjs/axios'

export default {
  components: {
    StarRating
  },
  data() {
    return {
      pageId: this.$route.params.id,
      starRating: 0,
      name: '',
      comment: ''
    }
  },
  methods: {
    async submitReview() {
      await axios.post('/postComment', {
        pageId: this.pageId,
        starRating: this.starRating,
        name: this.name,
        comment: this.comment
      })
    }
  }
}
</script>

<style scoped>
.container {
  width: auto;
  height: auto;
  background-color: white;
}
.form {
  display: flex;
  flex-direction: column;
}

.form label {
  flex-direction: row;
}
</style>
