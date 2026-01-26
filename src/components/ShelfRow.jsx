import { ImageList, ImageListItem, Typography, Box } from "@mui/material";
import placeholderCover from "../assets/generated-image.png";

export default function ShelfRow({ shelfName, books, onOpenBookView }) {

    return (
        <Box className="mb-6">
            <Typography
                variant="subtitle1"
                textAlign="center"
                className="text-slate-100 mb-2"
            >
                {shelfName}
            </Typography>

            <ImageList
                sx={{
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    gridAutoRows: "auto",
                }}
                cols={books.length || 1}
                gap={8}
            >
                {books.map((book) => (
                    <ImageListItem
                        key={book.id}
                        sx={{
                            minWidth: 96,
                            maxWidth: 96,          // fixed width
                        }}
                        onClick={() => onOpenBookView(book)}
                    >
                        <img
                            src={book.coverUrl || placeholderCover}
                            alt={book.title}
                            loading="lazy"
                            style={{
                                borderRadius: 8,
                                height: 144,          // fixed height
                                width: "100%",
                                objectFit: "cover",
                                filter: book.coverUrl ? "none" : "grayscale(80%)",
                                opacity: book.coverUrl ? 1 : 0.6,
                            }}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}


