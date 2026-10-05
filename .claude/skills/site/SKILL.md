---
name: site
description: Travailler sur le site ADN NETWORK — où vit chaque texte, la règle bilingue, ajouter une réalisation au portfolio, les prix et leur source unique, les règles de direction artistique à ne pas casser, les pièges connus. À utiliser dès qu'on touche au dépôt adn-network : « change ce texte », « ajoute un projet », « corrige un prix », « ajoute une page », « pourquoi c'est fait comme ça », ou /site.
---

# Travailler sur le site

Le site n'est pas une vitrine, c'est un **instrument**. Il est en export
statique : aucun serveur, aucune base, tout est prérendu au build. Ce qui suit
est ce qu'on ne peut pas deviner en lisant le code.

**Tu prépares, Sylvère valide et publie.** Pour mettre en ligne, voir le skill
`publier`.

---

## La règle qui explique tout le reste

**Une information n'existe qu'à un seul endroit.** Le site a déjà payé le prix
de l'inverse : une fiche projet affichait « 5 000 F le pack », le prix est passé
à 8 000 F dans la semaine, et la page est restée fausse — soixante pour cent
d'écart, sur une page que personne ne pensait à rouvrir.

D'où trois interdits, qui ne se négocient pas :

1. **Aucun texte en dur dans un composant.** Tout passe par `src/content/`.
2. **Aucun prix recopié.** Les montants vivent dans `vedettes.ts` et
   `vitrine.ts`. Une page qui les affiche les y lit — la boutique le fait.
3. **Aucun décompte écrit à la main.** « Dix disciplines », « dix-sept
   prestations » se calculent sur les tableaux. Le nombre de disciplines a déjà
   annoncé 7 alors que la liste en comptait 9.

---

## Où vit quoi

| Besoin | Fichier |
|---|---|
| Nom, baseline, coordonnées, menu, libellés d'interface | `src/content/site.ts` |
| Les 10 disciplines, leur code couleur | `src/content/services.ts` |
| **Les 10 prestations chiffrées et les 3 liaisons** | `src/content/vedettes.ts` |
| **Les 3 formules web et les 4 travaux à la carte** | `src/content/vitrine.ts` |
| **Les réalisations du portfolio** | `src/content/projects.ts` |
| La boutique : familles, sélection, formulaire de commande | `src/content/boutique.ts` |
| Le Réseau (communauté, candidature) | `src/content/community.ts` |
| Les publications réseaux sociaux | `src/content/actualites.ts` |
| Mentions légales et confidentialité | `src/content/legal.ts` |
| Couleurs, typographie, primitives de DA | `src/app/globals.css` (bloc `@theme`) |
| Durées, easings, staggers partagés | `src/lib/motion.ts` |
| Mise en forme des prix | `src/lib/prix.ts` |

Les versions anglaises sont dans `src/content/en/`, et `src/content/copy.ts`
est le seul point d'entrée : `copy(lang)`.

---

## Le bilingue : le contrat qui empêche d'oublier une traduction

Le type `Copy` est **écrit à la main** dans `copy.ts`, et c'est délibéré. Le
déduire du français avec `typeof` donnerait des types littéraux — aucune
traduction ne serait assignable. Écrit explicitement, il produit l'inverse du
piège : **ajouter un libellé au français et oublier l'anglais devient une
erreur de compilation**, pas un texte français qui traîne dans une page
anglaise.

Donc : on ajoute un champ au français → on l'ajoute à l'anglais → `npm run
typecheck` dit si on a oublié.

Ce qui n'est PAS dans `Copy` : couleurs, identifiants de discipline, slugs,
statuts. Ce sont des données de structure, communes aux deux langues.

**Les routes** vivent en double : `src/app/(fr)/…` et `src/app/(en)/en/…`.
`href("/chemin-fr")` (hook `useHref`) traduit un chemin de référence français
vers la langue courante. Toujours passer par lui dans un composant client.

---

## Ajouter une réalisation au portfolio

Une seule chose à faire : ajouter un objet au tableau `projects` de
`src/content/projects.ts`, puis sa traduction dans `en/projects.ts` (le type
exige une entrée par slug — un oubli ne compile pas).

```ts
{
  slug: "mon-projet",          // identifiant d'URL, doit rester STABLE
  title: "Mon Projet",
  year: 2026,
  discipline: "cybersecurity", // ← suffit à tout classer
  status: "livre",             // livre · exploitation · construction · financement · etude
  summary: "Une phrase : ce que le projet change.",
  stack: ["Audit", "Durcissement"],
  cover: "/work/mon-projet.webp", // facultatif
}
```

`discipline` fait le reste : la catégorie, sa couleur, son libellé, son
compteur et sa présence dans le filtre sont **tous dérivés**. Il n'existe
aucune liste de catégories à maintenir à côté.

