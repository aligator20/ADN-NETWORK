# ADN NETWORK — Architecture & Direction Artistique

> Document de référence. Site **en français**. Les six séquences, le menu et les
> routes `/work` sont livrés — voir l'état d'avancement en fin de document.

---

## 1. Parti pris

Le site n'est pas une vitrine, c'est un **instrument**. La métaphore centrale est le
nom lui-même : **ADN** — une double hélice qui se déroule en réseau. Chaque section
est une *séquence* d'un même organisme, pas une carte posée sur une page.

Trois règles non négociables qui écartent le SaaS générique :

| Règle | Traduction concrète |
|---|---|
| **Pas de carte** | Aucun `rounded-2xl border shadow` empilé. Les contenus vivent dans une grille typographique, des lignes de contact (hairlines) et des masques. |
| **Le vide est un matériau** | Minimum 40 % de la surface vide en permanence. La densité est un événement, pas un état. |
| **La couleur est un code** | Le fond reste noir. Les 7 couleurs vives ne décorent jamais : chacune **désigne** une discipline. Une teinte par bloc, jamais deux. |

---

## 2. Système de design

### Palette — base titane + signature + code disciplinaire

```
--void      #050506   fond absolu
--carbon    #0A0A0C   fond de section alterné
--graphite  #121215   surfaces
--ash       #1C1C20   séparateurs pleins
--steel     #2A2A30   bordures / hairlines
--fog       #7D7D86   texte secondaire, métadonnées
--bone      #ECECEE   texte primaire
--signal    #C6F24E   signature de marque
```

**Les 7 couleurs de discipline** — le système de marque :

```
--digital     #4D93FF    --network       #22D3EE    --creative   #FF5FAE
--ai          #A855F7    --cyber         #FF4D58    --agritech   #4ADE80
--automation  #FF8A1F
```

Réparties sur la roue chromatique pour rester distinguables au premier coup
d'œil, toutes calibrées AA sur `#050506`. Elles ne sont **jamais décoratives** :
elles identifient. Une couleur apparaît sur la catégorie d'un projet, le filet
d'une plaque, un état actif, et sur 22 % des particules de l'hélice — l'ADN
porte littéralement les sept métiers.

