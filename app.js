const request = require('request-promise')
const express = require( 'express' )
const bodyParser = require('body-parser')

const webhook = require('./routes/webhook')

const PORT = process.env.PORT

const app = express()

app.use( bodyParser.json() )

app.get( '/', ( req, res ) =>
    res.send( 'IMDBot' )
)

app.use('/webhook', webhook)

app.use( '*', ( req, res, next ) => {
    res.status( 404 ).send( 'resource not found!' )
    next()
})

app.listen( PORT || 8000, () =>
    console.log( 'server started on', PORT || 8000))