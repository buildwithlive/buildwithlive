'use client';
import { motion } from 'framer-motion';
import { Play, Layers, CheckCircle } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Play className="w-8 h-8 text-blue-400" />,
      title: "Live Video Experience",
      desc: "Stop guessing. Scan QR codes instantly to see 250+ exercises in motion. Perfect your form with real-time visual guides."
    },
    {
      icon: <Layers className="w-8 h-8 text-emerald-400" />,
      title: "Full Body Anatomy",
      desc: "Deep dive into muscle mechanics. Understand exactly which muscle fibers you are targeting with detailed anatomical breakdowns."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-purple-400" />,
      title: "Expert Tips & Breathing",
      desc: "Master the art of breathing and get insider tips for every rep. Maximize endurance and safety."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Not Just a Book. <br/><span className="text-gray-500">It&apos;s a Personal Trainer.</span></h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {features.map((feature, idx) => (
                    <motion.div 
                        key={idx}
                        whileHover={{ y: -10 }}
                        className="p-6 md:p-8 rounded-3xl bg-gray-900/50 border border-white/5 hover:border-blue-500/30 transition-all duration-300 group"
                    >
                        <div className="mb-6 p-4 bg-gray-800 rounded-2xl w-fit group-hover:bg-gray-700 transition-colors">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Features;