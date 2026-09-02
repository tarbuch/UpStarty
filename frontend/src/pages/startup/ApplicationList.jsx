import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState, StatusBadge, Table } from '../../components/ui';
import { applicationService, challengeService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { FileText, ArrowRight } from 'lucide-react';

const ApplicationList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const apps = await applicationService.getStartupApplications(CURRENT_STARTUP_ID);
      
      // Need challenge titles
      const allChallenges = await challengeService.getChallenges();
      const enhancedApps = apps.map(app => {
        const challenge = allChallenges.find(c => c.id === app.challengeId);
        return {
          ...app,
          challengeTitle: challenge ? challenge.title : 'Unknown Challenge',
          challengeDomain: challenge ? challenge.domain : ''
        };
      });

      setApplications(enhancedApps);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>My Applications</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Track the status of your challenge submissions.</p>
        </div>
      </div>

      <Card>
        {applications.length > 0 ? (
          <Table headers={['Challenge', 'Domain', 'Date Submitted', 'Status', 'Actions']}>
            {applications.map(app => (
              <tr key={app.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{app.challengeTitle}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ID: {app.id}</div>
                </td>
                <td>{app.challengeDomain}</td>
                <td>{app.submittedDate || 'Not Submitted'}</td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td>
                  {app.status === 'DRAFT' ? (
                    <Button variant="outline" onClick={() => navigate(`/startup/applications/new/${app.challengeId}`)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Continue Draft</Button>
                  ) : (
                    <Button variant="outline" onClick={() => navigate(`/startup/applications/${app.id}`)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View Details</Button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>No Applications Yet</h3>
            <p style={{ marginBottom: '1.5rem' }}>Explore challenges and start your first application.</p>
            <Button onClick={() => navigate('/startup/challenges')}>Explore Challenges</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicationList;
