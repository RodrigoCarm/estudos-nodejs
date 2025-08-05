import http from 'node:http'

const users = [
        {
            user_id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com'
        }, {
            user_id: 2,
            name: 'Jane Snow',
            email: 'jane.snow@example.com'
        }, {
            user_id: 3,
            name: 'John Puth',
            email: 'john.puth@example.com'
        }
    ]

const server = http.createServer((req, res)=> {
    const {method, url, body} = req

    if(method === 'GET' && url === '/users'){
        return res.end(JSON.stringify(users))
    }

    if(method === 'POST' && url === '/users'){
        //VALIDANDO O BODY
        console.log('OLHA O BODY --> ', body)
        if (!body) {
            return res.end(JSON.stringify({ error: 'Body is required' }))
        }
        
        if(!body.name || !body.email){
            return res.end(JSON.stringify({error: 'Name and email are required'}))
        }

        const { name, email } = body

        //VERIFICANDO O PRÓXIMO ID
        const lastIdUser = users[users.length - 1]
        users.push({
            user_id: lastIdUser.user_id + 1,
            name: name,
            email: email
        })

        return res.end(JSON.stringify(users))
    }

    return res.end('Hello World')
})

server.listen(3333)
