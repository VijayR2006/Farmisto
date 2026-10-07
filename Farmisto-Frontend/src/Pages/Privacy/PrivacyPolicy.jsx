import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import { Link } from "react-router-dom";

const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

const sections = [
  {
    id: "01",
    title: "Information We Collect",
    list: [
      "Personal information like name, email, and address.",
      "Non-personal data such as IP addresses and browsing behavior.",
      "Cookies for a personalized user experience.",
    ],
    img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
  {
    id: "02",
    title: "How We Use Your Information",
    text: "We use your data to provide and improve our services, personalize your experience, send updates, and respond to your queries.",
    img: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    reverse: true,
  },
  {
    id: "03",
    title: "How We Protect Your Information",
    list: [
      "Data encryption for all sensitive information.",
      "Regular security audits and checks.",
      "Strictly limited access to personal data.",
    ],
    img: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg",
  },
  {
    id: "04",
    title: "Your Rights",
    list: [
      "Access your personal data at any time.",
      "Request corrections or deletions.",
      "Opt out of marketing communications.",
    ],
    img: "https://images.pexels.com/photos/3184397/pexels-photo-3184397.jpeg",
    reverse: true,
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-cream">
      <NavBar />
      {/* Hero */}
      <div className="bg-cream-dark border-b border-cream-dark/50 py-16 text-center px-6">
        <Sparkle size={20} className="text-orange mx-auto mb-4 animate-sparkle" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-dark">
          Privacy <span className="italic font-normal">Policy</span>
        </h1>
        <p className="text-muted text-lg mt-4">Learn how we handle your information with care.</p>
      </div>

      {/* Sections */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-20 space-y-24">
        {sections.map((s, i) => (
          <div key={i} className={`flex flex-col ${s.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}>
            <div className="w-full lg:w-1/2">
              <img src={s.img} alt={s.title} className="w-full h-[350px] object-cover rounded-[2rem]" />
            </div>
            <div className="w-full lg:w-1/2">
              <span className="text-orange font-bold text-sm tracking-widest uppercase">{s.id}</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark mt-2 mb-6">{s.title}</h2>
              {s.text && <p className="text-muted text-lg leading-relaxed">{s.text}</p>}
              {s.list && (
                <ul className="space-y-3">
                  {s.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-muted text-base">
                      <span className="w-2 h-2 rounded-full bg-orange mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-dark text-white py-20 text-center px-6">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-5">Questions About Privacy?</h2>
        <p className="text-white/70 text-lg max-w-md mx-auto mb-10">
          Contact us at <span className="text-orange font-semibold">privacy@farmisto.com</span>
        </p>
        <Link to="/contact" className="inline-block px-10 py-4 bg-orange text-white font-semibold rounded-full text-lg hover:bg-orange-hover transition-colors shadow-lg">
          Get in Touch
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
