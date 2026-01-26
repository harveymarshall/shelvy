import { Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import ShelfRow from "./ShelfRow";


export default function ShelvesPage({ shelves, books, onOpenAddShelf, onOpenBookView }) {
    return (
        <Box className="flex flex-col gap-4 p-4 pb-24">
            <Box className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Shelves</h2>
                <Button
                    variant="contained"
                    size="small"
                    onClick={onOpenAddShelf}
                >
                    Add shelf
                </Button>
            </Box>

            {shelves.map((shelf) => {
                const shelfBooks = books.filter((b) => b.shelfId === shelf.id);
                return (
                    <ShelfRow
                        key={shelf.id}
                        shelfName={shelf.name}
                        books={shelfBooks}
                        onOpenBookView={onOpenBookView}
                    />
                );
            })}
        </Box>
    );
}
