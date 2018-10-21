import "dotenv/config";
import "reflect-metadata";

import * as express from "express";
import * as session from "express-session";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

const initServer = async () => {
  await createConnection();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }: any) => ({ req, res })
  });

  const port = process.env.PORT as any;
  const host = process.env.DB_HOST as any;
  const app = express();

  app.use(
    session({
      secret: process.env.SECRET as string,
      resave: false,
      saveUninitialized: false
    })
  );

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_HOST as string
    }
  });

  app.listen({ port }, () =>
    console.log(
      `🚀 Server ready at http://${host}:${port}${server.graphqlPath}`
    )
  );
};

initServer();