**`status` est obligatoire, et ce n'est pas de la bureaucratie.** Sans lui, un
plan d'affaires et une réalisation livrée s'affichaient exactement pareil. Un
investisseur repère les dates, comprend que certains projets n'existent pas
encore, et doute alors de *tous* les autres. Annoncer « ce projet cherche son
financement » ne coûte aucune crédibilité ; le laisser deviner en coûte.

### `prouve` — ce que la réalisation atteste en plus

Une réalisation n'a qu'une discipline, mais elle appuie souvent plusieurs
prestations. FullMesh Shop est un site (`digital`) ; c'est aussi l'offre IA
montée pour nous-mêmes, donc la preuve de la prestation `ai`.

```ts
prouve: ["ai", "creative"],
```

C'est ce champ qui remplit le portfolio de chaque prestation sur la boutique.
On ajoute, on dit ce que ça prouve, ça apparaît sous les bonnes cartes.

⚠️ **Ne coche jamais un service qu'une réalisation n'a pas réellement
produit.** Ça se retourne au premier client qui ouvre la fiche et n'y trouve
pas ce qu'on lui a annoncé.

### La couverture

Les plaques s'affichent au plus à ~26vw en 4:5. Au-delà de 1000 px de large, on
paie de la bande passante que personne ne voit — le PNG du t-shirt pesait
2,1 Mo, il en fait 95 Ko en WebP.

```bash
npx sharp-cli --input photo.png --output public/work/projet.webp resize 1000 --withoutEnlargement -- webp --quality 82
```

Sans `cover`, la galerie compose une plaque teintée à la couleur de la
discipline : le projet est présentable dès son ajout.

---

## La direction artistique : trois règles non négociables

| Règle | Traduction concrète |
|---|---|
| **Pas de carte** | Aucun `rounded-2xl border shadow` empilé. Grille typographique, filets de contact, masques. |
| **Le vide est un matériau** | Au moins 40 % de surface vide en permanence. La densité est un événement, pas un état. |
| **La couleur est un code** | Fond noir. Les couleurs de discipline ne décorent jamais : elles **désignent**. Une teinte par bloc, jamais deux. |

**Typographie** : `Archivo` en display, `JetBrains Mono` pour tout ce qui est
machine (index, labels, compteurs). Pas de troisième famille.

⚠️ **Le contraste.** `text-steel` (#2A2A30) donne **1,43:1** sur le fond du
site, très en dessous du seuil de 4,5:1. Il convient à un séparateur décoratif,
**jamais à du texte porteur de sens** — utiliser `text-fog` (5,00:1).

---

## Les conventions de motion

- **GSAP** pilote toute la chorégraphie : timelines, pin, scrub, révélations.
- **Framer Motion** est réservé aux entrées/sorties d'éléments montés puis
  démontés (menu, overlays). Jamais pour du scroll.
- **Three.js** ne sert qu'au champ hélicoïdal. Toute nouvelle idée 3D doit
  d'abord échouer en CSS/GSAP avant de justifier une scène WebGL.
- Toujours animer `transform` et `opacity`. Jamais `top`, `left`, `width`.
- Toute animation doit avoir un chemin `prefers-reduced-motion`.

⚠️ **Piège d'une grille filtrable** : ne pas animer les éléments filtrés avec
un `gsap.from(...)` à l'apparition. Une carte laissée invisible par un `from`
non rejoué disparaît au changement de filtre. La boutique anime ses bandes, pas
ses cartes.

---

## Les pièges déjà payés

- **Ancres inter-routes** : au montage d'une route le document est encore
  court, les pins n'ont pas ajouté leur hauteur, et le navigateur écrête le
  scroll sans rien signaler. `AppShell` vise, **contrôle** que la cible est
  atteinte, et recommence (borné à 8 tentatives).
- **Formulaires Netlify** : ils sont enregistrés en lisant le HTML produit au
  **build**. Un formulaire monté seulement à l'ouverture d'un panneau n'existe
  pas à ce moment-là — il accepterait les envois sans les enregistrer. Le
  formulaire de commande de la boutique est donc toujours dans le DOM, masqué
  par `hidden`.
- **Dates et heures** : composer les mois à la main plutôt que par
  `toLocaleDateString`, sinon le serveur et le navigateur peuvent différer et
  l'hydratation casse.
- **`localStorage`** : toujours dans un `try/catch`, et lu **après** le premier
  rendu. Lu pendant le rendu, il fait diverger le HTML prérendu.
- **Embarquer un tiers** (iframe Facebook, vidéo) : le site promet dans ses
  mentions légales qu'aucun tiers ne charge sans action du visiteur. Un embed
  se fait donc en **clic-pour-charger**, et la promesse se relit avant.

---

## Vérifier son travail

```bash
npm run typecheck     # le contrat bilingue, surtout
npm run lint
npm run build         # l'export statique complet
```

Puis regarder la page dans le navigateur. Un `tsc` vert ne dit rien d'une
mise en page.
