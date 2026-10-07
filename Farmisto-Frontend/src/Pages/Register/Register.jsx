import { useRef, useEffect, useState } from "react";
import { RiLeafFill } from "react-icons/ri";
import { FaArrowLeftLong } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { Modal } from "rsuite";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTractor, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/Auth";

/* ─── Role config ─────────────────────────────────────── */
const ROLES = {
  consumer: {
    label: "Consumer",
    icon: FaUser,
    tagline: "Shop fresh produce from local farmers.",
    redirect: "/",
    image: "https://plus.unsplash.com/premium_photo-1661964436517-d977254ad1fe?q=80&w=1400&auto=format&fit=crop",
    quote: "Fresh produce,\ndelivered to your door.",
    quoteCaption: "Join thousands of happy customers receiving farm-fresh goodness daily.",
  },
  farmer: {
    label: "Farmer",
    icon: FaTractor,
    tagline: "Sell your harvest directly to consumers.",
    redirect: "/farmer/dashboard",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1400&auto=format&fit=crop",
    quote: "Grow more,\nearns more.",
    quoteCaption: "Connect directly with buyers and get fair prices for your produce.",
  },
};

/* ─── Location modal ──────────────────────────────────── */
const LocationModal = ({ open, error, onManual, onClose }) => (
  <Modal backdrop="static" keyboard={false} open={open} onClose={onClose}
    className="fixed inset-0 z-[60] flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-2xl w-11/12 sm:w-96 overflow-hidden absolute left-1/2 -translate-x-1/2 top-1/4">
      <div className="bg-cream-dark px-6 py-5 flex items-center gap-3">
        <FaMapMarkerAlt className="text-orange" size={18} />
        <h2 className="font-serif text-lg font-bold text-dark">Fetching Location</h2>
      </div>
      <div className="p-6 text-center">
        <p className="text-muted text-sm leading-relaxed">
          We're determining your location to find nearby farmers. This takes a few seconds.
        </p>
        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        <button onClick={onManual}
          className="mt-4 px-6 py-2 bg-dark text-white rounded-full text-sm font-semibold hover:bg-dark/80 transition-colors">
          Enter Manually
        </button>
      </div>
      <div className="bg-cream-dark px-6 py-4 flex justify-center">
        <button onClick={onClose}
          className="px-8 py-2.5 bg-orange text-white rounded-full text-sm font-semibold hover:bg-orange-hover transition-colors shadow-md">
          Continue
        </button>
      </div>
    </div>
  </Modal>
);

