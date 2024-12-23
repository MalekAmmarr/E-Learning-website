'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

interface Quiz {
  quizId: string;
  courseTitle: string;
}

const Putgrades = () => {
  const [modules, setModules] = useState<Quiz[]>([]);
  const [insdata, setInsData] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [instructorEmail, setInstructorEmail] = useState<string>('');  
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem('Ins_Token');
        const storedInstructor = sessionStorage.getItem('instructorData');
        if (storedInstructor) {
          const parsedInstructor = JSON.parse(storedInstructor);
          setInsData(parsedInstructor);

          const [modulesResponse, quizzesResponse] = await Promise.all([
            fetch(`http://localhost:3000/modules/quiz-and-course-by-instructor?email=${parsedInstructor?.email}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            fetch(`http://localhost:3000/quizzes/by-instructor?email=${parsedInstructor?.email}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }),
          ]);

          if (!modulesResponse.ok || !quizzesResponse.ok) {
            throw new Error(
              `Failed to fetch data: ${modulesResponse.statusText} / ${quizzesResponse.statusText}`
            );
          }

          const modulesData: Quiz[] = await modulesResponse.json();
          const quizzesData: Quiz[] = await quizzesResponse.json();

          setModules(modulesData);
          setQuizzes(quizzesData);
        } else {
          router.push('/Ins_login');
        }
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleQuizClick = (quizId: string) => {
    router.push(`/Ins_Home/Put_grades/${encodeURIComponent(quizId)}`);
  };

  const handleDeleteModule = async (quizId: string) => {
    try {
      const token = sessionStorage.getItem('Ins_Token'); 
      if (!token) {
        throw new Error('Authorization token not found. Please log in again.');
      }
      const response = await fetch(
        `http://localhost:3000/modules/${encodeURIComponent(quizId)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete module: ${response.statusText}`);
      }
  
      // Update the state to remove the deleted module
      setModules((prevModules) => prevModules.filter((module) => module.quizId !== quizId));
  
      alert(`Module with title "${quizId}" successfully deleted.`);
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('An error occurred while trying to delete the module.');
    }
  };
  

  
  

  const handleModuleClick = (quizId: string) => {
    router.push(`/Ins_Home/create-module/update-module/${encodeURIComponent(quizId)}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="section quizzes" id="quizzes">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="section-heading">
              <h6>Available Modules and Quizzes</h6>
              <h2>Your Created Modules and Quizzes</h2>
            </div>
          </div>
        </div>

        {/* Modules Section */}
          <div className="row">
            <div className="col-lg-12 text-center">
              <h3>Modules</h3>
            </div>
            {modules.map((module, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-30">
                <div className="quiz-card">
                  <h4>{module.courseTitle}</h4>
                  <p>{module.quizId}</p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
                    <button
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                      onClick={() => handleModuleClick(module.quizId)}
                    >
                      Edit Module
                    </button>
                    <button
  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200"
  onClick={() => {
    console.log("Deleting module with quizId:", module.quizId); // Debug log
    if (confirm(`Are you sure you want to delete the module "${module.quizId}"?`)) {
      handleDeleteModule(module.quizId);
    }
  }}
>
  Delete Module
</button>
                  </div>
                </div>
              </div>
            ))}
          </div>


        {/* Quizzes Section */}
        <div className="row">
          <div className="col-lg-12 text-center">
            <h3>Quizzes</h3>
          </div>
          {quizzes.map((quiz, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 mb-30"
              onClick={() => handleQuizClick(quiz.quizId)}
            >
              <div className="quiz-card">
                <h4>{quiz.courseTitle}</h4>
                <p>{quiz.quizId}</p>
                <p>Click to manage feedbacks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Putgrades;
