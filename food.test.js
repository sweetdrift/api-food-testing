const client = require('./client')('localhost', 8000)

/**
 * Food is represented by a json with a following format
 * {'name':'name of the food', 'calories': 10 }
 * When a food is created it will get a randomly generated id 
 * and a food becomes
 * {'name':'name of the food', 'calories': 10, 'id': 'abcd1234' }
 */

describe('Food tests', () => {
    it('test runner works', () => {
        expect(1).toBe(1)
    })

    it('returns error for missing food name', async () => {

        const postResponse = await client.post('/api/food', {'calories': 10})

        expect(postResponse.code).toBe(400)
    })

    it('returns error for negative calories', async () => {

        const postResponse = await client.post('/api/food/', {'name':'pizza', 'calories': -10})

        expect(postResponse.code).toBe(400)
    })

    it('POST olt elemeket a GET-el hivott tomb tartalmazza', async () => {

        let hambi = {'name': 'hambi', 'calories':500}

        const postResponse = await client.post('/api/food', hambi)
        const hambiId = JSON.parse(postResponse.body).id

        const getResponse = await client.get('/api/food/' + hambiId)
        expect(getResponse.code).toBe(200)
        hambi.id = hambiId

        const getResponseBody = JSON.parse(getResponse.body)
        expect(getResponseBody).toEqual(hambi)

    })

    
    it('letrehozott elem GET el lekerheto', async () => {

        let gyros = {'name': 'gyros', 'calories':420}

        const postResponse = await client.post('/api/food', gyros)
        const gyrosId = JSON.parse(postResponse.body).id

        const getResponse = await client.get('/api/food/' + gyrosId)
        expect(getResponse.code).toBe(200)
        gyros.id = gyrosId

        const getResponseBody = JSON.parse(getResponse.body)
        expect(getResponseBody).toEqual(gyros)

    })

    it('[GET] 404 ervenytelen ID eseten', async () => {
        const getResponse = await client.get('/api/food/invalid')
        expect(getResponse.code).toBe(404)
    })

    it ('can update food', async () => {
        let gyros = {'name': 'gyros', 'calories': 420}

        const postResponse = await client.post('/api/food', gyros)
        const gyrosId = JSON.parse(postResponse.body).id
        gyros.id = gyrosId

        gyros.name = 'Gyors'
        gyros.calories = 650
        const putResponse = await client.put('/api/food/' + gyrosId, gyros)
        expect(putResponse.code).toBe(200)

        const getResponse = await client.get('/api/food/' + gyrosId)
        expect(getResponse.code).toEqual(putResponse.code)

        const putResponseBody = JSON.parse(putResponse.body)
        expect(putResponseBody).toEqual(gyros)
    })

    it('[PUT] 404 ervenytelen ID eseten', async () => {
        const putResponse = await client.get('/api/food/invalid')
        expect(putResponse.code).toBe(404)
    })

    it('can delete food', async () => {
        let gyros = {'name': 'gyros', 'calories': 420}
        const postResponse = await client.post('/api/food', gyros)
        gyros.id = JSON.parse(postResponse.body).id
        
        const deleteResponse = await client.delete('/api/food/' + gyros.id)
        expect(deleteResponse.code).toBe(204)

        const getResponse = await client.get('/api/food')
        expect(JSON.parse(getResponse.body)).toEqual(expect.not.arrayContaining([gyros]))
    })

    it('404 when deleting invalid id', async () => {
        
        const deleteResponse = await client.delete('/api/food/')
        expect(deleteResponse.code).toBe(404)

        const getResponse = await client.get('/api/food/invalid')
        expect(getResponse.code).toBe(deleteResponse.code)
    })

    
    it('[PUT] URL ID not equal BODY ID', async () => { // ez nemjó :C
        
        const postResponse = await client.post('api/food/', {'name':'salata','calories': 30})
        expect(postResponse.id).toBe(URL.id)

    })



    

}) 