import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as adminApi from '../../../services/adminApi';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaQuestionCircle } from 'react-icons/fa';
import Modal from '../../Shared/Modal';
import ModuleForm from '../forms/ModuleForm';
import ResourceForm from '../forms/ResourceForm';

const LearningPathDetailView = () => {
    const { path_id } = useParams();
    const [path, setPath] = useState(null);
    const [modules, setModules] = useState([]);
    const [resources, setResources] = useState([]); // New state for resources
    const [loading, setLoading] = useState(true);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false); // New state for resource modal
    const [editingResource, setEditingResource] = useState(null); // New state for editing resource
    const [selectedModuleId, setSelectedModuleId] = useState(null); // To know which module to add resource to

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminApi.getLearningPath(path_id);
            const pathData = response.data;
            setPath(pathData);
            setModules(pathData.modules || []);
            if (pathData.modules && pathData.modules.length > 0) {
                // By default, show resources for the first module
                setSelectedModuleId(pathData.modules[0].id);
                setResources(pathData.modules[0].resources || []);
            }
        } catch (error) {
            toast.error("Failed to fetch learning path details.");
            console.error("Failed to fetch details", error);
        } finally {
            setLoading(false);
        }
    }, [path_id]);

    const fetchResources = (moduleId) => {
        const module = modules.find(m => m.id === moduleId);
        if (module) {
            setResources(module.resources || []);
            setSelectedModuleId(moduleId);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleOpenModal = (module = null) => {
        setEditingModule(module);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingModule(null);
        setIsModalOpen(false);
    };

    const handleModuleSubmit = async (formData) => {
        const apiCall = editingModule
            ? adminApi.updateModule(editingModule.id, formData)
            : adminApi.createModule(formData);

        try {
            await toast.promise(apiCall, {
                loading: `${editingModule ? 'Updating' : 'Creating'} module...`,
                success: `Module ${editingModule ? 'updated' : 'created'} successfully!`,
                error: `Failed to ${editingModule ? 'update' : 'create'} module.`,
            });
            fetchDetails(); // Refresh all data
            handleCloseModal();
        } catch (error) {
            console.error("Module submission error:", error);
        }
    };

    const handleModuleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this module?')) {
            try {
                await toast.promise(adminApi.deleteModule(id), {
                    loading: 'Deleting module...',
                    success: 'Module deleted successfully!',
                    error: 'Failed to delete module.',
                });
                fetchDetails(); // Refresh all data
            } catch (error) {
                console.error("Module delete error:", error);
            }
        }
    };

    const handleResourceOpenModal = (resource = null) => {
        setEditingResource(resource);
        setIsResourceModalOpen(true);
    };

    const handleResourceCloseModal = () => {
        setEditingResource(null);
        setIsResourceModalOpen(false);
    };

    const handleResourceSubmit = async (formData) => {
        const apiCall = editingResource
            ? adminApi.updateResource(editingResource.id, formData)
            : adminApi.createResource(formData);

        try {
            await toast.promise(apiCall, {
                loading: `${editingResource ? 'Updating' : 'Creating'} resource...`,
                success: `Resource ${editingResource ? 'updated' : 'created'} successfully!`,
                error: `Failed to ${editingResource ? 'update' : 'create'} resource.`,
            });
            fetchResources(selectedModuleId);
            handleResourceCloseModal();
        } catch (error) {
            console.error("Resource submission error:", error);
        }
    };

    const handleResourceDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await toast.promise(adminApi.deleteResource(id), {
                    loading: 'Deleting resource...',
                    success: 'Resource deleted successfully!',
                    error: 'Failed to delete resource.',
                });
                fetchResources(selectedModuleId);
            } catch (error) {
                console.error("Resource delete error:", error);
            }
        }
    };

    if (loading) return <div>Loading details...</div>;
    if (!path) return <div>Learning path not found.</div>;

    return (
        <div>
            <Link to="/admin/content" className="flex items-center text-blue-600 hover:underline mb-6">
                <FaArrowLeft className="mr-2" />
                Back to Content Management
            </Link>

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                <h1 className="text-3xl font-bold">{path.title}</h1>
                <p className="text-gray-600 mt-2">{path.description}</p>
                <div className="mt-4 flex space-x-4">
                    <span className="text-sm font-medium text-gray-700">Category: {path.category}</span>
                    <span className="text-sm font-medium text-gray-700">Difficulty: {path.difficulty_level}</span>
                    <span className="text-sm font-medium text-gray-700">Status: {path.status}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Modules</h2>
                        <button onClick={() => handleOpenModal()} className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
                            <FaPlus className="mr-2" /> Add Module
                        </button>
                    </div>
                    <div className="space-y-3">
                        {modules.map(module => (
                            <div key={module.id} 
                                 className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-all ${selectedModuleId === module.id ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'}`}
                                 onClick={() => fetchResources(module.id)} >
                                <span className="font-medium">{module.title}</span>
                                <div className="flex items-center space-x-3">
                                    <button onClick={(e) => {e.stopPropagation(); handleOpenModal(module)}} className="text-gray-500 hover:text-blue-700" title="Edit Module"><FaEdit /></button>
                                    <Link to={`/admin/modules/${module.id}/quizzes`} onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-green-700" title="Manage Quizzes"><FaQuestionCircle /></Link>
                                    <button onClick={(e) => {e.stopPropagation(); handleModuleDelete(module.id)}} className="text-gray-500 hover:text-red-700" title="Delete Module"><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Resources</h2>
                        <button onClick={() => handleResourceOpenModal()} className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center hover:bg-green-600 transition-colors" disabled={!selectedModuleId}>
                            <FaPlus className="mr-2" /> Add Resource
                        </button>
                    </div>
                    <div className="space-y-3">
                        {resources.map(resource => (
                            <div key={resource.id} className="flex items-center justify-between border p-3 rounded-lg hover:bg-gray-50">
                                <span className="font-medium">{resource.title} ({resource.type})</span>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleResourceOpenModal(resource)} className="text-gray-500 hover:text-blue-700"><FaEdit /></button>
                                    <button onClick={() => handleResourceDelete(resource.id)} className="text-gray-500 hover:text-red-700"><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModuleModalOpen} onClose={handleModuleCloseModal} title={editingModule ? 'Edit Module' : 'Create New Module'}>
                <ModuleForm 
                    onSubmit={handleModuleSubmit} 
                    initialData={editingModule || {}}
                    onCancel={handleModuleCloseModal}
                    pathId={path_id}
                />
            </Modal>

            <Modal isOpen={isResourceModalOpen} onClose={handleResourceCloseModal} title={editingResource ? 'Edit Resource' : 'Create New Resource'}>
                <ResourceForm 
                    onSubmit={handleResourceSubmit} 
                    initialData={editingResource || {}}
                    onCancel={handleResourceCloseModal}
                    moduleId={selectedModuleId}
                />
            </Modal>
        </div>
    );
};

export default LearningPathDetailView;
