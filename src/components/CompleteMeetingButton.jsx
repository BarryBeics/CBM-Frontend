// CompleteMeetingButton.jsx
import React from "react";
import { Button } from "@mui/material";
import { GraphQLClient, gql } from "graphql-request";
import { graphqlEndpoint } from "../config";

const client = new GraphQLClient(graphqlEndpoint);

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
    }
  }
`;

const roundToNearest5 = (start, end) => {
  const diffMs = Math.abs(end - start);
  const minutes = Math.ceil(diffMs / (1000 * 60));
  return Math.ceil(minutes / 5) * 5;
};

const CompleteMeetingButton = ({ onComplete, setSnackbar }) => {
  const handleCompleteMeeting = async () => {
    const stored = localStorage.getItem("activeMeeting");
    if (!stored) return;

    const meeting = JSON.parse(stored);
    const endTime = new Date();
    const startTime = new Date(meeting.startTime);
    const duration = roundToNearest5(startTime, endTime);

    try {
      for (const user of meeting.participants) {
        await client.request(CREATE_TASK, {
          input: {
            title: `Meeting: ${meeting.topic || "Untitled"}`,
            description: `Meeting held at ${meeting.location} about ${meeting.topic || "general matters"}. Duration: ${duration} minutes.`,
            labels: ["Meeting"],
            assignedTo: user,
            duration: duration.toString(),
            status: "complete",
          },
        });
      }

      localStorage.removeItem("activeMeeting");
      setSnackbar({
        open: true,
        message: `Meeting completed. Duration: ${duration} minutes` ,
        severity: "success",
      });
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Failed to create tasks:", err);
      setSnackbar({
        open: true,
        message: "Failed to log meeting tasks",
        severity: "error",
      });
    }
  };

  return (
    <Button variant="contained" color="error" onClick={handleCompleteMeeting}>
      Complete Meeting
    </Button>
  );
};

export default CompleteMeetingButton;