Tailwind ne peut pas générer de classe dynamique (`text-${id}` n'existe pas) :
le mapping vit dans `disciplineColor` (`content/services.ts`) et part en style
inline, en référençant les variables CSS. `globals.css` reste la source unique.

### Typographie — grotesque industrielle + mono technique

- **Display — `Archivo`** (variable 100→900). Titres massifs : `clamp(4rem, 17vw, 20rem)`,
  `line-height: 0.82`, `letter-spacing: -0.045em`. Poids 800 pour les masses,
  contour (`-webkit-text-stroke`) pour les contre-masses.
- **Mono — `JetBrains Mono`**. Tout ce qui est *machine* : index, coordonnées,
  labels de section, compteurs, HUD. `10px / tracking 0.3em / uppercase`.

Pas de troisième famille. Le contraste massif ↔ mono porte toute la hiérarchie.

### Grille

12 colonnes, gouttières larges, marge de sécurité `24px` mobile / `40px` desktop.
Un **overlay de grille** en hairlines à 4 % d'opacité reste visible en permanence :
c'est le cadre technique qui signe la DA.

---

## 3. Chrome persistant (le « HUD »)

Ce qui transforme un site en expérience : un châssis fixe qui ne scrolle jamais.

```
┌──────────────────────────────────────────────────────────────┐
│ ADN°NETWORK                                      INDEX  ▤    │  ← Header
│                                                              │
│                    [ contenu scrollé ]                       │
│                                                              │
│ 06°22'N 02°26'E                              [001] SCROLL ↓  │  ← Status bar
└──────────────────────────────────────────────────────────────┘
   + GridOverlay (hairlines)  + Grain (bruit filmique)  + Cursor
```

| Élément | Rôle |
|---|---|
| `Preloader` | Compteur 000→100, rideau `clip-path`, débloque la timeline du Hero. |
| `Header` | Logotype + déclencheur d'index. Toujours au-dessus du WebGL. |
| `StatusBar` | Coordonnées, index de séquence, indicateur de scroll magnétique. |
| `GridOverlay` | 12 hairlines verticales, 4 % d'opacité. |
| `Grain` | Bruit SVG `feTurbulence` — casse le plat du noir, effet filmique. |
| `Cursor` | Anneau lerpé + point instantané, magnétique, morph sur `data-cursor`. |
| `Menu` | Plein écran en `clip-path`, à `z-35` — **sous** le grain et le HUD : le menu s'ouvre *dans* l'instrument, il ne le remplace pas. |

---

## 4. Séquences (structure narrative)

| # | Section | Idée motrice | Technique dominante |
|---|---|---|---|
| **001** | **HERO** | La double hélice tourne, le nom s'écrit. Au scroll, `ADN` et `NETWORK` se **scindent** — la dislocation typographique et le déroulement de l'hélice sont le même geste. | WebGL + reveal masqué + scrub `uUnwind` |
| **002** | **MANIFESTE** | Chaque mot passe de l'ombre à la pleine lumière au rythme du scroll : le lecteur ne subit pas l'animation, il la produit. Chiffres comptés **une seule fois**. | Scrub mot à mot + compteurs `once` |
| **003** | **DISCIPLINES** | 7 **lignes**, pas 7 cartes. Le nom est en contour au repos, se remplit sous le curseur ; les six autres reculent à 28 %. La hiérarchie naît du retrait. | Timelines préconstruites + écouteurs natifs |
| **004** | **RÉALISATIONS** | Galerie **horizontale pinnée** : le scroll vertical devient latéral. La piste s'incline à la vélocité du geste (bornée à 4°). Filtre dérivé des projets. | Pin + scrub + `quickTo` sur la piste |
| **005** | **STRUCTURE** | Attaque massive, argumentaire en mono, trois principes numérotés, signature du fondateur. Parallaxe **différentielle et faible** — c'est le décalage qui crée la profondeur. | Scrub + parallaxe multi-couches |
| **006** | **CONTACT** | `CONSTRUISONS L'IMPOSSIBLE.` se remplit au scrub. Tout est soustrait sauf la phrase et l'adresse, magnétique. | Text-fill scrub + magnétisme |

**Transitions inter-sections** : pas de `fade`. Chaque passage utilise un masque
(`clip-path: inset()`) ou un décalage de vitesse — la page se *recompose*.

---

## 5. Stack & rôles

```
Next.js 15 (App Router)   structure, RSC par défaut, îlots clients pour le motion
TypeScript                strict, chemins @/*
Tailwind CSS v4           @theme CSS-first — tokens = variables CSS natives
Lenis                     scroll inertiel, source de vérité du scroll
GSAP + ScrollTrigger      TOUTE la chorégraphie (timelines, pin, scrub)
@gsap/react (useGSAP)     cleanup automatique, sûr avec React 19 StrictMode
Framer Motion             UNIQUEMENT présence/exit (menu, overlays, route transitions)
Three.js (raw, sans R3F)  UNIQUEMENT le champ hélicoïdal — 1 shader, 2 draw calls
```

**Pourquoi Three.js ici et nulle part ailleurs** : 14 000 points positionnés par le
GPU, morphés hélice → réseau, avec champ de répulsion au pointeur. Impossible à
tenir en DOM/CSS à 60 fps. Partout ailleurs (survols, révélations, parallaxe),
GSAP sur des transforms composites est plus rapide et plus léger.

**Pourquoi pas React Three Fiber** : une seule scène sur-mesure, aucun graphe de
composants à réconcilier. Le `three` brut évite ~40 kB et le réconciliateur.

---

## 6. Routes

| Route | Rôle | Rendu |
|---|---|---|
| `/` | Page d'accueil complète — les 7 séquences | Statique |
| `/work` | Index des réalisations : **liste** verticale + aperçu flottant | Statique |
| `/work/[slug]` | Fiche projet : dossier détaillé, site en ligne, support | **SSG** — une page par projet |
| `/reseau` | La communauté : 3 rôles, 3 étapes, candidature | Statique |
| `/mentions-legales` | Informations légales — sans animation, délibérément | Statique |
| `/sitemap.xml`, `/robots.txt` | Dérivés des routes et des projets | Générés |

La galerie de l'accueil et l'index `/work` montrent le **même contenu dans deux
gestes différents** : traversée horizontale d'un côté, liste parcourue de
l'autre. Sans cette distinction, la page dédiée ne justifierait pas d'exister.

Le menu porte la destination réelle de chaque entrée (`content/site.ts` → `nav`).
L'absence d'`anchor` désigne une page à part entière. Sans ce modèle, un item
ancré cliqué depuis `/work` chercherait un `#id` inexistant et ne ferait rien.

**Piège des ancres inter-routes** : au montage d'une route le document est
encore court — les pins n'ont pas ajouté leur hauteur. Le navigateur écrête
alors le scroll sans rien signaler. `AppShell` vise, **contrôle** que la cible
est atteinte, et recommence tant que l'écart persiste (borné à 8 tentatives).

## 7. Arborescence

```
src/
├─ app/
│  ├─ layout.tsx            fonts, metadata, AppShell
│  ├─ page.tsx              assemblage des séquences
│  └─ globals.css           @theme (tokens) + base + primitives DA
├─ components/
│  ├─ chrome/               Preloader · Header · StatusBar · GridOverlay · Grain · Cursor
│  ├─ sections/             Hero ✅ · Intro · Services · Work · About · Contact
│  ├─ webgl/                HelixField + shaders/helix.ts
│  └─ ui/                   SplitText · Magnetic · ScrambleText · SectionIndex
├─ lib/                     gsap.ts (registre) · motion.ts (eases/durées) · utils.ts
├─ hooks/                   usePointer · usePrefersReducedMotion
├─ providers/               AppShell (chrome) · app-context · SmoothScroll (Lenis↔GSAP)
└─ content/                 site.ts · services.ts · projects.ts   ← tout le copy, typé
```

Le contenu est **entièrement sorti des composants** (`src/content/`). Changer le
copy ou ajouter un projet ne touche jamais au code d'animation.

---

## 8. Performance & accessibilité — contraintes tenues

- **DPR plafonné à 1.75**, particules adaptatives (14 000 desktop / 4 500 mobile).
- **rAF suspendu** hors viewport et sur onglet caché.
- `prefers-reduced-motion` → une seule frame WebGL statique, timelines réduites à
  des fondus, Lenis désactivé.
- **Pas de WebGL** (échec de contexte) → dégradé CSS de repli, aucune erreur.
- Curseur custom masqué sur pointeurs grossiers ; le curseur natif reste actif.
- Titres découpés en `<span>` mais lisibles par les lecteurs d'écran via
  `aria-label` sur le conteneur et `aria-hidden` sur les fragments.
- Animations pilotées uniquement en `transform` / `opacity` (pas de layout thrash).

---

## 9. État d'avancement

- [x] Fondations : tokens, fonts, grille, chrome persistant, scroll, curseur
- [x] **001 — HERO** (WebGL hélice + reveal + scrub de sortie)
- [x] **002 — INTRODUCTION** (remplissage du manifeste mot à mot au scrub + compteurs `once`)
- [x] **003 — SERVICES** (liste de 7 lignes, nom en contour rempli au survol, retrait des voisines)
- [x] **004 — WORK** (galerie horizontale pinnée, inclinaison à la vélocité, filtre auto-dérivé)
- [x] **005 — STRUCTURE** (parallaxe différentielle, 3 principes, signature du fondateur)
- [x] **006 — CONTACT** (remplissage du CTA au scrub, adresse magnétique, pied de page)
- [x] **Menu plein écran** (découpe `clip-path`, Framer Motion, verrou Lenis, Échap)
- [x] **006 — LE RÉSEAU** (communauté : 3 rôles, 3 étapes, limites explicites)
- [x] **007 — CONTACT**
- [x] **Page d'accueil complète**
- [x] **`/work`** — index vertical, aperçu flottant au curseur, filtre dérivé
- [x] **`/work/[slug]`** — une page par projet, prérendue au build (SSG)
- [x] **`/reseau`** — candidature par composition d'email, sans backend
- [x] **Transition de route** — rideau en découpe, masque la remesure
- [x] **Mise en ligne** — image de partage, favicons, sitemap, robots, mentions légales
- [ ] Domaine réel (`site.url`), hébergeur et RCCM/IFU dans les mentions légales
- [ ] Un projet client externe — le point le plus important de tous
