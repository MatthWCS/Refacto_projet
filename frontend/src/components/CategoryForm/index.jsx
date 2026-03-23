import { useAddCategoryMutation } from "@store/apiSlice/categoryApiSlice"
import { Button } from '@components/Button'
import { CustomInput } from '@components/CustomInput'
import { useDispatch, useSelector } from "react-redux"
import { setCategory } from "@store/slice/categoryFormSlice"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { PlusIcon } from "@phosphor-icons/react"

export const CategoryForm = () => {

    const { name } = useSelector(state => state.categoryForm)
    const dispatch = useDispatch()

    const [addCategory, { data, isLoading, isSuccess, isError, error }] = useAddCategoryMutation()

    useEffect(() => {

        if (!isLoading && isSuccess && !error) {
            toast.success(data.message)
        }

        if (!isLoading && isError && error) {
            toast.error(error.data.message)
        }

    }, [isLoading])

    return (
        <div className="w-full flex flex-row justify-center">
            <CustomInput
                className="input"
                type="text"
                labelText='Insert new category'
                inputValue={name}
                onChange={(e) => dispatch(setCategory({ name: e.target.value }))}
            />
            <Button
                onClick={() => {
                    addCategory({ name })
                    dispatch(setCategory({ name: "" }))
                }}
                className="btn btn-success"
                text={<PlusIcon size={16} />}
            />
        </div>
    )
}