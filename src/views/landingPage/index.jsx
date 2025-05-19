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
        subtitle="Most platforms sell you the dream. I’m building the machine."
      />

      <Section>
        <Typography variant="h5" gutterBottom>
          This isn’t a course, a dashboard, or a coach.
        </Typography>
        <Typography variant="body1" mb={3}>
          It’s a single developer — betting everything — to build a trading system that works.
          Seats are limited. Entry is final.
        </Typography>
        <Button variant="contained" color="success" size="large">
          Join the Ballot
        </Button>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Problem
        </Typography>
        <Typography variant="body1">
          The market is full of noise. Everyone’s selling trading tools, coaching, or courses.
          Most traders lose money.
          If these coaches were really printing cash, they wouldn’t be selling you their time.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Offer
        </Typography>
        <Typography variant="body1">
          This is different.
          <br /><br />
          I’m not selling education. You won’t be placing trades. You don’t need to learn charts or strategies.
          You provide access via a secure API key. I do the rest — research, testing, strategy development, and live trading.
          <br /><br />
          You’re not a trader. You’re early access to an experiment with teeth.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Commitment
        </Typography>
        <Typography variant="body1">
          I’ve already put in thousands of hours.
          This system is built with an idiomatic Go backend, strict testing, visual analytics, and a strategy that adapts with data.
          <br /><br />
          I’m not part-time. I’m not guessing. This is my full-time focus, and it either works or I go broke.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Seat
        </Typography>
        <Typography variant="body1">
          Only 40 seats exist. Once filled, it closes.
          <br /><br />
          You’re not buying shares. You’re not guaranteed returns.
          You’re buying access — to a platform that, if it works, you won’t be able to buy into again.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          Why It’s Fair
        </Typography>
        <Typography variant="body1">
          If I fail, you lose access.
          If I succeed, your seat is your reward.
          <br /><br />
          I don’t touch your money — you control your Binance account. I just trade via secure API.
          You can withdraw whenever you like. I’m incentivised only to win.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Table is Being Set
        </Typography>
        <Typography variant="body1" mb={3}>
          Will you have a seat?
        </Typography>
        <Button variant="contained" color="success" size="large">
          Apply for the Ballot
        </Button>
        <Typography variant="caption" display="block" mt={2}>
          Limited places. No ads. No public push. Just those who see the value.
        </Typography>
      </Section>

      <Box mt={8} textAlign="center">
        <Typography variant="body2">BArry Marples — Founder of Scalpel Hound Ltd</Typography>
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
