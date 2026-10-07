import { Link } from "react-router-dom";
import { FaLeaf, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaHeart } from "react-icons/fa";

const Footer = () => {
  const footerSections = {
    "Shop": [
      { name: "Market Place", path: "/market" },
      { name: "Nearby Farmers", path: "/farmers" },
      { name: "Organic Produce", path: "/market" },
    ],
    "Company": [
      { name: "About Us", path: "/about" },
      { name: "How It Works", path: "/about" },
      { name: "Our Farmers", path: "/farmers" },
    ],
    "Support": [
      { name: "Help Center", path: "/faq" },
      { name: "Contact Us", path: "/contact" },
      { name: "FAQs", path: "/faq" },
    ],
  };

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center shadow-lg group-hover:shadow-orange/30 transition-all">
                <FaLeaf size={15} className="text-white" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">
                farm<span className="italic text-orange">isto</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Fresh farm produce delivered directly from local farmers to your doorstep. Sustainable. Fresh. Local.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-1">
              {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-orange hover:border-orange hover:text-white transition-all duration-300"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerSections).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <span>&copy; {new Date().getFullYear()} Farmisto Trading Corp.</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline flex items-center gap-1">
                Made with <FaHeart size={9} className="text-orange" /> for local farmers
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/terms-conditions" className="text-xs text-white/40 hover:text-white transition-colors">Terms</Link>
              <Link to="/privacy" className="text-xs text-white/40 hover:text-white transition-colors">Privacy</Link>
              <Link to="/contact" className="text-xs text-white/40 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
