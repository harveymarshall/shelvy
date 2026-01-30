import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import BottomNav from './components/BottomNav.jsx';
import ShelvesPage from './components/Shelves.jsx';
import HomePage from './components/Home.jsx';
import AddBookDialog from './components/AddDialog.jsx';
import ShelfDialog from './components/ShelfDialog.jsx';


function App() {

  const API_BASE = "http://localhost:8000";
  const [tab, setTab] = useState(2);

  // shelves data
  const [shelves, setShelves] = useState([
    { id: 1, name: "Want to Read" },
    { id: 2, name: "Reading" },
    { id: 3, name: "Read" },
  ]);

  // Books
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/get-books`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          console.error("GET failed", res.status);
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setBooks(data);
      } catch (e) {
        console.error("Failed to retrieve books.", e);
      }
    };

    loadBooks();
  }, []);

  // dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);


  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedShelfId, setSelectedShelfId] = useState(
    shelves[0]?.id ?? null
  );

  //Set Dialog Mode
  const [dialogMode, setDialogMode] = useState("add"); // "add" | "edit"



  const [addShelfOpen, setAddShelfOpen] = useState(false);

  const handleAddShelfConfirm = (name) => {
    setShelves((prev) => [...prev, { id: Date.now(), name }]);
    setAddShelfOpen(false);
  };

  // when user clicks "Add" in HomePage search result
  const openAddSearchDialog = (book) => {
    // Try to find existing by apiId (search result) or by id (shelves)
    const existingBook =
      books.find((b) => b.openLibId === book.id) || null;

    if (existingBook) {
      // Edit existing
      setSelectedBook(existingBook);
      setSelectedShelfId(existingBook.shelfId ?? shelves[0]?.id ?? null);
      setDialogMode("edit");
    } else {
      // Add new
      setSelectedBook(book);
      setSelectedShelfId(shelves[0]?.id ?? null);
      setDialogMode("add");
    }

    setAddDialogOpen(true);
  };

  const openEditForShelfBook = (savedBook) => {
    setSelectedBook(savedBook);                           // book from `books` state
    setSelectedShelfId(savedBook.shelfId ?? shelves[0]?.id ?? null);
    setDialogMode("edit");
    setAddDialogOpen(true);
  };


  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedBook(null);
  };

  const handleConfirmAdd = async () => {
    if (!selectedBook || !selectedShelfId) return;

    const payload = {
      title: selectedBook.title,
      author: selectedBook.author,
      isbn: selectedBook.isbn,
      coverUrl: selectedBook.coverUrl,
      shelfId: selectedShelfId,
      openLibId: selectedBook.id,
      pages: selectedBook.pages
    };

    try {
      const res = await fetch(`${API_BASE}/api/add-books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("POST failed", res.status);
        throw new Error(`HTTP ${res.status}`);
      }
      const saved = await res.json();
      setBooks((prev) => [...prev, saved]);
    } catch (e) {
      console.error("Failed to save book", e);
    } finally {
      closeAddDialog();
    }
  };

  const handleConfirmUpdate = async () => {
    if (!selectedBook || !selectedShelfId) return;

    // local state
    setBooks((prev) =>
      prev.map((b) =>
        b._id === selectedBook._id
          ? { ...b, shelfId: selectedShelfId }
          : b
      )
    );

    // optional: PATCH to backend later

    closeAddDialog();
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col pb-20">

      {tab === 1 && <ShelvesPage
        shelves={shelves}
        books={books}
        onOpenAddShelf={() => setAddShelfOpen(true)}
        onOpenBookView={openEditForShelfBook} />}
      {tab === 2 && <HomePage
        books={books}
        shelves={shelves}
        onRequestAddBook={openAddSearchDialog} />}

      {/* Bottom nav always visible */}
      <BottomNav value={tab} onChange={setTab} />

      <ShelfDialog
        open={addShelfOpen}
        onClose={() => setAddShelfOpen(false)}
        mode
        onConfirm={handleAddShelfConfirm}
      />

      <AddBookDialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        book={selectedBook}
        shelves={shelves}
        selectedShelfId={selectedShelfId}
        onChangeShelf={setSelectedShelfId}
        mode={dialogMode}
        onConfirmAdd={handleConfirmAdd}
        onConfirmUpdate={handleConfirmUpdate}
      />
    </Box>
  );
}

export default App
