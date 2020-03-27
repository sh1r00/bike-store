/* eslint-disable no-console */
import axios from 'axios'
import uuidv1 from 'uuid/v1'

export const state = () => ({
  cartUIStatus: 'idle',
  product: {},
  storedata: [],
  cart: []
})

export const getters = {
  product(state) {
    return state.product
  },
  storedata(state) {
    return state.storedata
  },
  cart(state) {
    return state.cart
  },
  cartUIStatus(state) {
    return state.cartUIStatus
  },
  featuredProducts: state => state.storedata.slice(0, 3),
  women: state => state.storedata.filter(el => el.gender === 'Female'),
  men: state => state.storedata.filter(el => el.gender === 'Male'),
  cartCount: state => {
    if (!state.cart.length) return 0
    return state.cart.reduce((ac, next) => ac + next.quantity, 0)
  },
  cartTotal: state => {
    if (!state.cart.length) return 0
    return state.cart.reduce((ac, next) => ac + next.quantity * next.price, 0)
  }
}

export const mutations = {
  LOAD_DATA(state, payload) {
    state.storedata = payload
  },
  UPDATECART_UI: (state, payload) => {
    state.cartUIStatus = payload
  },
  CLEAR_CART: state => {
    // this clears the cart
    state.cart = []
    state.cartUIStatus = 'idle'
  },
  ADD_TO_CART: (state, payload) => {
    const itemfound = state.cart.find(el => el.id === payload.id)
    itemfound
      ? (itemfound.quantity += payload.quantity)
      : state.cart.push(payload)
  },
  REMOVE_FROM_CART: (state, payload) => {
    const newCart = state.cart.filter(el => el.id !== payload.id)
    state.cart = newCart
  },
  QUANTITY_INCREASE: (state, payload) => {
    const itemfound = state.cart.find(el => el.id === payload.id)
    itemfound.quantity = itemfound.quantity + 1
  },
  QUANTITY_DECREASE: (state, payload) => {
    const itemfound = state.cart.find(el => el.id === payload.id)
    itemfound.quantity = itemfound.quantity - 1
  },
  SET_CURR_PRODUCT(state, payload) {
    state.product = payload
  },
  UPDATE_REVIEWS(state, payload) {
    const itemfound = state.storedata.find(el => el.id === payload.pageId)
    const newReview = {
      rating: payload.starRating,
      name: payload.name,
      review: payload.comment
    }
    itemfound.review.push(newReview)
  }
}

export const actions = {
  loadData({ commit }) {
    axios
      .get('/getData')
      .then(response => {
        // console.log(response.data, this)
        commit('LOAD_DATA', response.data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  setCurrProduct({ commit, getters }, params) {
    const product = getters.storedata.find(el => el.id === params)
    // eslint-disable-next-line
    console.log('product: ', product)
    commit('SET_CURR_PRODUCT', product)
  },
  submitReview({ commit }, params) {
    axios.post('/postComment', params).then(response => {
      console.log('response', response)
      if (response.status === 200) {
        commit('UPDATE_REVIEWS', params)
      }
    })
  },
  async postStripeFunction({ getters, commit }, payload) {
    commit('UPDATECART_UI', 'loading')

    try {
      await axios
        .post(
          '/charge',
          {
            stripeEmail: payload.stripeEmail,
            stripeAmt: Math.floor(getters.cartTotal * 100), // it expects the price in cents, as an integer
            stripeToken: 'tok_visa', // testing token, later we would use payload.data.token
            stripeIdempotency: uuidv1() // we use this library to create a unique id
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(res => {
          if (res.status === 200) {
            commit('UPDATECART_UI', 'success')
            setTimeout(() => commit('CLEAR_CART'), 3000)
          } else {
            commit('UPDATECART_UI', 'failure')
            // allow them to try again
            setTimeout(() => commit('UPDATECART_UI', 'idle'), 3000)
          }

          console.log(JSON.stringify(res, null, 2))
        })
    } catch (err) {
      console.log(err)
      commit('UPDATECART_UI', 'failure')
    }
  }
}
