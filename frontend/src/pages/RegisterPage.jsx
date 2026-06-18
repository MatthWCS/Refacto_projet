import { RegisterForm } from "@shared"

export const RegisterPage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-8">
            <h1 className="text-4xl text-center">Inscription</h1>
            <RegisterForm />
        </main>
    )
}
