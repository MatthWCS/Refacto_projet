import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"

export const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
