import { useGetAllCategoriesQuery, useDeleteCategoryMutation } from '@store/apiSlice/categoryApiSlice'
import { Button } from '@components/Button'
import { TrashIcon } from "@phosphor-icons/react"
import { toast } from "react-toastify"
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const CategoryList = () => {

    const { t } = useTranslation()

    const { data: categories, currentData, isUninitialized, isLoading: isCategoriesLoading, isFetching, refetch } = useGetAllCategoriesQuery()

    const [deleteCategory, { isLoading, isSuccess, isError, error }] = useDeleteCategoryMutation()

    useEffect(() => {

        if (!isLoading && isSuccess && !error) {
            toast.success("Category deleted successfuly ")
        }

        if (!isLoading && isError && error) {
            toast.error("An error occured on deleting Category")
        }

    }, [isLoading])

    return (
        <ul className="flex flex-col items-center gap-5">
            {!isCategoriesLoading && categories.map((category) => (
                <li key={category.id}>
                    {category.name}
                    <Button
                        className="btn btn-error"
                        onClick={() => deleteCategory(category.id)}
                        // text={<TrashIcon size={18} />}
                        text={t("categoryList.delBtn")}
                    />
                </li>
            ))}
        </ul>
    )
}