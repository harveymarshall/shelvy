import { useState } from 'react';
import { Box } from '@mui/material';
import BottomNav from './components/BottomNav.jsx';
import ShelvesPage from './components/Shelves.jsx';
import HomePage from './components/Home.jsx';
import AddBookDialog from './components/AddDialog.jsx';
import ShelfDialog from './components/ShelfDialog.jsx';


function App() {
  const [tab, setTab] = useState(2);

  // shelves data
  const [shelves, setShelves] = useState([
    { id: 1, name: "Want to Read" },
    { id: 2, name: "Reading" },
    { id: 3, name: "Read" },
  ]);

  // Books
  const [books, setBooks] = useState([]);

  // dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);


  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedShelfId, setSelectedShelfId] = useState(
    shelves[0]?.id ?? null
  );

  // check book exists
  const existing = selectedBook
    ? books.find((b) => b.id === selectedBook.id)
    : null;

  const dialogMode = existing ? "edit" : "add";

  const [addShelfOpen, setAddShelfOpen] = useState(false);

  const handleAddShelfConfirm = (name) => {
    setShelves((prev) => [...prev, { id: Date.now(), name }]);
    setAddShelfOpen(false);
  };

  // when user clicks "Add" in HomePage search result
  const openAddDialog = (book) => {
    setSelectedBook(book);
    setSelectedShelfId(shelves[0]?.id ?? null);
    setAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedBook(null);
  };

  const handleConfirmAdd = () => {
    console.log("handleConfirmAdd called", { selectedBook, selectedShelfId });
    if (!selectedBook || !selectedShelfId) return;

    setBooks((prev) => {
      if (prev.some((b) => b.id === selectedBook.id)) return prev;
      return [...prev, { ...selectedBook, shelfId: selectedShelfId }];
    });

    closeAddDialog();
  };

  const handleConfirmUpdate = async () => {
    console.log("handleConfirmUpdate called", { selectedBook, selectedShelfId });
    if (!selectedBook || !selectedShelfId) return;

    // frontend state update
    setBooks((prev) =>
      prev.map((b) =>
        b.id === selectedBook.id ? { ...b, shelfId: selectedShelfId } : b
      )
    );
    closeAddDialog();
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col pb-20">

      {tab === 1 && <ShelvesPage
        shelves={shelves}
        books={books}
        onOpenAddShelf={() => setAddShelfOpen(true)}
        onOpenBookView={openAddDialog} />}
      {tab === 2 && <HomePage
        books={books}
        shelves={shelves}
        onRequestAddBook={openAddDialog} />}

      {/* Bottom nav always visible */}
      <BottomNav value={tab} onChange={setTab} />

      <ShelfDialog
        open={addShelfOpen}
        onClose={() => setAddShelfOpen(false)}
        mode="add"
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
