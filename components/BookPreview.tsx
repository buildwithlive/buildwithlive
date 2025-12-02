'use client';
import { Star, Play } from 'lucide-react';

const BookPreview = () => {
    return (
        <section id="preview" className="py-16 md:py-24 bg-[#080808] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/2 w-full">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What&apos;s Inside?</h2>
                        <p className="text-gray-400 mb-8 text-base">
                            Designed by <strong>Javi Isurumal</strong>, this guide covers every inch of your physique. From the intricate muscles of the forearm to the power of the glutes.
                        </p>
                        
                        {/* Mobile walata 1 col, sm walata 2 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['Biceps (22 Exercises)', 'Triceps (26 Exercises)', 'Forearms', 'Shoulders (40 Exercises)', 'Chest (35 Exercises)', 'Back & Lats', 'Quadriceps', 'Hamstrings', 'Glutes', 'Abs'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-300 bg-gray-900/30 p-2 rounded-lg lg:bg-transparent lg:p-0">
                                    <Star size={16} className="text-blue-500 flex-shrink-0" />
                                    <span className="text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full relative">
                        <div className="bg-gradient-to-br from-gray-800 to-black p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 bg-red-600 rounded-bl-2xl text-white font-bold text-xs uppercase z-10">
                                Exclusive Content
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                                <div className="h-32 sm:h-48 bg-gray-700/50 rounded-xl flex items-center justify-center border border-dashed border-gray-600">
                                    <div className="text-center">
                                        <Play className="mx-auto text-gray-500 mb-2" />
                                        <p className="text-gray-500 text-sm">Video Placeholder</p>
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BookPreview;