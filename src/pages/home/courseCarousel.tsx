import React, { useEffect, useState } from 'react'
import CourseCard from '../../components/courseCard'

// Интерфейс для структуры курса, основанный на модели Course
interface Course {
  id: number
  title: string
  description: string
  difficulty: string
  categoryId: number
  createdBy: number
  createdAt: string
  updatedAt: string
  category: {
    id: number
    name: string
  }
}

// Базовый URL API (желательно вынести в .env)
const API_URL = 'http://localhost:3333'

const CoursesCarousel: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/courses/latest`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json() // Парсим JSON из ответа
        console.log('API Response:', data) // Для отладки

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

  const handleView = (title: string) => {
    alert(`View course: ${title}`)
  }

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
              title={course.title}
              subtitle={course.description}
              coverUrl={`${API_URL}/assets/courses/covers/${course.id}.png`} // Используем API_URL
              onView={() => handleView(course.title)}
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