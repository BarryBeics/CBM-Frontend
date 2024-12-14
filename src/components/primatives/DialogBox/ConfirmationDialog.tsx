import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Button } from '@fluentui/react-components';

interface ConfirmationDialogProps {
    itemTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ itemTitle, onConfirm, onCancel }) => {
    return (
        <Dialog open>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Delete Item</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete the item "{itemTitle}"? This action cannot be undone.
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button appearance="primary" onClick={onConfirm}>
                            Confirm
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default ConfirmationDialog;