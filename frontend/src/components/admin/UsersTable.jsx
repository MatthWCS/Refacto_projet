import { UserRow } from "./UserRow"
import { Spinner } from "@ui"

const HEADERS = ["ID", "Username", "Email", "Rôle", "Créé le", "Actions"]

export function UsersTable({ users, isLoading, currentUserId }) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner size="md" />
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-emerald-900/30 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-base-200/60 border-b border-emerald-900/30">
                    <tr>
                        {HEADERS.map(h => (
                            <th key={h}
                                className="py-2 px-3 text-xs text-base-content/40
                                           uppercase tracking-wider font-medium">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <UserRow
                            key={user.id}
                            user={user}
                            currentUserId={currentUserId}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}