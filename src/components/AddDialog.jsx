import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    MenuItem,
    TextField,
    Box
} from "@mui/material";
import CircularWithValueLabel from "./CircularProgressWithLabel";

export default function AddBookDialog({
    open,
    onClose,
    book,
    shelves,
    selectedShelfId,
    onChangeShelf,
    mode,
    onConfirmAdd,
    onConfirmUpdate
}) {
    if (!book) return null;

    const isEdit = mode === "edit";

    const buttonLabel = isEdit ? "Update book" : "Add book";

    const handleClick = () => {
        if (isEdit) {
            onConfirmUpdate?.();
        } else {
            onConfirmAdd?.();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add book to shelf</DialogTitle>
            <DialogContent className="flex flex-col gap-4 pt-4">
                <Box className="flex gap-4">
                    {book.coverUrl && (
                        <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded"
                        />
                    )}
                    <CircularWithValueLabel value={book.progress || 0} />
                    <Box>
                        <Typography variant="h6">{book.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {book.author}
                        </Typography>
                        {book.isbn && (
                            <Typography variant="body2" color="text.secondary">
                                ISBN: {book.isbn}
                            </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                            Pages: {book.pages}
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    select
                    fullWidth
                    label="Shelf"
                    value={selectedShelfId ?? ""}
                    onChange={(e) => onChangeShelf(Number(e.target.value))}
                >
                    {shelves.map((shelf) => (
                        <MenuItem key={shelf.id} value={shelf.id}>
                            {shelf.name}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleClick}>
                    {buttonLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
