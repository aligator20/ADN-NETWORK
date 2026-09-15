# Vidéo de présentation — script de tournage

**Durée** 80 secondes · **Format** 1080 × 1350 (4:5) · **Voix** la vôtre, en
français · **Sous-titres** obligatoires, incrustés

---

## Les quatre règles qui décident du reste

**Tourner en 4:5, pas en 16:9.** Sur LinkedIn la vidéo est regardée au
téléphone, dans un fil vertical. Une vidéo 16:9 occupe le tiers de la hauteur
d'un format 4:5 : à contenu égal, elle est vue moitié moins longtemps. Si la
vidéo doit aussi servir en story Instagram ou en TikTok, tourner en 1080 × 1920
et recadrer vers le 4:5 pour LinkedIn — l'inverse ne marche pas.

**Les sous-titres ne sont pas une option.** La très grande majorité des vidéos
LinkedIn démarrent sans le son. Une vidéo sans sous-titres incrustés est une
vidéo muette. Ils doivent être *dans l'image*, pas dans un fichier `.srt` :
LinkedIn n'affiche pas toujours le fichier joint.

**Les trois premières secondes sont le post.** Pas de logo animé, pas de
« bonjour à tous ». La première image porte déjà la phrase qui arrête le
défilement. Le logo vient à la fin, quand on a gagné le droit de le montrer.

**Ne pas remaquetter le site.** Toutes les images de cette vidéo sont soit une
capture d'écran du site réel, soit une diapositive du carrousel déjà produite
dans `carrousel/`. Refaire les visuels dans un logiciel de montage introduit
un deuxième jeu de prix à maintenir — exactement ce que le générateur existe
pour éviter.

---

## Ce qui est déjà prêt, et ce qui ne l'est pas

**Prêt :** les images fixes. `site/` contient quinze captures du site en haute
densité — l'accueil, les prix, le schéma, les quatre démonstrations —, et
`carrousel/` les douze diapositives. Tout ça se pose tel quel dans un montage.

**Prêt aussi :** `schema-anime.gif`, la boucle du schéma du réseau. C'est la
seule animation du kit, et elle sert au plan C ci-dessous si vous préférez ne
pas filmer.

**Pas prêt, et ça ne peut pas l'être :** les plans où l'on voit quelqu'un
*manipuler* le site. Une capture fixe ne montre pas qu'un stock bouge quand on
enregistre une vente. Ces cinq plans-là demandent un enregistrement d'écran —
c'est l'objet de la section suivante.

## Ce qu'il faut enregistrer avant de monter

Cinq captures d'écran animées, prises **sur téléphone ou en fenêtre étroite**
(le site est conçu pour ça, et la capture sera en vertical).

| # | Adresse | Ce qu'on filme | Durée utile |
|---|---|---|---|
| A | `adn-network.netlify.app` | L'arrivée sur l'accueil, le titre qui se compose | 6 s |
| B | `/services` | Le défilement sur la liste des dix prix | 10 s |
| C | `/services` (bloc « Les liaisons ») | **Le schéma du réseau qui s'anime tout seul** | 8 s |
| D | `/demo/pilotage/` | Enregistrer une vente, voir le stock bouger | 8 s |
| E | `/demo/reseau/` | Taper un nombre d'hôtes dans l'établi VLSM, voir le plan sortir | 8 s |

> **Le plan C est le plus important de la vidéo.** Le schéma du réseau est déjà
> animé sur le site : les liens d'entrée coulent vers l'annuaire, les deux
> retours coulent en sens inverse. C'est du mouvement réel, gratuit, qui dit
> exactement ce que la voix est en train de dire. Le filmer en défilant
> lentement, sans rien toucher, et le laisser respirer.
>
> Si l'enregistrement d'écran est mauvais — saccades, barre de défilement —,
> `schema-anime.gif` fait le même plan, en boucle propre, et s'importe
> directement dans n'importe quel logiciel de montage.

---

## Le script, plan par plan

### 00:00 → 00:04 — L'accroche

**Image** Fond noir. Rien d'autre. Le texte apparaît d'un bloc, pas lettre par
lettre.

**Texte à l'écran** (Archivo Black, grand, blanc cassé)

> L'annuaire de mon réseau
> est vide.

**Voix** — *rien.* Quatre secondes de silence sur cette phrase. C'est la seule
fois de la vidéo où le silence travaille mieux que la voix.

---

### 00:04 → 00:12 — La raison

**Image** Plan A — l'arrivée sur l'accueil du site.

