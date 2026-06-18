import { BrowserRouter, Routes, Route } from "react-router"
import { LoginPage, RegisterPage, GamePage } from "@pages"
import { ProtectedRoute } from "@components/ProtectedRoute"
import { useAuthInit } from "./hooks/useAuthInit"
import { Spinner } from "@ui"

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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/game" element={<GamePage />} />
                    <Route index element={<GamePage />} />
                </Route>

                <Route path="*" element={<p className="text-center mt-10">404 - Page non trouvée</p>} />
            </Routes>
        </BrowserRouter>
    )
}
