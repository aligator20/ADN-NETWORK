# Les photographies du site — d'où elles viennent, et ce qu'on a le droit d'en faire

> ⚠️ **AUCUNE IMAGE N'ENTRE DANS `public/` SANS SA LIGNE ICI.** Une photo dont
> on ne sait plus d'où elle vient est une photo qu'on retirera en urgence le
> jour où quelqu'un la réclamera. La ligne se écrit AVANT que le fichier soit
> commité.

## Ce que ces images sont, et ce qu'elles ne sont pas

Ce sont des **illustrations**. Elles ne montrent **aucun client d'ADN NETWORK**,
aucune réalisation, aucun lieu où nous serions intervenus. Les personnes
photographiées n'ont aucun lien avec l'entreprise et n'ont rien approuvé.

Elles ne doivent donc jamais être placées de façon à laisser croire le
contraire : pas de légende qui nomme quelqu'un, pas de proximité avec un
témoignage, pas d'emploi dans la section des réalisations. Le portfolio, lui,
ne porte que de vraies captures de vrais livrables.

## Le traitement appliqué

Toutes passent par la même main : recadrage par zone d'intérêt, **saturation à
0,72**, **luminosité à 0,82**, export WebP. Le site est monochrome titane ; une
photo sortie de l'appareil y crie. Après traitement elle reste vivante, mais la
couleur signal demeure la seule teinte vive de la page.

## Le relevé

| Fichier | Source | Licence | Relevé le |
|---|---|---|---|
| `methode-hero.webp` | Pexels — photo n° 34523107 | Licence Pexels | 23.11.2026 |
| `methode-constat.webp` | Pexels — photo n° 30275077 | Licence Pexels | 23.11.2026 |
| `methode-etapes.webp` | Pexels — photo n° 13801809 | Licence Pexels | 23.11.2026 |

Adresse d'origine : `https://www.pexels.com/photo/<numéro>/`

## Ce que la licence Pexels autorise

Usage gratuit, y compris commercial, sans attribution obligatoire. Modification
autorisée. Interdits : revendre la photo telle quelle, et laisser croire qu'une
personne photographiée recommande un produit ou un service.

**Ce dernier point est exactement la raison de la section « Ce que ces images
sont » ci-dessus.** Ce n'est pas une précaution de confort : c'est une
condition de la licence.

## À faire, dès que possible

Remplacer ces photographies par **les photos de Sylvère**, prises sur le
terrain avec l'accord des personnes. Elles seront plus justes, elles
appartiendront à l'entreprise, et personne d'autre ne les aura. Le jour venu,
ce fichier porte les accords écrits à la place des licences.

---

# Les images ajoutées le 25 novembre 2026

Ce jour-là, quatre pages n'avaient aucune image : `/services`, `/reseau`,
`/vitrine` et `/boutique`. Deux sources ont été employées, et elles ne se
mélangent pas.

## 1. Les photographies — Freepik, licence gratuite

⚠️ **LA LICENCE GRATUITE DE FREEPIK EXIGE UNE ATTRIBUTION VISIBLE.** Elle est
portée par la page des mentions légales. Si ces fichiers restent et que la
mention disparaît, le site n'est plus en règle — les deux vont ensemble.

Même traitement que les trois photographies de `/methode` : recadrage,
**saturation 0,72**, **luminosité 0,82**, export WebP. Il est maintenant écrit
en code plutôt que refait à la main, pour que la prochaine entre au même
réglage.

| Fichier | Source | Licence | Relevé le |
|---|---|---|---|
| `services-couture.webp` | Freepik — ressource n° 26152868 | Freepik gratuite, attribution requise | 25.11.2026 |
| `reseau-marche.webp` | Freepik — ressource n° 16538591 | Freepik gratuite, attribution requise | 25.11.2026 |
| `vitrine-artisane.webp` | Freepik — ressource n° 17244236 | Freepik gratuite, attribution requise | 25.11.2026 |

Elles montrent des personnes. La règle du haut de ce fichier s'applique donc
entièrement : **ce ne sont pas des clients d'ADN NETWORK**, elles ne portent
aucune légende nommant quelqu'un, et elles ne voisinent aucun témoignage.

## 2. Les dix disciplines — images produites par IA

Une image par métier déclaré dans `src/content/services.ts`, nommée d'après
l'identifiant de sa discipline pour que le code la retrouve sans table de
correspondance. Produites le 25 novembre 2026 à la demande de Sylvère.

**Aucune ne montre de personne, et c'est la règle qui les gouverne.** Un
visage fabriqué sur un site qui promet de ne rien inventer se retourne contre
lui le jour où quelqu'un le repère. Ce sont donc des matières et des objets.

| Fichier | Source | Licence | Produite le |
|---|---|---|---|
| `disciplines/digital.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/ai.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/automation.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/network.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/cybersecurity.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/creative.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/agritech.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/farming.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/food.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/sante.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |
| `disciplines/fibre.webp` | Produite par IA pour ADN NETWORK | Aucune — production propre | 25.11.2026 |

**Un écart de traitement, écrit plutôt que caché :** la saturation est bien à
0,72, mais la luminosité n'est PAS abaissée à 0,82. La consigne de génération
demandait déjà une image presque noire ; l'abaisser encore donnait une bande
illisible — constaté le même jour sur la bande de l'accueil, où des captures
sombres mises bout à bout ne laissaient rien voir.

## 3. Les couvertures de la boutique — `public/boutique/`

Vingt-deux fichiers, relevés sur la boutique Chariow de Full Mesh Shop le
25 novembre 2026. Ce sont **les visuels de l'entreprise elle-même** : aucune
licence tierce, rien à attribuer. Les vignettes carrées ont été prises plutôt
que les bannières, et **les douze qui portaient un prix incrusté ont été
nettoyées** — la page `/boutique` affirme que les prix ne vivent que sur la
boutique, et une image qui affiche « 1 000 F » dément cette phrase au premier
changement de tarif.

## Ce qui reste à faire

Remplacer les photographies de personnes par **celles de Sylvère**, prises sur
le terrain avec l'accord écrit des intéressés. Elles seront plus justes, elles
appartiendront à l'entreprise, personne d'autre ne les aura — et l'obligation
d'attribution Freepik disparaîtra avec elles.
