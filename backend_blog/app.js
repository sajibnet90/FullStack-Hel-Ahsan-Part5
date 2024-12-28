//blogListApp/backend_blog/app.js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

// ##########-------------- Database Connention ----------------------###############
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

logger.info('connecting to..', config.MONGODB_URI)
//info('message')
// error('error message')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB 👍')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })
// ------------------------------------------------------------------------------

app.use(cors())
app.use(express.static('dist'))//serving the static frontend build
app.use(express.json())
app.use(middleware.requestLogger)


//######### routes..#################
app.use(middleware.tokenExtractor); // Register the tokenExtractor middleware before all routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app