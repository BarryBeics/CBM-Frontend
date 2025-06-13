// Graph
import { gql, GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_ALL_STRATEGIES_QUERY = gql`
  query {
    readAllStrategies {
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


export const readAllStrategies = async () => {
  try {
    const data = await client.request(GET_ALL_STRATEGIES_QUERY);
    return data.readAllStrategies;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    throw error;
  }
};
