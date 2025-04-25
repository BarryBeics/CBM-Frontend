// Graph
import { gql, GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const CREATE_STRATEGY_MUTATION = gql`
  mutation createStrategy(
    $BotInstanceName: String!
    $TradeDuration: Int!
    $IncrementsATR: Int!
    $LongSMADuration: Int!
    $ShortSMADuration: Int!
    $WINCounter: Int!
    $LOSSCounter: Int!
    $TIMEOUTGainCounter: Int!
    $TIMEOUTLossCounter: Int!
    $NetGainCounter: Int!
    $NetLossCounter: Int!
    $AccountBalance: Float!
    $MovingAveMomentum: Float!
    $TakeProfitPercentage: Float!
    $StopLossPercentage: Float!
    $ATRtollerance: Float!
    $FeesTotal: Float!
    $Tested: Boolean!
    $Owner: String!
    $CreatedOn: Int!
  ) {
    createStrategy(
      input: {
        BotInstanceName: $BotInstanceName
        TradeDuration: $TradeDuration
        IncrementsATR: $IncrementsATR
        LongSMADuration: $LongSMADuration
        ShortSMADuration: $ShortSMADuration
        WINCounter: $WINCounter
        LOSSCounter: $LOSSCounter
        TIMEOUTGainCounter: $TIMEOUTGainCounter
        TIMEOUTLossCounter: $TIMEOUTLossCounter
        NetGainCounter: $NetGainCounter
        NetLossCounter: $NetLossCounter
        AccountBalance: $AccountBalance
        MovingAveMomentum: $MovingAveMomentum
        TakeProfitPercentage: $TakeProfitPercentage
        StopLossPercentage: $StopLossPercentage
        ATRtollerance: $ATRtollerance
        FeesTotal: $FeesTotal
        Tested: $Tested
        Owner: $Owner
        CreatedOn: $CreatedOn
      }
    ) {
      BotInstanceName
    }
  }
`;

export const createStrategy = async (variables) => {
  try {
    const data = await client.request(CREATE_STRATEGY_MUTATION, variables);
    return data;
  } catch (error) {
    console.error("Error creating strategy:", error);
    throw error;
  }
};
