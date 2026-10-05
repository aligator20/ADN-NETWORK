---
name: publier
description: Vérifier puis mettre en ligne le site ADN NETWORK — la liste de contrôle avant publication, le build, le passage par GitHub et Netlify, et ce qui reste à régler avant de pouvoir facturer. À utiliser quand Sylvère dit « déploie », « mets en ligne », « publie le site », « c'est bon pour la mise en ligne ? », ou tape /publier.
---

# Mettre le site en ligne

Publier est un acte **visible par tout le monde, tout de suite**. Netlify
reconstruit à chaque `push` sur la branche principale : il n'y a pas d'étape de
validation après. Ce qui part, part.

**Tu prépares et tu vérifies. Sylvère dit « oui », et alors seulement on
pousse.** Un accord vaut pour cette mise en ligne, pas pour les suivantes.

---

## 1. Avant de toucher à quoi que ce soit

```bash
npm run typecheck
npm run lint
npm run build
```

Les trois doivent passer. `typecheck` est le plus important : c'est lui qui
attrape une traduction anglaise oubliée.

⚠️ Si un serveur `npm run dev` tourne, il partage le dossier `.next` et le
build échoue sur un `MODULE_NOT_FOUND`. Arrêter le serveur, `rm -rf .next`,
relancer le build.

## 2. La liste de contrôle

À passer sur le dossier `out/`, pas sur le dev :

- **Les pages attendues existent.** `out/` doit contenir les nouvelles routes,
  en français **et** en anglais.
- **Aucun lien interne cassé.** Le site en compte une quarantaine de pages ;
  un lien mort se voit tout de suite avec un balayage des `href` du dossier
  `out/`.
- **Les titres et descriptions** sont distincts d'une page à l'autre.
- **Les nouveaux formulaires sont dans le HTML statique.** Netlify les
  enregistre au déploiement, en lisant le HTML produit. Un formulaire absent à
  ce moment-là **ne recevra jamais rien**, sans erreur visible.
- **Les images ajoutées sont en WebP**, 1000 px de large au plus.
- **Les prix affichés** sont ceux de `vedettes.ts` et `vitrine.ts`, et ceux du
  catalogue de l'atelier (`node atelier.js verifier` les compare).

## 3. Pousser

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\HP\Documents\INNOVATION TECH IA\adn-network\deployer.ps1"
```

Le script demande l'URL du dépôt si elle n'est pas fournie
(`-RepoUrl "https://github.com/…"`). Aucun mot de passe : au premier `push`,
Git Credential Manager ouvre une fenêtre de connexion GitHub, et Windows retient
ensuite le jeton.

⚠️ **`deployer.ps1` est en ASCII pur, volontairement.** Windows PowerShell 5.1
lit les `.ps1` en ANSI, pas en UTF-8 : un caractère accentué ou un tiret
cadratin casse l'analyse du fichier. **Ne jamais y ajouter d'accents.**

Le message de commit suit le style du dépôt : français, à l'infinitif, disant
ce que le changement règle et non ce qu'il touche.

## 4. Après

Netlify reconstruit tout seul. Vérifier en ligne, pas en local :

- les nouvelles pages répondent en 200, dans les deux langues ;
- le `sitemap.xml` les contient ;
- l'entrée de menu apparaît ;
- si un formulaire a été ajouté, il figure bien dans les formulaires Netlify.

---

## Ce qui n'est PAS réglé, et qu'il faut dire

Ces points ne bloquent pas une mise en ligne, mais ils bloquent une
**facturation**. Les redire chaque fois qu'on parle de vendre :

- `config/entreprise.json` (côté atelier) n'a **ni RCCM ni IFU** : aucune
  facture ne sort, seulement des pro forma.
- Aucun numéro de paiement renseigné.
- Le contrat n'a pas été relu par un juriste.
- La fiscalité (TVA, AIB, e-MECeF) n'a pas été validée par un comptable.
- Pas de politique de conservation des données personnelles des prospects
  (APDP, code du numérique).
- Le site n'a **pas de CGU**.

Et deux choses que le site annonce sans pouvoir encore les tenir partout :

- le délai affiché (« dix jours ouvrés ») ne colle pas aux prestations les plus
  lourdes, qui demandent 15 à 20 jours ;
- hors du Bénin, le Nigeria n'est pas en FCFA : un prix converti au cours du
  jour se renégocie au moindre écart.

## Ce que tu ne fais jamais

- Pousser sans un « oui » explicite de Sylvère, dans la conversation.
- Publier le nom d'un client sans son accord écrit.
- Mettre en ligne une réalisation marquée « Livré » qui ne l'est pas.
- Écrire une adresse (`url`) pour un site qui n'est pas encore publié.
- Forcer un `push` ou réécrire l'historique.
