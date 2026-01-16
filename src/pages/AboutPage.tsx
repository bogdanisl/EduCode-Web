// src/pages/AboutPage.tsx
import React from "react";

const AboutPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-background-dark p-6 sm:p-10">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <header className="text-center space-y-4">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                        About Our Platform
                    </h1>
                    <p className="text-gray-700 dark:text-gray-400 text-lg">
                        Learn programming interactively, step by step, and become a skilled developer.
                    </p>
                </header>

                {/* Mission Section */}
                <section className="bg-white dark:bg-black/20 rounded-xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-md">
                    <div className="md:flex-1 space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            We aim to make programming education accessible, engaging, and effective for everyone.
                            Our platform provides interactive lessons, challenges, and projects to help learners build real skills.
                        </p>
                    </div>
                    
                </section>

                {/* How It Works Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-6 text-center shadow-sm">
                        <span className="material-symbols-outlined text-primary text-4xl">school</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Learn Step by Step</h3>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            Interactive lessons and exercises guide you from basics to advanced programming concepts.
                        </p>
                    </div>

                    <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-6 text-center shadow-sm">
                        <span className="material-symbols-outlined text-primary text-4xl">quiz</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Practice & Challenges</h3>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            Solve coding exercises and projects to apply what you've learned and improve your skills.
                        </p>
                    </div>

                    <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-6 text-center shadow-sm">
                        <span className="material-symbols-outlined text-primary text-4xl">emoji_events</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Track Progress</h3>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            Monitor your learning journey, earn achievements, and stay motivated as you advance.
                        </p>
                    </div>
                </section>

            </div>
        </main>
    );
};

export default AboutPage;
