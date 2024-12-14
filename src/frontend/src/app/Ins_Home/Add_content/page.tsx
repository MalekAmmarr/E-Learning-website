'use client'; // Marks this component as a client component
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Course = {
  name: string;
  category: string;
  price: number;
  instructor: string;
  image: string;
};

const AddContent = () => {
  const [courses, setCourses] = useState<Course[]>([]); // Specify the type for courses
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

        const data = await res.json();
        setCourses(data); // Assuming the response is an array of courses
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [email, token, router]);

  const handleCourseClick = (courseName: string) => {
    console.log(`Navigating to course: ${courseName}`);
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
              <h2>Latest Courses</h2>
            </div>
          </div>
        </div>
        <ul className="event_filter">
          <li>
            <a className="is_active" href="#!" data-filter="*">
              Show All
            </a>
          </li>
          <li>
            <a href="#!" data-filter=".design">
              Webdesign
            </a>
          </li>
          <li>
            <a href="#!" data-filter=".development">
              Development
            </a>
          </li>
          <li>
            <a href="#!" data-filter=".wordpress">
              Wordpress
            </a>
          </li>
        </ul>
        <div className="row event_box">
          {courses.map((course, index) => (
            <div key={index} className={`col-lg-4 col-md-6 align-self-center mb-30 event_outer ${course.category.toLowerCase()}`}>
              <div className="events_item" onClick={() => handleCourseClick(course.name)}>
                <div className="thumb">
                  <a href="#">
                    <img src={course.image} alt={course.name} />
                  </a>
                  <span className="category">{course.category}</span>
                  <span className="price">
                    <h6>
                      <em>$</em>{course.price}
                    </h6>
                  </span>
                </div>
                <div className="down-content">
                  <span className="author">{course.instructor}</span>
                  <h4>{course.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddContent;
