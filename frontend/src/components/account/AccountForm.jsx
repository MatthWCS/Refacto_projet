import { Field } from "@shared"

export const AccountForm = ({
    onSubmit,
    onChange,
    isLoading,
    currentPasswordValue,
    newUsernameValue,
    newPasswordValue,
    confirmPasswordValue
}) => {
    return (
        <form onSubmit={onSubmit}
            className="rounded-xl border border-emerald-900/40 bg-base-200/80 p-5
                               flex flex-col gap-4">
            <p className="text-base-content/50 text-xs uppercase tracking-wider">
                Modifier le compte
            </p>

            <Field label="Mot de passe actuel *" name="currentPassword"
                type="password" value={currentPasswordValue} onChange={onChange} />

            <div className="border-t border-emerald-900/30 pt-4 flex flex-col gap-4">
                <p className="text-xs text-base-content/40">
                    Laissez vide les champs que vous ne souhaitez pas modifier
                </p>
                <Field label="Nouveau nom d'utilisateur" name="username"
                    type="text" value={newUsernameValue} onChange={onChange} />
                <Field label="Nouveau mot de passe" name="newPassword"
                    type="password" value={newPasswordValue} onChange={onChange} />
                <Field label="Confirmer le nouveau mot de passe" name="confirmPassword"
                    type="password" value={confirmPasswordValue} onChange={onChange} />
            </div>

            <button type="submit" disabled={isLoading}
                className="btn btn-sm btn-outline border-emerald-700 text-emerald-400
                                   disabled:opacity-40 mt-1">
                {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </button>
        </form>
    )
}