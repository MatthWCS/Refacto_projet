import { CategoryForm } from '../../components/CategoryForm'
import { CategoryList } from '../../components/CategoryList'

export const Categories = () => {


    return (
        <>
            <section className='flex flex-col justify-center gap-10'>
                <h2 className="text-center">My categories</h2>
                <article>
                    <CategoryList />
                    <CategoryForm />
                </article>

            </section>
        </>
    )
}