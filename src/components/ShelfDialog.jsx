import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function ShelfDialog({
    open,
    onClose,
    onConfirm,
    initialName = "",
    mode = "add", // "add" | "edit"
}) {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        if (open) {
            setName(initialName || "");
        }
    }, [open, initialName]);

    const handleSubmit = () => {
        const trimmed = name.trim();
        if (!trimmed) return;
        onConfirm(trimmed); // parent decides whether to add or update
    };

    const title = mode === "edit" ? "Edit shelf" : "Add new shelf";
    const buttonLabel = mode === "edit" ? "Save changes" : "Add shelf";

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent className="flex flex-col gap-4 pt-4">
                <Box>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Shelf name"
                        placeholder="e.g. Fantasy, 2026 TBR"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {buttonLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
