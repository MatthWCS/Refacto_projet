import { LoginForm } from "@components/LoginForm"

export const Login = () => {

    return (
        <>
            <section className='flex flex-col justify-center gap-10'>
                <h1 className="text-center text-4xl">Login</h1>
                <article>
                    <LoginForm />
                </article>
            </section>
        </>
    )
}