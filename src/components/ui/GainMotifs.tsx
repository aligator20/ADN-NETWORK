/**
 * LES TROIS MOTIFS DE LA VITRINE
 *
 * Une illustration par formule, en deux volets : ce que vit l'acheteur
 * aujourd'hui, et ce qu'il obtient. Elles montrent LE LIVRABLE — un écran, un
 * document, un jeu de gabarits — parce qu'on n'achète pas une promesse
 * abstraite, on achète une chose qu'on peut se représenter.
 *
 * POURQUOI DU SVG INLINE ET NON DES IMAGES
 *
 * Trois fichiers PNG pèseraient un demi-mégaoctet, flouteraient sur les écrans
 * denses, et il faudrait les réexporter à chaque correction. Ici : zéro octet
 * téléchargé, net à toute taille, et chaque pièce du dessin porte une classe
 * que la timeline anime. Un flyer plat ne peut pas se construire sous les yeux
 * du lecteur ; celui-ci le peut.
 *
 * GRAMMAIRE COMMUNE
 *
 * Même boîte pour les six volets (320 × 200), donc les deux côtés d'une bande
 * s'alignent au pixel. Traits fins, aucun aplat décoratif, aucune ombre : le
 * registre des schémas de fiches projet. Le côté « aujourd'hui » est en gris de
 * corps, le côté « après » porte l'accent de la marque — l'écart de contraste
 * fait l'argument à lui seul.
 */
const AVANT = "var(--color-fog)";
const APRES = "var(--color-signal)";
const OS = "var(--color-bone)";

type MotifProps = { id: string };

/* ═══════════════════════════════════════════════ LA PAGE ══ */

/** Un fil qui défile : quatre publications identiques, la vôtre comprise. */
function PageAvant() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      {/* le téléphone */}
      <rect
        x="112" y="8" width="96" height="184" rx="12"
        fill="none" stroke={AVANT} strokeOpacity="0.45"
      />
      <rect x="146" y="16" width="28" height="3" rx="1.5" fill={AVANT} fillOpacity="0.45" />

      {/* quatre publications que rien ne distingue */}
      {[30, 72, 114, 156].map((y, i) => (
        <g key={y} className="vt-m-avant">
          <rect
            x="122" y={y} width="76" height="32" rx="3"
            fill={AVANT} fillOpacity={i === 1 ? 0.26 : 0.14}
          />
          <rect x="128" y={y + 7} width="34" height="4" rx="2" fill={AVANT} fillOpacity="0.5" />
          <rect x="128" y={y + 17} width="56" height="3" rx="1.5" fill={AVANT} fillOpacity="0.3" />
        </g>
      ))}
    </svg>
  );
}

/** Une page tenue : en-tête, titre, texte, et une adresse au bas. */
function PageApres() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      <g className="vt-m-apres">
        <rect x="8" y="14" width="304" height="172" rx="6" fill="none" stroke={APRES} />
        {/* barre de navigation */}
        <rect x="8" y="14" width="304" height="28" fill={APRES} fillOpacity="0.1" />
        <circle cx="26" cy="28" r="4" fill={APRES} />
        <rect x="38" y="26" width="46" height="4" rx="2" fill={OS} fillOpacity="0.75" />
        <rect x="270" y="26" width="24" height="4" rx="2" fill={AVANT} fillOpacity="0.6" />

        {/* le nom, en grand */}
        <rect x="26" y="62" width="152" height="15" rx="2" fill={OS} />
        <rect x="26" y="84" width="104" height="15" rx="2" fill={OS} fillOpacity="0.55" />

        {/* le propos */}
        <rect x="26" y="116" width="210" height="5" rx="2.5" fill={AVANT} fillOpacity="0.55" />
        <rect x="26" y="128" width="188" height="5" rx="2.5" fill={AVANT} fillOpacity="0.45" />
        <rect x="26" y="140" width="146" height="5" rx="2.5" fill={AVANT} fillOpacity="0.35" />

        {/* l'adresse permanente */}
        <rect x="26" y="162" width="118" height="6" rx="3" fill={APRES} />
        <rect x="26" y="173" width="118" height="1.5" fill={APRES} fillOpacity="0.5" />
      </g>
    </svg>
  );
}

/* ════════════════════════════════════════════ LE DOSSIER ══ */

/** Le rendez-vous se termine, et il ne reste rien sur la table. */
function DossierAvant() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      {/* la table */}
      <rect x="40" y="146" width="240" height="3" rx="1.5" fill={AVANT} fillOpacity="0.5" />
      <rect x="70" y="149" width="3" height="28" fill={AVANT} fillOpacity="0.3" />
      <rect x="247" y="149" width="3" height="28" fill={AVANT} fillOpacity="0.3" />

      {/* deux interlocuteurs */}
      {[74, 214].map((x) => (
        <g key={x} className="vt-m-avant">
          <circle cx={x + 16} cy="104" r="13" fill="none" stroke={AVANT} strokeOpacity="0.55" />
          <path
            d={`M ${x} 146 q 16 -24 32 0`}
            fill="none" stroke={AVANT} strokeOpacity="0.55"
          />
        </g>
      ))}

      {/* ce qui a été dit, et qui s'évapore */}
      <g className="vt-m-avant">
        <rect
          x="118" y="42" width="84" height="46" rx="6"
          fill="none" stroke={AVANT} strokeOpacity="0.4" strokeDasharray="5 5"
        />
        <rect x="130" y="58" width="46" height="3" rx="1.5" fill={AVANT} fillOpacity="0.25" />
        <rect x="130" y="68" width="34" height="3" rx="1.5" fill={AVANT} fillOpacity="0.15" />
      </g>
      {/* la table reste vide : c'est le sujet du dessin */}
    </svg>
  );
}

