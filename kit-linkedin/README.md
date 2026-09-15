# Kit LinkedIn

De quoi présenter ADN NETWORK au public : les captures du site, un carrousel de
douze diapositives, les formats paysage, une animation, le texte du post et le
script de la vidéo.

## Ce qu'il y a dans le dossier

| Fichier | Format | À quoi ça sert |
|---|---|---|
| `ADN-NETWORK-carrousel.pdf` | 12 pages | **Le fichier à téléverser.** Post « document » LinkedIn, paginé avec les flèches |
| `carrousel/01…12.png` | 1080 × 1350 | Les mêmes diapositives à l'unité — WhatsApp, Instagram, une pièce jointe |
| `site/*.png` | 2880 × 1800 | **Les captures du site réel**, en haute densité. 15 pages et démonstrations |
| `schema-anime.gif` | 1080 × 800 | Le schéma du réseau en boucle, 1,8 s. Se publie tel quel |
| `post-1200x627.png` | 1200 × 627 | L'image d'un post à lien simple |
| `banniere-1584x396.png` | 1584 × 396 | La bannière de profil ou de page entreprise |
| `TEXTE-DU-POST.md` | — | Trois versions du texte, le premier commentaire, les mots-dièse |
| `SCRIPT-VIDEO.md` | — | La vidéo de 80 secondes, plan par plan |

`public/og.png` est régénéré au passage : c'est la vignette qu'affiche LinkedIn
quand on colle l'adresse du site, et elle doit dire la même chose que le reste.

## Régénérer

Dans cet ordre — le carrousel a besoin des captures, et les captures ont besoin
du build.

```bash
npm run build && node kit-linkedin/captures.js && node kit-linkedin/generer.js && node kit-linkedin/anime.js
```

Aucune installation : `sharp` et `jiti` viennent des dépendances du site, et les
captures utilisent Chrome ou Edge déjà présent sur la machine, piloté par le
protocole DevTools. Les deux fontes de la marque sont récupérées au premier
lancement dans `.fontes/`, ignoré par git.

## Les trois scripts

**`captures.js`** sert `out/` en local et photographie quinze pages — l'accueil
en grand écran et en téléphone, les disciplines, les prix, le schéma, la
vitrine, la boutique, une fiche projet, quatre démonstrations. Elles sont prises
sur le dernier build, pas sur le site en ligne : ce qu'on montre est le code du
dépôt, pas un déploiement d'il y a trois jours.

**`generer.js`** compose les douze diapositives, le PDF, les deux formats
paysage et l'image de partage.

**`anime.js`** produit la boucle du schéma. Pas de vidéo : il n'y a pas
d'encodeur sur cette machine, et LinkedIn convertit les GIF en vidéo à la
lecture. Ça ne remplace pas la vidéo de présentation — voir `SCRIPT-VIDEO.md`.

## Pourquoi des scripts plutôt que des fichiers dessinés

Le carrousel annonce dix prix, trois liaisons, le nombre de disciplines et de
réalisations publiées. **Aucune de ces valeurs n'est écrite ici** : elles sont
lues dans `src/content/` à la génération. Les captures, elles, viennent du build.

C'est la seule façon d'avoir une présentation qui ne se trompe pas. Un visuel
dessiné à la main est juste le jour où on l'exporte et faux à la modification
suivante — sauf qu'il continue de circuler sur LinkedIn, où rien ne se corrige
après publication.

Corollaire : **après toute modification des prix, des prestations ou du design,
relancer la chaîne et republier.** Un carrousel qui traîne avec l'ancienne
grille est pire que pas de carrousel.

## Les contrôles que les scripts font à votre place

Aucun n'est décoratif ; chacun a été ajouté après une panne réelle.

**Les fontes.** Quand fontconfig ne trouve pas Archivo, il n'échoue pas : il
substitue une serif système et rend une image parfaitement valide. Les dix
premières diapositives sont sorties comme ça. Le script rend maintenant un texte
témoin dans chaque fonte et dans une famille inexistante ; si deux rendus sont
identiques au pixel près, il s'arrête.

**Les débordements.** Chaque ligne est mesurée dans les vraies chasses du
fichier de fonte avant d'être écrite. Un titre trop long fait échouer le script
au lieu de sortir coupé au bord du cadre.

**Le pied de page.** Chaque diapositive déclare jusqu'où elle descend. Deux
écrivaient par-dessus l'adresse du site, et le contrôle en a trouvé une
troisième que la relecture avait laissée passer.

**Les dimensions.** librsvg lit les dimensions d'un SVG comme des points : à la
densité par défaut, un document de 1080 × 1350 sort en 1440 × 1800. La taille
obtenue est vérifiée contre celle déclarée — la bannière doit faire exactement
1584 × 396, sinon LinkedIn la recadre.

**Les sélecteurs de capture.** Un sélecteur introuvable ne casse pas la capture :
elle sort cadrée en haut de page, ce qui ressemble à une capture réussie. Le
script le signale et s'arrête.

## À savoir avant de publier

**Le carrousel se publie en PDF, pas en douze images.** `+` → `Ajouter un
document` → `ADN-NETWORK-carrousel.pdf`. Titre à saisir : `Un réseau, plutôt
qu'un catalogue`. Téléverser les PNG un par un donne un défilement latéral sans
pagination, et la couverture perd son rôle.

**La bannière est décalée vers la droite exprès.** La photo de profil se pose en
bas à gauche et mange un disque d'environ 300 px.

**Le lien va dans le premier commentaire.** Voir `TEXTE-DU-POST.md`.

## Les fontes

Archivo (Omnibus-Type) et JetBrains Mono (JetBrains), toutes deux sous SIL Open
Font License 1.1 : redistribuables, modifiables, utilisables commercialement.
Ce sont exactement celles du site — le carrousel et la page ne peuvent pas avoir
l'air de venir de deux endroits différents.

Elles sont téléchargées à la demande plutôt que stockées dans le dépôt : leurs
auteurs les publient déjà mieux que nous ne les archiverions.
