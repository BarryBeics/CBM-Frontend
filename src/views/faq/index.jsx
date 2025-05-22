import { Box, Button, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is Scalpel Hound?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Scalpel Hound is a private, automated crypto trading system that will help you navigate the market with precision.
            It’s designed for people who want access to advanced trading strategies without the need to become an expert themselves.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Do I get ownership in Scalpel Hound?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            No. You’re purchasing early access to the platform. This is not an investment or equity offer.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How much does it cost to join?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The price for securing a seat in the Founders Circle will be shared once your application is considered.
            We keep it exclusive.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography color={colors.greenAccent[500]} variant="h5">
      Why does this cost more than other platforms?
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      You’re not buying a course or a signal group. You’re backing a real-time, full-time builder.
      <br /><br />
      This isn’t content. It’s commitment. There are no subscriptions, affiliate links, or commission kickbacks.
      <br /><br />
      You pay once. I trade. If I win, you win.
    </Typography>
  </AccordionDetails>
</Accordion>

<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography color={colors.greenAccent[500]} variant="h5">
      Is this running right now?
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
      The system is actively in development. It’s already pulling live market data and generating charts.
      <br /><br />
      The next step: building bots that comb historical data for high-probability setups, then executing those through live trading.
      <br /><br />
      You’re not late. You’re early.
    </Typography>
  </AccordionDetails>
</Accordion>


      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How do I connect my Binance account?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Once selected, you’ll receive a simple guide to connect your Binance API.
            This allows the platform to manage your trades — without ever having access to your funds.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* CTA Footer */}
      <Box mt={6} textAlign="center">
        <Typography variant="h5" gutterBottom>
          The table is being set. Will you have a seat?
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            backgroundColor: "#00FFFF", // Bright cyan
            color: "#000",
            "&:hover": {
              backgroundColor: "#00e0e0",
            },
          }}
        >
          Apply for a Seat
        </Button>
      </Box>
    </Box>
  );
};

export default FAQ;
