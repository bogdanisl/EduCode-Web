import React, { useEffect, useState } from 'react'
import type { Course } from '../../../types/interfaces/Course';
import CourseCard from '../../../components/CourseCard';


const CoursesCarousel: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/course?limit=4`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json() // Парсим JSON из ответа

        // Проверяем, что data — это массив
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
  }, [])

  if (loading) {
    return <div className="w-full px-6 py-8 text-center">Loading...</div>
  }

  if (error) {
    return <div className="w-full px-6 py-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="w-full px-6 py-8">
      <div
        className="
          grid 
          gap-6
          sm:grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-2
          xl:grid-cols-4
          2xl:grid-cols-4
        "
      >
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))
        ) : (
          <div className="w-full text-center">No courses available</div>
        )}
      </div>
    </div>
  )
}

export default CoursesCarousel