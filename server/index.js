/* eslint-disable no-console */
const Path = require('path')
const Hapi = require('hapi')
const consola = require('consola')
const HapiNuxt = require('hapi-nuxt')
const Inert = require('inert')
require('dotenv').config()

const server = new Hapi.Server({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '3000'
})

server
  .register([
    {
      plugin: HapiNuxt
    },
    {
      plugin: Inert
    }
  ])
  .catch(err => {
    consola.error(err)
    throw err
  })
  .then(() =>
    server.route([
      {
        method: 'GET',
        path: '/getData',
        handler: {
          file: Path.join(__dirname, '../static/storedata.json')
        }
      },
      {
        method: 'POST',
        path: '/postComment',
        options: {
          cors: true,
          handler: function(request, h) {
            const next = request.query.next ? request.query.next : '/'
            const data = request.payload
            const fs = require('fs')
            const fileName = '../static/storedata.json'
            const file = require(fileName)
            const fileKey = data.pageId
            const workingFile = file.filter(d => d.id === fileKey)
            const reviews = workingFile[0].review
            const newReview = {
              rating: data.starRating,
              name: data.name,
              review: data.comment
            }
            reviews.push(newReview)
            fs.writeFile(
              'static/storedata.json',
              JSON.stringify(file, null, 2),
              function(err) {
                if (err) return console.log(err)
              }
            )
            return h.redirect(next)
          }
        }
      },
      {
        method: 'POST',
        path: '/charge',
        options: {
          cors: {
            origin: ['*'],
            headers: ['Content-Type']
          },
          handler: function(request, h) {
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
            if (!request.payload || request.server.methods !== 'POST') {
              return {
                statusCode: 400,
                headers: request.headers,
                body: JSON.stringify({
                  status: 'invalid http method'
                })
              }
            }
            const data = request.payload
            console.log(data)
            if (
              !data.stripeToken ||
              !data.stripeAmt ||
              !data.stripeIdempotency
            ) {
              console.error('Required information is missing.')
              return {
                statusCode: 400,
                headers: request.headers,
                body: JSON.stringify({
                  status: 'missing information'
                })
              }
            }
            // stripe payment processing begins here
            stripe.customers
              .create({
                email: data.stripeEmail,
                source: data.stripeToken
              })
              .then(customer => {
                console.log(
                  `starting the charges, amt: ${data.stripeAmt}, email: ${
                    data.stripeEmail
                  }`
                )
                return stripe.charges
                  .create(
                    {
                      currency: 'usd',
                      amount: data.stripeAmt,
                      receipt_email: data.stripeEmail,
                      customer: customer.id,
                      description: 'Sample Charge'
                    },
                    {
                      idempotency_key: data.stripeIdempotency
                    }
                  )
                  .then(result => {
                    console.log(`Charge created: ${result}`)
                  })
              })
              .catch(err => {
                console.log(err)
                return {
                  statusCode: 400,
                  headers: request.headers,
                  body: JSON.stringify({
                    status: err
                  })
                }
              })
            return {
              statusCode: 200,
              headers: request.headers,
              body: JSON.stringify({
                status: 'it works! beep boop'
              })
            }
          }
        }
      }
    ])
  )
  .catch(err => {
    consola.error(err)
    throw err
  })
  .then(() => server.start())
  .then(() =>
    consola.ready({
      message: `Server running at: ${server.info.uri}`,
      badge: true
    })
  )
  .catch(err => {
    consola.error(err)
    throw err
  })
