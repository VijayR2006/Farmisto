import React from "react";

const Panel = () => {
  return (
    <div className="py-12 px-6 bg-gradient-to-b from-[#f7f3e9] via-[#e6edd6] to-[#d6e3bf]">
      <div className="max-w-screen-lg mx-auto relative flex flex-col lg:flex-row items-center text-center lg:text-left gap-10">
        <div className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#7a9f35] shadow-lg shadow-[#5e7b28] lg:order-1">
          <img
            src="https://plus.unsplash.com/premium_photo-1668446124029-9a55e3455b69?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Cow"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full lg:w-[60%]">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4 text-[#5e7b28]">
            Lilly <br />
            <span className="italic font-normal text-[#6b4226]">Daisy</span>
            <br />
            Ruby <br /> Minnie <br /> Ginger
          </h2>
          <p className="text-[#4b5722] text-base sm:text-lg lg:text-xl font-medium">
            Meet our beauties, connect with nature, and enjoy the calmness
            that comes from being around these magnificent animals.
          </p>
        </div>

        <div className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#7a9f35] shadow-lg shadow-[#5e7b28] lg:order-2">
          <img
            src="https://cdn.pixabay.com/photo/2013/12/28/19/28/cow-234835_1280.jpg"
            alt="Cow"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Panel;
