import { Button } from "@components/Button"
import { CustomInput } from "@components/CustomInput"
import { useDispatch, useSelector } from "react-redux"
import { useAddUserMutation } from "@store/apiSlice/userApiSlice"
import { setEmail, setName, setPassword } from "@store/slice/registerFormSlice"
import { toast } from "react-toastify"
import { useEffect } from "react"

import "./RegisterForm.scss"
import { useNavigate } from "react-router"

export const RegisterForm = () => {

    const { name, email, password } = useSelector(state => state.registerForm)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [addUser, { data, isLoading, isSuccess, isError, error }] = useAddUserMutation()

    useEffect(() => {
        if (!isLoading && isSuccess && !error) {
            toast.success(data.message)
        }

        if (!isLoading && isError && error) {
            toast.error("An error occured : " + error.data.message)
        }
    }, [isLoading])

    return (
        <>
            <CustomInput
                className='input'
                labelText="Name"
                inputName="name"
                inputType="text"
                inputValue={name}
                onChange={(e) => dispatch(setName(e.target.value))}
            />
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
                    addUser({ name, email, password }),
                        dispatch(setName('')),
                        dispatch(setEmail('')),
                        dispatch(setPassword('')),
                        navigate('/')
                }}
                className="btn btn-primary w-12rem"
                text='Register'
            />
        </>
    )
}