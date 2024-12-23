'use client';
import './page.css';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+ app directory

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
    price: 0,
  });
  const [profilePictureUrl, setprofilePictureUrl] = useState<string | null>(
    null,
  );

  const router = useRouter(); // Correct usage inside a page component

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setprofilePictureUrl(reader.result as string); // Convert image to Base64 URL
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const storedInstructor = sessionStorage.getItem('instructorData');
      if (!storedInstructor) throw new Error('Instructor data not found.');

      const { email } = JSON.parse(storedInstructor);

      const res = await fetch(
        `http://localhost:3000/instructor/${email}/create-course`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            image: profilePictureUrl,
            instructormail: email,
          }),
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to create course: ${res.statusText}`);
      }

      alert('Course created successfully!');
      router.push('/Ins_Home');
    } catch (err: any) {
      alert(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div>
      <h1>Create Course</h1>
      <form onSubmit={handleSubmit}>
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
            required
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

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Course ID:
          <input
            type="text"
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </label>

        <button type="submit">Create Course</button>
      </form>
    </div>
  );
};

export default CreateCourse;