/* ─── Main component ──────────────────────────────────── */
const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Role: consumer | farmer  (pre-select via ?role=farmer)
  const initialRole = searchParams.get("role") === "farmer" ? "farmer" : "consumer";
  const [role, setRole] = useState(initialRole);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const locationRef = useRef(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const cfg = ROLES[role];

  /* Location fetch — only needed for registration (both roles) */
  const fetchLocation = () => {
    if (isLogin) return;
    setShowModal(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locationRef.current = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setLocationError("");
        setShowModal(false);
      },
      () => {
        setLocationError("Unable to get location. Please enter manually.");
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };

  // Reset form state when role changes
  useEffect(() => {
    setIsLogin(false);
    setError("");
    locationRef.current = null;
    if (nameRef.current) nameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
  }, [role]);

  // Fetch location when switching to register mode
  useEffect(() => { fetchLocation(); }, [isLogin, role]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !document.getElementById("google-sign-in-button")) return undefined;

    const handleGoogleCredential = async (response) => {
      setError("");
      setGoogleLoading(true);
      try {
        const result = await axios.post("/user/google", { credential: response.credential, role });
        login(result.data.token);
        navigate(result.data.redirect || cfg.redirect);
      } catch (err) {
        setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    };

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleGoogleCredential });
      window.google.accounts.id.renderButton(document.getElementById("google-sign-in-button"), {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
    return () => script.remove();
  }, [cfg.redirect, login, navigate, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailRef.current?.value || !passwordRef.current?.value || (!isLogin && !nameRef.current?.value)) {
      setError("All fields are required."); return;
    }
    setLoading(true);

    // Unified request body for both roles
    const formData = isLogin
      ? { email: emailRef.current.value, password: passwordRef.current.value }
      : {
          userName: nameRef.current?.value || "",
          email: emailRef.current.value,
          password: passwordRef.current.value,
          role: role,
          userLocation: locationRef.current,
        };

    try {
      const endpoint = isLogin ? "/user/login" : "/user/register";
      const response = await axios.post(endpoint, formData);
      if (response.status === 200 || response.status === 201) {
        login(response.data.token);
        // Use redirect from response, or fall back to role config
        navigate(response.data.redirect || cfg.redirect);
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError("Server is waking up. Please wait a moment and try again.");
      } else {
        const serverMsg = err.response?.data?.message;
        setError(serverMsg || `${isLogin ? "Login" : "Registration"} failed. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cream flex">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <PuffLoader color="#E8621A" size={90} />
        </div>
      )}

      {/* Location modal (register only) */}
      <LocationModal
        open={showModal}
        error={locationError}
        onManual={() => { locationRef.current = { latitude: "Manual", longitude: "Manual" }; setLocationError(""); setShowModal(false); }}
        onClose={() => setShowModal(false)}
      />

      {/* ── Left: Form panel ──────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-16 relative">
        {/* Back btn */}
        <button onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-muted hover:text-dark transition-colors text-sm font-medium">
          <FaArrowLeftLong size={13} /> Back
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <RiLeafFill size={22} className="text-orange" />
          <span className="font-serif text-2xl font-bold text-dark">farm<span className="italic text-orange">isto</span></span>
        </div>

        <div className="w-full max-w-md">

          {/* ── Role Tab Switcher ── */}
          <div className="flex bg-cream-dark rounded-2xl p-1 mb-8">
            {Object.entries(ROLES).map(([key, r]) => (
              <button
                key={key}
                onClick={() => setRole(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  role === key
                    ? "bg-dark text-white shadow-md"
                    : "text-muted hover:text-dark"
                }`}
              >
                <r.icon size={15} />
                {r.label}
              </button>
            ))}
          </div>

          {/* ── Header ── */}
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dark mb-2">
            {isLogin ? "Welcome back." : `Join as a\n${cfg.label}.`}
          </h1>
          <p className="text-muted text-base mb-2">
            {isLogin ? `Log in to your ${cfg.label.toLowerCase()} account.` : cfg.tagline}
          </p>

          {/* Role capability hint */}
          {!isLogin && (
            <div className={`mb-8 px-4 py-3 rounded-xl text-sm font-medium border ${
              role === "farmer"
                ? "bg-orange/10 border-orange/30 text-orange"
                : "bg-dark/5 border-dark/10 text-dark"
            }`}>
              {role === "farmer"
                ? "You'll get access to the Farmer Dashboard — manage orders, listings & earnings."
                : "You'll be able to browse the market, place orders & track deliveries."}
            </div>
          )}
          {isLogin && <div className="mb-8" />}

          {/* Social sign-in */}
          <div className="flex gap-3 mb-6">
            <div id="google-sign-in-button" className={`flex-1 flex justify-center ${googleLoading ? "opacity-60 pointer-events-none" : ""}`} />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-cream-dark" />
            <span className="text-xs text-muted font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input ref={nameRef} type="text"
                placeholder={role === "farmer" ? "Farm / Full Name" : "Full Name"}
                className="w-full px-5 py-3.5 border border-cream-dark rounded-xl bg-white text-dark placeholder-muted focus:outline-none focus:border-orange transition-colors text-sm"
              />
            )}
            <input ref={emailRef} type="email" placeholder="Email Address"
              className="w-full px-5 py-3.5 border border-cream-dark rounded-xl bg-white text-dark placeholder-muted focus:outline-none focus:border-orange transition-colors text-sm"
            />
            <input ref={passwordRef} type="password" placeholder="Password"
              className="w-full px-5 py-3.5 border border-cream-dark rounded-xl bg-white text-dark placeholder-muted focus:outline-none focus:border-orange transition-colors text-sm"
            />
            {error && (
              <p className="text-red-500 text-xs font-medium px-1">{error}</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors text-base mt-2 disabled:opacity-60 shadow-md">
              {isLogin ? "Log In" : `Create ${cfg.label} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-orange font-semibold hover:underline">
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>

          {/* Switch role prompt */}
          <p className="text-center text-xs text-muted mt-3">
            {role === "farmer" ? "Shopping instead? " : "Are you a farmer? "}
            <button onClick={() => setRole(role === "farmer" ? "consumer" : "farmer")}
              className="text-dark font-semibold hover:text-orange transition-colors">
              {role === "farmer" ? "Switch to Consumer" : "Join as Farmer"}
            </button>
          </p>
        </div>
      </div>

      {/* ── Right: Image panel ────────────────────── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={cfg.image}
          className="w-full h-full object-cover transition-all duration-700"
          alt={cfg.label}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent flex flex-col justify-end p-12">
          {/* Role badge */}
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold w-fit">
            <cfg.icon size={14} /> {cfg.label} Portal
          </span>
          <p className="font-serif text-4xl font-bold text-white leading-tight mb-4 whitespace-pre-line">
            {cfg.quote}
          </p>
          <p className="text-white/70 text-base">{cfg.quoteCaption}</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
