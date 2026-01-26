import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Book, Search, Person, QueryStats } from '@mui/icons-material';

export default function BottomNav({ value, onChange }) {

    return (
        <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
            className="max-w-md mx-auto"
        >
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => onChange(newValue)}
                showLabels
                className="max-w-md"
            >
                <BottomNavigationAction label="Stats" icon={<QueryStats />} />
                <BottomNavigationAction label="Shelves" icon={<Book />} />
                <BottomNavigationAction label="Home" icon={<Home />} />
                <BottomNavigationAction label="Search" icon={<Search />} />
                <BottomNavigationAction label="Profile" icon={<Person />} />
            </BottomNavigation>
        </Paper>
    );
}
