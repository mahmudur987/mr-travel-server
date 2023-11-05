const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
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

module.exports = { travelType, userType };
