import Link from "next/link";
import { Heart, Mail, MapPin, Key } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-full bg-white shadow-sm flex items-center justify-center p-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <img src="/logo.png" alt="MDM Association Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">Association</span>
                <span className="text-sm font-bold uppercase tracking-widest text-white">
                  Marocains en France
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              L'association Loi 1901 dédiée à l'accompagnement, l'intégration et la réussite des étudiants marocains en France.
            </p>
            <a 
              href="https://donate.stripe.com/5kQaEQ6t57LC7KZ2jPb3q00" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-semibold text-brand-green hover:text-white transition-colors"
            >
              <Heart className="w-4 h-4 mr-2" />
              Soutenir notre action
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Menu</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Accueil</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">L'association</Link></li>
              <li><Link href="/guide" className="text-gray-400 hover:text-white text-sm transition-colors">Le Guide Étudiant</Link></li>
              <li><a href="https://donate.stripe.com/5kQaEQ6t57LC7KZ2jPb3q00" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">Faire un don</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors">Mentions légales</Link></li>
              <li><p className="text-gray-400 text-sm">SIRET : 990831778</p></li>
              <li><p className="text-gray-400 text-sm">Association Loi 1901</p></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-brand-green mr-3 shrink-0" />
                <a href="mailto:contact@marocainsenfrance.fr" className="text-gray-400 hover:text-white text-sm transition-colors">
                  contact@marocainsenfrance.fr
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-brand-green mr-3 shrink-0" />
                <span className="text-gray-400 text-sm">
                  France
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Marocains en France – Main dans la main. Tous droits réservés.
          </p>
          <div className="flex space-x-6 items-center">
            <Link
              href="/admin/login"
              className="text-gray-500 hover:text-brand-green transition-colors"
              aria-label="Administration"
            >
              <Key className="w-5 h-5" />
            </Link>
            <a 
              href="https://www.instagram.com/marocainsenfrance" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-green transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
