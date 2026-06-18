import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// gameApiSlice
// Tous les endpoints du moteur de jeu — contrat JSON
// validé avec le backend (WebUI + GameController).
//
// Principe : un seul objet `state` est renvoyé par chaque endpoint ;
// les composants le lisent via state.pending.type pour décider quoi afficher.

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/game",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
})

/**
 * Endpoints du moteur de jeu 
 */
export const gameApiSlice = createApi({
    reducerPath: "gameApi",
    baseQuery,
    tagTypes: ["Hero", "Paragraph", "Inventory", "Combat"],
    endpoints: (build) => ({

        /** Démarre ou reprend la partie — renvoie le state courant */
        startGame: build.mutation({
            query: () => ({
                url: "/start",
                method: "POST"
            }),
            invalidatesTags: ["GameState", "Inventory", "Trade"]
        }),

        /** Snapshot courant sans relancer le moteur */
        getGameState: build.query({
            query: () => "/state",
            providesTags: ["GameState"]
        }),


        // ---- Décision du joueur (résout le pending courant) ----
        /**
         * Corps attendu : { type, value }
         * - type   : correspond à state.pending.type
         * - value  : dépend du type :
         *     "choice"       -> index dans state.choices
         *     "continue"     -> null (n'importe quelle valeur)
         *     "item_pickup"  -> "use_now" | "take" | "equip" | "inventory" | "discard"
         *     "combat_target"-> id du monstre cible
         *     "combat_luck"  -> "none" | "increase" | "reduce"
         *     "combat_flee"  -> "continue" | "flee"
         *     "ending_choice"-> "replay" | "quit"
         */
        sendAction: build.mutation({
            query: (body) => ({
                url: "/action",
                method: "POST",
                body
            }),
            invalidatesTags: ["GameState", "Inventory"]
        }),

        // ---- Inventaire ----

        /** Liste complète de l'inventaire (enrichie des définitions d'items) */
        getInventory: build.query({
            query: () => "/inventory",
            providesTags: ["Inventory"]
        }),

        /** Utilise un objet depuis l'inventaire (hors flux de ramassage) */
        useItem: build.mutation({
            query: (body) => ({
                url: "/inventory/use",
                method: "POST",
                body   // { item_id }
            }),
            invalidatesTags: ["GameState", "Inventory"]
        }),

        /** Équipe un objet (type "equippable") */
        equipItem: build.mutation({
            query: (body) => ({
                url: "/inventory/equip",
                method: "POST",
                body   // { item_id }
            }),
            invalidatesTags: ["GameState", "Inventory"]
        }),

        /** Déséquipe un objet */
        unequipItem: build.mutation({
            query: (body) => ({
                url: "/inventory/unequip",
                method: "POST",
                body   // { item_id }
            }),
            invalidatesTags: ["GameState", "Inventory"]
        }),

        // ---- Commerce / troc (§36) ----

        /**
         * Offres de troc disponibles au paragraphe courant.
         * Chaque offre contient : { id, item_id, description, giveableItemIds }
         * giveableItemIds = items que le joueur possède ET acceptés par Arilys.
         */
        getTrades: build.query({
            query: () => "/trade",
            providesTags: ["Trade"]
        }),

        /**
         * Exécute un troc : retire giveItemId de l'inventaire,
         * ajoute l'item proposé par l'offre, marque l'offre comme utilisée.
         */
        executeTrade: build.mutation({
            query: (body) => ({
                url: "/trade/execute",
                method: "POST",
                body   // { tradeOfferId, giveItemId }
            }),
            invalidatesTags: ["GameState", "Inventory", "Trade"]
        })
    })
})

export const {
    useStartGameMutation,
    useGetGameStateQuery,
    useSendActionMutation,
    useGetInventoryQuery,
    useUseItemMutation,
    useEquipItemMutation,
    useUnequipItemMutation,
    useGetTradesQuery,
    useExecuteTradeMutation,
} = gameApiSlice
