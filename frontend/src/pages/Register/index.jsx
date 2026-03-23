import { RegisterForm } from "@components/RegisterForm"

export const Register = () => {

    return (
        <main id="main_register" >
            <h1 className="text-center text-4xl mt-[2rem]">Register</h1>
            <section className="flex flex-col items-center mt-[5rem] mb-[5rem]">
                <article className="card bg-base-100 w-128 shadow-sm gap-8 flex flex-col items-center border bw-1 pb-[2rem]">
                    <RegisterForm />
                </article>
            </section>
        </main>
    )
}