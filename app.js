const express = require( 'express' )
const bodyParser = require('body-parser')

const PORT = process.env.PORT
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN

const app = express()

app.use( bodyParser.json() )

app.get( '/', ( req, res ) => {

    res.send( 'IMDBot' )

})

app.get( '/webhook', ( req, res ) => {

    if ( req.query['hub.mode'] === 'subscribe' &&
         req.query['hub.verify_token'] === VALIDATION_TOKEN ) {

        console.log('verification ok')
        res.send( req.query['hub.challenge'] )
        
    }
    else {

        console.log('verification error')
        res.sendStatus( 403 )

    }

})

app.use( '*', ( req, res, next ) => {

    res.status( 404 ).send( 'resource not found!' )
    next()

})

app.listen( process.env.PORT, () =>
    console.log( 'server listening on :8000' ))