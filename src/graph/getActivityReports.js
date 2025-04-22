import { gql, GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_ACTIVITY_REPORTS_QUERY = gql`
  query {
    ActivityReports {
      Timestamp
      Qty
      TopAGain
      TopBGain
      TopCGain
    }
  }
`;

export const getActivityReports = async () => {
  try {
    const data = await client.request(GET_ACTIVITY_REPORTS_QUERY);
    return data.ActivityReports;
  } catch (error) {
    console.error("Error fetching activity reports:", error);
    throw error;
  }
};
