import React from "react";

export default function PeopleStrip() {
  const people = [
    { img: "/images/devam demo.png", bg: "bg-orange-500" },
    { img: "/images/devam demo.png", bg: "bg-green-500" },
    { img: "/images/devam demo.png", bg: "bg-blue-900" },
    { img: "/images/devam demo.png", bg: "bg-orange-300" },
    { img: "/images/devam demo.png", bg: "bg-blue-900" },
    { img: "/images/devam demo.png", bg: "bg-red-500" },
    { img: "/images/devam demo.png", bg: "bg-green-500" },
    { img: "/images/devam demo.png", bg: "bg-green-500" }
  ];

  const committees = [
    { name: "Discipline", cards: 2 },
    { name: "Design", cards: 1 },
    { name: "Decor", cards: 2 },
    { name: "Media", cards: 1 },
    { name: "Report", cards: 1 },
    { name: "Photography", cards: 2 },
    { name: "Cultural", cards: 2 },
    { name: "Hospitality", cards: 1 },
    { name: "Stage & Venue", cards: 2 },
    { name: "Registrations", cards: 2 },
    { name: "Tech & Support", cards: 1 },
    { name: "Internal Arrangements", cards: 2 },
    { name: "Transport", cards: 1 },
    { name: "Social Media", cards: 1 },
    { name: "Prize & Certificates", cards: 1 }
  ];

  const totalCards = 3;
  const cards = Array.from({ length: totalCards }, (_, i) => people[i % people.length]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 py-8">
      <h1 className="text-7xl font-black mb-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        Organizing Heads
      </h1>
      <div className="flex overflow-hidden mb-16">
        {cards.map((person, index) => (
          <div
            key={index}
            className={`relative w-[180px] overflow-hidden aspect-[1/2.5] ${person.bg} ${
              index === 1 ? 'transform -translate-y-15' : 'transform translate-y-12'
            }`}
          >
            <img
              src={person.img}
              alt={`Person ${index + 1}`}
              className="absolute bottom-0 left-0 w-full h-2/3 object-cover"
            />
          </div>
        ))}
      </div>
      
      <h2 className="text-7xl font-black mb-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        Committee Cores
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {committees.map((committee, index) => (
          <div key={index} className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
              {committee.name}
            </h3>
            <div className="flex overflow-hidden">
              {Array.from({ length: committee.cards }, (_, cardIndex) => {
                const person = people[cardIndex % people.length];
                return (
                  <div
                    key={cardIndex}
                    className={`relative w-[120px] overflow-hidden aspect-[1/2.5] ${person.bg} ${
                      committee.cards === 1 ? '' : 
                      cardIndex === 1 ? 'transform -translate-y-8' : 'transform translate-y-8'
                    }`}
                  >
                    <img
                      src={person.img}
                      alt={`${committee.name} Person ${cardIndex + 1}`}
                      className="absolute bottom-0 left-0 w-full h-2/3 object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
