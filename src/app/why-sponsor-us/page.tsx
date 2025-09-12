'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, CheckCircle, ArrowRight, Download, Megaphone, Eye, Star as StarIcon, Briefcase } from 'lucide-react';

// --- Data from your sponsorship deck ---

const generalInfo = {
  festival: "Sabrang 2025",
  theme: "Noorvana: From Color to Cosmos",
  description: "Sabrang is JKLU’s premier annual cultural festival, celebrating creativity, entertainment, and immersive experiences. It attracts students, artists, and performers nationwide, creating an atmosphere of music, technology, and artistic expression.",
  heroSubtitle: "A strategic partnership opportunity to connect your brand with thousands of India's brightest young minds at the intersection of culture and innovation."
};

const flagshipEvents = [
  { name: "Panache (Fashion Show)", description: "The grandest runway event showcasing elegance, charisma, and original collections.", href: "/Events/1/rules" },
  { name: "Bandjam", description: "A showdown of student bands across genres (rock, indie, fusion, classical).", href: "/Events/2/rules" },
  { name: "Dance Battle", description: "One-on-one & crew battles across hip-hop, freestyle, krumping, fusion.", href: "/Events/3/rules" },
  { name: "Step Up (Solo Dance)", description: "The ultimate solo dance challenge testing creativity and stage command.", href: "/Events/4/rules" },
];

const whySponsor = [
  { title: "Extensive Media Coverage", description: "Wide promotion across print, digital, and social media.", icon: Megaphone },
  { title: "Unparalleled Visibility", description: "Prominent logo placement on banners, brochures, certificates, merchandise, digital creatives, and main stage backdrops.", icon: Eye },
  { title: "Engagement & Activation", description: "Premium stall space, co-hosting rights for flagship events, and high-impact social media promotions.", icon: StarIcon },
  { title: "Valuable Audience", description: "Connect with thousands of students, influencers, and young professionals from across India.", icon: Users }
];

const sponsorshipTiers = [
  {
    name: "Title Sponsor",
    price: "₹5,00,000",
    featured: true,
    sections: {
      branding: [
        "“Sabrang 2025 – Presented by [Brand Name]” across all platforms.",
        "Most prominent logo placement (stage backdrops, brochures, digital creatives, T-shirts, etc.).",
        "Top-row placement in press releases, website, and communications."
      ],
      engagement: [
        "Premium stall space.",
        "Sponsor a flagship event.",
        "Brand announcements.",
        "8+ social media promotions & sponsor reel in aftermovie."
      ],
      privileges: ["10 VIP passes", "On-stage felicitation", "Branded goodies in fest kits"]
    }
  },
  {
    name: "Co-Powered By",
    price: "₹3,50,000",
    featured: false,
    sections: {
      branding: [
        "“Co-Powered by [Brand Name]” on all digital and on-ground assets.",
        "Logo on stage panels, posters, T-shirts, digital creatives (medium prominence)."
      ],
      engagement: [
        "Premium stall space.",
        "Sponsor a flagship event.",
        "Announcements.",
        "5–6 social media promotions & mentions in newsletters."
      ],
      privileges: ["6 exclusive passes", "Felicitation on final day", "Vouchers in welcome kits"]
    }
  },
  {
    name: "Associate Sponsor",
    price: "₹2,50,000",
    featured: false,
    sections: {
      branding: ["Logo on select digital materials, posters, certificates, and venue signage."],
      engagement: [
        "Optional stall space.",
        "One-time stage acknowledgment.",
        "Branding in zones (food/exhibition).",
        "3–4 social media shout-outs."
      ],
      privileges: ["4 general passes", "Appreciation certificate", "Access to post-event media"]
    }
  },
  {
    name: "In-Kind Sponsors",
    price: "Flexible Value",
    featured: false,
    description: "Non-monetary contributions to reduce costs & enrich the fest. Visibility is equivalent to the contribution value (logos, stage mentions, stall space, social media shout-outs).",
    examples: [
      "Product sampling",
      "Merchandise",
      "Photography",
      "Food/refreshments",
      "Trophies & certificates"
    ]
  }
];

// --- Reusable Components ---

