const express = require( 'express' )

const app = express()

app.get( '/', ( req, res ) => {

    res.send( 'IMDBot' )

})

app.get( '/webhook', ( req, res ) => {

    res.send( 'IMDBot webhook!' )

})

app.use( '*', ( req, res, next ) => {

    res.status( 404 ).send( 'resource not found!' )
    next()

})

app.listen( 8000, () =>
    console.log( 'server listening on :8000' ))