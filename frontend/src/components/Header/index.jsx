import { NavLink, useNavigate } from 'react-router'
import './Header.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshTokenMutation, useSignOutMutation } from '../../store/apiSlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { logout } from '@store/slice/authSlice'
import { LangSelector } from '../LangSelector'

export const Header = () => {

    const { token, refresh_token, user, isAuthenticated } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [signOut, { data, isLoading, isSuccess, isError, error }] = useSignOutMutation()

    useEffect(() => {

        if (isSuccess && !error) {
            toast.success(data.message)

            dispatch(logout())
            navigate('/')
        }
        if (isError) {
            toast.error(error.data.message)
        }

    }, [isSuccess, isError])

    return (
        <>
            <header className="navbar bg-base-100 shadow-sm">
                <div className="flex-1">
                    <NavLink to='/' className="btn btn-ghost text-xl">Redux Tool Kit ❤</NavLink>
                </div>
                <nav className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        {isAuthenticated === false && (
                            <>
                                <li><NavLink to='/register'>Register</NavLink></li>
                                <li><NavLink to='/login'>Login</NavLink></li>
                            </>
                        )}
                        {isAuthenticated === true && (
                            <>
                                <li><NavLink to='/categories'>Categories</NavLink></li>
                                <li><NavLink to='/profil'>Profil</NavLink></li>
                                <li><NavLink to='/' onClick={() => signOut()}>LogOut</NavLink></li>
                            </>
                        )}

                    </ul>
                </nav>
                <LangSelector />
            </header>
        </>
    )
}