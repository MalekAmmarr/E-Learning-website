'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';


const CreateCourse = () => {
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    instructormail: '',
    description: '',
    category: '',
    difficultyLevel: 'Beginner',
    totalClasses: 0,
    courseContent: [],
  });

  const router = useRouter();

  useEffect(() => {
    // Automatically set the instructor email from localStorage
    const storedInstructor = localStorage.getItem('instructorData');
    if (storedInstructor) {
      const { email } = JSON.parse(storedInstructor);
      setFormData((prevData) => ({ ...prevData, instructormail: email }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const storedInstructor = localStorage.getItem('instructorData');
      if (!storedInstructor) throw new Error('Instructor data not found.');

      const { email } = JSON.parse(storedInstructor);

      const res = await fetch(`http://localhost:3000/instructor/${email}/create-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, instructormail: email }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create course: ${res.statusText}`);
      }

      alert('Course created successfully!');
      router.push('/Ins_Home/Add_content');
    } catch (err: any) {
      alert(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Course ID (Optional):
          <input
            type="text"
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            placeholder="Leave blank to auto-generate"
          />
        </label>
        <label>
          Instructor Email:
          <input
            type="email"
            name="instructormail"
            value={formData.instructormail}
            readOnly
            placeholder="Logged-in email"
          />
        </label>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Difficulty Level:
          <select
            name="difficultyLevel"
            value={formData.difficultyLevel}
            onChange={handleInputChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <label>
          Total Classes:
          <input
            type="number"
            name="totalClasses"
            value={formData.totalClasses}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
