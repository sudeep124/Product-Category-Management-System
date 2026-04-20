import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Dashboard from "./pages/Dashboard"
import CategoriesList from "./pages/CategoriesList"
import CategoriesTree from "./pages/CategoriesTree"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AddProduct from "./pages/AddProduct"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="categories/tree" element={<CategoriesTree />} />
            <Route path="products/new" element={<AddProduct />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
