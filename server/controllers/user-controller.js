const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  async fetchSingleUser({ user = null, params }, res) {
    try {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      });
      if (!foundUser) {
        return res.status(400).json({ message: 'User not found' });
      }
      res.json(foundUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async createUser({ body }, res) {
    try {
      const user = await User.create(body);
      if (!user) {
        return res.status(400).json({ message: 'Unable to create user' });
      }
      const token = signToken(user);
      res.json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async loginUser({ body }, res) {
    try {
      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const correctPassword = await user.isCorrectPassword(body.password);
      if (!correctPassword) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
      const token = signToken(user);
      res.json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async saveBook({ user, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async deleteBook({ user, params }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};