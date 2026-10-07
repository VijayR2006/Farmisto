import React, { useState } from "react";
import { FaQuestionCircle, FaCommentDots, FaChevronDown, FaChevronUp, FaCheckCircle, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "../../../utils/axios";

const faqs = [
  { question: "How can I track my weekly or monthly profits?", answer: "Visit the Dashboard to view your earnings, total transactions, and revenue trends in the sales chart." },
  { question: "How do I check the status of my orders?", answer: "Go to 'Orders' in the sidebar to see all orders with statuses like 'Pending,' 'Shipped,' or 'Delivered,' plus customer details." },
  { question: "Can I cancel an order after it's placed?", answer: "Contact support immediately if you need to cancel an order. Once shipped, cancellations follow our refund policy." },
  { question: "How do I update my payment details?", answer: "Head to 'Payment Settings' to edit your bank account or UPI details for seamless profit transfers." },
  { question: "What happens if a consumer doesn't pay?", answer: "Farmisto collects payment upfront before shipping, ensuring you're covered. Contact us if any issues arise." },
  { question: "How do I add new products to sell?", answer: "Go to 'Add Item' in the sidebar, fill in the product details, upload an image, and submit. Your item will appear in the marketplace." },
];

const HelpAndSupport = () => {
  const [formData, setFormData] = useState({ feedback: "" });
  const [openFaq, setOpenFaq] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.feedback.trim()) { setError("Please enter your feedback before submitting."); return; }

    setSubmitting(true);
    try {
      const response = await axios.post("/farmer/support/feedback", { feedback: formData.feedback }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      if (response.status === 200) {
        setSuccess(true);
        setFormData({ feedback: "" });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.response?.data?.message || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-dark">Help & Support</h2>
          <p className="text-sm text-muted mt-1">Find answers and get in touch with us</p>
        </div>
        {success && <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-xl">✓ Feedback sent!</span>}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-cream-dark/50 overflow-hidden mb-4">
        <button onClick={() => setOpenFaq(openFaq === "main" ? null : "main")} className="w-full flex items-center justify-between px-6 py-4 hover:bg-cream transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
              <FaQuestionCircle size={14} className="text-orange" />
            </div>
            <span className="font-semibold text-dark text-sm">Frequently Asked Questions</span>
          </div>
          {openFaq === "main" ? <FaChevronUp size={12} className="text-muted" /> : <FaChevronDown size={12} className="text-muted" />}
        </button>

        {openFaq === "main" && (
          <div className="border-t border-cream-dark divide-y divide-cream-dark">
            {faqs.map((faq, i) => (
              <div key={i} className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? "main" : i)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <div className="flex items-start gap-3">
                    <FaCheckCircle size={13} className="text-orange mt-0.5 shrink-0" />
                    <span className="text-sm font-semibold text-dark group-hover:text-orange transition-colors">{faq.question}</span>
                  </div>
                  {openFaq === i ? <FaChevronUp size={11} className="text-muted shrink-0" /> : <FaChevronDown size={11} className="text-muted shrink-0" />}
                </button>
                {openFaq === i && (
                  <p className="text-sm text-muted mt-2 ml-6 leading-relaxed">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-2xl border border-cream-dark/50 overflow-hidden mb-4">
        <button onClick={() => setShowFeedback(!showFeedback)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-cream transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
              <FaCommentDots size={14} className="text-orange" />
            </div>
            <span className="font-semibold text-dark text-sm">Feedback & Suggestions</span>
          </div>
          {showFeedback ? <FaChevronUp size={12} className="text-muted" /> : <FaChevronDown size={12} className="text-muted" />}
        </button>

        {showFeedback && (
          <form onSubmit={handleSubmit} className="border-t border-cream-dark px-6 py-5 space-y-4">
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows={4}
              placeholder="Share your feedback or suggestions..."
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-dark text-sm focus:outline-none focus:border-orange resize-none placeholder-muted"
            />
            <button type="submit" disabled={submitting}
              className="w-full py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors shadow-md disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-dark rounded-2xl p-5 text-white">
        <p className="text-xs font-bold text-orange uppercase tracking-widest mb-3">Contact Us</p>
        <div className="space-y-2">
          <a href="mailto:support@farmisto.com" className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
            <FaEnvelope size={12} className="text-orange" /> support@farmisto.com
          </a>
          <a href="tel:+911234567890" className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
            <FaPhone size={12} className="text-orange" /> +91 123 456 7890
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
