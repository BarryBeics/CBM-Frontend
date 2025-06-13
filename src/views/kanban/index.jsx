import React, { useEffect, useState } from "react";
import UserAvatar from "../../components/UserAvatar";
import formOptions from "../../config/formOptions";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  useTheme,
  Snackbar,
  Alert,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";
import { tokens } from "../../theme";
import { useSettings } from "../../context/SettingsProvider";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Header from "../../components/Header";
import AdminUserSelect from "../../components/AdminUserSelect";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const client = new GraphQLClient(graphqlEndpoint);

const READ_ALL_TASKS = `
  query {
    readAllTasks {
      id
    title
    status
    labels
    assignedTo
    department
    duration
    projectId
    }
  }
`;

const UPDATE_TASK_STATUS = `
  mutation UpdateTaskStatus($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      status
    }
  }
`;

const GET_SOP_PROJECT_IDS = `
  query {
    filterProjects(filter: { sop: true }) {
      id
    }
  }
`;

const KanbanBoard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { showSomedayMaybe, showComplete } = useSettings();
  const STATUS_COLUMNS = {
    inbox: "Inbox",
    nextAction: "Next Action",
    waitingFor: "Waiting For",
    scheduled: "Scheduled",
    ...(showSomedayMaybe && { somedayMaybe: "Someday/Maybe" }),
    ...(showComplete && { complete: "Complete" }),
  };

  const [selectedLabels, setSelectedLabels] = useState([]);
  const [lastMovedTask, setLastMovedTask] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'error', 'warning', 'info'
  });
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [tasksByStatus, setTasksByStatus] = useState({
    inbox: [],
    nextAction: [],
    waitingFor: [],
    scheduled: [],
    somedayMaybe: [],
    complete: [],
  });

  const updateTaskStatus = async (id, status) => {
    try {
      const input = { id, status };
      await client.request(UPDATE_TASK_STATUS, { input });
      setSnackbar({
        open: true,
        message: `Task updated to "${status}"`,
        severity: "success",
      });
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error.response || error.message
      );
      setSnackbar({
        open: true,
        message: "Failed to update task",
        severity: "error",
      });
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceTasks = [...tasksByStatus[sourceCol]];
    const destTasks = [...tasksByStatus[destCol]];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destCol;

    if (sourceCol === destCol) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setTasksByStatus({
        ...tasksByStatus,
        [sourceCol]: sourceTasks,
      });
    } else {
      destTasks.splice(destination.index, 0, movedTask);
      setTasksByStatus({
        ...tasksByStatus,
        [sourceCol]: sourceTasks,
        [destCol]: destTasks,
      });

      // persist to backend
      updateTaskStatus(movedTask.id, destCol);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // 1. Fetch SOP project IDs
        const sopData = await client.request(GET_SOP_PROJECT_IDS);
        const sopProjectIds = sopData.filterProjects.map((proj) => proj.id);

        // 2. Fetch all tasks
        const { readAllTasks } = await client.request(READ_ALL_TASKS);

        // 3. Filter out tasks related to SOPs
        const filteredTasks = readAllTasks.filter(
          (task) => !sopProjectIds.includes(task.projectId)
        );

        // 4. Group and set state as before
        const grouped = {
          inbox: [],
          nextAction: [],
          waitingFor: [],
          scheduled: [],
          somedayMaybe: [],
          complete: [],
        };
        const validStatuses = Object.keys(grouped);

        for (const task of filteredTasks) {
          const status = task.status;
          if (validStatuses.includes(status)) {
            grouped[status].push(task);
          } else {
            grouped.inbox.push(task);
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
        {/* Add Task */}
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
        {/* Pill Filter */}
        <Box
          mb={2}
          sx={{ width: "40%" }}
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          {formOptions.labelOptions.map((label) => {
            const isSelected = selectedLabels.includes(label.value);
            return (
              <Chip
                key={label.value}
                label={label.value}
                clickable
                onClick={() => {
                  setSelectedLabels((prev) =>
                    isSelected
                      ? prev.filter((l) => l !== label.value)
                      : [...prev, label.value]
                  );
                }}
                sx={{
                  backgroundColor: isSelected ? label.color : colors.grey[600],
                  color: isSelected ? "#333" : colors.grey[200],
                  border: isSelected
                    ? `2px solid ${label.color}`
                    : "1px solid #555",
                  fontWeight: isSelected ? "bold" : "normal",
                }}
              />
            );
          })}
        </Box>
        {/* User Filter */}
        <Box width="20%" mb={2}>
          <AdminUserSelect
            selectedAdmin={selectedAdminId}
            setFieldValue={(field, value) => setSelectedAdminId(value)}
          />
        </Box>
      </Box>

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          display="flex"
          gap={2}
          p={2}
          overflow="auto"
          backgroundColor={colors.grey[600]}
          borderRadius="5px"
          boxShadow={1}
          minHeight="60vh"
        >
          {Object.entries(STATUS_COLUMNS).map(([key, label]) => {
            const tasks = (tasksByStatus[key] || []).filter((task) => {
              const matchesLabels =
                selectedLabels.length === 0 ||
                task.labels?.some((label) => selectedLabels.includes(label));

              const matchesAdmin =
                !selectedAdminId || task.assignedTo === selectedAdminId;

              return matchesLabels && matchesAdmin;
            });

            return (
              <Droppable droppableId={key} key={key}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    flex={1}
                    minWidth={200}
                    maxWidth="100%"
                    backgroundColor={colors.grey[700]}
                    borderRadius="5px"
                    boxShadow={2}
                    p={2}
                    sx={{
                      flexBasis: 0,
                      border: `1px solid ${colors.grey[700]}`,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                      pb={1}
                      borderBottom={`2px solid ${colors.scalpelTeal[400]}`}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: colors.grey[200], fontWeight: 600 }}
                      >
                        {label} ({tasks.length})
                      </Typography>
                    </Box>

                    {tasks.map((task, index) => (
                      <Draggable
                        draggableId={task.id}
                        index={index}
                        key={task.id}
                      >
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              position: "relative",
                              p: 2,
                              mb: 2,
                              borderRadius: "8px",
                              backgroundColor: colors.grey[800],
                              color: colors.grey[100],
                              border: `1px solid ${colors.scalpelTeal[500]}`,
                              transition:
                                "transform 0.1s ease-in-out, box-shadow 0.2s",
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: `0 4px 20px ${colors.scalpelTeal[700]}`,
                              },
                            }}
                            elevation={3}
                          >
                            {/* Top-Right User Avatar */}
                            {task.assignedTo && (
                              <Box position="absolute" top={8} right={8}>
                                <UserAvatar
                                  fullName={task.assignedTo}
                                  size={28}
                                />
                              </Box>
                            )}

                            {/* Task Title & Checkbox (side-by-side) */}
                            <Box display="flex" alignItems="center" gap={1}>
                              {/* Checkbox on the left */}
                              {task.status !== "complete" && (
                                <Tooltip title="Mark as complete" arrow>
                                  <Checkbox
                                    icon={<CheckCircleOutlineIcon />}
                                    checkedIcon={<CheckCircleIcon />}
                                    sx={{
                                      color: colors.scalpelTeal[300],
                                      "&.Mui-checked": {
                                        color: colors.scalpelTeal[500],
                                      },
                                      p: 0.5,
                                    }}
                                    onChange={() => {
                                      const originalStatus = task.status;

                                      updateTaskStatus(task.id, "complete");

                                      setTasksByStatus((prev) => {
                                        const updated = { ...prev };
                                        updated[originalStatus] = updated[
                                          originalStatus
                                        ].filter((t) => t.id !== task.id);
                                        updated.complete = [
                                          ...updated.complete,
                                          { ...task, status: "complete" },
                                        ];
                                        return updated;
                                      });

                                      setLastMovedTask({
                                        ...task,
                                        status: originalStatus,
                                      });

                                      setSnackbar({
                                        open: true,
                                        message: "Task marked as complete",
                                        severity: "success",
                                      });
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {/* Clickable task title with tooltip */}
                              <Tooltip title="Edit Task" arrow>
                                <Typography
                                  fontWeight="bold"
                                  fontSize="0.95rem"
                                  sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                      color: colors.scalpelTeal[300],
                                    },
                                  }}
                                  onClick={() =>
                                    navigate(`/tasks/edit/${task.id}`, {
                                      state: {
                                        redirectPath: "/kanban",
                                      },
                                    })
                                  }
                                >
                                  {task.title}
                                </Typography>
                              </Tooltip>
                            </Box>
                            {/* Labels*/}
                            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                              {task.labels.map((labelText) => {
                                const labelDef = formOptions.labelOptions.find(
                                  (l) => l.value === labelText
                                );
                                return (
                                  <Chip
                                    key={labelText}
                                    label={labelText}
                                    size="small"
                                    style={{
                                      backgroundColor:
                                        labelDef?.color || "#ccc",
                                      color: "#333",
                                      fontWeight: "bold",
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          </Paper>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            );
          })}
        </Box>
      </DragDropContext>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          action={
            lastMovedTask ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  updateTaskStatus(lastMovedTask.id, lastMovedTask.status);
                  setTasksByStatus((prev) => {
                    const updated = { ...prev };
                    updated.complete = updated.complete.filter(
                      (t) => t.id !== lastMovedTask.id
                    );
                    updated[lastMovedTask.status] = [
                      ...updated[lastMovedTask.status],
                      lastMovedTask,
                    ];
                    return updated;
                  });
                  setSnackbar({ open: false, message: "", severity: "info" });
                  setLastMovedTask(null);
                }}
              >
                UNDO
              </Button>
            ) : null
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KanbanBoard;
