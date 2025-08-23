import http from 'node:http'

const serve = http.createServer(
    (req, res)=> {
        if (req.method === 'GET') {
            return res.end('HEllo Word!')
        }

        if (req.method === 'POST' && req.url === '/arquivo') {
            let body = ''

            req.on('data', (chunk) => {
                body += chunk
            })

            req.on('end', () => {
                console.log(body)
                return res.end('Dados recebidos!')
            })
        }
    }
).listen(8585, () => {
    console.log('Servidor rodando em http://localhost:8585');
})