
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { ConfigJson } from './config.service.js';

dotenv.config();
const app = express();
app.use(express.json());                          
app.use(express.urlencoded({ extended: true }));
const config = new ConfigJson();

function get_dados_env(){
    return {
        APP_ID: process.env.APP_ID,
        URI_REDIRECT: process.env.URI_REDIRECT,
        REDIRECT_URI: process.env.REDIRECT_URI,
        CODE: process.env.CODE,
        SECRET_KEY: process.env.SECRET_KEY,
    }
}


app.post('/acess_token', async(req, res) => {

    const dados_env = get_dados_env()
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: dados_env.APP_ID,
        client_secret: dados_env.SECRET_KEY,
        code: dados_env.CODE,
        redirect_uri: dados_env.URI_REDIRECT,
      });
      
    try{ 
        const response = await axios.post(
            'https://api.mercadolibre.com/oauth/token',
            body.toString(),
            {
                headers: {
                accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );

        config.save_config({
            access_token: response.data.access_token,
            user_id: response.data.user_id,
            refresh_token: response.data.refresh_token
        })

        return res.json({
            message: 'Access token salvo!',
            data: response.data
        });
    }
    catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                erro: 'Falhou ao trocar code por token',
                detalhe: err.response.data
            });
        }
    }
})


app.post('/acess_token/refresh_token', async(req, res) => {
    
    const dados_env = get_dados_env()
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: dados_env.APP_ID,
        client_secret: dados_env.SECRET_KEY,
        refresh_token: dados_env.CODE,
      });

    try {
        const response = await axios.post(
            'https://api.mercadolibre.com/oauth/token',
            'grant_type=refresh_token&client_id=$APP_ID&client_secret=$SECRET_KEY&refresh_token=$REFRESH_TOKEN',
            {
              headers: {
                'accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              }
            }
        );

        return res.json({
            message: 'Access token atualizado!',
            data: response.data
        });
    }
    catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({
                erro: 'Falhou ao trocar code por token',
                detalhe: err.response.data
            });
        }
    }
})  


app.get('/code', async(req, res) => {
    const url_auth = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${process.env.APP_ID}&redirect_uri=${process.env.URI_REDIRECT}`
    
    console.log('OLHA A URL --> ', url_auth)
    const response = await axios.get(url_auth)
    return res.json({
        message: 'URL de autenticação gerada!',
        data: response.url_auth
    });
})

app.listen(process.env.PORT_APP, () => {
    console.log(`Server is running on port ${process.env.PORT_APP}`)
})
