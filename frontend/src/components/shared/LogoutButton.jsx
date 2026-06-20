import { useNavigate } from "react-router"
import { useLogoutMutation } from "@apiSlice"
import { toast } from "react-toastify"

export const LogoutButton = ({ className = "" }) => {
    const navigate = useNavigate()
    const [logout, { isLoading }] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logout().unwrap()
        } catch {
            // le store est nettoyé dans tous les cas via authApiSlice.onQueryStarted
        } finally {
            navigate("/login")
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`btn btn-sm btn-ghost text-base-content/40 hover:text-red-400
                        disabled:opacity-40 ${className}`}
        >
            {isLoading ? "..." : "Déconnexion"}
        </button>
    )
}