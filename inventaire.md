
# 🧩 1) Ton architecture actuelle (parfaite pour ce qu’on veut faire)

Tu as :

### ✔️ Une table `item`  
→ qui contient tous les objets possibles  
→ avec leurs propriétés (type, nom, description, etc.)

### ✔️ Une table `paragraph_item`  
→ qui dit : “au paragraphe X, on trouve l’objet Y”

### ✔️ Un `InventoryEngine`  
→ qui gère l’ajout, suppression, équipement, etc.

### ✔️ Un `HeroEngine`  
→ qui stocke l’inventaire dans `hero.inventory`

### ✔️ Un `ParagraphEngine`  
→ qui résout les paragraphes et détecte les objets trouvés

Tu as déjà **toutes les briques**.  
Il manque juste **la logique interactive**.

---

# 🎯 2) Objectif

Quand le joueur arrive sur un paragraphe contenant un objet :

### Si l’objet est **consommable** ou **divers**  
→ lui demander :  
```
Vous trouvez une Potion de Force.
Voulez-vous la prendre ?
1. Oui
2. Non
```

### Si l’objet est **équipable**  
→ lui demander :  
```
Vous trouvez une Épée Magique.
Que voulez-vous faire ?
1. L’équiper
2. La mettre dans l’inventaire
3. Ne pas la prendre
```

Et ensuite :

- ajouter l’objet dans l’inventaire  
- ou l’équiper  
- ou ignorer  

---

# 🟦 3) Étape 1 — Ajouter un champ `type` dans ta table item

Tu dois avoir quelque chose comme :

| id | name | type | description |
|----|------|------|-------------|
| 1 | Épée | equipable | Une épée simple |
| 2 | Potion de force | consumable | +2 END |
| 3 | Clé en bronze | misc | Ouvre une porte |

Les types recommandés :

- `"equipable"`
- `"consumable"`
- `"misc"` (divers)

---

# 🟩 4) Étape 2 — Récupérer les objets du paragraphe dans ParagraphEngine

Dans `resolveParagraph()`, tu dois déjà avoir :

```js
const items = await this.paragraphModel.getItems(paragraphId);
```

Ensuite tu ajoutes :

```js
result.items = items;
```

---

# 🟦 5) Étape 3 — Dans test-app.js, afficher les objets trouvés

Juste après l’affichage du paragraphe :

```js
if (result.items && result.items.length > 0) {
    for (const item of result.items) {
        await handleItemPickup(item);
    }
}
```

---

# 🟩 6) Étape 4 — Créer la fonction `handleItemPickup(item)` dans test-app.js

Voici la version complète, propre, interactive :

```js
async function handleItemPickup(item) {

    console.log(`\nVous trouvez : ${item.name}`);

    if (item.type === "equipable") {

        console.log("Que voulez-vous faire ?");
        console.log("1. L’équiper");
        console.log("2. Le mettre dans l’inventaire");
        console.log("3. Ne pas le prendre");

        const answer = await ask("Votre choix : ");

        if (answer === "1") {
            heroEngine.addItem(item.id, 1);
            heroEngine.equipItem(item.id);
            console.log(`${item.name} équipé !`);
        }
        else if (answer === "2") {
            heroEngine.addItem(item.id, 1);
            console.log(`${item.name} ajouté à l’inventaire.`);
        }
        else {
            console.log("Vous laissez l’objet.");
        }
    }

    else {
        console.log("Voulez-vous le prendre ?");
        console.log("1. Oui");
        console.log("2. Non");

        const answer = await ask("Votre choix : ");

        if (answer === "1") {
            heroEngine.addItem(item.id, 1);
            console.log(`${item.name} ajouté à l’inventaire.`);
        } else {
            console.log("Vous laissez l’objet.");
        }
    }
}
```

---

# 🟦 7) Étape 5 — Vérifier InventoryEngine (tu l’as déjà)

Tu as déjà :

- `addItem(item_id, quantity)`
- `equipItem(item_id)`
- `removeItem(item_id)`
- `hasItem(item_id)`

Donc tout est compatible.

---

# 🎉 Résultat final

Quand le joueur arrive sur un paragraphe avec un objet :

### Exemple 1 — Objet consommable

```
Vous trouvez : Potion de Force
Voulez-vous le prendre ?
1. Oui
2. Non
Votre choix : 1
Potion de Force ajouté à l’inventaire.
```

### Exemple 2 — Objet équipable

```
Vous trouvez : Épée Magique
Que voulez-vous faire ?
1. L’équiper
2. Le mettre dans l’inventaire
3. Ne pas le prendre
Votre choix : 1
Épée Magique équipé !
```

### Exemple 3 — Objet divers

```
Vous trouvez : Clé en bronze
Voulez-vous le prendre ?
1. Oui
2. Non
Votre choix : 1
Clé en bronze ajouté à l’inventaire.
```

---

# 🧠 Tu veux aller plus loin ?

Je peux t’aider à ajouter :

- un **poids maximum** (gestion de charge)  
- un **système d’équipement complet** (arme, armure, anneau, etc.)  
- un **affichage de l’inventaire** dans un menu  
- un **système de consommation d’objets** (potions, repas)  
- un **système de description détaillée** des objets  

Tu veux quelle évolution ?