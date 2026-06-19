import { useEffect, useState } from "react"
import { useRefreshTokenMutation } from "@apiSlice"
import { useDispatch } from "react-redux"
import { logout } from "@slice/authSlice"

/**
 * Au chargement de l'app, échange le refresh_token (cookie httpOnly,
 * seul élément persistant côté navigateur) contre un access token
 * via /auth/refresh-token. L'access token résultant ne vit qu'en
 * mémoire (store Redux) — perdu à chaque rechargement, d'où cet
 * échange systématique au montage.
 */
export const useAuthInit = () => {
    const dispatch = useDispatch()
    const [refreshToken] = useRefreshTokenMutation()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const init = async () => {
            try {
                // refreshToken.onQueryStarted dispatche déjà setCredentials
                // en cas de succès, et logout() en cas d'échec.
                await refreshToken().unwrap()
            } catch {
                if (!cancelled) dispatch(logout())
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        init()
        return () => { cancelled = true }
    }, [])

    return { isLoading }
}