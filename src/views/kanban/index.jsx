import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";
import { tokens } from "../../theme";

const client = new GraphQLClient(graphqlEndpoint);

const GET_ALL_TASKS = `
  query {
    tasks {
      id
      title
      priority
      assignedTo
      status
    }
  }
`;

const STATUS_COLUMNS = {
  toDo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

const KanbanBoard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tasksByStatus, setTasksByStatus] = useState({
    toDo: [],
    inProgress: [],
    done: [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { tasks } = await client.request(GET_ALL_TASKS);
        const grouped = {
          toDo: [],
          inProgress: [],
          done: [],
        };
        for (const task of tasks) {
            const key = task.status;
            if (grouped[key]) {
                grouped[key].push(task);
            } else {
              grouped.toDo.push(task); // fallback
            }
          }
          
        setTasksByStatus(grouped);
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <Box
      display="flex"
      gap={2}
      p={2}
      overflow="auto"
      backgroundColor={colors.primary[400]}
      borderRadius="8px"
      boxShadow={1}
      minHeight="60vh"
    >
      {Object.entries(STATUS_COLUMNS).map(([key, label]) => (
        <Box key={key} minWidth="280px">
          <Typography
            variant="h6"
            sx={{ mb: 2, color: colors.greenAccent[400] }}
          >
            {label}
          </Typography>

          {tasksByStatus[key].map((task) => (
            <Paper
              key={task.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "8px",
                backgroundColor: colors.primary[300],
                color: colors.grey[100],
              }}
              elevation={2}
            >
              <Typography fontWeight="bold">{task.title}</Typography>
              <Typography variant="body2">
                👤 {task.assignedTo || "Unassigned"}
              </Typography>
              <Typography variant="body2">⚡ {task.priority}</Typography>
            </Paper>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default KanbanBoard;
