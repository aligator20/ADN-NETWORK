/**
 * UN PDF D'IMAGES, ÉCRIT À LA MAIN.
 *
 * LinkedIn ne publie pas un carrousel à partir de dix PNG : le format « post
 * document » attend UN fichier, PDF de préférence, et c'est lui qui donne la
 * pagination avec les flèches. Sans ce fichier, le kit obligerait à passer par
 * un convertisseur en ligne — donc à téléverser les visuels de la marque chez
 * un tiers avant même de les avoir publiés.
 *
 * Aucune dépendance : un PDF qui n'enrobe que des JPEG tient en une centaine
 * de lignes. Chaque image devient un XObject en DCTDecode — le flux JPEG est
 * recopié tel quel, sans réencodage, donc sans perte supplémentaire.
 */
const fs = require("fs");

function ecrirePdf(pages, fichier, titre) {
  const morceaux = [];
  const decalages = [];
  let position = 0;

  const pousser = (data) => {
    const b = Buffer.isBuffer(data) ? data : Buffer.from(data, "latin1");
    morceaux.push(b);
    position += b.length;
  };

  const objet = (numero, corps, flux) => {
    decalages[numero] = position;
    pousser(`${numero} 0 obj\n${corps}\n`);
    if (flux) {
      pousser("stream\n");
      pousser(flux);
      pousser("\nendstream\n");
    }
    pousser("endobj\n");
  };

  pousser("%PDF-1.4\n");
  /* Un commentaire d'octets hauts : la convention qui signale aux outils que
     le fichier est binaire et ne doit pas subir de conversion de fin de ligne. */
  pousser(Buffer.from([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  const N = pages.length;
  const numPage = (i) => 4 + i * 3;
  const numContenu = (i) => 5 + i * 3;
  const numImage = (i) => 6 + i * 3;
  const dernier = 3 + N * 3;

  objet(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objet(
    2,
    `<< /Type /Pages /Count ${N} /Kids [${pages.map((_, i) => `${numPage(i)} 0 R`).join(" ")}] >>`,
  );
  objet(
    3,
    `<< /Title (${titre.replace(/[()\\]/g, "")}) /Producer (ADN NETWORK - kit-linkedin) >>`,
  );

  pages.forEach((page, i) => {
    const { largeur, hauteur, jpeg } = page;
    objet(
      numPage(i),
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${largeur} ${hauteur}] ` +
        `/Resources << /XObject << /Im0 ${numImage(i)} 0 R >> >> /Contents ${numContenu(i)} 0 R >>`,
    );

    const contenu = `q\n${largeur} 0 0 ${hauteur} 0 0 cm\n/Im0 Do\nQ`;
    objet(numContenu(i), `<< /Length ${contenu.length} >>`, Buffer.from(contenu, "latin1"));

    objet(
      numImage(i),
      `<< /Type /XObject /Subtype /Image /Width ${largeur} /Height ${hauteur} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`,
      jpeg,
    );
  });

  const debutXref = position;
  let xref = `xref\n0 ${dernier + 1}\n0000000000 65535 f \n`;
  for (let n = 1; n <= dernier; n++) {
    xref += `${String(decalages[n]).padStart(10, "0")} 00000 n \n`;
  }
  pousser(xref);
  pousser(
    `trailer\n<< /Size ${dernier + 1} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${debutXref}\n%%EOF\n`,
  );

  fs.writeFileSync(fichier, Buffer.concat(morceaux));
  return fichier;
}

module.exports = { ecrirePdf };
