// Graph
import { gql, GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const READ_ACTIVITY_REPORTS_QUERY = gql`
  query {
    readAllActivityReports {
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
    const data = await client.request(READ_ACTIVITY_REPORTS_QUERY);
    return data.readAllActivityReports;
  } catch (error) {
    console.error("Error fetching activity reports:", error);
    throw error;
  }
};
