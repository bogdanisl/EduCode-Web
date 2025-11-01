import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import NotFound from "../notFound";

interface CourseData {
    id: number;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    coverImage?: string;
    price: number;
    originalPrice?: number;
    duration?: string;
    exercises?: number;
    quizzes?: number;
    certificate?: boolean;
    instructor?: {
        name: string;
        title: string;
        avatar: string;
    };
}

const API_URL = import.meta.env.VITE_API_URL;

const Course: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<CourseData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) {
                setError("ID не найден в URL");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/course/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Course not found");
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    setCourse(data.course);
                }
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message || "Ошибка загрузки");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (error === "Course not found") return <NotFound />;
    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-400">Error: {error}</div>;
    if (!course) return null;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-white">
            <div className="layout-container flex h-full grow flex-col">
                {/* Main Content */}
                <main className="flex-grow">
                    <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-10 md:py-16">
                        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-12">
                                <section>
                                    <div className="space-y-4">
                                        <p className="text-primary font-bold text-sm">JavaScript</p>
                                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">{course.title}</h1>
                                        <p className="text-gray-400 max-w-3xl">{course.description}</p>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                                    <div className="space-y-3">
                                        {["JavaScript Foundations", "Asynchronous JavaScript", "Functional Programming", "Modern Tooling & Best Practices"].map((module, i) => (
                                            <div key={i} className="border border-white/10 rounded-lg">
                                                <div className="p-4 flex justify-between items-center cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                                                    <h3 className="font-bold">Module {i + 1}: {module}</h3>
                                                    <span className="material-symbols-outlined text-gray-400">expand_more</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold mb-6">Reviews (4.9/5)</h2>
                                    <div className="space-y-6">
                                        {[
                                            { name: "Alex Johnson", text: "This course completely changed my understanding of JavaScript. Highly recommended!" },
                                            { name: "Maria Garcia", text: "The best JS course I've taken online. The interactive exercises were incredibly helpful." }
                                        ].map((review, i) => (
                                            <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-dashed border-gray-400" />
                                                    <div>
                                                        <h4 className="font-bold">{review.name}</h4>
                                                        <div className="flex text-yellow-400 text-sm">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} className="material-symbols-outlined">star</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-400">"{review.text}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right Column - Sticky Card */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    <div className="border border-white/10 rounded-xl bg-black/20 overflow-hidden">
                                        <img
                                            src={course.coverImage || `${API_URL}/assets/courses/covers/${course.id}.png`}
                                            alt={course.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6 space-y-6">
                                            <div className="flex flex-col gap-4">
                                                {user?.role === 'admin' && (
                                                    <>
                                                        <button className="w-full h-12 px-4 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-500/90 transition-colors">
                                                            Edit
                                                        </button>
                                                        <button className="w-full h-12 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-500/90 transition-colors">
                                                            Delete
                                                        </button>
                                                        <br />
                                                    </>
                                                )}
                                                {!isAuthenticated && (
                                                    <button className="w-full h-12 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                                        Sign in For Start
                                                    </button>
                                                )}
                                                {isAuthenticated && (
                                                    <>
                                                        <button className="w-full h-12 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                                            Start Now
                                                        </button>
                                                        <button className="w-full h-12 px-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
                                                            Add to Favorite
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <div className="space-y-3 pt-4 border-t border-white/10">
                                                <h3 className="font-bold">This course includes:</h3>
                                                <ul className="space-y-2 text-gray-300 text-sm">
                                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">play_circle</span>22 hours of on-demand video</li>
                                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">code</span>5 Interactive Exercises</li>
                                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">quiz</span>3 Quizzes</li>
                                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">article</span>Downloadable resources</li>
                                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">workspace_premium</span>Certificate of completion</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Course;