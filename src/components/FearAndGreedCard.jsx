import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import { tokens } from "../theme";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import { graphqlEndpoint } from "../config";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient(graphqlEndpoint);

const classificationColor = {
  ExtremeFear: "error",
  Fear: "warning",
  Neutral: "default",
  Greed: "success",
  ExtremeGreed: "primary",
};

const classificationIcon = {
  ExtremeFear: <SentimentDissatisfiedIcon />,
  Fear: <SentimentDissatisfiedIcon />,
  Neutral: <SentimentNeutralIcon />,
  Greed: <SentimentSatisfiedAltIcon />,
  ExtremeGreed: <SentimentSatisfiedAltIcon />,
};

const FearAndGreedCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const colors = tokens("dark"); // or useTheme() if wrapped

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = gql`
          query readFearAndGreedIndex {
            readFearAndGreedIndex(limit: 1) {
              Timestamp
              Value
              ValueClassification
            }
          }
        `;
        const res = await client.request(query);
        setData(res.readFearAndGreedIndex[0]);
      } catch (err) {
        console.error("Failed to fetch index:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const updatedAt = data?.Timestamp
    ? new Date(data.Timestamp * 1000).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  const value = parseInt(data?.Value ?? "0");
  const label = data?.ValueClassification ?? "Unknown";

  return (
    <Box
      width="100%"
      p={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor={colors.grey[800]}
      borderRadius="5px"
    >
      <Typography variant="h6" color={colors.grey[100]} gutterBottom>
        Fear & Greed Index
      </Typography>
      <Typography variant="h3" color={colors.scalpelTeal[400]}>
        {value}
      </Typography>
      <Chip
        icon={classificationIcon[label] ?? null}
        label={label}
        color={classificationColor[label] ?? "default"}
        sx={{ mt: 1 }}
      />
      <Typography variant="caption" color={colors.grey[400]} sx={{ mt: 1 }}>
        Last Updated: {updatedAt}
      </Typography>
    </Box>
  );
};

export default FearAndGreedCard;
