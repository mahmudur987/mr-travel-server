const events = require("../models/travelModel");
const users = require("../models/userModel");
const travelInputType = require("../args/TravelInputType");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLID,
  GraphQLEnumType,
} = require("graphql");
const { ObjectId } = require("mongodb");

// Define the planingType
const planingType = new GraphQLObjectType({
  name: "Planing",
  fields: () => ({
    time: { type: GraphQLString },
    description: { type: GraphQLString },
    picture: { type: GraphQLString },
  }),
});

// Define the bookedMemberType
const bookedMemberType = new GraphQLObjectType({
  name: "BookedMember",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    userName: { type: GraphQLString },
  }),
});

// Define the destinationType
const destinationType = new GraphQLObjectType({
  name: "Destination",
  fields: () => ({
    country: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    district: { type: GraphQLString },
  }),
});

// Define the travelType
const travelType = new GraphQLObjectType({
  name: "Travel",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    pictures: { type: GraphQLList(GraphQLString) },
    destination: { type: destinationType },
    planing: { type: GraphQLList(planingType) },
    spots: { type: GraphQLList(GraphQLString) },
    maxMembers: { type: GraphQLInt },
    nonBookedSeats: { type: GraphQLInt },
    bookedmember: { type: GraphQLList(bookedMemberType) },
    description: { type: GraphQLString },
    price: { type: GraphQLString },
    publishDate: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    bestDeals: { type: GraphQLBoolean },
  }),
});

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    photoURL: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    address: { type: GraphQLString },
    password: { type: GraphQLString },
    joinDate: { type: GraphQLString },
    role: {
      type: new GraphQLEnumType({
        name: "Role",
        values: {
          admin: { value: "admin" },
          user: { value: "user" },
        },
      }),
    },
  }),
});
// Define the root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getEvents: {
      type: new GraphQLList(travelType),
      resolve(parent, args) {
        return events.find();
      },
    },
    getOneEvent: {
      type: travelType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return events.findById(args.id);
      },
    },
    getEventsbyBookingUserId: {
      type: new GraphQLList(travelType),
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, { id }) => {
        try {
          const eventsData = await events.find({
            bookedmember: { $elemMatch: { userId: id } },
          });

          return eventsData;
        } catch (error) {
          throw new Error("Error finding events data");
        }
      },
    },
    users: {
      type: new GraphQLList(userType),
      resolve(parent, args) {
        return users.find();
      },
    },
    user: {
      type: userType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return users.findOne(args);
      },
    },
  },
});

// Define the mutation (if you need to create, update, or delete travel data)
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addEvent: {
      type: travelType,
      args: {
        travelInput: { type: new GraphQLNonNull(travelInputType) },
      },
      resolve(parent, args) {
        const data = args.travelInput;
        const newevent = new events(data);
        return newevent.save();
      },
    },
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

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
