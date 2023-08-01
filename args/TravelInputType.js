const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");

// Define the GraphQL input type for destination
const DestinationInputType = new GraphQLInputObjectType({
  name: "DestinationInput",
  fields: () => ({
    country: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    district: { type: GraphQLString },
  }),
});

// Define the GraphQL input type for planing
const PlaningInputType = new GraphQLInputObjectType({
  name: "PlaningInput",
  fields: () => ({
    time: { type: GraphQLString },
    description: { type: GraphQLString },
    picture: { type: GraphQLString },
  }),
});

// Define the GraphQL input type for bookedmember
const BookedMemberInputType = new GraphQLInputObjectType({
  name: "BookedMemberInput",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

// Define the main GraphQL input type for the travel data
const TravelInputType = new GraphQLInputObjectType({
  name: "TravelInput",
  fields: () => ({
    name: { type: GraphQLString },
    pictures: { type: GraphQLList(GraphQLString) },
    destination: { type: DestinationInputType },
    planing: { type: GraphQLList(PlaningInputType) },
    spots: { type: GraphQLList(GraphQLString) },
    maxMembers: { type: GraphQLInt },
    nonBookedSeats: { type: GraphQLInt },
    bookedmember: { type: GraphQLList(BookedMemberInputType) },
    description: { type: GraphQLString },
    price: { type: GraphQLString },
    publishDate: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    bestDeals: { type: GraphQLBoolean },
  }),
});

module.exports = TravelInputType;
