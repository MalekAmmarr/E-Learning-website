'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';

interface Backup {
  backupId: string;
  backupType: string;
  storagePath: string;
  createdAt: string;
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const response = await axios.get<Backup[]>('http://localhost:3000/backups');
      setBackups(response.data);
    } catch (err: any) {
      console.error('Error fetching backups:', err);
      setError(err.response?.data?.message || 'Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/backups/create');
      fetchBackups();
      alert('Backup created successfully.');
    } catch (err: any) {
      console.error('Error creating backup:', err);
      setError(err.response?.data?.message || 'Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/backups/${backupId}`);
      setBackups((prev) => prev.filter((backup) => backup.backupId !== backupId));
      alert('Backup deleted successfully.');
    } catch (err: any) {
      console.error('Error deleting backup:', err);
      setError(err.response?.data?.message || 'Failed to delete backup');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackup = async (storagePath: string) => {
    try {
      const response = await axios.get('http://localhost:3000/backups/Hoss/OpenFile', {
        params: { storagePath },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', storagePath.split('/').pop() || 'backup.json');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error('Error downloading backup:', err);
      setError(err.response?.data?.message || 'Failed to download backup');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading backups...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Backup Management</h1>
        <p className="text-gray-600 mb-6">Manage, download, or delete system backups.</p>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={createBackup}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create Backup
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-4 px-6 text-sm font-medium">Backup ID</th>
                <th className="py-4 px-6 text-sm font-medium">Type</th>
                <th className="py-4 px-6 text-sm font-medium">Created At</th>
                <th className="py-4 px-6 text-sm font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup, index) => (
                <tr
                  key={backup.backupId}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">{backup.backupId}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">{backup.backupType}</td>
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {new Date(backup.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center space-x-4">
                    <button
                      onClick={() => downloadBackup(backup.storagePath)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => deleteBackup(backup.backupId)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
