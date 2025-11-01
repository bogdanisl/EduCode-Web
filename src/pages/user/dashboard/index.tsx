import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import NotFound from "../../notFound";



const DashboardIndex: React.FC = () => {
    const { isAuthenticated } = useAuth()
    const [error, setError] = useState('good')
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`/api/courses/category/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! Status:  ${response.status}`)
                }

                const data = await response.json()
                console.log({ data })
                if (Array.isArray(data.categories)) {
                } else {
                    throw new Error('API did not return an array')
                }
            } catch (err) {
                console.error('Fetch error:', err)
                setError('Error')
            }

        }

        fetchCourses()
    }, [])

    if(!isAuthenticated){
        return <NotFound/>
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-white min-h-screen flex-1 justify-center text-center">
            <h1>
                {error}
            </h1>
        </div>
    );
};

export default DashboardIndex;
