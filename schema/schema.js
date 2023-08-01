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
} = require("graphql");

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
    name: { type: GraphQLString },
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
        console.log(args);
        return events.findById(args.id);
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
        name: { type: GraphQLNonNull(GraphQLString) },
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
          console.log(alredyUser);

          return alredyUser;
        }

        const newUser = new users(args);
        return newUser.save();
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
