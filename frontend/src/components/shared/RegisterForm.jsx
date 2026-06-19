import { useRegisterMutation } from "@apiSlice"
import { Form } from "@ui"
import { getErrorMessage, getSuccessMessage } from "@utils"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router"

export const RegisterForm = () => {
    const [register, { isLoading }] = useRegisterMutation()
    const navigate = useNavigate()

    const handleSubmit = async (values) => {
        try {
            const result = await register({
                email: values.email,
                password: values.password,
                username: values.username,
            }).unwrap()

            toast.success(getSuccessMessage(result, "Inscription réussie !"))
            navigate("/login")
        } catch (err) {
            toast.error(getErrorMessage(err, "Erreur lors de l'inscription"))
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Form
                title="Inscription"
                resetOnSubmit
                submitText={isLoading ? "Inscription..." : "S'inscrire"}
                onSubmit={handleSubmit}
                fields={[
                    { name: "username", label: "Nom d'utilisateur", type: "text" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "password", label: "Mot de passe", type: "password" },
                ]}
            />
            <p className="text-center text-sm text-base-content/50">
                Déjà un compte ? {" "}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
                    Se connecter
                </Link>
            </p>
        </div>
    )
}
