const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {

        me: async ( __ , ___ , context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('Please login.');
        },
    },

    Mutation: {
    
        login: async ( __ , { email, password }) => {

            const userData = await User.findOne({ email });
            if (!userData) {
                throw new AuthenticationError('Email unsuccessful, please login.');
            }
            const correctPw = await userData.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Password unsuccessful, please login.');
            }
            const token = signToken(userData);
            return { token, userData };
        },

        addUser: async ( __ , { username, email, password }) => {
            const userData = await User.create({ username, email, password });
            const token = signToken(userData);
            return { token, userData };
        },

        saveBook: async ( __ , { input }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );
            }
            throw new AuthenticationError('Please login.');
        },

        removeBook: async ( __ , { bookId }, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )
                return updateUser;
            }
            throw new AuthenticationError('Please login.');
        },
    },
};

module.exports = resolvers;