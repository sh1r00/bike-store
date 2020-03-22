<template>
  <div>
    <section class="item-contain">
      <section class="img">
        <img :src="`/products/${product.img}`">
      </section>
      <section class="product-info">
        <h1>{{ product.name }}</h1>
        <star-rating
          :rating="product.starrating"
          :star-size="15"
          :show-rating="false"
          :read-only="true"
          active-color="#000"
          style="margin: 5px 0"
        />
        <h4 class="price">
          {{ product.price | dollar }}
        </h4>
        <p>
          {{ product.description }}
        </p>
        <p class="quantity">
          <button class="update-num" @click="quantity > 0 ? quantity-- : quantity = 0">
            -
          </button>
          <span class="quantity-value"> {{ quantity }} </span>
          <button class="update-num" @click="quantity++">
            +
          </button>
        </p>
        <p>
          Available in additional colors:
          <strong>
            <span :style="`color: ${product.color}`">
              {{ product.color }}
            </span>
          </strong>
        </p>
        <p>
          <button class="button purchase" @click="cartAdd(); openConfirmModal();">
            Add to Cart
          </button>
        </p>
      </section>
    </section>
    <hr>
    <div class="reviews">
      <h2>
        Reviews
      </h2>
      <!-- maybe an image of a person? -->
      <span v-if="product.review">
        <div v-for="item in product.review" :key="item.id" class="reviewIndividual">
          <h3>
            {{ item.name }}
          </h3>
          <star-rating
            :rating="item.rating"
            avtive-color="#000"
            :read-only="true"
            :star-size="15"
            :show-rating="false"
            style="margin: 5px 0"
          />
          <p>
            {{ item.review }}
          </p>
        </div>
      </span>
      <span v-else>
        <p> Be the first to leave a review </p>
      </span>
      <button class="btn review-btn" @click="openReviewModal();">
        Add a Review
      </button>
    </div>
    <app-featured-products />
    <client-only>
      <modal-window ref="confirmModal">
        <confirm-modal @close-confirm-modal="closeConfirmModal" />
      </modal-window>
      <modal-window ref="reviewModal">
        <review-modal @close-review-modal="closeReviewModal" />
      </modal-window>
    </client-only>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import StarRating from 'vue-star-rating/src/star-rating.vue'
import AppFeaturedProducts from '~/components/AppFeaturedProducts.vue'
import ModalWindow from '~/helpers/ModalWindow.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import ReviewModal from '~/components/ReviewModal.vue'

export default {
  components: {
    StarRating,
    AppFeaturedProducts,
    ModalWindow,
    ConfirmModal,
    ReviewModal
  },
  props: {
    data: {
      modalOpen: false,
      type: Boolean
    }
  },
  data() {
    return {
      id: this.$route.params.id,
      quantity: 1,
      tempcart: [] // this object should be the same as the json store object, with an additional param, quantity
    }
  },
  computed: {
    ...mapGetters(['product'])
  },
  methods: {
    openConfirmModal() {
      this.$refs.confirmModal.modalOpen = true
    },
    closeConfirmModal() {
      this.$refs.confirmModal.modalOpen = false
    },
    openReviewModal() {
      this.$refs.reviewModal.modalOpen = true
    },
    closeReviewModal() {
      this.$refs.reviewModal.modalOpen = false
    },
    cartAdd() {
      const item = this.product
      item.quantity = this.quantity
      this.tempcart.push(item)
      this.$store.commit('ADDTOCART', { ...item })
    }
  },
  mounted() {
    // eslint-disable-next-line
    console.log(this.$route.params.id)
    this.$store.dispatch('setCurrProduct', this.$route.params.id)
  }
}
</script>

<style lang="scss" scoped>
.item-contain {
  margin-left: 8%;
  width: 80%;
  display: grid;
  justify-content: space-around;
  grid-template-columns: 1fr 2fr;
}

input {
  width: 60px;
  font-size: 25px;
  margin: 0 10px;
  padding: 5px 10px;
}

.update-num {
  background: black;
  border-color: black;
  color: white;
  font-size: 20px;
  width: 45px;
}

.quantity {
  display: flex;
}

.quantity-value {
  width: 60px;
  text-align: center;
  line-height: 1.625em;
  font-weight: 700;
}

@media screen and (max-width: 650px) {
  .img img {
    width: 100%;
  }

  .item-contain {
    margin-left: 0 !important;
    width: 95% !important;
  }

  .review {
    width: 90%;
    margin-left: 4%;
  }
}
</style>
