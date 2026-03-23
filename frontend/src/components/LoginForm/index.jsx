import { CustomInput, Button } from '@components/'
import { useDispatch, useSelector } from 'react-redux'
import { useSignInMutation } from '@store/apiSlice/authApiSlice'
import { setEmail, setPassword } from '@store/slice/loginFormSlice'
import { setCredentials } from '@store/slice/authSlice'
import { useEffect } from 'react'
import { toast } from "react-toastify"
import { useNavigate } from 'react-router'

export const LoginForm = () => {

    const { token, refresh_token, user, isAuthenticated } = useSelector(state => state.auth)
    const { email, password } = useSelector(state => state.loginForm)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [signIn, { data, isLoading, isSuccess, isError, error }] = useSignInMutation()

    useEffect(() => {

        if (!isLoading && isSuccess && !error) {
            toast.success(data.message)
            dispatch(setCredentials({ isAuthenticated: true }))
            navigate('/')
        }

        if (!isLoading && isError && error) {
            toast.error(error.data.message)
        }

    }, [isLoading])

    return (
        <section>
            <CustomInput
                className='input'
                labelText="Email"
                inputName="email"
                inputType="email"
                inputValue={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
            />
            <CustomInput
                className='input'
                labelText="Password"
                inputName="password"
                inputType="password"
                inputValue={password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
            />
            <Button
                onClick={() => {
                    signIn({ email: email, password: password })
                    dispatch(
                        setEmail(""),
                        setPassword("")
                    )
                }}
                className="btn"
                text='Login'
            />
        </section>
    )
}