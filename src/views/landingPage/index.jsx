import { Box, Button, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const LandingPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const Section = ({ children }) => (
    <Box my={6} p={4} backgroundColor={colors.primary[400]} borderRadius="8px">
      {children}
    </Box>
  );

  return (
    <Box m="20px">
      <Header
        title="SCALPEL HOUND"
        subtitle="Taking cuts from the market with surgeon-like precision."
      />

      <Section>
        <Typography variant="h5" mb={2}>
          Private crypto intelligence platform.
        </Typography>
        <Typography variant="body1" mb={3}>
          Lifetime membership access now open to Founders’ Club applicants.
        </Typography>
        <Button variant="contained" color="success" size="large">
          Register for Ballot
        </Button>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          About Scalpel Hound
        </Typography>
        <Typography variant="body1" mb={3}>
          Built by a trader — not a salesman. Born from years of coding, trading, and fighting the markets firsthand. Scalpel Hound is precision-first: scanning the crypto markets for opportunities no human — or typical bot — could catch.
        </Typography>
        <Button variant="outlined" color="success">
          Register for Ballot
        </Button>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          Why Join Early?
        </Typography>
        <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
          <li>Private access only — no public sales, no mass subscriptions.</li>
          <li>Lifetime membership — no monthly fees.</li>
          <li>Serious trading infrastructure — no courses, no hype.</li>
        </ul>
        <Typography variant="body2" mb={2}>
          Once the ballot closes, membership will be locked.
        </Typography>
        <Button variant="contained" color="success">
          Register for Ballot
        </Button>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          See for Yourself
        </Typography>
        <Typography variant="body1" mb={3}>
          View real, live charts and system analytics. Get a feel for the precision Scalpel Hound brings — and imagine what the full system unlocks.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button variant="contained" color="primary">
            Explore Platform
          </Button>
          <Button variant="outlined" color="success">
            Register for Ballot
          </Button>
        </Box>
        <Typography variant="caption" display="block" mt={2}>
          Premium features are gated — early members will unlock full access.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          How It Works
        </Typography>
        <ol style={{ paddingLeft: 20 }}>
          <li>Register your interest by joining the ballot.</li>
          <li>Selected members will be invited to secure lifetime access.</li>
          <li>Once the Founders’ Club is full, no new memberships will be offered.</li>
        </ol>
        <Typography variant="body2" my={2}>
          No upsells. No ongoing fees. No nonsense.
        </Typography>
        <Button variant="contained" color="success">
          Register for Ballot
        </Button>
      </Section>

      <Box mt={8} textAlign="center">
        <Typography variant="body2">Your Name — Founder of Scalpel Hound</Typography>
        <Typography variant="body2" color="primary">
          your@email.com
        </Typography>
        <Typography variant="caption" display="block" mt={2}>
          Information provided is not financial advice. Trading involves risk.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
