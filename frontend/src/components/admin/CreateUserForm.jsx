import { useState } from "react"
import { useCreateUserMutation } from "@apiSlice"
import { toast } from "react-toastify"

export function CreateUserForm() {
    const [form, setForm] = useState({ username: "", email: "", password: "" })
    const [createUser, { isLoading }] = useCreateUserMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.username || !form.email || !form.password) {
            toast.error("Tous les champs sont requis")
            return
        }
        try {
            await createUser(form).unwrap()
            toast.success("Compte créé")
            setForm({ username: "", email: "", password: "" })
        } catch (err) {
            toast.error(err?.data?.message ?? "Erreur lors de la création")
        }
    }

    return (
        <form onSubmit={handleSubmit}
            className="rounded-xl border border-emerald-900/40 bg-base-200/80 p-5
                       flex flex-col gap-3">
            <p className="text-xs text-emerald-600 uppercase tracking-wider">
                Créer un compte
            </p>
            {[
                { name: "username", label: "Username", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "password", label: "Password", type: "password" }
            ].map(({ name, label, type }) => (
                <div key={name} className="flex flex-col gap-1">
                    <label className="text-xs text-base-content/50">{label}</label>
                    <input
                        type={type}
                        value={form[name]}
                        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                        className="input input-sm input-bordered bg-base-300/50
                                   border-emerald-900/40 focus:border-emerald-700
                                   focus:outline-none w-full"
                    />
                </div>
            ))}
            <button type="submit" disabled={isLoading}
                className="btn btn-sm btn-outline border-emerald-700 text-emerald-400
                           disabled:opacity-40 mt-1">
                {isLoading ? "Création..." : "Créer"}
            </button>
        </form>
    )
}