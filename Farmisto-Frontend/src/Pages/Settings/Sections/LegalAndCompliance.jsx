import React, { useState } from "react";
import { FaFileContract, FaShieldAlt, FaTasks, FaChevronDown, FaChevronUp } from "react-icons/fa";

const termsOfService = [
  { title: "Control Over Produce", content: "As a farmer on Farmisto, you have full authority to set prices, manage inventory, and decide which produce to sell directly to consumers." },
  { title: "Payment Terms", content: "Profits are transferred weekly or monthly to your designated bank account or UPI ID, as set in Payment Settings. Farmisto ensures payment is collected from consumers before shipping." },
  { title: "Order Cancellation", content: "You may cancel orders before shipment through the Order Management section. Cancellations after shipment are subject to Farmisto's refund policy." },
];

const privacyPolicy = [
  { title: "Data Collection", content: "Farmisto collects your name, contact details, and payment information to facilitate transactions and communication with consumers." },
  { title: "Data Usage", content: "Your data is used to process orders, track profits, and improve our services. We do not sell your personal information to third parties." },
  { title: "Data Security", content: "We implement industry-standard encryption to protect your information. You can update or delete your data via the Admin Panel." },
];

const complianceChecklist = [
  { title: "Accurate Produce Listings", content: "Ensure all produce details (e.g., quantity, quality, price) are accurate to comply with consumer protection laws." },
  { title: "Timely Order Fulfillment", content: "Ship orders within the timelines promised to consumers to maintain trust and meet Farmisto's service standards." },
  { title: "Tax Compliance", content: "You are responsible for reporting your earnings to local tax authorities. Farmisto provides profit summaries to assist with this." },
];

const AccordionSection = ({ title, icon: Icon, items, isOpen, onToggle }) => (
  <div className="bg-white rounded-2xl border border-cream-dark/50 overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-4 hover:bg-cream transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
          <Icon size={14} className="text-orange" />
        </div>
        <span className="font-semibold text-dark text-sm">{title}</span>
      </div>
      {isOpen ? <FaChevronUp size={12} className="text-muted" /> : <FaChevronDown size={12} className="text-muted" />}
    </button>
    {isOpen && (
      <div className="border-t border-cream-dark divide-y divide-cream-dark">
        {items.map((item, i) => (
          <div key={i} className="px-6 py-4 flex items-start gap-4">
            <span className="text-xs font-bold text-orange bg-orange/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold text-dark mb-1">{item.title}</p>
              <p className="text-sm text-muted leading-relaxed">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const LegalAndCompliance = () => {
  const [openSection, setOpenSection] = useState("termsOfService");

  const toggle = (s) => setOpenSection(prev => prev === s ? null : s);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-dark">Legal & Compliance</h2>
        <p className="text-sm text-muted mt-1">Review our terms, privacy policy, and compliance guidelines</p>
      </div>

      <div className="space-y-4">
        <AccordionSection
          title="Terms of Service" icon={FaFileContract}
          items={termsOfService}
          isOpen={openSection === "termsOfService"}
          onToggle={() => toggle("termsOfService")}
        />
        <AccordionSection
          title="Privacy Policy" icon={FaShieldAlt}
          items={privacyPolicy}
          isOpen={openSection === "privacyPolicy"}
          onToggle={() => toggle("privacyPolicy")}
        />
        <AccordionSection
          title="Compliance Checklist" icon={FaTasks}
          items={complianceChecklist}
          isOpen={openSection === "complianceChecklist"}
          onToggle={() => toggle("complianceChecklist")}
        />
      </div>

      {/* Info panel */}
      <div className="mt-6 bg-dark rounded-2xl p-5 text-white">
        <p className="text-xs font-bold text-orange uppercase tracking-widest mb-2">Need Help?</p>
        <p className="text-sm text-white/70 leading-relaxed">
          If you have questions about our legal policies, contact our support team at{" "}
          <a href="mailto:legal@farmisto.com" className="text-orange hover:underline font-medium">legal@farmisto.com</a>
        </p>
      </div>
    </div>
  );
};

export default LegalAndCompliance;