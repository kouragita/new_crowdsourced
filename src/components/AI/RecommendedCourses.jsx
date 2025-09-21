import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBrain } from 'react-icons/fa';

const RecommendedCourses = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get('http://127.0.0.1:5555/api/ai/recommendations', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecommendations(response.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return <div>Loading recommendations...</div>;
    }

    if (recommendations.length === 0) {
        return null; // Don't show the component if there are no recommendations
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center"><FaBrain className="mr-2 text-purple-600"/> Recommended For You</h2>
            <div className="space-y-4">
                {recommendations.map(rec => (
                    <div key={rec.path_id} className="border p-4 rounded-lg hover:bg-gray-50">
                        <h3 className="font-semibold text-lg text-gray-800">{rec.path_title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                        <div className="text-xs text-purple-700 font-medium mt-2">Confidence: {Math.round(rec.confidence * 100)}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedCourses;
