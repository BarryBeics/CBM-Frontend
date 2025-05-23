// components/TableActions.jsx
import { Box, Button, Tooltip } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const TableActions = ({ onEdit, onDelete, onCreateTask, hideCreate = false }) => (
  <Box display="flex" gap="10px" m="10px auto">
    <Tooltip title="Edit">
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<EditIcon />}
        onClick={onEdit}
      >
      </Button>
    </Tooltip>

    <Tooltip title="Delete">
      <Button
        variant="contained"
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={onDelete}
      >
      </Button>
    </Tooltip>

    {!hideCreate && (
      <Tooltip title="Create Task">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<AddIcon />}
          onClick={onCreateTask}
        >
            Task
        </Button>
      </Tooltip>
    )}
  </Box>
);

export default TableActions;
