import { useLoginMutation } from "@apiSlice"
import { Form } from "@ui"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { getErrorMessage, getSuccessMessage } from "@utils"

export const LoginForm = () => {
    const [login, { isLoading }] = useLoginMutation()
    const navigate = useNavigate()

    const handleSubmit = async (values) => {
        try {
            const result = await login({
                email: values.email,
                password: values.password
            }).unwrap()

            toast.success(getSuccessMessage(result, "Connexion réussie !"))
            navigate("/game")
        } catch (err) {
            toast.error(getErrorMessage(err, "Erreur lors de la connexion"))
        }
    }

    return (
        <Form
            title="Connexion"
            submitText={isLoading ? "Connexion..." : "Se connecter"}
            onSubmit={handleSubmit}
            fields={[
                { name: "email", label: "Email", type: "email" },
                { name: "password", label: "Mot de passe", type: "password" }
            ]}
        />
    )
}
