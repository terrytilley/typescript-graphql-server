import "dotenv/config";
import "reflect-metadata";

import * as express from "express";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";

import redis from "./redis";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { redisSessionPrefix } from "./constants";

const RedisStore = connectRedis(session as any);

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
      name: "sid",
      secret: process.env.SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
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
