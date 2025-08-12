import React from "react";

export default function PeopleStrip() {
  // People array with unique images and background colors for each person
  // Each person has a distinct image (person1.jpg through person30.jpg) and background color
  const people = [
    { img: "/images/person1.jpg", bg: "bg-orange-500" },
    { img: "/images/person2.jpg", bg: "bg-green-500" },
    { img: "/images/person3.jpg", bg: "bg-blue-900" },
    { img: "/images/person4.jpg", bg: "bg-orange-300" },
    { img: "/images/person5.jpg", bg: "bg-blue-900" },
    { img: "/images/person6.jpg", bg: "bg-red-500" },
    { img: "/images/person7.jpg", bg: "bg-orange-500" },
    { img: "/images/person8.jpg", bg: "bg-green-500" },
    { img: "/images/person9.jpg", bg: "bg-purple-500" },
    { img: "/images/person10.jpg", bg: "bg-pink-500" },
    { img: "/images/person11.jpg", bg: "bg-indigo-500" },
    { img: "/images/person12.jpg", bg: "bg-teal-500" },
    { img: "/images/person13.jpg", bg: "bg-yellow-500" },
    { img: "/images/person14.jpg", bg: "bg-cyan-500" },
    { img: "/images/person15.jpg", bg: "bg-lime-500" },
    { img: "/images/person16.jpg", bg: "bg-amber-500" },
    { img: "/images/person17.jpg", bg: "bg-emerald-500" },
    { img: "/images/person18.jpg", bg: "bg-violet-500" },
    { img: "/images/person19.jpg", bg: "bg-rose-500" },
    { img: "/images/person20.jpg", bg: "bg-sky-500" },
    { img: "/images/person21.jpg", bg: "bg-slate-500" },
    { img: "/images/person22.jpg", bg: "bg-zinc-500" },
    { img: "/images/person23.jpg", bg: "bg-neutral-500" },
    { img: "/images/person24.jpg", bg: "bg-stone-500" },
    { img: "/images/person25.jpg", bg: "bg-gray-500" },
    { img: "/images/person26.jpg", bg: "bg-red-600" },
    { img: "/images/person27.jpg", bg: "bg-blue-600" },
    { img: "/images/person28.jpg", bg: "bg-green-600" },
    { img: "/images/person29.jpg", bg: "bg-purple-600" },
    { img: "/images/person30.jpg", bg: "bg-pink-600" }
  ];

  // Committee definitions with name and number of cards required
  // Each committee will get different images based on its position in the grid
  const committees = [
    { name: "Discipline", cards: 2 },           // Uses person4, person5
    { name: "Design", cards: 1 },               // Uses person6
    { name: "Decor", cards: 2 },                // Uses person7, person8
    { name: "Media", cards: 1 },                // Uses person9
    { name: "Report", cards: 1 },               // Uses person10
    { name: "Photography", cards: 2 },          // Uses person11, person12
    { name: "Cultural", cards: 2 },             // Uses person13, person14
    { name: "Hospitality", cards: 1 },          // Uses person15
    { name: "Stage & Venue", cards: 2 },        // Uses person16, person17
    { name: "Registrations", cards: 2 },        // Uses person18, person19
    { name: "Tech & Support", cards: 1 },       // Uses person20
    { name: "Internal Arrangements", cards: 2 }, // Uses person21, person22
    { name: "Transport", cards: 1 },            // Uses person23
    { name: "Social Media", cards: 1 },         // Uses person24
    { name: "Prize & Certificates", cards: 1 }  // Uses person25
  ];

  // Organizing Heads section - uses first 3 people
  const totalCards = 3;
  const cards = Array.from({ length: totalCards }, (_, i) => people[i % people.length]);

  // Separate committees by card count for better mobile layout
  // Double-card committees first, then single-card committees
  const doubleCardCommittees = committees.filter(c => c.cards === 2);
  const singleCardCommittees = committees.filter(c => c.cards === 1);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-2 sm:px-4 py-4 sm:py-8">
      {/* Main "Organizing Heads" heading with cosmic styling - responsive */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        Organizing Heads
      </h1>
      
      {/* Organizing Heads cards - responsive sizing */}
      <div className="flex overflow-hidden mb-12 sm:mb-16">
        {cards.map((person, index) => (
          <div
            key={index}
            className={`relative w-[120px] sm:w-[150px] md:w-[180px] overflow-hidden aspect-[1/2.5] ${person.bg} ${
              index === 1 ? 'transform -translate-y-8 sm:-translate-y-12 md:-translate-y-15' : 'transform translate-y-8 sm:translate-y-12 md:translate-y-12'
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
      
      {/* "Committee Cores" heading - responsive */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        Committee Cores
      </h2>

      {/* Committee grid - responsive layout with double-card committees first */}
      <div className="w-full max-w-6xl px-2 sm:px-4 space-y-8">
        {/* Double card committees - 1 per row on mobile (shown first) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {doubleCardCommittees.map((committee, committeeIndex) => {
            const originalIndex = committees.findIndex(c => c.name === committee.name);
            return (
              <div key={committeeIndex} className="flex flex-col items-center">
                {/* Committee subheading - responsive size */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide text-center" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
                  {committee.name}
                </h3>
                
                {/* Double committee cards with V-shape */}
                <div className="flex overflow-hidden">
                  {Array.from({ length: committee.cards }, (_, cardIndex) => {
                    const personIndex = originalIndex * 3 + cardIndex;
                    const person = people[personIndex % people.length];
                    return (
                      <div
                        key={cardIndex}
                        className={`relative w-[120px] sm:w-[130px] md:w-[150px] overflow-hidden aspect-[1/2.5] ${person.bg} ${
                          cardIndex === 1 ? 'transform -translate-y-6 sm:-translate-y-8' : 'transform translate-y-6 sm:translate-y-8'
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
            );
          })}
        </div>

        {/* Single card committees - 2 per row on mobile (shown second) with larger mobile size */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {singleCardCommittees.map((committee, committeeIndex) => {
            const originalIndex = committees.findIndex(c => c.name === committee.name);
            return (
              <div key={committeeIndex} className="flex flex-col items-center">
                {/* Committee subheading - responsive size */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide text-center" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
                  {committee.name}
                </h3>
                
                {/* Single committee card - increased mobile size */}
                <div className="flex overflow-hidden">
                  {Array.from({ length: committee.cards }, (_, cardIndex) => {
                    const personIndex = originalIndex * 3 + cardIndex;
                    const person = people[personIndex % people.length];
                    return (
                      <div
                        key={cardIndex}
                        className="relative w-[110px] sm:w-[120px] md:w-[130px] overflow-hidden aspect-[1/2.5] bg-gray-500"
                        style={{ backgroundColor: person.bg.replace('bg-', '') }}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
