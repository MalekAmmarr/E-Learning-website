'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';
import { Instructor } from '../Ins_applied-students/page';

const AddContent = () => {
  const [courseTitles, setCourseTitles] = useState<string[]>([]); // Array of course titles
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState<Instructor>(); // Loading state
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const storedInstructor = localStorage.getItem('instructorData');
        if (storedInstructor) {
          const parsedInstructor = JSON.parse(storedInstructor);
          setInstructor(parsedInstructor);
          const res = await fetch(`http://localhost:3000/instructor/courses?email=${parsedInstructor?.email}`);

          if (!res.ok) {
            throw new Error(`Failed to fetch courses: ${res.statusText}`);
          }

          const data: string[] = await res.json();
          setCourseTitles(data);
          setLoading(false);
        } else {
          setError('Instructor data not found.');
        }
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  const handleCourseClick = (courseTitle: string) => {
    const encodedTitle = encodeURIComponent(courseTitle);
    router.push(`/Ins_Home/Add_content/course/${encodedTitle}`);
  };

  const handleCreateCourse = () => {
    router.push('/Ins_Home/Add_content/create-course');
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
        <div className="row">
          <div className="col-lg-12 text-center">
            <button className="btn btn-primary" onClick={handleCreateCourse}>
              Create Course
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddContent;
