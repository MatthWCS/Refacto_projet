/**
 * Extrait un message d'erreur lisible depuis une erreur RTK Query.
 * Gère les formats { data: { message } }, { error }, et les erreurs réseau.
 */
export const getErrorMessage = (err, fallback = "Une erreur est survenue") => {
  if (!err) return fallback

  if (err.data?.message) return err.data.message
  if (err.error) return err.error
  if (typeof err.data === "string") return err.data
  if (err.message) return err.message

  return fallback
}

/**
 * Extrait un message de succès depuis une réponse d'API.
 */
export const getSuccessMessage = (result, fallback = "Opération réussie") => {
  if (!result) return fallback
  return result.message || fallback
}
