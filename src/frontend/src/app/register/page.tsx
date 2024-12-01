'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle course selection
  const handleCourseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedCourses(
      (prevSelectedCourses) =>
        event.target.checked
          ? [...prevSelectedCourses, value] // Add course if checked
          : prevSelectedCourses.filter((course) => course !== value), // Remove course if unchecked
    );
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!name || !age || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // API call to register
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age,
          email,
          passwordHash: password,
          appliedCourses: selectedCourses,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      // Clear the error and redirect to home
      setError(null);
      router.push('/login'); // Redirect to the home page
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="title">Register</p>
      <p className="message">Signup now and get full access to our app.</p>

      <div className="flex">
        {/* Name and Age Fields */}
        <label>
          <input
            required
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span>Name</span>
        </label>
        <label>
          <input
            required
            type="number"
            className="input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <span>Age</span>
        </label>
      </div>

      {/* Email and Password Fields */}
      <label>
        <input
          required
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span>Email</span>
      </label>
      <label>
        <input
          required
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span>Password</span>
      </label>
      <label>
        <input
          required
          type="password"
          className="input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span>Confirm Password</span>
      </label>

      {/* Course Selection with Checkboxes */}
      <div className="courses">
        <p>Courses to Apply:</p>
        <label>
          <input
            type="checkbox"
            name="course"
            value="Machine Learning"
            checked={selectedCourses.includes('Machine Learning')}
            onChange={handleCourseChange}
          />
          <span>Machine Learning</span>
        </label>
        <label>
          <input
            type="checkbox"
            name="course"
            value="Database Programming"
            checked={selectedCourses.includes('Database Programming')}
            onChange={handleCourseChange}
          />
          <span>Database Programming</span>
        </label>
        <label>
          <input
            type="checkbox"
            name="course"
            value="Software Project"
            checked={selectedCourses.includes('Software Project')}
            onChange={handleCourseChange}
          />
          <span>Software Project</span>
        </label>
      </div>

      {/* Show error message if there's any */}
      {error && <p className="error-message">{error}</p>}

      {/* Submit Button */}
      <button type="submit" className="submit">
        Submit
      </button>

      {/* Signin Link */}
      <p className="signin">
        Already have an account? <a href="#">Signin</a>
      </p>
    </form>
  );
};

export default RegisterPage;
