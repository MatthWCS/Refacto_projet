import { useState } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "@apiSlice"
import { toast } from "react-toastify"

export function UserRow({ user, currentUserId }) {
    const [editing, setEditing] = useState(false)
    const [username, setUsername] = useState(user.username)
    const [updateUser, { isLoading: updating }] = useUpdateUserMutation()
    const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation()

    const handleUpdate = async () => {
        try {
            await updateUser({ id: user.id, username }).unwrap()
            toast.success("Compte mis à jour")
            setEditing(false)
        } catch (err) {
            toast.error(err?.data?.message ?? "Erreur lors de la mise à jour")
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Supprimer le compte de "${user.username}" ?`)) return
        try {
            await deleteUser(user.id).unwrap()
            toast.success("Compte supprimé")
        } catch (err) {
            toast.error(err?.data?.message ?? "Erreur lors de la suppression")
        }
    }

    const isSelf = user.id === currentUserId

    return (
        <tr className="border-b border-emerald-900/20 hover:bg-base-200/40 transition-colors">
            <td className="py-2 px-3 text-xs text-base-content/40 font-mono">{user.id}</td>
            <td className="py-2 px-3 text-sm">
                {editing ? (
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="input input-xs input-bordered bg-base-300/50
                                   border-emerald-900/40 focus:border-emerald-700
                                   focus:outline-none w-36"
                    />
                ) : (
                    <span className="text-base-content/80">{user.username}</span>
                )}
            </td>
            <td className="py-2 px-3 text-sm text-base-content/50">{user.email}</td>
            <td className="py-2 px-3">
                {user.is_admin
                    ? <span className="text-xs text-emerald-400">Admin</span>
                    : <span className="text-xs text-base-content/30">Joueur</span>}
            </td>
            <td className="py-2 px-3 text-xs text-base-content/40">
                {new Date(user.created_at).toLocaleDateString("fr-FR")}
            </td>
            <td className="py-2 px-3">
                <div className="flex gap-2 items-center">
                    {editing ? (
                        <>
                            <button onClick={handleUpdate} disabled={updating}
                                className="btn btn-xs btn-outline border-emerald-700
                                           text-emerald-400 disabled:opacity-40">
                                {updating ? "..." : "Valider"}
                            </button>
                            <button
                                onClick={() => { setEditing(false); setUsername(user.username) }}
                                className="btn btn-xs btn-ghost text-base-content/40">
                                Annuler
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditing(true)}
                                className="btn btn-xs btn-ghost text-emerald-600
                                           hover:text-emerald-400">
                                Modifier
                            </button>
                            {!isSelf && (
                                <button onClick={handleDelete} disabled={deleting}
                                    className="btn btn-xs btn-ghost text-red-400/50
                                               hover:text-red-400 disabled:opacity-40">
                                    {deleting ? "..." : "Supprimer"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}