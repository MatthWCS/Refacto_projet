import { LoginForm } from "@shared"

export const LoginPage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-8">
            <h1 className="text-4xl text-center">Connexion</h1>
            <LoginForm />
        </main>
    )
}
