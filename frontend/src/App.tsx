import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import AddUserPage from './pages/AddUserPage'
import UsersListPage from './pages/UsersListPage'

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/list"><span className="brand-mark">UD</span><span>User Directory</span></NavLink>
        <nav aria-label="Main navigation">
          <NavLink to="/add">Add</NavLink>
          <NavLink to="/list">List</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/add" element={<AddUserPage />} />
          <Route path="/list" element={<UsersListPage />} />
          <Route path="*" element={<Navigate to="/list" replace />} />
        </Routes>
      </main>
      <footer>USER DIRECTORY <span>·</span> PRIVATE BY DESIGN</footer>
    </div>
  )
}