// Fonction qui requete sur l'API pour recuperer les todos dans la DB 
async function getAllTodos()
{
    return await fetch("http://localhost:9000/todo") // requete sur API
    .then( res => res.json() ) // Recuperation du JSON dans un format JS exploitable
    .then( data => data.todos ) // recuperation des todos dans la data fournie par l'API 
}

// Affichage d'une liste de todos dans la section#search_result
function displayTodos( todos ) {

    // Recuperation l'element section#search_result dans le DOM
    const searchResultSection = document.querySelector("#search_results")

    // On boucle sur chaque element a afficher
    for( let todo of todos ) {
        // on creer un nouveau paragraph
        let paragraph = document.createElement('p')
        // on indique que le contenu du paragraphe est le texte de la todo
        paragraph.innerText = todo.text
        // On ajoute le paragraphe dans section#search_result, a la suite de ceux qui s'y trouvent deja
        searchResultSection.append( paragraph )
    }
}

// fonction qui effectue un premier affichage de tous les todos 
async function initDisplay() {
    // On recupere tous les todos grace a la fonction getAllTodos
    const todos = await getAllTodos()
    // On demande leur affichage a la fonction displayTodos
    displayTodos( todos )
}

// Fonction qui recupere puis affiche les resultats de recherche
async function getSearchResults(e) {
    // On recupere tous les todos grace a la fonction getAllTodos
    const allTodos = await getAllTodos()
    // On filtre la liste complete pour ne conserver que ceux dont le texte contient le terme recherche
    const searchResults = allTodos.filter( todo => todo.text.toLowerCase().includes( e.target.value.toLowerCase() ) )
    // Recuperation l'element section#search_result dans le DOM
    const searchResultSection = document.querySelector("#search_results")
    // On vide l'element section#search_results
    searchResultSection.innerHTML = ""
    // S'il y a au moins 1 resultat
    if( searchResults.length ) {
        // on affiche les resultats
        displayTodos( searchResults )
    } else { // sinon
        // on creer un paragaphe
        let paragraph = document.createElement('p')
        // on indique que son contenu est un message indiquant qu'il n'y a pas de resultats
        paragraph.innerText = "Aucun resultat pour votre recherche."
        // on ajoute l'element paragraphe a section#search_results
        searchResultSection.append( paragraph )
    }
}

// on attend que tous les elements html de la page soient montes dans le DOM
document.addEventListener("DOMContentLoaded", () => {
    // on effectue un premier affichage de tous les todos
    initDisplay()
    // on recupere l'element input#search_bar
    const searchBar = document.querySelector("#search_bar")
    // on surveille le relachement d'une touche du clavier
    // quand l'evenement a lieu on execute la fonction getSearchResults 
    searchBar.addEventListener("keyup", getSearchResults)
})
