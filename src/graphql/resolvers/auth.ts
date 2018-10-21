import * as bcrypt from "bcryptjs";
import { IResolvers } from "graphql-tools";
import { AuthenticationError } from "apollo-server-express";

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
    },
    async login(_, { email, password }, { req }) {
      const errorMessage = "Wrong email or password";

      try {
        await userValidation.validate({ email, password });

        const user = await User.findOne({ where: { email } });
        if (!user) throw new AuthenticationError(errorMessage);

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new AuthenticationError(errorMessage);

        req.session.userId = user.id;
        return user;
      } catch (err) {
        return err;
      }
    }
  }
};

export default resolvers;
