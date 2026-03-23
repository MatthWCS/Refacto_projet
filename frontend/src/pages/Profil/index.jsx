import { ProfilDisplay } from "../../components/ProfilDisplay"

export const Profil = () => {
    return (
        <>
            <main className='h-[76vh]'>
                <section className='flex flex-col justify-center gap-10'>
                    <h1 className='text-center text-4xl'>Profil</h1>
                    <article>
                        <ProfilDisplay />
                    </article>
                </section>
            </main>
        </>
    )
}