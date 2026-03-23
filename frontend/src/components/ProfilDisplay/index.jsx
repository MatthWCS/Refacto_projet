import { useEffect } from "react"
import { useAuthProfilQuery } from "../../store/apiSlice"

export const ProfilDisplay = () => {

    const { data, isLoading, isSuccess, isError, error } = useAuthProfilQuery()

    useEffect(() => {


    }, [isLoading, isError])

    return (
        <>
            {isLoading && (<p>Loading ...</p>)}
            {isSuccess && (
                <>
                    <h2>Bienvenue {data.user.name}</h2>
                    <p>Email : {data.user.email}</p>
                    <h3>My Todos</h3>
                    <ul>
                        {!data.todos && (
                            <p>Nothing to display.</p>
                        )}
                        {data?.todos?.map(todo => (
                            <li key={todo.id}>{todo.title}</li>
                        ))}
                    </ul>
                </>
            )}

        </>
    )
}