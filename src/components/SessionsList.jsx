import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGetAllSessions, useGetSessionTypes, useDeleteSession } from '../hooks/useSessionQueries.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';

const SessionsList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const { data: sessionsData, isLoading } = useGetAllSessions(filters);
  const { data: typesData } = useGetSessionTypes();
  const deleteSession = useDeleteSession();

  const sessions = sessionsData?.data?.content || [];
  const sessionTypes = typesData?.data || [];

  const getTypeColor = (type) => {
    const colors = {
      'CONSULTATION': 'bg-blue-100 text-blue-800',
      'THERAPY': 'bg-purple-100 text-purple-800',
      'ASSESSMENT': 'bg-green-100 text-green-800',
      'FOLLOW_UP': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <Button onClick={() => navigate('/sessions/create')} className="bg-blue-600 hover:bg-blue-700">
          Create Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-3 py-2 border rounded-md"
              onChange={(e) => setFilters({ ...filters, sessionType: e.target.value })}
            >
              <option value="">All Types</option>
              {sessionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-md"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <Input
              placeholder="Search by doctor..."
              onChange={(e) => setFilters({ ...filters, doctorName: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{session.name}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(session.type)}`}>
                  {session.type}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Doctor:</strong> {session.doctorName}</p>
                <p><strong>Duration:</strong> {session.duration} mins</p>
                <p><strong>Price:</strong> ${session.price}</p>
                <p><strong>Mode:</strong> {session.mode}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/sessions/${session.id}`)}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/sessions/${session.id}/edit`)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteSession.mutate(session.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No sessions found.</p>
        </Card>
      )}
    </div>
  );
};

export default SessionsList;