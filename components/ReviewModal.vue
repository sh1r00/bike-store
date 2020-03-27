<template>
  <validation-observer
    v-slot="{ invalid }"
    class="container"
    tag="div"
  >
    <form
      class="form"
      @submit.prevent="submitReview"
    >
      <star-rating v-model="starRating" />
      <validation-provider
        v-slot="{ errors }"
        tag="div"
        rules="required"
      >
        <label for="name">
          <h3> Name* </h3>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Please enter your name"
          >
        </label>
        <span v-if="!errors[0]">
          * Required
        </span>
        <span
          v-if="errors[0]"
          style="color: red; font-weight: 600; font-size: 0.6em"
        >
          {{ errors[0] }}
        </span>
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        tag="div"
        rules="required"
      >
        <label for="comment">
          <h3> Comment </h3>
          <textarea
            id="comment"
            v-model="comment"
            type="text"
            placeholder="Please enter a comment..."
          />
        </label>
        <span v-if="!errors[0]">
          * Required
        </span>
        <span
          v-if="errors[0]"
          style="color: red; font-weight: 600; font-size: 0.6em"
        >
          {{ errors[0] }}
        </span>
      </validation-provider>
      <button
        type="submit"
        :disabled="invalid"
      >
        Submit
      </button>
    </form>
  </validation-observer>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import StarRating from 'vue-star-rating/src/star-rating.vue'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
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
    submitReview() {
      const review = {
        pageId: this.pageId,
        starRating: this.starRating,
        name: this.name,
        comment: this.comment
      }
      this.$store.dispatch('submitReview', review)
      this.$emit('close-review-modal')
    }
  }
}
</script>

<style scoped>
.container {
  width: auto;
  height: auto;
  background-color: white;
  padding: auto;
}
.form {
  display: flex;
  flex-direction: column;
}

.form label {
  flex-direction: column;
}

button:disabled,
button[disabled] {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}
</style>
