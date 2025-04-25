// Graph
import { gql, GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_BOT_NAMES = gql`
  query {
    getAllStrategies {
      BotInstanceName
    }
  }
`;

export const getBotNames = async () => {
  try {
    const res = await client.request(GET_BOT_NAMES);
    return res.getAllStrategies.map((s) => s.BotInstanceName);
  } catch (error) {
    console.error("Failed to fetch bot names", error);
    throw error;
  }
};
