import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as adminApi from '../../../services/adminApi';
import Modal from '../../Shared/Modal';
import QuizForm from '../forms/QuizForm';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaBrain } from 'react-icons/fa';
import toast from 'react-hot-toast';

const QuizManagementView = () => {
    const { module_id } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);

    const fetchQuizzes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminApi.getQuizzesForModule(module_id);
            setQuizzes(response.data);
        } catch (error) {
            toast.error("Failed to fetch quizzes.");
        } finally {
            setLoading(false);
        }
    }, [module_id]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleOpenModal = (quiz = null) => {
        setEditingQuiz(quiz);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingQuiz(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (formData) => {
        const apiCall = editingQuiz
            ? adminApi.updateQuiz(editingQuiz.id, formData)
            : adminApi.createQuiz(module_id, formData);

        try {
            await toast.promise(apiCall, {
                loading: `${editingQuiz ? 'Updating' : 'Creating'} quiz...`,
                success: `Quiz ${editingQuiz ? 'updated' : 'created'} successfully!`,
                error: `Failed to ${editingQuiz ? 'update' : 'create'} quiz.`,
            });
            fetchQuizzes();
            handleCloseModal();
        } catch (error) {
            console.error("Quiz submission error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this quiz question?')) {
            try {
                await toast.promise(adminApi.deleteQuiz(id), {
                    loading: 'Deleting quiz...',
                    success: 'Quiz deleted successfully!',
                    error: 'Failed to delete quiz.',
                });
                fetchQuizzes();
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };
    
    // Placeholder for AI generation
    const handleAIGenerate = async () => {
        // In a real implementation, you would show a modal to select a resource
        const resourceContent = "This is a sample text about React. React is a JavaScript library for building user interfaces.";
        try {
            const response = await toast.promise(adminApi.generateQuizWithAI(resourceContent, 2), {
                loading: 'Generating quiz with AI...',
                success: 'Quiz generated successfully!',
                error: 'AI generation failed.',
            });
            // This would typically populate the form, but for now we'll just log it
            console.log(response.data);
            toast.success('Check console for AI generated quiz data.');
        } catch (error) {
            console.error("AI generation error:", error);
        }
    };

    if (loading) return <div>Loading quizzes...</div>;

    return (
        <div>
            <Link to={`/admin/content/`} className="flex items-center text-blue-600 hover:underline mb-6">
                <FaArrowLeft className="mr-2" />
                Back to Content Management
            </Link>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quiz Management</h1>
                <div>
                    <button onClick={handleAIGenerate} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors mr-4">
                        <FaBrain className="mr-2" /> Generate with AI
                    </button>
                    <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                        <FaPlus className="mr-2" /> Create New Quiz
                    </button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                {quizzes.map(quiz => (
                    <div key={quiz.id} className="border-b py-3">
                        <p className="font-semibold">{quiz.question}</p>
                        <div className="text-sm text-gray-500">Correct Answer: {quiz.correct_answer}</div>
                        <div className="flex items-center space-x-4 mt-2">
                            <button onClick={() => handleOpenModal(quiz)} className="text-blue-500">Edit</button>
                            <button onClick={() => handleDelete(quiz.id)} className="text-red-500">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}>
                <QuizForm 
                    onSubmit={handleSubmit} 
                    initialData={editingQuiz || {}}
                    onCancel={handleCloseModal} 
                    moduleId={module_id}
                />
            </Modal>
        </div>
    );
};

export default QuizManagementView;
