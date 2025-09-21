import React, { useState, useEffect, useCallback } from 'react';
import * as adminApi from '../../../services/adminApi';
import Modal from '../../Shared/Modal';
import LearningPathForm from '../forms/LearningPathForm';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ContentManagement = () => {
    const [learningPaths, setLearningPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPath, setEditingPath] = useState(null);

    const fetchLearningPaths = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminApi.getLearningPaths();
            setLearningPaths(response.data);
        } catch (error) {
            toast.error("Failed to fetch learning paths.");
            console.error("Error fetching learning paths:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLearningPaths();
    }, [fetchLearningPaths]);

    const handleOpenModal = (path = null) => {
        setEditingPath(path);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingPath(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (formData) => {
        const apiCall = editingPath
            ? adminApi.updateLearningPath(editingPath.id, formData)
            : adminApi.createLearningPath(formData);

        try {
            const response = await toast.promise(apiCall, {
                loading: `${editingPath ? 'Updating' : 'Creating'} learning path...`,
                success: `Learning path ${editingPath ? 'updated' : 'created'} successfully!`,
                error: `Failed to ${editingPath ? 'update' : 'create'} learning path.`,
            });
            fetchLearningPaths(); // Refresh data
            handleCloseModal();
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this learning path?')) {
            try {
                await toast.promise(adminApi.deleteLearningPath(id), {
                    loading: 'Deleting learning path...',
                    success: 'Learning path deleted successfully!',
                    error: 'Failed to delete learning path.',
                });
                fetchLearningPaths(); // Refresh data
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading content...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Content Management</h1>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                    <FaPlus className="mr-2" /> Create New Path
                </button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Learning Paths</h2>
                <div className="space-y-4">
                    {learningPaths.map(path => (
                        <div key={path.id} className="flex items-center justify-between border-b py-3 px-4 rounded-lg hover:bg-gray-50">
                            <Link to={`/admin/content/${path.id}`} className="flex-grow">
                                <h3 className="font-semibold text-lg text-gray-800 hover:text-blue-600">{path.title}</h3>
                                <p className="text-sm text-gray-500">{path.category || 'No Category'} - <span className={`font-medium ${path.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>{path.status}</span></p>
                            </Link>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => handleOpenModal(path)} className="text-blue-500 hover:text-blue-700 p-2">
                                    <FaEdit size={18} />
                                </button>
                                <button onClick={() => handleDelete(path.id)} className="text-red-500 hover:text-red-700 p-2">
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPath ? 'Edit Learning Path' : 'Create New Learning Path'}>
                <LearningPathForm 
                    onSubmit={handleSubmit} 
                    initialData={editingPath || {}}
                    onCancel={handleCloseModal} 
                />
            </Modal>
        </div>
    );
};

const AdminAnalytics = () => <div className="text-2xl font-semibold">Analytics</div>;
const AdminSettings = () => <div className="text-2xl font-semibold">Settings</div>;

export { AdminOverview, UserManagement, ContentManagement, AdminAnalytics, AdminSettings };
