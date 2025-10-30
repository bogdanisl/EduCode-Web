// src/components/courses/CourseCard.tsx

import { useNavigate } from 'react-router-dom';
import type { Course } from '../../../types/interfaces/Course';

interface CourseCardProps {
    course: Course;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function CourseCard({ course }: CourseCardProps) {
    const navigate = useNavigate();

    const handleViewCourse = () => {
        navigate(`/courses/${course.id}`);
    };

    return (
        <div
            onClick={handleViewCourse}
            className="flex flex-col bg-background-light dark:bg-[#1c2127] shadow-md dark:shadow-none rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 group cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleViewCourse()}
        >
            {/* Cover Image */}
            <div
                className="bg-center bg-no-repeat aspect-video bg-cover"
                style={{ backgroundImage: `url("${API_URL}/assets/courses/covers/${course.id}.png")` }}
                aria-label={course.title}
            />

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-[#9dabb9] mb-4 flex-1">{course.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags && course.tags.map((tag) => (
                        <span
                            key={tag}
                            className={`text-xs font-medium px-2 py-1 rounded-full ${['JavaScript', 'Python', 'UI/UX', 'React', 'Node.js', 'Data Science'].includes(tag)
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-white/10 text-white/80'
                                }`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Difficulty + Rating */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-[#9dabb9] border-t border-white/10 pt-3">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base ">
                            {course.difficulty === 'beginner' && 'signal_cellular_alt_1_bar'}
                            {course.difficulty === 'intermediate' && 'signal_cellular_alt_2_bar'}
                            {course.difficulty === 'advanced' && 'signal_cellular_alt'}
                        </span>
                        <span>{course.difficulty}</span>
                    </div>
                    { course.rating &&
                        <div className="flex items-center gap-1.5">

                            <span
                                className="material-symbols-outlined text-base text-yellow-400"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                star
                            </span>
                            <span>{course.rating}</span>
                        </div>
                    }
                </div>

                {/* View Course Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // не вызывать клик по карточке
                        handleViewCourse();
                    }}
                    className="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                    <span className="truncate">View Course</span>
                </button>
            </div>
        </div>
    );
}