# Kit LinkedIn

De quoi présenter ADN NETWORK au public : un carrousel de dix diapositives, les
deux formats paysage, le texte du post et le script de la vidéo.

## Ce qu'il y a dans le dossier

| Fichier | Taille | À quoi ça sert |
|---|---|---|
| `ADN-NETWORK-carrousel.pdf` | 10 pages | **Le fichier à téléverser.** Post « document » LinkedIn, paginé avec les flèches |
| `carrousel/01…10.png` | 1080 × 1350 | Les mêmes diapositives à l'unité — pour WhatsApp, Instagram, une pièce jointe |
| `post-1200x627.png` | 1200 × 627 | L'image d'un post à lien simple |
| `banniere-1584x396.png` | 1584 × 396 | La bannière de profil ou de page entreprise |
| `TEXTE-DU-POST.md` | — | Trois versions du texte, le premier commentaire, les mots-dièse |
| `SCRIPT-VIDEO.md` | — | La vidéo de 80 secondes, plan par plan |
| `generer.js` | — | Ce qui produit tout ce qui précède |

`public/og.png` est régénéré au passage : c'est la vignette qu'affiche LinkedIn
quand on colle l'adresse du site, et elle doit dire la même chose que le reste.

## Régénérer

```bash
node kit-linkedin/generer.js
```

Aucune installation : le script utilise `sharp` et `jiti`, déjà présents dans
les dépendances du site. Il récupère les deux fontes de la marque au premier
lancement, dans `.fontes/`, ignoré par git.

## Pourquoi un script plutôt que dix fichiers dessinés

Le carrousel annonce dix prix, trois liaisons, le nombre de disciplines et le
nombre de réalisations publiées. **Aucune de ces valeurs n'est écrite ici.**
Elles sont lues dans `src/content/` au moment de la génération.

C'est la seule façon d'avoir un carrousel qui ne se trompe pas : un visuel
dessiné à la main est juste le jour où on l'exporte, et faux dès la modification
suivante — sauf qu'il continue de circuler sur LinkedIn, où rien ne se corrige
après publication. Changer un prix dans `vedettes.ts`, relancer le script,
republier : les deux disent la même chose.

Corollaire : **après toute modification des prix ou des prestations, relancer le
script et republier.** Un carrousel qui traîne avec l'ancienne grille est pire
que pas de carrousel.

## Les trois contrôles que le script fait à votre place

Ils ne sont pas décoratifs — chacun a été ajouté après une panne réelle.

**Les fontes.** Quand fontconfig ne trouve pas Archivo, il n'échoue pas : il
substitue une serif système et rend une image parfaitement valide. Les dix
premières diapositives sont sorties comme ça. Le script rend maintenant un texte
témoin dans chaque fonte et dans une famille inexistante : si deux rendus sont
identiques, il s'arrête.

**Les débordements.** Chaque ligne est mesurée dans les vraies chasses de la
fonte avant d'être écrite. Un titre trop long fait échouer le script au lieu de
sortir coupé au bord du cadre.

**Le pied de page.** Chaque diapositive déclare jusqu'où elle descend. Deux
d'entre elles écrivaient par-dessus l'adresse du site sans que rien ne le
signale.

## À savoir avant de publier

**Le carrousel se publie en PDF, pas en dix images.** `+` → `Ajouter un
document` → `ADN-NETWORK-carrousel.pdf`. Titre à saisir : `Un réseau, plutôt
qu'un catalogue`. Téléverser les PNG un par un donne un défilement latéral sans
pagination, et la couverture perd son rôle.

**La bannière est décalée vers la droite exprès.** La photo de profil vient se
poser en bas à gauche et mange un disque d'environ 300 px. Le bloc de marque
commence à 420 px du bord gauche pour cette raison.

**Le lien va dans le premier commentaire.** Voir `TEXTE-DU-POST.md`.

## Les fontes

Archivo (Omnibus-Type) et JetBrains Mono (JetBrains), toutes deux sous SIL Open
Font License 1.1 : redistribuables, modifiables, utilisables commercialement.
Ce sont exactement celles du site — le carrousel et la page ne peuvent pas avoir
l'air de venir de deux endroits différents.

Elles sont téléchargées à la demande plutôt que stockées dans le dépôt : leurs
auteurs les publient déjà mieux que nous ne les archiverions.