**Texte à l'écran** `Je préfère l'écrire.`

**Voix**
> Je préfère l'écrire que vous laisser le découvrir. Un réseau qui se prétend
> plein quand il est vide perd tout à la première recherche.

---

### 00:12 → 00:26 — Ce que c'est

**Image** Plan B — le défilement sur les dix prestations. Laisser voir les
prix, ne pas accélérer.

**Texte à l'écran** `Dix prestations. Nommées et chiffrées.`

**Voix**
> ADN NETWORK, c'est dix prestations nommées et chiffrées. Pas une liste de
> compétences que personne ne sait commander. Un site complet, deux cent
> vingt-cinq mille. Une page, trente-sept mille cinq cents. Un parcours, vingt-
> deux mille cinq cents.

---

### 00:26 → 00:34 — Le prix, et ce qu'il n'est pas

**Image** Diapositive `carrousel/05.png`, tenue à l'écran. Un léger mouvement
d'échelle, très lent, pour qu'elle ne soit pas figée.

**Texte à l'écran** — celui de la diapositive, rien à ajouter.

**Voix**
> Ce sont des planchers, ils sont publiés, et ils n'ont aucune date limite. Un
> prix qui expire est un prix qu'on n'assumait pas.

---

### 00:34 → 00:50 — Les trois liaisons *(le cœur)*

**Image** Plan C — le schéma du réseau qui s'anime.

**Texte à l'écran**, en trois apparitions successives calées sur la voix :

> L'Annuaire — 0 F
> La Mise en relation — 0 F
> Le Parrainage — 20 %

**Voix**
> Et trois choses qui ne se vendent pas. Toute page que je produis entre dans un
> annuaire public, à vie. Une demande qui m'arrive repart vers quelqu'un de cet
> annuaire, nommément. Et si vous amenez quelqu'un, vous touchez vingt pour cent
> de sa première commande.

---

### 00:50 → 00:58 — Pourquoi c'est un réseau

**Image** Le schéma, arrêté sur les deux flèches de retour. Zoom lent dessus.

**Texte à l'écran** `Ce qui entre. Ce qui repart.`

**Voix**
> C'est la seule différence réelle entre une agence et un réseau. Ce qui a de la
> valeur ici ne dépend pas de ce que je fabrique, mais de combien nous sommes.

---

### 00:58 → 01:10 — La preuve

**Image** Plans D puis E, coupés serré. On voit une main taper, un chiffre
changer, un plan d'adressage se calculer.

**Texte à l'écran** `Cinq démonstrations ouvertes.`

**Voix**
> Cinq démonstrations sont ouvertes. Un poste de pilotage, un site client, un
> dossier d'agence IA, quatre chantiers, un parcours réseau. Rien n'est une
> capture d'écran : ça s'ouvre, et ça se manipule.

---

### 01:10 → 01:20 — La sortie

**Image** Fond noir. Le bloc de marque apparaît — `ADN` plein, `NETWORK` en
filaire — puis les dix pastilles de couleur, une par une, de gauche à droite.
La diapositive `carrousel/10.png` fournit exactement cette composition.

**Texte à l'écran**

> La première place
> vaut mieux que la centième.
>
> adn-network.netlify.app
> +229 01 56 22 37 76

**Voix**
> La première place dans cet annuaire vaut mieux que la centième.

---

## Le montage en 30 secondes

Pour les stories et pour republier plus tard, garder uniquement :

- **00:00 → 00:04** l'accroche, intacte
- **00:34 → 00:50** les trois liaisons et le schéma
- **01:10 → 01:20** la sortie

Ne pas couper dans l'accroche pour gagner deux secondes. C'est la seule partie
qui décide si le reste est vu.

---

## Réglages techniques

| | |
|---|---|
| Définition | 1080 × 1350, 30 images/s |
| Sous-titres | JetBrains Mono ou Archivo, blanc cassé `#ECECEE`, fond noir à 70 % derrière le texte |
| Bas de cadre | Garder 180 px libres : LinkedIn y superpose le nom et les boutons |
| Musique | Aucune sous la voix. Une nappe très basse est acceptable sur les quatre premières secondes et sur la sortie, pas entre les deux |
| Fichier | MP4, H.264, moins de 200 Mo |
| Vignette | `carrousel/01.png` — recadrée au centre, elle donne le bloc de marque |

---

## Les deux phrases à ne pas prononcer

**« Nous sommes une agence leader. »** Le site dit l'inverse à chaque page, et
l'annuaire vide contredit la phrase dans la même vidéo.

**« Offre de lancement. »** Les prix affichés ne sont pas promotionnels. Les
annoncer comme tels oblige à les augmenter un jour — devant les mêmes gens qui
auront vu cette vidéo.
