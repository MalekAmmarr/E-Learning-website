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
  const [profilePictureUrl, setprofilePictureUrl] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false); // State for success message
  const [loading, setLoading] = useState(false); // State for loading during the submission
  const router = useRouter();

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

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Basic validation
    if (!name || !age || !email || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // API call to register
      const response = await fetch('http://localhost:3000/admins/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age,
          email,
          passwordHash: password,
          profilePictureUrl, // Send the Base64 URL of the image
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      // Show success animation
      setSuccess(true);
      setError(null);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/Admin_Home');
      }, 2000); // 2-second delay before redirect
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {success ? (
        <div className="success-message">
          <div className="checkmark-animation">&#10003;</div>
          <p>Registered successfully!</p>
        </div>
      ) : (
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

          {/* Profile Picture Upload */}
          <label className="file-upload">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <span>Upload Profile Picture</span>
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

          {/* Show error message if there's any */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          {/* Signin Link */}
          <p className="signin">
            Already have an account? <a href="/login">Signin</a>
          </p>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
