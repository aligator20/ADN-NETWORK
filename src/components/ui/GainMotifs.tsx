/**
 * LES TROIS MOTIFS DE LA VITRINE
 *
 * Une illustration par formule, en deux volets : ce que vit l'acheteur
 * aujourd'hui, et ce qu'il obtient.
 *
 * ELLES PORTENT UN CONTENU RÉEL, PAS DES BARRES GRISES
 *
 * Un schéma abstrait demande au lecteur de faire le travail d'imagination à
 * notre place. Un exemple nommé le lui épargne : il lit « Kofi Adandé,
 * agronome-conseil », et il se met à la place.
 *
 * ⚠️ CE PERSONNAGE EST FICTIF, ET LE DESSIN LE DIT.
 *
 * Chaque volet « après » porte la mention EXEMPLE, en clair. Sans elle, un
 * visiteur pourrait prendre cette page pour une référence client — c'est-à-dire
 * pour une preuve. Le site refuse par ailleurs de promettre ce qu'il ne peut
 * tenir ; il ne va pas fabriquer un faux client dans une illustration.
 *
 * POURQUOI DU SVG INLINE ET NON DES IMAGES
 *
 * Trois PNG pèseraient un demi-mégaoctet, flouteraient sur les écrans denses,
 * et il faudrait les réexporter à chaque correction de texte. Ici : zéro octet
 * téléchargé, net à toute taille, texte sélectionnable, et chaque pièce porte
 * une classe que la timeline anime.
 */
const AVANT = "var(--color-fog)";
const APRES = "var(--color-signal)";
const OS = "var(--color-bone)";
const MONO = "var(--font-mono), ui-monospace, monospace";
const DISPLAY = "var(--font-display), Arial, sans-serif";

/** Le professionnel imaginaire dont on montre la vitrine. */
const EX = {
  nom: "KOFI ADANDÉ",
  metier: "Agronome-conseil",
  ville: "Cotonou — BJ",
  monogramme: "KA",
  chiffres: [
    { v: "12", l: "ans" },
    { v: "40", l: "exploitations" },
    { v: "03", l: "filières" },
  ],
};

type MotifProps = { id: string; exemple: string };

/** Pastille « EXEMPLE » — la mention qui empêche de lire une preuve. */
function Etiquette({ texte }: { texte: string }) {
  return (
    <g>
      <rect x="228" y="6" width="84" height="16" rx="8" fill={APRES} fillOpacity="0.16" />
      <text
        x="270" y="17" textAnchor="middle"
        fill={APRES} fontFamily={MONO} fontSize="8.5" letterSpacing="1.6"
      >
        {texte.toUpperCase()}
      </text>
    </g>
  );
}

/* ═══════════════════════════════════════════════ LA PAGE ══ */

/** Un fil qui défile : quatre publications que rien ne distingue. */
function PageAvant() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      <rect
        x="112" y="8" width="96" height="184" rx="12"
        fill="none" stroke={AVANT} strokeOpacity="0.45"
      />
      <rect x="146" y="16" width="28" height="3" rx="1.5" fill={AVANT} fillOpacity="0.45" />

      {[30, 72, 114, 156].map((y, i) => (
        <g key={y} className="vt-m-avant">
          <rect
            x="122" y={y} width="76" height="32" rx="3"
            fill={AVANT} fillOpacity={i === 1 ? 0.24 : 0.13}
          />
          <circle cx="131" cy={y + 10} r="4" fill={AVANT} fillOpacity="0.4" />
          <rect x="139" y={y + 7} width="30" height="4" rx="2" fill={AVANT} fillOpacity="0.45" />
          <rect x="128" y={y + 19} width="58" height="3" rx="1.5" fill={AVANT} fillOpacity="0.28" />
        </g>
      ))}

      {/* Vous êtes là-dedans, et rien ne le signale au lecteur. */}
      <g className="vt-m-avant">
        <path d="M 214 88 H 204" stroke={AVANT} strokeOpacity="0.6" />
        <text x="218" y="91" fill={AVANT} fontFamily={MONO} fontSize="9" letterSpacing="1">
          vous
        </text>
      </g>
    </svg>
  );
}

