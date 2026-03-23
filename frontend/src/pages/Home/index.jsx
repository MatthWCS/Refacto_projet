import './Home.scss'
import { useTranslation } from 'react-i18next'


export const Home = () => {

    const { t } = useTranslation()

    return (
        <>
            <main className='h-[76vh]'>
                <section className='flex flex-col justify-center gap-10'>
                    <h1 className='text-center text-4xl'>
                        {t("homePage.title")}
                    </h1>
                    <article>

                    </article>
                </section>
            </main>
        </>
    )
}