'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

interface Course {
  courseId: string;
  title: string;
  instructormail: string;
  instructorName?: string;
  description: string;
  category: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  isArchived: boolean;
  totalClasses: number;
  courseContent: string[]; // Array of PDF URLs/paths
  notes: string[]; // Array of note IDs or content (you can adjust depending on the structure of the notes)
  price: number;
  image: string; // URL or path to the course image
}

export interface Instructor {
  email: string;
  name: string;
  age: string; // Assuming age is a string, but can be converted to number if necessary
  passwordHash: string;
  Teach_Courses: string[]; // List of course names the instructor teaches
  profilePictureUrl?: string;
  Certificates: string; // Certificates the instructor holds
  createdAt: string; // ISO Date format
  updatedAt: string; // ISO Date format
  __v: number; // MongoDB version field (not typically required in app logic)
}

const EditPage = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [profilePictureUrl, setprofilePictureUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [Courses, setCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<Instructor>();
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
    const accessToken = sessionStorage.getItem('Ins_Token');
    const user = sessionStorage.getItem('instructorData');
    if (accessToken) {
      if (user) {
        const parsedUser = JSON.parse(user);
        fetchUserDetails(parsedUser?.email, accessToken);
      } else router.push('/Ins_login');
    } else router.push('/Ins_login');
  }, []);

  const fetchUserDetails = async (
    email: string,
    accessToken: string,
  ): Promise<Instructor> => {
    try {
      const response = await fetch(
        `http://localhost:3000/instructor/${email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.statusText}`);
      }

      const data: Instructor = await response.json();
      console.log('Fetched user details:', data);
      setUserData(data); // Update state with user data
      setName(data.name); // Pre-fill name
      setAge(data.age); // Pre-fill age
      setEmail(data.email); // Pre-fill email
      setSelectedCourses(data.Teach_Courses); // Pre-fill selected courses
      setprofilePictureUrl(data.profilePictureUrl || null); // Pre-fill profile picture URL if available
      return data;
    } catch (error) {
      console.error('Error fetching user details', error);
      throw error;
    }
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedCourses((prevSelectedCourses) =>
      event.target.checked
        ? [...prevSelectedCourses, value]
        : prevSelectedCourses.filter((course) => course !== value),
    );
  };

  const fetchCourses = async (): Promise<string[]> => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/courses/CoursesTitle`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }

      const coursesTitle = await response.json();
      console.log('Fetched courses details:', coursesTitle);
      setCourses(coursesTitle);
      return coursesTitle;
    } catch (error) {
      console.error('Error fetching courses', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setprofilePictureUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !age || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/instructor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age,
          email,
          passwordHash: password,
          Teach_Courses: selectedCourses,
          profilePictureUrl,
          oldEmail: userData?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      setError(null);
      router.push('/Ins_login');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  if (!userData) {
    return (
      <div className="loading-container">
        <i className="loading-icon" />
        <strong>Loading courses, please wait...</strong>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="title">Update Profile</p>

      <div className="flex">
        <label>
          <input
            required
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span>Old Name: {userData.name}</span>
        </label>
        <label>
          <input
            required
            type="number"
            className="input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <span>Old Age: {userData.age}</span>
        </label>
      </div>

      <label>
        <input
          required
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span>Old Email: {userData.email}</span>
      </label>

      <label>
        <input
          required
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span>New Password</span>
      </label>

      <label>
        <input
          required
          type="password"
          className="input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span>Confirm New Password</span>
      </label>

      <label className="file-upload">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <span>Upload new Profile Picture</span>
      </label>
      {profilePictureUrl && (
        <div className="image-preview">
          <p>Image Preview:</p>
          <img
            src={profilePictureUrl}
            alt="profilePictureUrl"
            className="circular-preview"
          />
        </div>
      )}

      <div className="courses">
        <p>Tecahes courses:</p>
        {isLoading ? (
          <div className="loading-container">
            <i className="loading-icon" />
            <strong>Loading courses, please wait...</strong>
          </div>
        ) : (
          Courses.map((course, index) => (
            <label key={index}>
              <input
                type="checkbox"
                name="course"
                value={course}
                checked={selectedCourses.includes(course)}
                onChange={handleCourseChange}
              />
              <span>{course}</span>
            </label>
          ))
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="submit">
        Submit
      </button>
    </form>
  );
};

export default EditPage;
