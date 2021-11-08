/*
▬▬▬.◙.▬▬▬
═▂▄▄▓▄▄▂
◢◤ █▀▀████▄▄▄▄▄▄◢◤
█▄ █ :) ██▀▀▀▀▀▀▀╬
◥█████◤
══╩══╩══
▬▬▬Tiago Freitas - © 2021 Copyright▬▬▬
*/

// Configurando as dependencias
require('dotenv/config')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const crypto = require('crypto')
const multer = require('multer');
var cors = require('cors')
const storege_dir = __dirname + '/data'

// Configurando o express
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// Cria as pastas para o funcionamento da aplicação
if (!fs.existsSync(storege_dir)){
    fs.mkdirSync(storege_dir);
}
if (!fs.existsSync('./tmp')){
    fs.mkdirSync('./tmp');
}

// Configurando Multer
const storege = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `tmp/`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

// Enviar arquivos para o storege
app.post('/upload', multer({ storage: storege }).array('file'), (req, res) => {
    if(crypto.createHash('md5').update(req.body.key).digest('hex') != process.env.KEY) { // Verifica a chave de acesso usando hash
        for(file of req.files){
            fs.unlink(file.path, () => {})
        }
        res.status(202).send('incorrect-key')
        return
    }

    for(file of req.files){ // Armazena os arquivos depois de verificar a chave
        var newPath = ''
        if(req.body.path == '0'){
            if(req.body.new_path == null) return
            if (!fs.existsSync(`${storege_dir}/${req.body.new_path}`)){
                fs.mkdirSync(`${storege_dir}/${req.body.new_path}`);
            }
            newPath = `${storege_dir}/${req.body.new_path}/${file.filename}`
        } else {
            newPath = `${storege_dir}/${req.body.path}/${file.filename}`
        }
        fs.rename(file.path, newPath, () => {})
    }
    res.status(202).send('success')
});

// Listar as pastas diponiveis em {storege_dir}
app.get('/list-paths', (req, res) => {
    fs.readdir(`${storege_dir}`, (err, paths) => {
        var paths_list = []
        for(ph of paths){
            if(fs.lstatSync(`${storege_dir}/${ph}`).isDirectory()){
                paths_list.push(ph)
            }
        }
        res.json(paths_list)
    })

})

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