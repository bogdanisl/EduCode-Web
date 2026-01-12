// src/pages/Course.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import NotFound from "../notFound";
import type { Course } from "../../types/interfaces/Course";
import CourseCurriculum from "./components/CourseCurriculum";
import CoursesCarousel from "../home/components/courseCarousel";
import { ToastContainer, toast } from 'react-toastify';
import type { UserProgress } from "../../types/interfaces/UserProgress";

const API_URL = import.meta.env.VITE_API_URL;

const CoursePage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [progress, setProgress] = useState<UserProgress | null>(null)


    const navigate = useNavigate()
    const handleEnroll = async () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to enroll in the course.", {
                theme: "dark"
            });
            return;
        }
        else {
            try {
                const response = await fetch(`/api/enroll/${id}`, {
                    method: "POST",
                    credentials: "include",
                });
               // console.log(response)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json()
                //console.log({ data })
                const enrollment = data.enrollment
                if (enrollment != null) {
                    navigate(`/lesson/${enrollment.lessonId}`)
                }
                else {
                    toast.error("Failed to redirect for first lesson.", {
                        theme: "dark"
                    });
                }
            }
            catch (err) {
                toast.error("Failed to enroll in the course. Please try again later.", {
                    theme: "dark"
                });
            }
        }
    };
    const handleContinue = async () => {
        if (progress != null && progress.lessonId != null) {
            navigate(`/lesson/${progress.lessonId}`)
        }
        else {
            toast.error("Failed to redirect for lesson page. Please, reload page and try again.", {
                theme: 'dark'
            })
        }
    }
    const singInForStart = async () => {
        navigate(`/auth/login`)
    }
    const handleEdit = async () => {
        navigate(`/admin/course/edit/${id}`)
    }
    const handleDelete = async () => {
        if (!id) {
            setError("ID not founded in URL");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/course/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setError("Course not found");
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } 
            else {
                navigate('../')
            }

        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message || "Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) {
                setError("ID не найден в URL");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/course/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Course not found");
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    //console.log({ data })
                    setCourse(data.course);
                    if (data.enrolled != null) {
                        setProgress(data.enrolled)
                        console.log(data.enrolled)
                        setIsEnrolled(true)
                    }
                }

            } catch (err: any) {
                console.error("Fetch error:", err);
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
                <main className="flex-grow">
                    <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-10 md:py-16">
                        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-12">
                                <section>
                                    <div className="space-y-4">
                                        <p className="text-primary font-bold text-sm">{course.category.name}</p>
                                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">{course.title}</h1>
                                        <p className="text-gray-400 max-w-3xl">{course.description}</p>
                                    </div>
                                </section>

                                {/* Раскрываемый Curriculum с анимацией */}
                                <CourseCurriculum modules={course.modules} />
                            </div>

                            {/* Right Column - Sticky Card */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    <div className="border border-white/10 rounded-xl bg-black/20 overflow-hidden">
                                        <img
                                            src={`${API_URL}/assets/courses/covers/${course.id}.png`}
                                            alt={course.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6 space-y-6">
                                            <div className="flex flex-col gap-4">
                                                {(user?.role === "admin" || (user?.role === 'tester' && user?.id === course.createdBy)) && (
                                                    <>
                                                        <button onClick={handleEdit} className="w-full h-12 px-4 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-500/90 transition-colors">
                                                            Edit
                                                        </button>
                                                        <button onClick={handleDelete} className="w-full h-12 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-500/90 transition-colors">
                                                            Delete
                                                        </button>
                                                        <br />
                                                    </>
                                                )}
                                                {!isAuthenticated && (
                                                    <button onClick={singInForStart} className="w-full h-12 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                                        Sign in For Start
                                                    </button>
                                                )}
                                                {(isAuthenticated && !isEnrolled) && (
                                                    <>
                                                        <button onClick={handleEnroll} className="w-full h-12 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                                            Start Now
                                                        </button>
                                                        <button className="w-full h-12 px-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
                                                            Add to Favorite
                                                        </button>
                                                    </>
                                                )}
                                                {(isAuthenticated && isEnrolled && progress) && (
                                                    <>
                                                        <button onClick={handleContinue} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] transition-colors">
                                                            <span className="material-symbols-outlined">play_arrow</span>
                                                            <span className="truncate">Continue Learning</span>
                                                        </button>
                                                        <p className="text-sm text-gray-500 dark:text-[#9dabb9] flex-1">
                                                            {progress != null ? `${progress.progressPercent}% complete` : course.description}
                                                        </p>
                                                        <div className="">
                                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary transition-all duration-500 ease-out"
                                                                    style={{ width: `${progress.progressPercent}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="space-y-3 pt-4 border-t border-white/10">
                                                <h3 className="font-bold">This course includes:</h3>
                                                <ul className="space-y-2 text-gray-300 text-sm">
                                                    <li className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-primary">play_circle</span>
                                                        22 hours of on-demand video
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-primary">code</span>
                                                        5 Interactive Exercises
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-primary">quiz</span>
                                                        3 Quizzes
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-primary">article</span>
                                                        Downloadable resources
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-auto max-w-7xl mt-20">
                            <section>
                                <div className="space-y-4">
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tighter">More for {course.category.name}</h3>
                                    <CoursesCarousel category={course.category.id} />
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CoursePage;