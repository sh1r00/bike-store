/* eslint-disable no-console */
const Path = require('path')
const Hapi = require('hapi')
const consola = require('consola')
const HapiNuxt = require('hapi-nuxt')
const Inert = require('Inert')

const server = new Hapi.Server({
  host: process.env.DEPLOY_URL || '127.0.0.1',
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
            const host = process.env.HOST || 'localhost:3000'
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
            return h.redirect(host)
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
