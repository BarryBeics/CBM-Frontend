import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";
import { tokens } from "../../theme";
import Header from "../../components/Header"; // Assuming you use this elsewhere


const client = new GraphQLClient(graphqlEndpoint);

const GET_ALL_TASKS = `
  query {
    allTasks {
      id
      title
      priority
      assignedTo
      status
    }
  }
`;


const STATUS_COLUMNS = {
  inbox: "Inbox",
  nextAction: "Next Action",
  waitingFor: "Waiting For",
  scheduled: "Scheduled",
  somedayMaybe: "Someday/Maybe",
  complete: "Complete",
};


const KanbanBoard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [tasksByStatus, setTasksByStatus] = useState({
    inbox: [],
    nextAction: [],
    waitingFor: [],
    scheduled: [],
    somedayMaybe: [],
    complete: [],
  });
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { allTasks } = await client.request(GET_ALL_TASKS);
        const grouped = {
          inbox: [],
          nextAction: [],
          waitingFor: [],
          scheduled: [],
          somedayMaybe: [],
          complete: [],
        };
        const validStatuses = Object.keys(grouped);

        for (const task of allTasks) {
          let key = task.status;

          // Map legacy statuses to GTD
          if (key === "todo") key = "inbox";
          if (key === "inProgress") key = "nextAction";

          if (validStatuses.includes(key)) {
            grouped[key].push(task);
          } else {
            grouped.inbox.push(task); // fallback
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
    <Box m="20px">
      {/* Page Header and +Task Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="KANBAN" subtitle="View and organise tasks" />
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            navigate("/createTask", {
              state: { redirectPath: "/kanban" },
            })
          }
        >
          + Task
        </Button>
      </Box>

      {/* Kanban Columns */}
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
        {Object.entries(STATUS_COLUMNS).map(([key, label]) => {
          const tasks = tasksByStatus[key] || [];
          return (
            <Box
              key={key}
              minWidth="300px"
              flexShrink={0}
              backgroundColor={colors.primary[500]}
              borderRadius="8px"
              boxShadow={2}
              p={2}
              sx={{
                border: `1px solid ${colors.grey[700]}`,
              }}
            >
              {/* Column Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                pb={1}
                borderBottom={`2px solid ${colors.greenAccent[400]}`}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.greenAccent[400],
                    fontWeight: 600,
                  }}
                >
                  {label} ({tasks.length})
                </Typography>
              </Box>

              {/* Task Cards */}
              {tasks.map((task) => (
                <Paper
                  key={task.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: "8px",
                    backgroundColor: colors.primary[300],
                    color: colors.grey[100],
                    border: `1px solid ${colors.grey[600]}`,
                    transition: "transform 0.1s ease-in-out, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: `0 4px 20px ${colors.blueAccent[700]}`,
                    },
                  }}
                  elevation={3}
                >
                  <Typography
                    fontWeight="bold"
                    fontSize="0.95rem"
                    sx={{ mb: 0.5 }}
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.grey[300], mb: 0.5 }}
                  >
                    👤 {task.assignedTo || "Unassigned"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        task.priority === "high"
                          ? colors.redAccent[400]
                          : task.priority === "medium"
                          ? colors.yellowAccent[400]
                          : colors.greenAccent[400],
                      fontWeight: 500,
                    }}
                  >
                    ⚡{" "}
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </Typography>
                </Paper>
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default KanbanBoard;