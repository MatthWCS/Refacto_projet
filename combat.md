Matthieu…  
Là tu veux passer à **un vrai mode “livre‑jeu interactif”**, où tu peux :

- décider **à chaque round** si tu utilises la Chance  
- choisir **comment** tu l’utilises (réduire dégâts subis / augmenter dégâts infligés)  
- décider **si tu continues le combat**  
- décider **si tu tentes la fuite** (si autorisée)  

Et tout ça **dans test-app.js**, sans casser ton moteur.

Je vais te donner **une architecture propre**, simple à intégrer, et surtout **qui ne touche pas ton moteur**.  
On va juste intercepter les rounds **entre** `assaultMultiple()` et `applyDuringCombatRules()`.

---

# 🟦 1. Le principe

Dans `fightMultiple()` :

- tu fais un round → `result = assaultMultiple()`
- AVANT d’appliquer les dégâts → tu appelles ton `io.askChanceDecision(result)`
- tu modifies `result` selon la décision
- tu appliques les dégâts
- tu demandes si on continue ou si on fuit

Donc on ajoute **deux hooks** :

### ✔ `io.askLuckUsage(result)`  
→ demande si tu veux utiliser la Chance  
→ et comment

### ✔ `io.askContinueOrFlee(canFlee)`  
→ demande si tu veux continuer ou fuir

---

# 🟩 2. Ajouter les hooks dans test-app.js

Juste après ton `io = { ask, showRound }`, tu ajoutes :

```js
io.askLuckUsage = async function (result) {
    console.log("\n Souhaites-tu utiliser la Chance ?");
    console.log("1. Non");
    console.log("2. Oui, pour réduire les dégâts subis");
    console.log("3. Oui, pour augmenter les dégâts infligés");

    const answer = await ask("Ton choix : ");

    if (answer === "2") return "reduce";
    if (answer === "3") return "increase";
    return "none";
};

io.askContinueOrFlee = async function (canFlee) {
    console.log("\n Continuer le combat ?");
    console.log("1. Oui");
    if (canFlee) console.log("2. Fuir");

    const answer = await ask("Ton choix : ");

    if (answer === "2" && canFlee) return "flee";
    return "continue";
};
```

---

# 🟦 3. Modifier CombatEngine pour appeler ces hooks

Dans `fightMultiple()` **juste après** :

```js
const result = this.assaultMultiple(monsters);
```

Ajoute :

```js
// 🔹 MODE PAS À PAS : choix d'utiliser la Chance
if (this.stepByStep && this.io) {
    const luckChoice = await this.io.askLuckUsage(result);

    if (luckChoice !== "none") {
        const luckRoll = Dice.testLuck(this.heroEngine.hero);

        if (luckRoll.success) {
            if (luckChoice === "reduce" && result.charactersHitHero > 0) {
                result.charactersHitHero = Math.max(0, result.charactersHitHero - 1);
                console.log(" Chance réussie ! Tu réduis les dégâts subis.");
            }
            if (luckChoice === "increase" && result.enemyHit) {
                result.extraDamage = 2;
                console.log(" Chance réussie ! Tu infliges +2 dégâts.");
            }
        } else {
            if (luckChoice === "reduce" && result.charactersHitHero > 0) {
                result.charactersHitHero += 1;
                console.log(" Chance ratée ! Tu subis +1 dégât.");
            }
            if (luckChoice === "increase" && result.enemyHit) {
                result.extraDamage = -1;
                console.log(" Chance ratée ! Tu infliges -1 dégât.");
            }
        }
    }
}
```

Ensuite, dans `applyDuringCombatRules()` tu ajoutes :

```js
if (result.extraDamage) {
    if (result.enemyHit) {
        heroTarget.endurance -= result.extraDamage;
    }
}
```

---

# 🟩 4. Ajouter la décision “continuer ou fuir”

Toujours dans `fightMultiple()`, **juste avant** de passer au round suivant :

```js
if (this.stepByStep && this.io) {
    const choice = await this.io.askContinueOrFlee(this.canFlee(rules));

    if (choice === "flee") {
        this.applyFleePenalty(rules);
        return { outcome: "fled", log };
    }
}
```

---

# 🟦 5. Résultat final

Tu obtiens un mode console où :

### À chaque round :

- tu vois le round  
- tu choisis si tu utilises la Chance  
- tu choisis comment tu l’utilises  
- tu vois le résultat du test de Chance  
- tu vois les dégâts modifiés  
- tu choisis si tu continues ou si tu fuis  

C’est exactement comme dans les Défis Fantastiques.
