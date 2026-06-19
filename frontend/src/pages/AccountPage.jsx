import { useState } from "react"
import { useSelector } from "react-redux"
import { useUpdateAccountMutation } from "@apiSlice"
import { toast } from "react-toastify"
import { Link } from "react-router"
import { AccountForm, AccountInfoCard } from "@components/account"


export const AccountPage = () => {
    const user = useSelector(state => state.auth.user)
    const [updateAccount, { isLoading }] = useUpdateAccountMutation()

    const [form, setForm] = useState({
        currentPassword: "",
        username: "",
        newPassword: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.currentPassword) {
            toast.error("Le mot de passe actuel est requis")
            return
        }
        if (!form.username && !form.newPassword) {
            toast.error("Renseignez au moins un champ à modifier")
            return
        }
        if (form.newPassword && form.newPassword !== form.confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas")
            return
        }

        const body = { currentPassword: form.currentPassword }
        if (form.username) body.username = form.username
        if (form.newPassword) body.password = form.newPassword

        try {
            await updateAccount(body).unwrap()
            toast.success("Compte mis à jour avec succès")
            setForm({ currentPassword: "", username: "", newPassword: "", confirmPassword: "" })
        } catch (err) {
            toast.error(err?.data?.message ?? "Erreur lors de la mise à jour")
        }
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
            <section className="w-full max-w-md flex flex-col gap-6">

                {/* En-tête */}
                <article className="flex items-center justify-between">
                    <h1 className="text-2xl text-emerald-300 font-semibold">Mon compte</h1>
                    <Link to="/saves"
                        className="btn btn-sm btn-outline border-emerald-800 text-emerald-400
                                   hover:bg-emerald-900/40">
                        Mes sauvegardes
                    </Link>
                </article>

                {/* Infos actuelles */}
                <AccountInfoCard
                    username={user?.username ?? "—"}
                    email={user?.email ?? "—"}
                />

                {/* Formulaire de modification */}
                <AccountForm
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    isLoading={isLoading}
                    currentPasswordValue={form.currentPassword}
                    newUsernameValue={form.username}
                    newPasswordValue={form.newPassword}
                    confirmPasswordValue={form.confirmPassword}
                />

                <div className="flex justify-between text-sm">
                    <Link to="/home" className="text-emerald-600 hover:text-emerald-400">
                        ← Accueil
                    </Link>
                </div>
            </section>
        </main>
    )
}