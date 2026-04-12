export const metadata = {
  title: "Mentions légales | Marocains en France",
  description: "Mentions légales de l'association",
};

export default function MentionsLegales() {
  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-gray">
        <h1 className="text-4xl font-black text-brand-dark mb-10">Mentions Légales</h1>
        
        <h2>1. Présentation de l'association</h2>
        <p>
          L'association <strong>Marocains en France – Main dans la main</strong> est une association soumise à la loi du 1er juillet 1901 et au décret du 16 août 1901.
        </p>
        <ul>
          <li><strong>Nom de l'association :</strong> Marocains en France – Main dans la main</li>
          <li><strong>SIRET :</strong> 990831778</li>
          <li><strong>Date de création :</strong> Juillet 2025</li>
          <li><strong>Fondateur :</strong> Yassir Chirawi</li>
          <li><strong>Email :</strong> contact@marocainsenfrance.fr</li>
          <li><strong>Site internet :</strong> marocainsenfrance.fr</li>
        </ul>

        <h2>2. Éditeur et Hébergeur du site</h2>
        <p>
          Le site <em>marocainsenfrance.fr</em> est édité par l'association "Marocains en France – Main dans la main".<br />
          Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
        </p>

        <h2>3. Données personnelles et Confidentialité (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), l'association s'engage à protéger la vie privée des utilisateurs de son site web.
        </p>
        <p>
          Les données personnelles collectées via le formulaire de contact ou le formulaire de don sont destinées exclusivement au bureau de l'association dans le but de :
        </p>
        <ul>
          <li>Répondre aux demandes de renseignements.</li>
          <li>Gérer les reçus fiscaux (le cas échéant) et l'enregistrement des dons.</li>
        </ul>
        <p>
          Conformément à la loi "Informatique et Libertés", vous disposez d'un droit d'accès, de rectification, de modification et de suppression des données qui vous concernent. Vous pouvez exercer ce droit en nous contactant à l'adresse e-mail mentionnée ci-dessus.
        </p>

        <h2>4. Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu (textes, images, base de données, "Le Guide") de ce site est protégé par les droits de propriété intellectuelle. Toute reproduction, même partielle, est interdite sans l'accord préalable de l'association.
        </p>
      </div>
    </div>
  );
}
