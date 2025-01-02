const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (req, res) => {
  try {
    //await User.deleteMany({});
    await User.collection.drop(); // Drops the collection and its indexes
    await Blog.deleteMany({});
    console.log('Database reset complete');
    res.status(204).end();
} catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).end();
}
})

module.exports = testingRouter