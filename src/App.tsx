import { useEffect, useState } from 'react';
import './App.scss';
import './index.scss'
import { useAuth } from './context/AuthProvider';

function App() {
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const {isAuthenticated,logout} = useAuth()

  useEffect( () => {
    fetch('/api/v1/auth/me', {
    method: 'GET',
    credentials: 'include', // 👈 ключевая часть
    }).then((res) => {
        if (!res.ok) 
          {
            logout()
            throw new Error("Not authorized");
          }
            return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => {
        logout()
        setUser(null)
      });
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#1a202c] flex items-center justify-center text-white text-2xl">
      {isAuthenticated ? <>Hello, {user? user.fullName : 'abracadabra'}!</> : <>Hello</>}
    </div>
  );
}

export default App;