/** La page livrée : un nom, un métier, une adresse qui tient. */
function PageApres({ exemple }: { exemple: string }) {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      <g className="vt-m-apres">
        <rect x="8" y="28" width="304" height="164" rx="6" fill="none" stroke={APRES} />
        <rect x="8" y="28" width="304" height="26" fill={APRES} fillOpacity="0.1" />
        <circle cx="26" cy="41" r="3.5" fill={APRES} />
        <text x="36" y="44" fill={OS} fontFamily={MONO} fontSize="8" letterSpacing="1.4">
          ADN°NETWORK
        </text>

        {/* le nom, en grand — c'est ce qu'on achète */}
        <text x="24" y="88" fill={OS} fontFamily={DISPLAY} fontSize="24" fontWeight="800">
          {EX.nom}
        </text>
        <text x="24" y="106" fill={APRES} fontFamily={MONO} fontSize="9.5" letterSpacing="1.2">
          {EX.metier.toUpperCase()} — {EX.ville}
        </text>

        <rect x="24" y="120" width="264" height="1" fill={AVANT} fillOpacity="0.3" />

        <text x="24" y="138" fill={AVANT} fontFamily={MONO} fontSize="8.5">
          Diagnostic de sol, plan de fertilisation
        </text>
        <text x="24" y="151" fill={AVANT} fontFamily={MONO} fontSize="8.5">
          et suivi de campagne, du semis à la récolte.
        </text>

        {/* l'adresse permanente, ce qu'il envoie au lieu de s'expliquer */}
        <rect x="24" y="164" width="150" height="16" rx="3" fill={APRES} fillOpacity="0.16" />
        <text x="32" y="175" fill={APRES} fontFamily={MONO} fontSize="8.5">
          adn-network.app/kofi
        </text>
      </g>
      <Etiquette texte={exemple} />
    </svg>
  );
}

/* ════════════════════════════════════════════ LE DOSSIER ══ */

/** Le rendez-vous se termine, et la table reste vide. */
function DossierAvant() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      <rect x="40" y="146" width="240" height="3" rx="1.5" fill={AVANT} fillOpacity="0.5" />
      <rect x="70" y="149" width="3" height="28" fill={AVANT} fillOpacity="0.3" />
      <rect x="247" y="149" width="3" height="28" fill={AVANT} fillOpacity="0.3" />

      {[74, 214].map((x) => (
        <g key={x} className="vt-m-avant">
          <circle cx={x + 16} cy="102" r="13" fill="none" stroke={AVANT} strokeOpacity="0.55" />
          <path d={`M ${x} 144 q 16 -26 32 0`} fill="none" stroke={AVANT} strokeOpacity="0.55" />
        </g>
      ))}

      {/* ce qui a été dit, et qui ne survit pas à la porte */}
      <g className="vt-m-avant">
        <rect
          x="110" y="34" width="100" height="52" rx="6"
          fill="none" stroke={AVANT} strokeOpacity="0.4" strokeDasharray="5 5"
        />
        <text x="122" y="54" fill={AVANT} fontFamily={MONO} fontSize="8.5" fillOpacity="0.55">
          « je fais du suivi
        </text>
        <text x="122" y="67" fill={AVANT} fontFamily={MONO} fontSize="8.5" fillOpacity="0.4">
          de campagne… »
        </text>
        <text x="122" y="80" fill={AVANT} fontFamily={MONO} fontSize="8.5" fillOpacity="0.22">
          …
        </text>
      </g>

      <text
        x="160" y="192" textAnchor="middle"
        fill={AVANT} fontFamily={MONO} fontSize="8.5" fillOpacity="0.5" letterSpacing="1"
      >
        table vide
      </text>
    </svg>
  );
}

/** Un dossier reste sur la table, et il circule après vous. */
function DossierApres({ exemple }: { exemple: string }) {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      <rect x="40" y="146" width="240" height="3" rx="1.5" fill={AVANT} fillOpacity="0.5" />
      <rect x="70" y="149" width="3" height="28" fill={AVANT} fillOpacity="0.3" />
      <rect x="247" y="149" width="3" height="28" fill={AVANT} fillOpacity="0.3" />

      {[52, 236].map((x) => (
        <g key={x}>
          <circle cx={x + 16} cy="102" r="13" fill="none" stroke={AVANT} strokeOpacity="0.55" />
          <path d={`M ${x} 144 q 16 -26 32 0`} fill="none" stroke={AVANT} strokeOpacity="0.55" />
        </g>
      ))}

      <g className="vt-m-apres">
        {/* le dossier, coin corné : il est posé, il ne s'envole pas */}
        <path
          d="M 106 40 H 190 L 214 64 V 146 H 106 Z"
          fill="var(--color-void)" stroke={APRES}
        />
        <path d="M 190 40 V 64 H 214" fill="none" stroke={APRES} strokeOpacity="0.6" />

        <text x="118" y="62" fill={APRES} fontFamily={MONO} fontSize="7.5" letterSpacing="1.2">
          DOSSIER
        </text>
        <text x="118" y="82" fill={OS} fontFamily={DISPLAY} fontSize="13" fontWeight="800">
          {EX.nom}
        </text>
        <rect x="118" y="90" width="84" height="1" fill={AVANT} fillOpacity="0.35" />

        {EX.chiffres.map((c, i) => (
          <g key={c.l}>
            <text
              x="118" y={106 + i * 15}
              fill={APRES} fontFamily={DISPLAY} fontSize="11" fontWeight="800"
            >
              {c.v}
            </text>
            <text
              x="138" y={106 + i * 15}
              fill={AVANT} fontFamily={MONO} fontSize="8"
            >
              {c.l}
            </text>
          </g>
        ))}
      </g>
      <Etiquette texte={exemple} />
    </svg>
  );
}

