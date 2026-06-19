import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { toast } from "react-toastify"
import {
    useListSavesQuery,
    useSaveGameMutation,
    useDeleteSaveMutation
} from "@apiSlice"
import { Spinner } from "@ui"
import { SaveSlot } from "@components/saves"

const MAX_SAVES = 3
const SLOT_NAMES = ["slot_1", "slot_2", "slot_3"]
const SLOT_LABELS = ["Emplacement 1", "Emplacement 2", "Emplacement 3"]

export const SavesPage = () => {
    const navigate = useNavigate()
    const { data, isLoading, refetch } = useListSavesQuery()
    const [saveGame] = useSaveGameMutation()
    const [deleteSave] = useDeleteSaveMutation()

    const [savingSlot, setSavingSlot] = useState(null)
    const [deletingSlot, setDeletingSlot] = useState(null)

    const saves = data?.saves ?? []

    // Associe chaque slot nommé à sa save (ou null si vide)
    const slotMap = Object.fromEntries(
        SLOT_NAMES.map(slot => [slot, saves.find(s => s.slot_name === slot) ?? null])
    )

    const handleLoad = (slot) => {
        navigate("/game", { state: { slot } })
        toast.info(`Chargement de l'emplacement ${slot.replace("_", " ")}...`)
    }

    const handleSave = async (slot) => {
        setSavingSlot(slot)
        try {
            await saveGame({ slot }).unwrap()
            toast.success("Partie sauvegardée")
            refetch()
        } catch (err) {
            toast.error(err?.data?.error ?? "Impossible de sauvegarder")
        } finally {
            setSavingSlot(null)
        }
    }

    const handleDelete = async (slot) => {
        if (!window.confirm(`Supprimer la sauvegarde "${slot.replace("_", " ")}" ?`)) return
        setDeletingSlot(slot)
        try {
            await deleteSave(slot).unwrap()
            toast.success("Sauvegarde supprimée")
        } catch (err) {
            toast.error("Impossible de supprimer")
        } finally {
            setDeletingSlot(null)
        }
    }


    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
            <div className="w-full max-w-lg flex flex-col gap-6">

                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl text-emerald-300 font-semibold">
                        Sauvegardes
                    </h1>
                    <span className="text-xs text-base-content/30">
                        {saves.length}/{MAX_SAVES} emplacements utilisés
                    </span>
                </div>

                {/* Liste des slots */}
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Spinner size="md" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {SLOT_NAMES.map((slot, i) => (
                            <SaveSlot
                                key={slot}
                                slot={slot}
                                label={SLOT_LABELS[i]}
                                save={slotMap[slot]}
                                onLoad={handleLoad}
                                onDelete={handleDelete}
                                onSave={handleSave}
                                isSaving={savingSlot === slot}
                                isDeleting={deletingSlot === slot}
                            />
                        ))}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between text-sm pt-2">
                    <Link to="/home" className="text-emerald-600 hover:text-emerald-400">
                        ← Accueil
                    </Link>
                    <Link to="/game" className="text-emerald-600 hover:text-emerald-400">
                        Retour au jeu
                    </Link>
                    <Link to="/account" className="text-emerald-600 hover:text-emerald-400">
                        Mon compte
                    </Link>
                </div>
            </div>
        </main>
    )
}