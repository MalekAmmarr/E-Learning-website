'use client'; // Marks this component as a client component
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';


const AddContent = () => {
  const [courseTitles, setCourseTitles] = useState<string[]>([]); // Array of course titles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const token = sessionStorage.getItem('authToken');
  const email = "Behz@gmail.com"; // Replace with dynamic email if needed

  useEffect(() => {
    if (!email || !token) {
      router.push('/Ins_login'); // Redirect if email or token is not available
      return; // Prevent further execution
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://localhost:3000/instructor/courses?email=${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Send token in the header
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch courses: ${res.statusText}`);
        }

        const data: string[] = await res.json(); // Assuming the response is an array of strings (course titles)
        setCourseTitles(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [email, token, router]);

  const handleCourseClick = (courseTitle: string) => {
    const encodedTitle = encodeURIComponent(courseTitle);
    router.push(`/Ins_Home/Add_content/course/${encodedTitle}`);
  };
  
  
  

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="section courses" id="courses">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="section-heading">
              <h6>Latest Courses</h6>
              <h2>Courses You Teach</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {courseTitles.map((title, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 align-self-center mb-30"
              onClick={() => handleCourseClick(title)}
            >
              <div className="course-card">
                <h4>{title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddContent;
