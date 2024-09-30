// imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Configurar o express para ler JSon
app.use(express.json())

// Models
const User = require('./models/user.js')

// *Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Hello World" })
})

// *Private Route
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id

    // checar se o usuário já está cadastrado
    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' })
    }
    res.status(200).json({ user })
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado' })
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()

    } catch(error) {
        res.status(400).json({ msg: "Token inválido"})
    }
}

// *Register User
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    // validações
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório' })
    }
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'a senha é obrigatória' })
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não são iguais' })
    }
    // verificar se o usuário já está cadastrado
    const userExists = await User.findOne({ email: email })
    if (userExists) {
        return res.status(422).json({ msg: 'email já cadastrado, por favor utilize outro email' })
    }

    // criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // criar usuário
    const user = new User({
        name,
        email,
        password: passwordHash
    })
    try {
        await user.save()
        res.status(201).json({ msg: 'Usuário cirado com sucesso' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Aconteceu um erro no servidor, tente novamente mais tarde"
        })
    }
})

// *Login User
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body
    // validações
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' })
    }

    // verificar se o usuário não existe
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(422).json({ msg: 'Usuário não encontrado' })
    }

    // verificar se as senhas são as mesmas
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida' })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )

        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token })
    } catch (err) {
        console.log(error)
        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde',
        })
    }
})

// Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS


mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.mz9xi84.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        app.listen(3000)
        console.log('Conectou ao banco de dados!')
    }).catch((err) => console.log(err))