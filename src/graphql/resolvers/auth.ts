import { IResolvers } from "graphql-tools";

import { User } from "../../entity/User";
import userValidation from "../../validation/user";

const resolvers: IResolvers = {
  Mutation: {
    async register(_, { email, password }) {
      try {
        await userValidation.validate({ email, password });

        const userExists = await User.findOne({
          where: { email },
          select: ["id"]
        });

        if (userExists) {
          throw new Error("User already exists");
        }

        return await User.create({ email, password }).save();
      } catch (err) {
        return err;
      }
    }
  }
};

export default resolvers;
