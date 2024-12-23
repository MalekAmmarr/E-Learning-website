'use client';
import { useState } from 'react';
import axios from 'axios';

interface Log {
    _id: string;
    email: string;
    pass: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export default function LogsManagement() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(''); // State for the selected date
    const fetchLogsByDate = async () => {
        try {
            // Retrieve the access token from session storage
            const token = sessionStorage.getItem('accessToken');

            if (!token) {
                alert('No access token found. Please log in again.');
                return;
            }

            // Check if a date is selected
            if (!selectedDate) {
                alert('Please select a date.');
                return;
            }

            // Send GET request with the token in the headers
            const response = await axios.get<Log[]>(`http://localhost:3000/logs/getLogs/${selectedDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the logs state with the fetched logs
            setLogs(response.data);
            if (response.data.length === 0) {
                alert('No logs found for the selected date.');
            }
        } catch (err: any) {
            // Handle errors and log them to the console
            console.error('Error fetching logs:', err.response?.data || err.message);
            alert('Failed to fetch logs for the selected date. Please check the logs for details.');
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Logs Management</h1>
                <p className="text-gray-600 mb-6">
                    Select a date to fetch logs created on that day.
                </p>

                <div className="flex items-center space-x-4 mb-6">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
                    />
                    <button
                        onClick={fetchLogsByDate}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Fetch Logs
                    </button>
                </div>

                {loading && (
                    <div className="p-8 text-center text-gray-600">Loading logs...</div>
                )}

                {error && (
                    <div className="p-8 text-center text-red-500">{error}</div>
                )}

                {!loading && logs.length > 0 && (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="py-4 px-6 text-sm font-medium">Email</th>
                                    <th className="py-4 px-6 text-sm font-medium">Password</th>
                                    <th className="py-4 px-6 text-sm font-medium">Role</th>
                                    <th className="py-4 px-6 text-sm font-medium">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, index) => (
                                    <tr
                                        key={log._id}
                                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}
                                    >
                                        <td className="py-4 px-6 text-gray-800 font-medium">{log.email}</td>
                                        <td className="py-4 px-6 text-gray-800 font-medium">{log.pass}</td>
                                        <td className="py-4 px-6 text-gray-800 font-medium">{log.role}</td>
                                        <td className="py-4 px-6 text-gray-800 font-medium">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && logs.length === 0 && !error && (
                    <div className="p-8 text-center text-gray-600">No logs found for the selected date.</div>
                )}
            </div>
        </div>
    );
}
