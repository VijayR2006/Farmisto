import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const Learn = () => {
  const sections = [
    { num: "01", title: "Your Dashboard", desc: "Overview of your farmer control panel — analytics, orders, inventory at a glance." },
    { num: "02", title: "Listing Your Produce", desc: "How to add and manage your items, upload photos, and set competitive prices." },
    { num: "03", title: "Managing Orders", desc: "Track incoming orders, confirm delivery, and communicate with buyers directly." },
    { num: "04", title: "Settings", desc: "Update your profile, payment preferences, and notification settings." },
    { num: "05", title: "Sales Stats & Reports", desc: "Understand your revenue trends, top products, and customer insights." },
    { num: "06", title: "Graphics & Tutorials", desc: "Visual guides and video walkthroughs for every major platform feature." },
  ];

  const videoId = "px1EeqpKDUI";

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />

      {/* Hero */}
      <div className="bg-cream-dark border-b border-cream-dark/50 py-16 text-center px-6">
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-dark">Farmer <span className="italic font-normal">Learning Hub</span></h1>
        <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">
          Learn how to use Farmisto to sell your produce directly to customers.
        </p>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-20">
        {/* Guide Index */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-20">
          {sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-cream-dark/50 shadow-sm hover:shadow-md hover:border-orange/30 transition-all group cursor-pointer">
              <span className="text-xs font-bold text-orange tracking-widest block mb-2">{s.num}</span>
              <h3 className="font-serif text-lg font-bold text-dark group-hover:text-orange transition-colors mb-2">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Video Tutorials */}
        <h2 className="font-serif text-4xl font-bold text-dark mb-10 text-center">Video Walkthroughs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-dark/50">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?list=PLopq6yGfmFAtRWTFWaX46sfusrL84e5fx`}
                  title={s.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold text-orange tracking-widest">{s.num}</span>
                <h4 className="font-serif text-lg font-bold text-dark mt-1">{s.title}</h4>
                <p className="text-muted text-sm mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted mt-16 text-base">
          Need further help? <a href="/contact" className="text-orange font-semibold hover:underline">Contact our support team →</a>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Learn;