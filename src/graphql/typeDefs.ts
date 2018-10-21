import * as path from "path";
import { gql } from "apollo-server-express";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";

const typesArray = fileLoader(path.join(__dirname, "./types"));

export default gql`
  ${mergeTypes(typesArray)}
`;
