const express = require('express')
const session = require('express-session')

const port = 3000
var path = require('path')
const app = express()

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('viewa', path.join(__dirname, '/viewa'))

app.listen(port, () => {
    console.log(`Servidor rodando no endereço https://localhost:${port}`)
})