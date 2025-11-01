// src/pages/CoursesPage.jsx

import { useEffect, useState } from "react";
import CourseGrid from "./components/CourseGrid";
import FiltersSidebar from "./components/FilterSideBar";
import Pagination from "./components/Pagination";
import SortChips from "./components/SortChips";
import type { Course } from "../../types/interfaces/Course";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";


export default function CoursesIndex() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { role } = useAuth();
    
    useEffect(() => {
        //console.log(loading,error)
        const fetchCourses = async () => {
            try {
                const response = await fetch(`/api/course?limit=9`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! Status:  ${response.status}`)
                }

                const data = await response.json()
                if (Array.isArray(data)) {
                    setCourses(data)
                } else {
                    throw new Error('API did not return an array')
                }
                setLoading(false)
            } catch (err) {
                console.error('Fetch error:', err)
                setError('Failed to load courses. Please try again later.')
                setLoading(false)
            }
        }

        fetchCourses()
    })
    return (
        <main className="flex-1 px-6 sm:px-10 lg:px-20 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filters */}
                    <FiltersSidebar />

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                                Explore Our Courses
                            </h1>
                            {role === 'admin' &&
                            <Link
                            to={'/admin/course/create'}
                            className="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                            >
                                <span className="truncate">Add New Course</span>
                            </Link>
                            }
                        </div>

                        <SortChips />
                        <CourseGrid courses={courses} />
                        <Pagination />
                    </div>
                </div>
            </div>
        </main>
    );
}