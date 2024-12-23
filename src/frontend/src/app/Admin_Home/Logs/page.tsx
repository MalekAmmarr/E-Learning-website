'use client';
import { useState } from 'react';
import axios from 'axios';
import '../Logs/page.css'


interface Log {
    _id: string;
    email: string;
    pass: string;
    role: string;
    createdAt: string;
}

export default function LogsManagement() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Fetch logs for a specific date
    const fetchLogsByDate = async () => {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                alert('No access token found. Please log in again.');
                return;
            }

            const response = await axios.get<Log[]>(
                `http://localhost:3000/logs/getLogs/${selectedDate}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setLogs(response.data);
        } catch (err: any) {
            console.error('Error fetching logs:', err.response?.data || err.message);
            setError('Failed to fetch logs for the selected date.');
        }
    };

    // Delete a log by ID
    const deleteLog = async (logId: string) => {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                alert('No access token found. Please log in again.');
                return;
            }

            const response = await axios.delete(
                `http://localhost:3000/logs/${logId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert(response.data.message);

            // Remove the deleted log from the UI
            setLogs((prevLogs) => prevLogs.filter((log) => log._id !== logId));
        } catch (err: any) {
            console.error('Error deleting log:', err.response?.data || err.message);
            alert('Failed to delete the log. Please check the logs for details.');
        }
    };

    return (
        <div className="logs-management">
            <h1>Logs Management</h1>
            <p>Select a date to view logs created on that day and manage them effortlessly.</p>

            <div className="flex justify-center items-center space-x-4 mb-6">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button onClick={fetchLogsByDate}>Fetch Logs</button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="logs-table-container">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{log.email}</td>
                                <td>{log.pass}</td>
                                <td>{log.role}</td>
                                <td>{new Date(log.createdAt).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => deleteLog(log._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {logs.length === 0 && !error && <p className="no-logs">No logs found for the selected date.</p>}
        </div>

    );
}
