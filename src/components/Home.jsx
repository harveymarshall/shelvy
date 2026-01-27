import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
} from "@mui/material";

export default function HomePage({ books, shelves, onRequestAddBook }) {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        setLoading(true);
        try {
            const res = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`
            );
            const data = await res.json();
            const mapped = (data.docs || []).map((doc) => {
                const coverId = doc.cover_i;
                return {
                    id: doc.key, // e.g. "/works/OL12345W"
                    title: doc.title,
                    author: doc.author_name?.[0] || "Unknown",
                    isbn: doc.isbn?.[0] || null,
                    coverUrl: coverId
                        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
                        : null,
                };
            });
            setResults(mapped);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleAddClick = async (book) => {
        let enrichedBook = { ...book };
        enrichedBook.pages = 'N/A'; // Default

        if (book.id.startsWith('/works/')) {
            try {
                const editionsUrl = `https://openlibrary.org${book.id}/editions.json?limit=1`;
                const editionsRes = await fetch(editionsUrl);
                if (!editionsRes.ok) {
                    console.warn(`Editions fetch failed: ${editionsRes.status} for ${editionsUrl}`);
                    onRequestAddBook(enrichedBook);
                    return;
                }
                const editionsData = await editionsRes.json();
                if (editionsData.docs?.[0]) {
                    const editionUrl = `https://openlibrary.org${editionsData.docs[0].key}.json`;
                    const editionRes = await fetch(editionUrl);
                    if (!editionRes.ok) {
                        console.warn(`Edition fetch failed: ${editionRes.status}`);
                    } else {
                        const editionData = await editionRes.json();
                        enrichedBook.pages = editionData.number_of_pages || 'N/A';
                        enrichedBook.editionKey = editionsData.docs[0].key;
                    }
                }
            } catch (err) {
                console.error('Failed to fetch pages:', err);
            }
        } else if (book.id.startsWith('/books/')) {
            try {
                const editionUrl = `https://openlibrary.org${book.id}.json`;
                const editionRes = await fetch(editionUrl);
                if (editionRes.ok) {
                    const editionData = await editionRes.json();
                    enrichedBook.pages = editionData.number_of_pages || 'N/A';
                }
            } catch (err) {
                console.error('Failed to fetch pages:', err);
            }
        }

        onRequestAddBook(enrichedBook);
    };


    return (
        <Box className="flex flex-col gap-4 p-4 pb-24">
            {/* Search form */}
            <Box
                component="form"
                onSubmit={handleSearch}
                className="flex gap-2"
            >
                <TextField
                    label="Search for a book"
                    placeholder="Title, author, or ISBN"
                    size="small"
                    fullWidth
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </Button>
            </Box>

            {/* Search results */}
            {results.length > 0 && (
                <List className="bg-slate-900/60 rounded-lg border border-slate-700">
                    {results.map((book) => (
                        <ListItem
                            key={book.id}
                            secondaryAction={
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleAddClick(book)}
                                >
                                    Add
                                </Button>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar
                                    variant="rounded"
                                    src={book.coverUrl || undefined}
                                >
                                    {book.title[0]}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={book.title}
                                secondary={book.author}
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Current library (optional quick view) */}
            {books?.length > 0 && (
                <Box>
                    <Typography variant="h6" className="text-slate-100 mb-2">
                        Your books
                    </Typography>
                    <List className="bg-slate-900/40 rounded-lg border border-slate-800">
                        {books.map((book) => (
                            <ListItem key={book.id}>
                                <ListItemText primary={book.title} secondary={book.author} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
}
