import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/game",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
})

/**
 * Endpoints du moteur de jeu — à compléter au fur et à mesure
 * de l'intégration des routes Express (paragraphes, combat,
 * inventaire, commerce, sauvegarde...).
 */
export const gameApiSlice = createApi({
    reducerPath: "gameApi",
    baseQuery,
    tagTypes: ["Hero", "Paragraph", "Inventory", "Combat"],
    endpoints: (build) => ({
        getCurrentParagraph: build.query({
            query: () => "/paragraph/current",
            providesTags: ["Paragraph"]
        }),
        getHero: build.query({
            query: () => "/hero",
            providesTags: ["Hero"]
        })
        // À venir : makeChoice, getInventory, useFlask, tradeItem,
        // startCombat, rollDice, attack, saveGame, loadGame...
    })
})

export const { useGetCurrentParagraphQuery, useGetHeroQuery } = gameApiSlice
