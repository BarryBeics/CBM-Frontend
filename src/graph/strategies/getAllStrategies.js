// Graph
import { gql, GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_ALL_STRATEGIES_QUERY = gql`
  query {
    getAllStrategies {
      BotInstanceName
      CreatedOn
      TakeProfitPercentage
      StopLossPercentage
      IncrementsATR
      ATRtollerance
      MovingAveMomentum
      TradeDuration
      LongSMADuration
      ShortSMADuration
      WINCounter
      LOSSCounter
      TIMEOUTGainCounter
      TIMEOUTLossCounter
      NetLossCounter
      AccountBalance
    }
  }
`;


export const getAllStrategies = async () => {
  try {
    const data = await client.request(GET_ALL_STRATEGIES_QUERY);
    return data.getAllStrategies;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    throw error;
  }
};
