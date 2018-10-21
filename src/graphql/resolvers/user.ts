import { IResolvers } from "graphql-tools";
import { User } from "../../entity/User";

const resolvers: IResolvers = {
  Query: {
    me(_, __, { req }) {
      if (!req.session.userId) {
        return null;
      }

      return User.findOne(req.session.userId);
    }
  }
};

export default resolvers;
