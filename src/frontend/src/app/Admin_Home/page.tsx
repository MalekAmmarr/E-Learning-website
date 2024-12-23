'use client'; // Client-side rendering
import Link from 'next/link';

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold">Welcome, Admin</h1>
          <p className="text-lg mt-1">Manage the platform efficiently with the tools below</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1 - Course Management */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Course Management</h2>
          <p className="text-gray-600 mb-4">
            View, update, archive, or delete courses offered on the platform.
          </p>
          {/* Use Link around the entire button */}
          <Link href="/Admin_Home/Courses">
            <button className="text-blue-500 hover:underline">
              Manage Courses
            </button>
          </Link>
        </div>


        {/* Card 2 - Announcements */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Announcements</h2>
          <p className="text-gray-600 mb-4">
            Create, edit, or delete announcements for the platform.
          </p>
          <Link href="/Admin_Home/Announcments" passHref>
            <button className="text-blue-500 hover:underline">
              Manage Announcments
            </button>
          </Link>
        </div>

        {/* Card 3 - Student Accounts */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Student Accounts</h2>
          <p className="text-gray-600 mb-4">
            View, update, or delete student accounts registered on the platform.
          </p>
          <Link href="/Admin_Home/Students" passHref>
            <button className="text-blue-500 hover:underline">
              Manage Students
            </button>
          </Link>
        </div>

        {/* Card 4 - Instructor Accounts */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Instructor Accounts</h2>
          <p className="text-gray-600 mb-4">
            View, update, or delete instructor accounts registered on the platform.
          </p>
          <Link href="/Admin_Home/Instructors" passHref>
            <button className="text-blue-500 hover:underline">
              Manage Instructors
            </button>
          </Link>
        </div>

        {/* Card 5 - Access Logs */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Access Logs</h2>
          <p className="text-gray-600 mb-4">
            Monitor unauthorized access or login attempt logs.
          </p>
          <Link href="/Admin_Home/Logs" passHref>
            <button className="text-blue-500 hover:underline">
              View Logs
            </button>
          </Link>
        </div>

        {/* Card 6 - Admin register */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Create Admin</h2>
          <p className="text-gray-600 mb-4">
            Create new admin
          </p>
          <Link href="/Admin_Home/Register" passHref>
            <button className="text-blue-500 hover:underline">
              Register
            </button>
          </Link>
        </div>

        {/* Card 5 - feedbacks Logs */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Feedbacks</h2>
          <p className="text-gray-600 mb-4">
            Collect feedbacks for future updates.
          </p>
          <Link href="/Admin_Home/Feedbacks" passHref>
            <button className="text-blue-500 hover:underline">
              View Feedbacks
            </button>
          </Link>
        </div>

        {/* Card - Backups */}
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Backups</h2>
          <p className="text-gray-600 mb-4">
            Manage scheduled backups and restore critical data.
          </p>
          <Link href="/Admin_Home/Backups" passHref>
            <button className="text-blue-500 hover:underline">
              Manage Backups
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
};

export default AdminHome;