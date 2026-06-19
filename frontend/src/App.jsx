import { BrowserRouter, Routes, Route } from "react-router"
import {
    LoginPage, RegisterPage,
    HomePage, GamePage,
    AccountPage, SavesPage,
    AdminPage
} from "@pages"
import { ProtectedRoute } from "@components/ProtectedRoute"
import { useAuthInit } from "./hooks/useAuthInit"
import { useSelector } from "react-redux"
import { Spinner } from "@ui"
import { Navigate } from "react-router"

// Route protégée admin — App attend déjà la fin de useAuthInit
// avant de rendre les Routes, donc le state auth est déjà stable ici.
const AdminRoute = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    if (!user?.is_admin) return <Navigate to="/home" replace />
    return children
}

export const App = () => {
    const { isLoading } = useAuthInit()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Routes publiques */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Routes protégées */}
                <Route element={<ProtectedRoute />}>
                    <Route index element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/saves" element={<SavesPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/admin" element={
                        <AdminRoute><AdminPage /></AdminRoute>
                    } />
                </Route>

                <Route path="*" element={
                    <p className="text-center mt-10">404 - Page non trouvée</p>
                } />
            </Routes>
        </BrowserRouter>
    )
}
