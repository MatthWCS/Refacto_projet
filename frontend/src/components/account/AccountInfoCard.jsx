export const AccountInfoCard = ({ username, email }) => {
    return (
        <article className="rounded-xl border border-emerald-900/40 bg-base-200/80 p-4
                                flex flex-col gap-1 text-sm">
            <p className="text-base-content/50 text-xs uppercase tracking-wider mb-1">
                Compte actuel
            </p>
            <p className="text-base-content/80">
                <span className="text-base-content/40 w-24 inline-block">Utilisateur</span>
                {username}
            </p>
            <p className="text-base-content/80">
                <span className="text-base-content/40 w-24 inline-block">Email</span>
                {email}
            </p>
        </article>
    )
}