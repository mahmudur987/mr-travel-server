const events = require("../models/travelModel");
const users = require("../models/userModel");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");
const { travelType, userType } = require("./schema");
const TravelInputType = require("../args/TravelInputType");

// Define the mutation (if you need to create, update, or delete travel data)
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // add event
    addEvent: {
      type: travelType,
      args: {
        travelInput: { type: new GraphQLNonNull(TravelInputType) },
      },
      resolve(parent, args) {
        const data = args.travelInput;
        const newevent = new events(data);
        return newevent.save();
      },
    },
    deleteEvent: {
      type: travelType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, { id }) => {
        console.log(id);
        try {
          const result = await events.findByIdAndDelete(id);
          return result;
        } catch (error) {
          throw new Error("Failed to delete user");
        }
      },
    },

    // add user
    addUser: {
      type: userType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phoneNumber: { type: GraphQLNonNull(GraphQLString) },
        photoURL: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const alredyUser = await users.findOne({
          name: args.name,
          email: args.email,
        });

        if (alredyUser) {
          return alredyUser;
        }

        const newUser = new users(args);
        return newUser.save();
      },
    },
    // add member to event
    addMemberToEvent: {
      type: travelType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        memberId: { type: GraphQLNonNull(GraphQLID) },
        memberName: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { id, memberId, memberName }) => {
        try {
          const event = await events.findById(id);
          if (!event) {
            throw new Error("Event not found");
          }
          const alreadybooked = event.bookedmember.find(
            (x) => x.userId.toString() === memberId
          );

          if (alreadybooked) {
            return new Error("You alredy booked this Event");
          }
          event.bookedmember.push({ userId: memberId, userName: memberName });
          event.save();
          return event;
        } catch (err) {
          throw new Error(err.message);
        }
      },
    },
    // update user
    updateUser: {
      type: userType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        phoneNumber: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { id, phoneNumber, address }) => {
        try {
          // Find the user by ID
          const user = await users.findById(id);

          if (!user) {
            throw new Error("User not found");
          }

          // Update the phoneNumber and address fields if provided
          if (phoneNumber) {
            user.phoneNumber = phoneNumber;
          }

          if (address) {
            user.address = address;
          }
          await users.findByIdAndUpdate(id, { $set: user });
          console.log(user);

          return user;
        } catch (error) {
          throw new Error("Failed to update user");
        }
      },
    },
    // delete user
    deleteUser: {
      type: userType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, { id }) => {
        try {
          const user = await users.findById(id);

          if (!user) {
            throw new Error("User not found");
          }

          await users.findByIdAndRemove(id);
          console.log(user);

          return user;
        } catch (error) {
          throw new Error("Failed to update user");
        }
      },
    },
  },
});

module.exports = Mutation;
