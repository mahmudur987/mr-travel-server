const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const schema = require("./schema/schema");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
const data = require("./data.json");
const events = require("./models/travelModel");
// middlewere
app.use(cors());
app.use(express.json());

// mongodb
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  });

// console.log(data);

// GraphQl

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return "Hello world!";
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get("/", async (req, res) => {
  const result = await events.find({});

  res.send({ data: result.length, result });
});
app.post("/travel", async (req, res) => {
  console.log(data);
  const result = await events.insertMany(data);

  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
