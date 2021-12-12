/*
▬▬▬.◙.▬▬▬
═▂▄▄▓▄▄▂
◢◤ █▀▀████▄▄▄▄▄▄◢◤
█▄ █ :) ██▀▀▀▀▀▀▀╬
◥█████◤
══╩══╩══
▬▬▬Tiago Freitas - © 2022 Copyright▬▬▬
*/

// Configurando as dependencias
require('dotenv/config')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const storege_dir = __dirname + '/data'

// Configurando o express
app.use(express.json())
app.use(express.urlencoded())


// Servir os arquivos desponiveis em {storege_dir}
app.use((req, res) => {
    try {
        let file = fs.readFileSync(storege_dir + req.url);
        res.end(file);
    } catch {
        res.status(404).send('file not found')
    };
});

// Configara a aplicação para observar a porta configurada ou a 1515
http.listen(process.env.PORT || 1515, function () {
    console.log("Server is online in: " + (process.env.PORT || 1515));
});