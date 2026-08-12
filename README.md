# ADN NETWORK

Site expérientiel. Next.js 15 · TypeScript · Tailwind v4 · GSAP · Three.js.

La direction artistique et le découpage des séquences sont documentés dans
[`ARCHITECTURE.md`](./ARCHITECTURE.md) — à lire avant de toucher au code.

---

## Prérequis

Node.js **20 ou plus** est requis et n'est pas installé sur cette machine.

```bash
winget install OpenJS.NodeJS.LTS
```

Ferme puis rouvre le terminal après l'installation pour que le `PATH` soit repris.

## Démarrer

```bash
npm install
```

```bash
npm run dev
```

Le site tourne sur http://localhost:3000.

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Sert le build |
| `npm run lint` | ESLint (config Next) |
| `npm run typecheck` | `tsc --noEmit`, sans émettre de fichiers |

---

## Où modifier quoi

| Besoin | Fichier |
|---|---|
| Nom, baseline, propriétaire, libellés d'interface | `src/content/site.ts` |
| Détail des 7 services, code couleur, chiffres | `src/content/services.ts` |
| **Projets du portfolio** | `src/content/projects.ts` |
| Couleurs, typo, courbes d'animation | `src/app/globals.css` (bloc `@theme`) |
| Durées / easings / staggers partagés | `src/lib/motion.ts` |
| Chorégraphie du Hero | `src/components/sections/Hero.tsx` |
| Comportement de l'hélice WebGL | `src/components/webgl/shaders/helix.ts` |
| Densité de particules, composition 3D | `src/components/webgl/HelixField.tsx` |

Aucun texte ne doit être écrit en dur dans un composant : tout passe par
`src/content/`.

## Langue

Le site est **entièrement en français** (`<html lang="fr">`, horloge en
`fr-FR`, métadonnées `fr_FR`). Les libellés d'interface — « Défiler »,
« Index », « Tous », « Fin de sélection »… — sont regroupés dans l'objet `ui`
de [`site.ts`](./src/content/site.ts) : c'est le seul endroit à toucher pour
retoucher la langue, et le point de départ si une version anglaise est ajoutée
un jour.

Restent en anglais, délibérément : les noms propres (ADN NETWORK, les titres de
projets) et le vocabulaire technique consacré (RAG, VoIP, RPA, SIEM, ETL,
headless), qu'aucune traduction ne rendrait plus clair.

> La baseline et le CTA figuraient **en anglais** dans le brief initial
> (« Technology. Creativity. Systems. » / « LET'S BUILD SOMETHING IMPOSSIBLE. »).
> Ils sont traduits — `site.tagline` et `site.cta` pour revenir en arrière.

---

## Ajouter un projet au portfolio

Une seule chose à faire : ajouter un objet au tableau `projects` dans
[`src/content/projects.ts`](./src/content/projects.ts).

```ts
{
  slug: "mon-projet",          // identifiant d'URL, doit rester stable
  title: "Mon Projet",
  year: 2026,
  discipline: "cybersecurity", // ← suffit à tout classer
  summary: "Une phrase : ce que le projet change.",
  stack: ["Audit", "Hardening"],
  cover: "/work/mon-projet.jpg", // facultatif
}
```

`discipline` fait le reste. La catégorie, sa couleur, son libellé, son compteur
et sa présence dans le filtre sont **dérivés automatiquement** — il n'existe
aucune liste de catégories à maintenir en parallèle. Sans `cover`, la galerie
compose une plaque teintée à la couleur de la discipline : le projet est
présentable dès son ajout, sans attendre les visuels.

> ⚠️ Les projets actuellement listés sont du **contenu de démonstration**, sauf
> `aquacontrol-ai`. À remplacer avant mise en ligne.

## Conventions de motion

- **GSAP** pilote toute la chorégraphie (timelines, pin, scrub, révélations).
- **Framer Motion** est réservé aux entrées/sorties d'éléments montés puis
  démontés (menu, overlays). Ne pas l'utiliser pour du scroll.
- **Three.js** ne sert qu'au champ hélicoïdal. Toute nouvelle idée 3D doit
  d'abord échouer en CSS/GSAP avant de justifier une scène WebGL.
- Toujours animer `transform` et `opacity`. Jamais `top`, `left`, `width`.
- Toute animation doit avoir un chemin `prefers-reduced-motion`.

## Micro-interactions disponibles

Les composants n'ont jamais besoin de connaître le curseur : il suffit de poser
un attribut sur n'importe quel élément.

```tsx
<button data-cursor="hover">…</button>
<div data-cursor="drag" data-cursor-label="Drag">…</div>
```

Pour rendre une cible magnétique :

```tsx
<Magnetic strength={0.35}>
  <button>…</button>
</Magnetic>
```

---

## État d'avancement

- [x] Fondations — tokens, typo, grille, chrome persistant, scroll, curseur
- [x] 001 HERO · 002 MANIFESTE · 003 DISCIPLINES · 004 RÉALISATIONS · 005 STRUCTURE · 006 LE RÉSEAU · 007 CONTACT
- [x] Menu plein écran · transition de route
- [x] Routes `/work`, `/work/[slug]`, `/reseau`, `/mentions-legales`
- [x] Image de partage, favicons, sitemap, robots

### Dossiers investisseurs

Quatre présentations de 11 slides — une par projet — vivent hors du site, dans
`../decks/`. Elles partagent la charte et le code couleur disciplinaire, et
leurs chiffres proviennent des mêmes sources que les fiches projet. Le
générateur et la procédure de régénération sont documentés dans
`../decks/LISEZ-MOI.md`.

### Avant mise en ligne

1. **`site.url`** dans `src/content/site.ts` — le domaine réel. Sans lui, les
   aperçus de partage ne s'afficheront nulle part : les réseaux sociaux exigent
   des URL absolues.
2. **Hébergeur et RCCM/IFU** dans `src/app/mentions-legales/page.tsx`.
3. **Vérifier `contact@adnnetwork.com`** — c'est l'adresse qui reçoit les
   demandes de support et les candidatures au Réseau.

### Optimiser une image de couverture

Les plaques s'affichent au plus à ~26vw en 4:5. Au-delà de 1000px de large, on
paie de la bande passante que personne ne voit — le PNG du t-shirt pesait
2,1 Mo, il en fait 95 Ko en WebP.

```bash
npx sharp-cli --input photo.png --output public/work/projet.webp resize 1000 --withoutEnlargement -- webp --quality 82
```
