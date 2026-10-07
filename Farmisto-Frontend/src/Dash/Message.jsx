import React, { useState } from "react";
import SideNav from "./SideNav";
import { FaSearch, FaPaperPlane } from "react-icons/fa";

const allMessages = [
  { id: 1, name: "Leanne Graham", city: "Gwenborough", profileImage: "https://randomuser.me/api/portraits/med/men/75.jpg", message: "Hello, how are you doing today?" },
  { id: 2, name: "Ervin Howell", city: "Wisokyburgh", profileImage: "https://randomuser.me/api/portraits/med/men/78.jpg", message: "Can you send me the report by 3 PM?" },
  { id: 3, name: "Clementine Bauch", city: "McKenziehaven", profileImage: "https://randomuser.me/api/portraits/med/men/79.jpg", message: "I need help with the new project." },
  { id: 4, name: "Patricia Lebsack", city: "South Elvis", profileImage: "https://randomuser.me/api/portraits/med/men/77.jpg", message: "Don't forget about the meeting at 2 PM!" },
  { id: 5, name: "Sam Whisley", city: "Roscoeview", profileImage: "https://randomuser.me/api/portraits/med/men/80.jpg", message: "Let's catch up soon, been a while!" },
  { id: 6, name: "Emily Smith", city: "Roscoeview", profileImage: "https://randomuser.me/api/portraits/med/women/81.jpg", message: "Can we discuss the pricing?" },
  { id: 7, name: "Tanya Boswolth", city: "Roscoeview", profileImage: "https://randomuser.me/api/portraits/med/women/90.jpg", message: "Great produce, ordered again!" },
  { id: 8, name: "Jack Molter", city: "Roscoeview", profileImage: "https://randomuser.me/api/portraits/med/men/92.jpg", message: "Please confirm my bulk order." },
];

const mockChats = [
  { from: "them", text: "Hello, how are you doing today?" },
  { from: "me", text: "Hey! All good, thanks for reaching out." },
  { from: "them", text: "I wanted to ask about bulk pricing for tomatoes." },
  { from: "me", text: "Sure! For orders above 50kg we can do ₹40/kg." },
];

const Message = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(allMessages[0]);
  const [chats, setChats] = useState(mockChats);
  const [input, setInput] = useState("");

  const filtered = allMessages.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const sendMessage = () => {
    if (!input.trim()) return;
    setChats(prev => [...prev, { from: "me", text: input.trim() }]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <SideNav />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="w-full h-16 flex items-center px-6 bg-white border-b border-cream-dark/60 shrink-0">
          <div>
            <p className="text-xs text-muted font-medium">Farmer Portal</p>
            <h2 className="font-serif text-lg font-bold text-dark">Messages</h2>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar: contacts list */}
          <div className="w-72 shrink-0 bg-white border-r border-cream-dark/50 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-cream-dark">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-dark bg-cream text-sm focus:outline-none focus:border-orange"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {filtered.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => setSelected(msg)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-cream-dark/30 hover:bg-cream transition-colors ${selected?.id === msg.id ? "bg-cream" : ""}`}
                >
                  <img src={msg.profileImage} alt={msg.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold truncate ${selected?.id === msg.id ? "text-orange" : "text-dark"}`}>{msg.name}</p>
                      <span className="w-2 h-2 rounded-full bg-orange shrink-0 ml-2" />
                    </div>
                    <p className="text-xs text-muted truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat area */}
          {selected ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat header */}
              <div className="px-6 py-4 bg-white border-b border-cream-dark/50 flex items-center gap-4 shrink-0">
                <img src={selected.profileImage} alt={selected.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-dark">{selected.name}</p>
                  <p className="text-xs text-muted">{selected.city}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-none">
                {chats.map((c, i) => (
                  <div key={i} className={`flex ${c.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${c.from === "me" ? "bg-orange text-white rounded-br-none" : "bg-white text-dark border border-cream-dark rounded-bl-none"}`}>
                      {c.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input area */}
              <div className="px-6 py-4 bg-white border-t border-cream-dark/50 flex items-center gap-3 shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm focus:outline-none focus:border-orange text-dark placeholder-muted"
                />
                <button onClick={sendMessage} className="w-11 h-11 bg-orange text-white rounded-xl flex items-center justify-center hover:bg-orange-hover transition-colors shadow-sm">
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted text-sm">Select a conversation to chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