/* ═══════════════════════════════════════════ L'IDENTITÉ ══ */

/** Quatre supports, quatre traitements. Rien ne se ressemble. */
function IdentiteAvant() {
  const vignettes = [
    { x: 16, y: 44, s: 62, forme: "cercle", ou: "carte" },
    { x: 96, y: 66, s: 46, forme: "triangle", ou: "devis" },
    { x: 160, y: 36, s: 70, forme: "croix", ou: "réseaux" },
    { x: 248, y: 74, s: 44, forme: "carre", ou: "camion" },
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
              <circle cx={v.x + c} cy={v.y + c} r={v.s * 0.2} fill={AVANT} fillOpacity="0.5" />
            )}
            {v.forme === "triangle" && (
              <path
                d={`M ${v.x + c} ${v.y + c - 10} L ${v.x + c + 10} ${v.y + c + 8} L ${v.x + c - 10} ${v.y + c + 8} Z`}
                fill={AVANT} fillOpacity="0.5"
              />
            )}
            {v.forme === "croix" && (
              <g stroke={AVANT} strokeOpacity="0.5" strokeWidth="3">
                <line x1={v.x + c - 11} y1={v.y + c - 11} x2={v.x + c + 11} y2={v.y + c + 11} />
                <line x1={v.x + c + 11} y1={v.y + c - 11} x2={v.x + c - 11} y2={v.y + c + 11} />
              </g>
            )}
            {v.forme === "carre" && (
              <rect
                x={v.x + c - 8} y={v.y + c - 8} width="16" height="16"
                fill={AVANT} fillOpacity="0.5"
              />
            )}
            <text
              x={v.x + c} y={v.y + v.s + 13} textAnchor="middle"
              fill={AVANT} fontFamily={MONO} fontSize="8" fillOpacity="0.55"
            >
              {v.ou}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Le même signe, la même grille, partout. */
function IdentiteApres({ exemple }: { exemple: string }) {
  const supports = ["carte", "devis", "réseaux", "camion"];
  const x0 = 20;
  const pas = 74;
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-hidden>
      <g stroke={APRES} strokeOpacity="0.16">
        <line x1="8" y1="54" x2="312" y2="54" />
        <line x1="8" y1="134" x2="312" y2="134" />
      </g>

      {supports.map((s, i) => {
        const x = x0 + i * pas;
        return (
          <g key={s} className="vt-m-apres">
            <rect x={x} y="54" width="60" height="80" rx="4" fill="none" stroke={APRES} />
            <rect x={x} y="54" width="60" height="18" fill={APRES} fillOpacity="0.14" />
            {/* le monogramme, strictement identique d'un support à l'autre */}
            <text
              x={x + 30} y="104" textAnchor="middle"
              fill={OS} fontFamily={DISPLAY} fontSize="22" fontWeight="900"
            >
              {EX.monogramme}
            </text>
            <rect x={x + 16} y="114" width="28" height="2.5" rx="1.25" fill={APRES} />
            <text
              x={x + 30} y="148" textAnchor="middle"
              fill={AVANT} fontFamily={MONO} fontSize="8"
            >
              {s}
            </text>
          </g>
        );
      })}

      <text x="20" y="180" fill={AVANT} fontFamily={MONO} fontSize="8.5">
        {EX.nom} — {EX.metier}
      </text>
      <Etiquette texte={exemple} />
    </svg>
  );
}

/* ══════════════════════════════════════════════ AIGUILLAGE ══ */

export function MotifAvant({ id }: MotifProps) {
  if (id === "dossier") return <DossierAvant />;
  if (id === "identite") return <IdentiteAvant />;
  return <PageAvant />;
}

export function MotifApres({ id, exemple }: MotifProps) {
  if (id === "dossier") return <DossierApres exemple={exemple} />;
  if (id === "identite") return <IdentiteApres exemple={exemple} />;
  return <PageApres exemple={exemple} />;
}
