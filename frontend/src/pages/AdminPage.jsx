import { Link } from "react-router"
import { useSelector } from "react-redux"
import { useListUsersQuery } from "@apiSlice"
import { CreateUserForm, UsersTable } from "@components/admin"

export const AdminPage = () => {
    const { data, isLoading } = useListUsersQuery()
    const users = data?.users ?? []
    const currentUserId = useSelector(state => state.auth.user?.id)

    return (
        <main className="flex flex-col min-h-screen gap-6 p-6 max-w-5xl mx-auto">

            <div className="flex items-center justify-between pt-4">
                <h1 className="text-2xl text-emerald-300 font-semibold">
                    Dashboard admin
                </h1>
                <Link to="/home" className="text-emerald-600 hover:text-emerald-400 text-sm">
                    ← Accueil
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-3">
                    <p className="text-xs text-base-content/40 uppercase tracking-wider">
                        Comptes ({users.length})
                    </p>
                    <UsersTable
                        users={users}
                        isLoading={isLoading}
                        currentUserId={currentUserId}
                    />
                </div>

                <div className="w-full lg:w-72 shrink-0">
                    <CreateUserForm />
                </div>
            </div>
        </main>
    )
}