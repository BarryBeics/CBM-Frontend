import { Box, Button, Typography, useTheme, List, ListItem, ListItemText } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const LandingPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const Section = ({ children }) => (
    <Box my={6} p={4} backgroundColor={colors.grey[700]} borderRadius="5px">
      {children}
    </Box>
  );

  return (
    <Box m="20px">
      <Header
        title="SCALPEL HOUND LTD"
        subtitle="Taking cuts from the market with surgeon-like precision"
      />

      <Section>
        <Typography variant="h5" gutterBottom>
          This isn’t a course, a dashboard, or a coaching gig.
        </Typography>
        <Typography variant="body1" mb={3}>
          It’s a focused solo venture — a founder-led project in search of
          something real.
          <br />
          A trading system that adapts, improves, and trades with edge.
          <br />
          Built by a single full-stack developer with a passion for markets and
          code.
          <br />
          Already pulling live market data, running analytics, and charting
          insights.
          <br />
          Now entering the next phase: automated execution and risk management.
          <br />
          <br />
          Seats are limited. Entry is final.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          href="/register"
        >
          Apply for a Seat
        </Button>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Problem
        </Typography>
        <Typography variant="body1">
          The market is noisy. Most offerings are courses, newsletters, or
          coaching funnels. But if someone’s truly making money trading — why
          are they selling you access?
          <br />
          This isn’t that.
          <br />
          Scalpel Hound is not about theory. It's about action.
          <br />
          No promises — just transparency, logic, and results that speak for
          themselves.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Offer
        </Typography>
        <Typography variant="body1">
          This is different.
          <br />
          <br />
          You’re not buying a course or learning a strategy. If you win in the
          ballot you will get a chance to add your API access to your Binance
          account — and the system handles the rest!
          <br />
          The system does the rest — scanning markets 24/7, identifying
          high-probability trades, and executing with no emotion or distraction.
          <br />
          <br />
          This system will trade in a way no person could trade alone, it
          hasnesses the power and speed of the computer to work 24/7 You're not
          a student. And your probably too busy to trade anyway. You're gaining
          early access to a trading system with teeth.
          <br />
          You’re not learning to trade. You’re accessing a system designed to do
          it better. All custom-built: Go backend No 3rd-party black boxes Tight
          control Real-time analytics Risk-first design
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Commitment
        </Typography>
        <Typography variant="body1">
          This isn’t a side hustle.
          <br />
          Scalpel Hound has been in development for 4+ years — after hours,
          weekends, holidays.
          <br />
          <br />
          It’s my passion.
          <br />
          Built from scratch. Powered by data. Refined with AI. Protected by
          design.
          <br />
          I’m not playing at this. I’m building it to win.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          Why I’m Opening It Up
        </Typography>
        <Typography variant="body1">
        If I had the capital, I’d keep this closed.
          <br />
          <br />
          But time is money — and paid pack members buys me time to build this right. 
          <br />
          This is live and progressing either way. The train is leaving the station.
          <br />
          <br />
          If you're sharp enough to see the asymmetry — you bring capital, I
          bring commitment — there's a seat with your name on it.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Tiers
        </Typography>
        <Typography variant="body1">
          Details coming soon
        </Typography>
      </Section>

      <Section>
  <Typography variant="h4" gutterBottom>
    Why It’s Fair
  </Typography>

  <List>
  {[
    "No commissions",
    "No subscriptions",
    "No affiliate deals",
    "I can’t touch your funds — only trade on your behalf",
    "Disconnect at any time",
    "You control your account",
    "I only win if you win.",
  ].map((item) => (
    <ListItem key={item} disableGutters dense>
      <ListItemText primary={item} />
    </ListItem>
  ))}
</List>

</Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          Early Backers Say...
        </Typography>
        <Typography variant="body1" mb={2}>
          “I saw the potential and took the leap. Being a Founding Seat Holder
          feels like being part of something real.”
          <br />— Alex R., London
        </Typography>
        <Typography variant="body1" mb={2}>
          “The transparency and commitment are unmatched. It's rare to find such
          integrity in this space.”
          <br />— Jamie L., Chester
        </Typography>
        <Typography variant="body1">
          “Even in its early stages, Scalpel Hound stands out. I'm excited to
          see where it goes.”
          <br />— Priya S., Madrid
        </Typography>
      </Section>

      <Section>
        <Typography variant="h4" gutterBottom>
          The Table is Being Set
        </Typography>
        <Typography variant="body1" mb={3}>
          Will you have a seat?
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          href="/register"
        >
          Apply for a Seat
        </Button>
        <Typography variant="caption" display="block" mt={2}>
          Limited seats. No ads. No push. Just those who see the value.
        </Typography>
      </Section>

      <Box mt={8} textAlign="center">
        <Typography variant="body2">
          Barry Marples — Founder of Scalpel Hound Ltd
        </Typography>
        <Typography variant="caption" display="block" mt={2}>
          Information provided is not financial advice. Trading involves risk.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
