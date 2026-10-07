import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

const sections = [
  {
    id: "01",
    title: "Welcome",
    text: "By using our platform, you agree to adhere to these terms and conditions. Please read them carefully before proceeding.",
    img: "https://images.unsplash.com/photo-1655979910796-7d81bd5449a8?w=700&h=500&fit=crop",
  },
  {
    id: "02",
    title: "User Responsibilities",
    list: [
      "Provide accurate and truthful information during registration.",
      "Misuse of the platform for illegal activities is strictly prohibited.",
      "Ensure the security of your account credentials.",
      "Report any suspicious activity immediately.",
    ],
    img: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    reverse: true,
  },
  {
    id: "03",
    title: "Privacy Policy",
    text: "Your data privacy is our priority. We ensure that your information is securely stored and not shared with third parties without your explicit consent.",
    img: "https://plus.unsplash.com/premium_photo-1700681802465-63aae555de29?w=700&h=500&fit=crop",
  },
  {
    id: "04",
    title: "Limitation of Liability",
    text: "While we strive to provide accurate information and a seamless experience, we are not liable for any direct, indirect, or incidental damages that may occur while using our platform.",
    img: "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg",
    reverse: true,
  },
];

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-cream">
      <NavBar />

      {/* Hero */}
      <div className="bg-cream-dark border-b border-cream-dark/50 py-16 text-center px-6">
        <Sparkle size={20} className="text-orange mx-auto mb-4 animate-sparkle" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-dark">
          Terms &amp; <span className="italic font-normal">Conditions</span>
        </h1>
        <p className="text-muted text-lg mt-4">Know the rules before you engage with our platform.</p>
      </div>

      {/* Sections */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-20 space-y-24">
        {sections.map((s, i) => (
          <div key={i} className={`flex flex-col ${s.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}>
            <div className="w-full lg:w-1/2">
              <img
                src={s.img}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&h=400&fit=crop";
                }}
                alt={s.title}
                className="w-full h-[350px] object-cover rounded-[2rem]"
              />
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

      <Footer />
    </div>
  );
};

export default TermsConditions;
