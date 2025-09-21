import React, { useState, useEffect, useCallback } from 'react';
import * as adminApi from '../../../services/adminApi';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaMobileAlt, FaSms } from 'react-icons/fa';

const IntegrationsManagement = () => {
    const [ussdLogs, setUssdLogs] = useState([]);
    const [smsLogs, setSmsLogs] = useState([]);
    const [stats, setStats] = useState({ ussdTotal: 0, smsTotal: 0 });
    const [broadcastMessage, setBroadcastMessage] = useState('');

    const fetchLogs = useCallback(async () => {
        try {
            const ussdRes = await adminApi.getUssdLogs();
            const smsRes = await adminApi.getSmsLogs();
            setUssdLogs(ussdRes.data.sessions);
            setSmsLogs(smsRes.data.logs);
            setStats({ ussdTotal: ussdRes.data.total, smsTotal: smsRes.data.total });
        } catch (error) {
            toast.error("Failed to fetch integration logs.");
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcastMessage) {
            toast.error("Message cannot be empty.");
            return;
        }
        try {
            await toast.promise(adminApi.sendBroadcast(broadcastMessage), {
                loading: 'Sending broadcast...',
                success: 'Broadcast sent successfully!',
                error: 'Failed to send broadcast.',
            });
            setBroadcastMessage('');
        } catch (error) {
            console.error("Broadcast error:", error);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Africa's Talking Integration</h1>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={FaMobileAlt} title="Total USSD Sessions" value={stats.ussdTotal} />
                <StatCard icon={FaSms} title="Total SMS Sent" value={stats.smsTotal} />
            </div>

            {/* Broadcast */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Send Broadcast SMS</h2>
                <form onSubmit={handleBroadcast} className="flex items-center space-x-4">
                    <input 
                        type="text" 
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                        <FaPaperPlane className="mr-2" /> Send
                    </button>
                </form>
            </div>

            {/* Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LogTable title="USSD Session Logs" logs={ussdLogs} headers={['ID', 'Phone', 'State', 'Updated']} />
                <LogTable title="SMS Logs" logs={smsLogs} headers={['ID', 'To', 'Status', 'Cost']} />
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
        <div className="bg-blue-100 p-4 rounded-full">
            <Icon className="text-blue-600" size={24} />
        </div>
        <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const LogTable = ({ title, logs, headers }) => {
    const renderCell = (log, header) => {
        const key = header.toLowerCase();
        switch(key) {
            case 'phone': return log.phone_number;
            case 'to': return log.to_number;
            case 'updated': return new Date(log.updated_at).toLocaleString();
            default: return log[key];
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b hover:bg-gray-50">
                                {headers.map(header => <td key={header} className="p-3">{String(renderCell(log, header))}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IntegrationsManagement;
