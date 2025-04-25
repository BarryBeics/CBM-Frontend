// Graph
import { gql, GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_HISTORIC_PRICES_QUERY = gql`
  query getPriceData($symbol: String!, $limit: Int!) {
    getHistoricPrice(symbol: $symbol, limit: $limit) {
      Pair {
        Symbol
        Price
      }
      Timestamp
    }
  }
`;

export const getHistoricPrices = async (symbol, limit) => {
  try {
    const data = await client.request(GET_HISTORIC_PRICES_QUERY, {
      symbol,
      limit,
    });
    return data.getHistoricPrice || [];
  } catch (error) {
    console.error("Error fetching historic prices:", error);
    throw error;
  }
};

