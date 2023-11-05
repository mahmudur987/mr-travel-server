const events = require("../models/travelModel");
const users = require("../models/userModel");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");
const { travelType, userType } = require("./schema");

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

module.exports = RootQuery;
