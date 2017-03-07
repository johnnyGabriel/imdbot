const assert = require('assert')
const request = require('request')

const API_SERVER = 'http://localhost:8000'
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN

describe('HTTP Methods', function() {

    describe('GET /webhook', function() {

        it('should return STATUS CODE 403 Forbidden', function(done) {

            request(API_SERVER + '/webhook', function(err, res, body) {

                if (err) throw err
                assert.equal( 403, res.statusCode )
                done()

            })

        })

        it('should return STATUS CODE 200 OK and hub.challenge', function(done) {

            request({
                uri: API_SERVER + '/webhook',
                qs: {
                    'hub.mode': 'subscribe', 
                    'hub.challenge': 'SOME_RANDOM_CHALLENGE', 
                    'hub.verify_token': VALIDATION_TOKEN 
                }
            }, function(err, res, body) {

                if (err) throw err
                assert.equal( 200, res.statusCode )
                assert.equal( 'SOME_RANDOM_CHALLENGE', res.body )
                done()

            })

        })

    })

    describe('POST /webhook', function() {

        it('should return STATUS CODE 200 OK', function(done) {

            request({
                method: 'POST',
                uri: API_SERVER + '/webhook'
            }, function(err, res, body) {

                if (err) throw err
                assert.equal( 200, res.statusCode )
                done()

            })

        })

    })

})
