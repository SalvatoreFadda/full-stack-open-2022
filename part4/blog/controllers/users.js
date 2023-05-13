const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    // Add checks for username and password length
    if (body.username === undefined || body.username.length < 3) {
        return response.status(400).json({ error: 'username must be at least 3 characters long' })
    }

    if (body.password === undefined || body.password.length < 3) {
        return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    // Check for unique username
    const existingUser = await User.findOne({ username: body.username })

    if (existingUser) {
        return response.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()
    response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  
    response.json(users.map(user => user.toJSON()))
  })


module.exports = usersRouter