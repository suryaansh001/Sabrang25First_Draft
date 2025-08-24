export default function PanacheRules() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">PANACHE - Fashion Show</h1>
      <div className="max-w-4xl w-full bg-gray-900 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Event Overview</h2>
          <p className="text-lg text-gray-300 mb-4">
            Sabrang's grandest fashion extravaganza spanning two spectacular days. Day 1 features THEME WALK where fashion meets narrative, 
            while Day 2 showcases the ultimate PANACHE runway with original collections and full choreography.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Day 1: THEME WALK</h3>
              <p className="text-gray-300">Date: 25.12.2024 • Time: 19:00</p>
              <p className="text-gray-300">Venue: Main Auditorium</p>
              <p className="text-gray-300">Prize Pool: ₹85</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-pink-400 mb-2">Day 2: PANACHE</h3>
              <p className="text-gray-300">Date: 26.12.2025 • Time: 21:00</p>
              <p className="text-gray-300">Venue: Main Auditorium</p>
              <p className="text-gray-300">Prize Pool: ₹120</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Event Rules</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Day 1: THEME WALK Rules</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Participants must design and wear costumes that interpret the Sabrang theme</li>
                <li>Judging criteria: costume design, thematic relevance, stage presence, and group coordination</li>
                <li>Maximum team size: 4-6 members</li>
                <li>Time limit: 3-5 minutes per team</li>
                <li>Props and accessories are allowed but must be carried by participants</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-pink-400 mb-2">Day 2: PANACHE Rules</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Teams must display original collections or concepts with full choreography</li>
                <li>Soundtrack and fashion narratives are mandatory</li>
                <li>Judging criteria: creativity, choreography, fashion innovation, and overall impact</li>
                <li>Maximum team size: 4-6 members</li>
                <li>Time limit: 5-8 minutes per team</li>
                <li>Professional makeup and styling are encouraged</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">General Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>All participants must register for both days separately</li>
            <li>Teams can participate in either or both days</li>
            <li>Winners will be announced at the end of each day</li>
            <li>Grand prize for best overall performance across both days</li>
            <li>Professional photography and videography will be provided</li>
            <li>Dress rehearsal will be held 2 hours before each event</li>
          </ul>
        </div>
        
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">Contact Coordinators</h3>
          <p className="text-gray-300">Tushar: 823 374 9755 | Chahak: 635 067 3074</p>
        </div>
      </div>
    </div>
  );
} 