const Section = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <section className={`relative z-10 py-20 md:py-28 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

const SectionTitle = ({ title, subtitle }: { title: React.ReactNode, subtitle: string }) => (
  <motion.div
    className="text-center mb-16"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    transition={{ staggerChildren: 0.2 }}
    variants={{ hidden: {}, visible: {} }}
  >
    <motion.h2
      className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
      {title}
    </motion.h2>
    <motion.p
      className="text-lg text-gray-400 max-w-3xl mx-auto"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } } }}
    >
      {subtitle}
    </motion.p>
  </motion.div>
);

const TierCard = ({ tier, index }: { tier: any, index: number }) => (
  <motion.div
    className={`group relative bg-black/60 backdrop-blur-md border rounded-2xl p-8 flex flex-col h-full shadow-2xl ${tier.featured ? 'border-blue-400' : 'border-white/20'}`}
    variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    transition={{ type: 'spring', stiffness: 400, damping: 30, delay: index * 0.1 }}
  >
    {tier.featured && <div className="absolute top-0 right-8 -mt-4 px-3 py-1 text-sm font-semibold rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/50">Most Popular</div>}
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
      <div className="text-5xl font-extrabold text-white">{tier.price}</div>
    </div>
    <div className="space-y-6 flex-grow mb-8">
      {tier.description ? (
        <p className="text-gray-400">{tier.description}</p>
      ) : tier.sections ? (
        Object.entries(tier.sections).map(([key, value]) => (
          <div key={key}>
            <h4 className="font-semibold text-blue-300 uppercase tracking-wider text-sm mb-2">{key}</h4>
            <ul className="space-y-2">
              {(value as string[]).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : null}
      {tier.examples && (
         <div>
            <h4 className="font-semibold text-blue-300 uppercase tracking-wider text-sm mb-2">Examples</h4>
            <ul className="space-y-2">
              {tier.examples.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
      )}
    </div>
  </motion.div>
);

interface FormField {
  name: string;
  label: string; 
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const contactFields: FormField[] = [
  { name: 'companyName', label: 'Company Name', type: 'text', required: true, placeholder: 'Enter your company name' }, 
  { name: 'contactPerson', label: 'Contact Person', type: 'text', required: true, placeholder: 'Enter your name' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter your email' },
  { name: 'phone', label: 'Phone Number', type: 'phone', placeholder: 'Enter your phone number' },
  { name: 'sponsorshipAmount', label: 'Sponsorship Amount', type: 'select', options: [
    { value: '50000 - 100000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000 - 200000', label: '₹1,00,001 - ₹2,00,000' },
    { value: '200000 - 500000', label: '₹2,00,001 - ₹5,00,000' },
    { value: '500000+', label: '₹5,00,000+' }
  ] },
  { name: 'preferredTiming', label: 'Preferred Call Time', type: 'select', options: [
    { value: 'Morning', label: 'Morning (9 AM - 12 PM)' },
    { value: 'Afternoon', label: 'Afternoon (12 PM - 5 PM)' },
    { value: 'Evening', label: 'Evening (5 PM - 8 PM)' }
  ] },
];
// --- Main Page Component ---

export default function WhySponsorUsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Form state and handlers can be added here if needed

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/eventpage.webp)'
        }}
      />
      
      {/* Glassy Translucent Overlay with 0.4 opacity */}
      <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.3 }}
          variants={{ hidden: {}, visible: {} }}
        >
          <motion.div
            className="mb-6"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-br from-white via-gray-300 to-blue-300 bg-clip-text text-transparent">
              {generalInfo.festival}
         </h1>
            <p className="text-xl md:text-2xl text-blue-300/80 mt-2 tracking-widest">{generalInfo.theme.split(':')[0]}</p>
          </motion.div>
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
          >
            {generalInfo.heroSubtitle}
          </motion.p>
       <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
          >
            <button
              onClick={() => setIsFormOpen(true)}
              className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold bg-blue-600 rounded-lg text-white transition-all duration-300 hover:bg-blue-500"
            > 
              Become a Partner <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="/Sponsorship_Deck_Sabrang_2025.pdf"
              download
              className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold bg-white/10 border border-white/20 rounded-lg text-white transition-all duration-300 hover:bg-white/20"
            >
              Download Deck <Download className="w-5 h-5" /> 
            </a>
          </motion.div>
   
        </motion.div>
      </section>

      {/* Why Sponsor Us Section */}
      <Section className="relative !py-8 md:!py-12">
        <SectionTitle
          title="The Sabrang Advantage"
          subtitle="Leverage our platform to achieve your brand's strategic objectives."
        />
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.15 }}
        >
           {whySponsor.map((benefit, index) => (
             <motion.div
               key={index}
               className="bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl hover:bg-black/70 transition-all duration-300"
               variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
             >
              <div className="text-blue-400 mb-4"><benefit.icon className="w-10 h-10" /></div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Flagship Events Section */}
      <Section>
        <SectionTitle
          title="A Glimpse of the Spectacle"
          subtitle="Our flagship events are the heart of Sabrang, drawing massive crowds and media attention."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flagshipEvents.map((event, index) => {
            const colors = [
              'from-purple-600 via-pink-600 to-red-500', // Panache - Fashion
              'from-blue-600 via-cyan-500 to-teal-400',  // BandJam - Music
              'from-orange-500 via-red-500 to-pink-500', // Battle Dance - Energy
              'from-green-500 via-emerald-500 to-teal-400' // Nukkad Natak - Street
            ];
            const hoverColors = [
              'hover:from-purple-500 hover:via-pink-500 hover:to-red-400',
              'hover:from-blue-500 hover:via-cyan-400 hover:to-teal-300',
              'hover:from-orange-400 hover:via-red-400 hover:to-pink-400',
              'hover:from-green-400 hover:via-emerald-400 hover:to-teal-300'
            ];
            
            return (
              <a href={event.href} aria-label={`View ${event.name}`} className="block group focus:outline-none focus:ring-2 focus:ring-white/40 rounded-2xl">
                <motion.div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[index]} ${hoverColors[index]}`}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -10, scale: 1.05, boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.3)" }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
                >
                  {/* Video Card Content */}
                  <div className="relative p-8 h-64 flex flex-col justify-center items-center text-center">
                    {/* Event Info */}
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-white/80 text-sm group-hover:text-white transition-colors">
                        {event.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-white/90 text-sm bg-black/20 border border-white/20 px-4 py-2 rounded-full">
                        Explore details <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </a>
            );
          })}
        </div>
      </Section>

      {/* Sponsorship Tiers Section */}
      <Section className="bg-gray-900/50">
        <SectionTitle
          title="Partnership Tiers"
          subtitle="Choose a level of partnership that aligns with your brand's vision and goals."
        />
        <motion.div
          className="grid lg:grid-cols-3 gap-8 items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {sponsorshipTiers.map((tier, index) => (
            <TierCard key={index} tier={tier} index={index} />
          ))}
        </motion.div>
        <motion.div
          className="mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }} >
       </motion.div>
  
        
      </Section>


      <AnimatePresence>
       {isFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFormOpen(false)}
          >
             <motion.div
               className="bg-black/80 backdrop-blur-xl text-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
               onClick={(e) => e.stopPropagation()}
             >
               <div className="bg-black/60 backdrop-blur-md text-white p-6 rounded-t-2xl relative flex justify-between items-center border-b border-white/20">
                <div>
                  <h2 className="text-2xl font-bold">Partnership Inquiry</h2>
                  <p className="text-gray-400">Let's create something extraordinary together.</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

                <form  className="p-8 space-y-4">
                 {contactFields.map((field, index) => (
                 <div key={index}> 
                 <label htmlFor={field.name} className="block text-gray-300 text-sm font-medium mb-2">{field.label}</label>
                   {field.type === 'text' && (
                     <input
                     type="text"
                     id={field.name}
                     name={field.name}
                    placeholder={field.placeholder}
                       className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300" /> 
                      )}
                                {field.type === 'email' && (
                     <input
                     type="email"
                     id={field.name}
                     name={field.name}
                     placeholder={field.placeholder}
                       className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300" /> 
                      )}
                            {field.type === 'phone' && (
                     <input
                     type="tel"
                     id={field.name}
                     name={field.name}
                    placeholder={field.placeholder}
                       className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300" /> 
                      )}
                     {field.type === 'select' && (
                       <select
                          id={field.name}
                          name={field.name}
                       className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300">
                       <option value="">Select {field.label}</option>
                        {field.options && field.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                        </select>
                    )}
                 </div>
                  ))}
        
            <div className="flex items-center justify-between">
            <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Submit
      </button>
  </div>
    </form>
       </motion.div>
          </motion.div>
         )}

            </AnimatePresence>


        
     

    

    </div>
  );
}
  