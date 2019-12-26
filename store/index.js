/* eslint-disable no-console */
import axios from 'axios'
import uuidv1 from 'uuid/v1'

export const state = () => ({
  cartUIStatus: 'idle',
  storedata: [],
  cart: []
})

export const getters = {
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
  LOADDATA(state, payload) {
    state.storedata = payload
  },
  UPDATECARTUI: (state, payload) => {
    state.cartUIStatus = payload
  },
  CLEARCART: state => {
    // this clears the cart}
    ;(state.cart = [])((state.cartUIStatus = 'idle'))
  },
  ADDTOCART: (state, payload) => {
    const itemfound = state.cart.find(el => el.id === payload.id)
    itemfound
      ? (itemfound.quantity += payload.quantity)
      : state.cart.push(payload)
  },
  REMOVEFROMCART: (state, payload) => {
    const itemfound = state.cart.find(el => el.id === payload.id)
    state.cart.splice(itemfound)
  },
  QUANTITYINCREASE: (state, payload) => {
    const itemfound = state.cart.find(el => el.id === payload.id)
    itemfound.quantity = itemfound.quantity + 1
  },
  QUANTITYREDUCE: (state, payload) => {
    const itemfound = state.cart.find(el => el.id === payload.id)
    itemfound.quantity = itemfound.quantity - 1
  }
}

export const actions = {
  async loadData({ commit }) {
    await axios
      .get('http://localhost:3000/getData')
      .then(response => {
        // console.log(response.data, this)
        commit('LOADDATA', response.data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  async postStripeFunction({ getters, commit }, payload) {
    commit('UPDATECARTUI', 'loading')

    try {
      await axios
        .post(
          'https://ecommerce-netlify.netlify.com/.netlify/functions/index',
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
            commit('UPDATECARTUI', 'success')
            setTimeout(() => commit('CLEARCART'), 3000)
          } else {
            commit('UPDATECARTUI', 'failure')
            // allow them to try again
            setTimeout(() => commit('UPDATECARTUI', 'idle'), 3000)
          }

          console.log(JSON.stringify(res, null, 2))
        })
    } catch (err) {
      console.log(err)
      commit('UPDATECARTUI', 'failure')
    }
  }
}
