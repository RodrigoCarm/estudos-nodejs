import http from 'node:http'

const serve = http.createServer(
    (req, res)=> {
        if (req.method === 'GET') {
            return res.end('HELLO WORD!')
        }
    }
).listen(8585, () => {
    console.log('Servidor rodando em http://localhost:8585');
})