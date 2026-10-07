import React from "react";
import Marquee from "react-fast-marquee";

const VegMarquee = () => {
  const vegs = [
    {
      name: "Carrots",
      img: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2Fycm90c3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Broccoli",
      img: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Corn",
      img: "https://plus.unsplash.com/premium_photo-1667047165840-803e47970128?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29ybnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Zucchini",
      img: "https://images.pexels.com/photos/3375263/pexels-photo-3375263.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Onion",
      img: "https://images.pexels.com/photos/7129153/pexels-photo-7129153.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Tomato",
      img: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Pepper",
      img: "https://images.pexels.com/photos/221140/pexels-photo-221140.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Cucumber",
      img: "https://images.pexels.com/photos/1691180/pexels-photo-1691180.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Mushroom",
      img: "https://images.pexels.com/photos/1249884/pexels-photo-1249884.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Spinach",
      img: "https://images.pexels.com/photos/6824475/pexels-photo-6824475.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Cilantro",
      img: "https://images.pexels.com/photos/3338495/pexels-photo-3338495.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  return (
    <div className="w-full min-h-[30vh] sm:min-h-[35vh] md:min-h-[40vh] flex items-center justify-center mb-6 sm:mb-8 md:mb-10">
      <Marquee
        gradient={false}
        speed={40}
        loop={0}
        pauseOnHover={true}
        className="w-full h-40 sm:h-48 md:h-56 lg:h-60 flex items-center justify-center"
      >
        {vegs.map((item, index) => (
          <div
            key={index}
            className="h-32 sm:h-40 md:h-48 lg:h-52 w-28 sm:w-36 md:w-44 lg:w-48 mx-1 sm:mx-2 md:mx-3 bg-green-200 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 sm:hover:scale-110 relative shadow-md"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${item.img})`,
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300 hover:bg-opacity-30">
              <h2 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl text-center px-2">
                {item.name}
              </h2>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default VegMarquee;