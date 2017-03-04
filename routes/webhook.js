const request = require('request-promise')
const express = require('express')

const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

const router = express.Router()

const getEmptyMessage = senderId => {
    return { recipient: { id: senderId }, message: {} } }

const getTextMessage = ( senderId, text ) => {

    let data = getEmptyMessage( senderId )
    data['message']['text'] = text
    return data

}

const getTemplateType = type => {
    return {
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: type,
                    elements: []
                }
            }
        }
    }
}

const toTemplateGeneric = list => {

    let defaultImg = 'https://placeholdit.imgix.net/~text?txtsize=53&txt=NO%20IMAGE&w=300&h=450',

        data = getTemplateType( 'generic' ),

        payload = data['message']['attachment']['payload']

    let generateEls = data =>
        data.reduce( (acc, item) => {
    
            acc.push({
                title: item.Title,
                subtitle: item.Type + ' - ' + item.Year,
                image_url: ( item.Poster !== 'N/A' ) ? item.Poster : defaultImg
            })

            return acc
    
        }, [])

    payload['template_type'] = 'generic'
    payload['elements'] = generateEls( list )

    return data

}

const imdbSearch = term =>
    request({
        uri: 'http://www.omdbapi.com',
        qs: { s: term, r: 'json' },
        method: 'GET',
        json: true
    })

const sendMessage = data =>
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: data
    })

const merge = ( obj1, obj2 ) =>
    Object.assign({}, obj1, obj2)



router.route('')

    .get( ( req, res ) => {

        if ( req.query['hub.mode'] === 'subscribe' &&
             req.query['hub.verify_token'] === VALIDATION_TOKEN )
            res.send( req.query['hub.challenge'] )
        else
            res.sendStatus( 403 )
    
    })

    .post( ( req, res ) => {

        var data = req.body
    
        if ( data.object === 'page' ) {

            data.entry.forEach( entry => {

                entry.messaging.forEach( event => {

                    if ( event.message ) {

                        let senderId = event.sender.id,
                            text = event.message.text

                        imdbSearch( text )
                            .then( res => {

                                if ( res.Response === 'False' )
                                    return getTextMessage(
                                        senderId, 'Não encontrei nada :|' )

                                return merge(
                                    getEmptyMessage( senderId ),
                                    toTemplateGeneric( res.Search )
                                )

                            })
                            .then( sendMessage )
                            .catch( err => {

                                console.log(
                                    '!!! erro ao enviar mensagem', err )

                                sendMessage(
                                    getTextMessage(
                                        senderId,
                                        'Desculpe, não consegui concluir minhas buscas :(' ) )

                            })
                    }
                })
            })
        }
    
        res.sendStatus( 200 )
    
    })

module.exports = router