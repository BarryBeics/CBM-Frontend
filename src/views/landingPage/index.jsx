import { Box, Button, Typography, useTheme } from "@mui/material";
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
            This isn’t a course, a dashboard, or a coach.
          </Typography>
          <Typography variant="body1" mb={3}>
            It’s a single fullstack developer — with a pation for trading, betting everything — to build a trading system that works.
            <br />
            The system is already pulling price data and charting. Now I’m building the bots and money management layer.
            <br /><br />
            Seats are limited. Entry is final.
          </Typography>
          <Button variant="contained" color="secondary" size="large" href="/register">
            Apply for a Seat
          </Button>
        </Section>
    
        <Section>
          <Typography variant="h4" gutterBottom>
            The Problem
          </Typography>
          <Typography variant="body1">
            The market is full of noise. Most are selling trading tools, coaching, or courses, and claim to be successful traders.
            If these coaches were really printing cash, I personaly dont believe they would be selling you their time.
            It's well known most traders lose money!
          </Typography>
        </Section>
    
        <Section>
          <Typography variant="h4" gutterBottom>
            The Offer
          </Typography>
          <Typography variant="body1">
            This is different.
            <br /><br />
            You’re not buying a course or learning a strategy.
            If you win in the ballot you will get a chance to add your API access to your Binance account — and I handle the rest!
            Working full time endlessly researching, testing, and refining the trading bots to adapt to the every changing market.
            <br /><br />
            This system will trade in a way no person could trade alone, it hasnesses the power and speed of the computer to work 24/7
            You're not a student. And your probably too busy to trade anyway. You're gaining early access to a trading system with teeth.
          </Typography>
        </Section>
    
        <Section>
          <Typography variant="h4" gutterBottom>
            The Commitment
          </Typography>
          <Typography variant="body1">
            This isn’t part-time. I’ve already poured countless hours into this over the last 4 years.
            Built in Go. Strict testing. Visual analytics. Real-time data. I'm not playing at this, creating this system is my passion, this maybe your chance to hope on aord and catch a ride.
            <br /><br />
            Now I'm building the bots to extract high-probability trades — using AI to refine everything.
            But not 3rd party AI in the hope if finds something, I have reseached and written every single function, no 3rd party libabries so that in 100% in control of the code.
            This is my full-time focus. I'm all in at I must work!
          </Typography>
        </Section>
    
        <Section>
          <Typography variant="h4" gutterBottom>
            Why I’m Opening It Up
          </Typography>
          <Typography variant="body1">
            If I had the capital, I wouldn't offer this.
            <br /><br />
            But time is money — and money buys me time to build this right.
            This is happening either way. The train is leaving the station.
            <br /><br />
            If you're sharp enough to see the asymmetry — you bring capital, I bring commitment — there's a seat with your name on it.
          </Typography>
        </Section>
    
        <Section>
          <Typography variant="h4" gutterBottom>
            The Tiers
          </Typography>
          <Typography variant="body1">
            <strong>Ballot Bypass (£8k–£10k)</strong><br />
            Immediate access. Rare. Only for those who truly believe in the project. 3 already taken.<br /><br />
    
            <strong>Premium Ballot (£2,500)</strong><br />
            This is the core tier — full access upon selection. Target: 20–40 supporters.<br /><br />
    
            <strong>Hobbyist Tier (£995)</strong><br />
            Lighter access, fewer updates, and slower data. Still part of the experiment — at a different pace.
          </Typography>
        </Section>
    
        <Section>
          <Typography variant="h4" gutterBottom>
            Why It’s Fair
          </Typography>
          <Typography variant="body1">
            I don’t take commissions. There are no subscriptions. I have no affiliates.
            <br /><br />
            Your funds stay in your account — disconnect anytime. I can’t withdraw, just execute trades.
            <br /><br />
            I’m not diversified. I’m not hedged. This is my full-time work, and it’s the only thing paying my way.
            <br /><br />
            If I win, you win. That’s it.
          </Typography>
        </Section>
    
        <Section>
          <Typography variant="h4" gutterBottom>
            Early Backers Say...
          </Typography>
          <Typography variant="body1" mb={2}>
            “I saw the potential and took the leap. Being a Founding Seat Holder feels like being part of something real.”  
            <br />— Alex R., London
          </Typography>
          <Typography variant="body1" mb={2}>
            “The transparency and commitment are unmatched. It's rare to find such integrity in this space.”  
            <br />— Jamie L., Berlin
          </Typography>
          <Typography variant="body1">
            “Even in its early stages, Scalpel Hound stands out. I'm excited to see where it goes.”  
            <br />— Priya S., New York
          </Typography>
        </Section>
    
        <Section>
          <Typography variant="h4" gutterBottom>
            The Table is Being Set
          </Typography>
          <Typography variant="body1" mb={3}>
            Will you have a seat?
          </Typography>
          <Button variant="contained" color="secondary" size="large" href="/register">
            Apply for a Seat
          </Button>
          <Typography variant="caption" display="block" mt={2}>
            Limited seats. No ads. No push. Just those who see the value.
          </Typography>
        </Section>
    
        <Box mt={8} textAlign="center">
          <Typography variant="body2">Barry Marples — Founder of Scalpel Hound Ltd</Typography>
          <Typography variant="caption" display="block" mt={2}>
            Information provided is not financial advice. Trading involves risk.
          </Typography>
        </Box>
      </Box>
    );
    
};

export default LandingPage;
