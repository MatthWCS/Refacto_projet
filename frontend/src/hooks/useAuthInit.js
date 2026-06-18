import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useMeQuery } from "@apiSlice"
import { setCredentials, logout } from "@slice/authSlice"

/**
 * Au chargement de l'app, tente de restaurer la session via /auth/me
 * (cookie httpOnly). Met à jour authSlice en conséquence.
 */
export const useAuthInit = () => {
    const dispatch = useDispatch()
    const { data, isSuccess, isError, isLoading } = useMeQuery()

    useEffect(() => {
        if (isSuccess && data?.user) {
            dispatch(setCredentials({ user: data.user }))
        }
        if (isError) {
            dispatch(logout())
        }
    }, [isSuccess, isError, data, dispatch])

    return { isLoading }
}
