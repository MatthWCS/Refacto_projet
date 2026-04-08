import { db } from '../services/database.js'

/**
 * Génère un slug à partir d'une chaîne de caractères.
 */
export function generateSlug(title) {

    return title
        .normalize("NFD")                   // décompose les accents (é => e + ́)
        .replace(/[\u0300-\u036f]/g, "")    // supprime les diacritiques accents, cédille, tilde
        .toLowerCase()                      // met les caractères en minuscule
        .trim()                             // supprime les espaces au début et à la fin de la chaine de caractère
        .replace(/[^a-z0-9\s-]/g, "")       // remplace les caractères spéciaux par des espaces
        .replace(/\s+/g, "-")               // remplace les espaces par des tirets
        .replace(/-+/g, "-")                // évite les tirets consécutifs
}

/**
 * Génère un slug unique en vérifiant les doublons en base.
 * Si le slug existe déjà, ajoute un suffixe numérique.
 */
export async function generateUniqueSlug(title) {
    const baseSlug = generateSlug(title)

    const [rows] = await db.query(
        "SELECT slug FROM adventure WHERE slug REGEXP ?", [`^${baseSlug}(-[0-9]+)?$`]
    )

    if (rows.length === 0) {
        return baseSlug
    }

    const existingSlugs = rows.map(row => row.slug)

    let counter = 1
    let nextSlug = `${baseSlug}-${counter}`

    while (existingSlugs.includes(nextSlug)) {
        counter++
        nextSlug = `${baseSlug}-${counter}`
    }

    return nextSlug
}