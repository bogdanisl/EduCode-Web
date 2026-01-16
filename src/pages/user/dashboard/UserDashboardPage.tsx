import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import NotFound from "../../NotFoundPage";
import CoursesCarousel from "../../../components/CourseCarousel";
import type { UserProgress } from "../../../types/userProgress";



const DashboardIndex: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [progresses, setProgresses] = useState<UserProgress[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!isAuthenticated) return;

            try {
                const response = await fetch(`/api/progress`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (Array.isArray(data.progresses)) {
                    setProgresses(data.progresses);
                    console.log(data.progresses); // ← правильный массив
                } else {
                    console.warn('Expected progresses array, got:', data);
                    setProgresses([]);
                }
            } catch (err) {
                console.error('Fetch progress error:', err);
                setProgresses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <NotFound />;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-600 dark:text-gray-400">Loading your progress...</p>
            </div>
        );
    }

    return (
        <div className="relative flex h-auto  w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                {/* Main Content */}
                <main className="flex-1 px-4 sm:px-8 lg:px-10 py-8">
                    <div className="layout-content-container flex flex-col max-w-7xl mx-auto">
                        {/* Welcome Section */}
                        <div className="flex flex-wrap justify-between items-center gap-4 py-4 px-2">
                            <div className="flex min-w-72 flex-col gap-2">
                                <p className="text-gray-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                                    Welcome back, {user?.fullName}!
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 dark:text-slate-400 text-base font-normal leading-normal">
                                    Ready to dive back into your learning journey?
                                </p>
                            </div>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] transition-colors">
                                <span className="material-symbols-outlined">play_arrow</span>
                                <span className="truncate">{progresses.length==0?'Start your journey': 'Continue Learning'}</span>
                            </button>
                        </div>

                        {/* Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                            {/* Left Column */}
                            <div className="lg:col-span-2 flex flex-col">
                                <div className="px-2">
                                    <section>

                                        <h2 className="text-gray-800 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 bg-background-light dark:bg-background-dark">
                                            My Courses
                                        </h2>
                                        <div className="space-y-4">
                                            <CoursesCarousel progressesRef={progresses}/>
                                        </div>
                                    </section>
                                </div>

                            </div>

                            {/* Right Column - Sidebar */}
                            <aside className="lg:col-span-1 flex flex-col gap-8">
                                {/* My Progress */}
                                {/* <section>
                                    <h2 className="text-gray-800 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 pb-3 pt-5 bg-background-light dark:bg-background-dark">
                                        My Progress
                                    </h2>
                                    <div className="p-6 mt-8 shadow-md dark:shadow-none ounded-xl overflow-hidden dark:bg-background-dark-2 rounded-xl">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-6">
                                            <div className="flex flex-col items-center text-center">
                                                <p className="text-primary text-4xl font-black">8</p>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Courses<br />Completed</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <p className="text-primary text-4xl font-black">120</p>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Hours of<br />Learning</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <p className="text-primary text-4xl font-black">23</p>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Current<br />Streak</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center">
                                                <p className="text-primary text-4xl font-black">14</p>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Projects<br />Submitted</p>
                                            </div>
                                        </div>
                                    </div>
                                </section> */}
                            </aside>
                        </div>


                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardIndex;
