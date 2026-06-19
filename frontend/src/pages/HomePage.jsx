import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { useListSavesQuery, useStartGameMutation } from "@apiSlice"
import { Spinner } from "@ui"
import { MenuCard } from "@shared"

export const HomePage = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)

    const { data: savesData, isLoading: savesLoading } = useListSavesQuery()
    const [startGame, { isLoading: starting }] = useStartGameMutation()

    const hasSaves = (savesData?.saves?.length ?? 0) > 0

    const handleNewGame = async () => {
        // Démarre une nouvelle partie — GamePage s'en chargera via startGame au montage
        navigate("/game")
    }

    const handleContinue = () => {
        navigate("/game")
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-6">

            {/* Titre */}
            <div className="text-center flex flex-col gap-2">
                <h1 className="text-4xl font-semibold text-emerald-300 tracking-wide">
                    Faery ~ Interlude Sylvain ~
                </h1>
                <p className="text-base-content/40 text-sm">
                    Bienvenue, {user?.username ?? "aventurier"}
                </p>
            </div>

            {/* Séparateur décoratif */}
            <div className="flex items-center gap-3 w-full max-w-sm opacity-30">
                <div className="flex-1 h-px bg-emerald-700" />
                <span className="text-emerald-700 text-xs">✦</span>
                <div className="flex-1 h-px bg-emerald-700" />
            </div>

            {/* Menu */}
            {savesLoading || starting ? (
                <div className="flex items-center gap-3 text-emerald-600">
                    <Spinner size="sm" />
                    <span className="text-sm animate-pulse">Chargement…</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                    <MenuCard
                        icon="⚔️"
                        title="Débuter l'aventure"
                        description="Créer un nouveau héros et partir à l'aventure"
                        onClick={handleNewGame}
                        variant="primary"
                    />
                    <MenuCard
                        icon="📖"
                        title="Continuer"
                        description={hasSaves
                            ? "Reprendre là où vous vous êtes arrêté"
                            : "Aucune sauvegarde disponible"}
                        onClick={handleContinue}
                        disabled={!hasSaves}
                        variant="default"
                    />
                    <MenuCard
                        icon="💾"
                        title="Mes sauvegardes"
                        description="Gérer vos emplacements de sauvegarde"
                        onClick={() => navigate("/saves")}
                        variant="muted"
                    />
                    <MenuCard
                        icon="👤"
                        title="Mon profil"
                        description="Modifier votre nom d'utilisateur ou mot de passe"
                        onClick={() => navigate("/account")}
                        variant="muted"
                    />
                </div>
            )}

            {/* Pied de page */}
            <p className="text-base-content/20 text-xs mt-4">
                Un livre dont vous êtes le héros
            </p>
        </main>
    )
}
