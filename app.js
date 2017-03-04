const request = require('request-promise')
const express = require( 'express' )
const bodyParser = require('body-parser')

const PORT = process.env.PORT
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

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

app.post( '/webhook', ( req, res ) => {

    console.log('<< post method', req.body);

    var data = req.body

    if ( data.object === 'page' ) {

        data.entry.forEach( entry => {

            entry.messaging.forEach( event => {

                console.log('<< event', event)

                if ( event.message ) {

                    console.log('<< message received', event.message.text)

                    request({
                        uri: 'https://graph.facebook.com/v2.6/me/messages',
                        qs: { access_token: PAGE_ACCESS_TOKEN },
                        method: 'POST',
                        json: {
                            recipient: { id: event.sender.id },
                            message: {
                                attachment: {
                                    type: 'template',
                                    payload: {
                                        template_type: 'generic',
                                        elements: [
                                            { 
                                                title: 'Item 1',
                                                image_url: 'http://www.carderator.com/assets/avatar_placeholder_small.png',
                                                subtitle: 'subtitulo item 1',
                                            },
                                            { 
                                                title: 'Item 2',
                                                image_url: 'http://www.carderator.com/assets/avatar_placeholder_small.png',
                                                subtitle: 'subtitulo item 2',
                                            }
                                        ]
                                    }
                                }
                            }
                        } 
                    })
                        .then( response => {
                            console.log('>> message sended!', response)
                        })
                        .catch( err =>
                            console.log('!! ERR', err.message)
                        )

                }                

            })

            

        })

    }

    res.sendStatus( 200 )

})

app.use( '*', ( req, res, next ) => {

    res.status( 404 ).send( 'resource not found!' )
    next()

})

app.listen( process.env.PORT, () =>
    console.log( 'server listening on :8000' ))