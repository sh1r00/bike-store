import { extend, ValidationProvider } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

import Vue from 'vue'

Vue.component('ValidationProvider', ValidationProvider)

extend('required', {
  ...required,
  message: 'This field is required'
})
