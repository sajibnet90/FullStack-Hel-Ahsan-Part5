//this script is used to seed the database with some sample data
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Blog = require('./models/blog');
const User = require('./models/user');
const config = require('./utils/config');
const logger = require('./utils/logger');

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB');

    // Cleanup existing data
    await Blog.deleteMany({});
    await User.deleteMany({});
    logger.info('Cleared existing blogs and users');

    // Create sample users
    const passwordHash1 = await bcrypt.hash('ahsan', 10);
    const user1 = new User({
      username: 'ele',
      name: 'User ele',
      passwordHash: passwordHash1,
    });

    const passwordHash2 = await bcrypt.hash('ahsan', 10);
    const user2 = new User({
      username: 'ebraam',
      name: 'User Ebraam',
      passwordHash: passwordHash2,
    });

    const savedUser1 = await user1.save();
    const savedUser2 = await user2.save();
    logger.info('Created sample users');

    // Create sample blogs
    const blog1 = new Blog({
      title: 'Blog One',
      author: 'Author One',
      url: 'http://example.com/blog1',
      likes: 1,
      user: savedUser1._id,
    });

    const blog2 = new Blog({
      title: 'Blog Two',
      author: 'Author Two',
      url: 'http://example.com/blog2',
      likes: 2,
      user: savedUser1._id,
    });

    const blog3 = new Blog({
      title: 'Blog Three',
      author: 'Author Three',
      url: 'http://example.com/blog3',
      likes: 3,
      user: savedUser2._id,
    });

    const savedBlog1 = await blog1.save();
    const savedBlog2 = await blog2.save();
    const savedBlog3 = await blog3.save();
    logger.info('Created sample blogs');

    // Update users with blog references
    savedUser1.blogs = [savedBlog1._id, savedBlog2._id];
    savedUser2.blogs = [savedBlog3._id];
    await savedUser1.save();
    await savedUser2.save();
    logger.info('Updated users with blog references');

    mongoose.connection.close();
    logger.info('Database seeding completed');
  } catch (error) {
    logger.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();