/** Un document reste sur la table, et il circule après vous. */
function DossierApres() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      <rect x="40" y="146" width="240" height="3" rx="1.5" fill={AVANT} fillOpacity="0.5" />
      <rect x="70" y="149" width="3" height="28" fill={AVANT} fillOpacity="0.3" />
      <rect x="247" y="149" width="3" height="28" fill={AVANT} fillOpacity="0.3" />

      {[74, 214].map((x) => (
        <g key={x}>
          <circle cx={x + 16} cy="104" r="13" fill="none" stroke={AVANT} strokeOpacity="0.55" />
          <path d={`M ${x} 146 q 16 -24 32 0`} fill="none" stroke={AVANT} strokeOpacity="0.55" />
        </g>
      ))}

      <g className="vt-m-apres">
        {/* le dossier, coin corné — il est posé, il ne s'envole pas */}
        <path
          d="M 122 56 H 178 L 198 76 V 146 H 122 Z"
          fill="var(--color-void)" stroke={APRES}
        />
        <path d="M 178 56 V 76 H 198" fill="none" stroke={APRES} strokeOpacity="0.6" />
        <rect x="134" y="92" width="52" height="4" rx="2" fill={OS} fillOpacity="0.8" />
        <rect x="134" y="104" width="40" height="3" rx="1.5" fill={AVANT} fillOpacity="0.6" />
        <rect x="134" y="114" width="46" height="3" rx="1.5" fill={AVANT} fillOpacity="0.45" />
        <rect x="134" y="128" width="28" height="5" rx="2.5" fill={APRES} />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════ L'IDENTITÉ ══ */

/** Quatre supports, quatre traitements. Rien ne se ressemble. */
function IdentiteAvant() {
  const vignettes = [
    { x: 18, y: 30, s: 62, forme: "cercle" },
    { x: 98, y: 52, s: 48, forme: "triangle" },
    { x: 164, y: 22, s: 72, forme: "croix" },
    { x: 252, y: 62, s: 44, forme: "carre" },
  ];
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      {vignettes.map((v) => {
        const c = v.s / 2;
        return (
          <g key={v.x} className="vt-m-avant">
            <rect
              x={v.x} y={v.y} width={v.s} height={v.s} rx="4"
              fill="none" stroke={AVANT} strokeOpacity="0.45"
            />
            {v.forme === "cercle" && (
              <circle cx={v.x + c} cy={v.y + c} r={v.s * 0.22} fill={AVANT} fillOpacity="0.5" />
            )}
            {v.forme === "triangle" && (
              <path
                d={`M ${v.x + c} ${v.y + c - 11} L ${v.x + c + 11} ${v.y + c + 9} L ${v.x + c - 11} ${v.y + c + 9} Z`}
                fill={AVANT} fillOpacity="0.5"
              />
            )}
            {v.forme === "croix" && (
              <g stroke={AVANT} strokeOpacity="0.5" strokeWidth="3">
                <line x1={v.x + c - 12} y1={v.y + c - 12} x2={v.x + c + 12} y2={v.y + c + 12} />
                <line x1={v.x + c + 12} y1={v.y + c - 12} x2={v.x + c - 12} y2={v.y + c + 12} />
              </g>
            )}
            {v.forme === "carre" && (
              <rect
                x={v.x + c - 9} y={v.y + c - 9} width="18" height="18"
                fill={AVANT} fillOpacity="0.5"
              />
            )}
          </g>
        );
      })}
      {/* les lignes de base ne s'alignent sur rien : c'est voulu */}
    </svg>
  );
}

/** Le même signe, la même grille, partout — jusqu'aux fichiers sources. */
function IdentiteApres() {
  const x0 = 22;
  const pas = 74;
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      {/* la grille qui tient l'ensemble */}
      <g stroke={APRES} strokeOpacity="0.18">
        <line x1="10" y1="62" x2="310" y2="62" />
        <line x1="10" y1="138" x2="310" y2="138" />
      </g>

      {[0, 1, 2, 3].map((i) => {
        const x = x0 + i * pas;
        return (
          <g key={i} className="vt-m-apres">
            <rect x={x} y="62" width="60" height="76" rx="4" fill="none" stroke={APRES} />
            {/* le monogramme, strictement identique d'une vignette à l'autre */}
            <path
              d={`M ${x + 18} ${x === x0 ? 112 : 112} L ${x + 30} 84 L ${x + 42} 112`}
              fill="none" stroke={OS} strokeWidth="3"
            />
            <line
              x1={x + 23} y1="104" x2={x + 37} y2="104"
              stroke={OS} strokeWidth="3"
            />
            <rect x={x + 18} y="122" width="24" height="3" rx="1.5" fill={APRES} />
          </g>
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════ AIGUILLAGE ══ */

const AVANT_PAR_ID: Record<string, () => React.JSX.Element> = {
  page: PageAvant,
  dossier: DossierAvant,
  identite: IdentiteAvant,
};

const APRES_PAR_ID: Record<string, () => React.JSX.Element> = {
  page: PageApres,
  dossier: DossierApres,
  identite: IdentiteApres,
};

export function MotifAvant({ id }: MotifProps) {
  const M = AVANT_PAR_ID[id] ?? PageAvant;
  return <M />;
}

export function MotifApres({ id }: MotifProps) {
  const M = APRES_PAR_ID[id] ?? PageApres;
  return <M />;
}
