const { GraphQLServer, PubSub } = require("graphql-yoga");
const messages = [];

const typeDefs = `
type Query {
    messages : [Message!]
}

type Message {
   id: ID!
    user : String!
    content : String!
    created_at : String!
}

type Mutation {
    postMessage(user : String! , content: String!, created_at : String! ): ID!
}

type Subscription {
    messages : [Message]
}
`;

const subscribers = [];

const onMessagesUpdate = (fn) => subscribers.push(fn);

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { user, content,created_at }) => {
      const id = messages.length + 1;
      messages.push({
        id,
        user,
        content,
        created_at
      });
      subscribers.forEach((fn) => fn());
      return {
        id,
      };
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = "thread_channel";
        onMessagesUpdate(() => pubsub.publish(channel, { messages }));
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const pubsub = new PubSub();

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.start(({ port }) => console.log(`server started on ${port}`));
