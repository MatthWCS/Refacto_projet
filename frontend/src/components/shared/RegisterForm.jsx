import { useRegisterMutation } from "@apiSlice"
import { Form } from "@ui"
import { getErrorMessage, getSuccessMessage } from "@utils"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"

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
    )
}
