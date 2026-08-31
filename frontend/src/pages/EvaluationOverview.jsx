import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Table, LoadingState, Badge } from '../components/ui';
import { evaluationService, applicationService, challengeService, startupService } from '../services/mockServices';

const EvaluationOverview = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const evalData = await evaluationService.getEvaluations();
        
        // Enrich data
        const enrichedData = await Promise.all(evalData.map(async ev => {
          const app = await applicationService.getApplicationById(ev.applicationId);
          let startupName = 'Unknown';
          let challengeTitle = 'Unknown';
          
          if (app) {
            const startup = await startupService.getStartupById(app.startupId);
            startupName = startup?.name || 'Unknown';
            const challenge = await challengeService.getChallengeById(app.challengeId);
            challengeTitle = challenge?.title || 'Unknown';
          }
          
          return {
            ...ev,
            applicationId: ev.applicationId,
            startupName,
            challengeTitle,
            status: ev.status || 'COMPLETED', // default mock status
          };
        }));
        
        setEvaluations(enrichedData);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading evaluations..." />;

  const completed = evaluations.filter(e => e.status === 'COMPLETED').length;
  const pending = evaluations.filter(e => e.status === 'PENDING').length;
  const overdue = evaluations.filter(e => e.status === 'OVERDUE').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expert Evaluations</h1>
          <p className="page-subtitle">Monitor application evaluations submitted by independent experts.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Evaluations</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{evaluations.length}</div>
        </Card>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Completed</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>{completed}</div>
        </Card>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Pending</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning)' }}>{pending}</div>
        </Card>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Overdue</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error)' }}>{overdue}</div>
        </Card>
      </div>

      <Card style={{ padding: 0 }}>
        {evaluations.length > 0 ? (
          <Table headers={['Application', 'Startup', 'Challenge', 'Expert', 'Submitted', 'Average Score', 'Status', 'Action']}>
            {evaluations.map(ev => (
              <tr key={ev.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{ev.applicationId}</td>
                <td style={{ fontWeight: 500 }}>{ev.startupName}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{ev.challengeTitle}</td>
                <td>{ev.expertId}</td>
                <td>{ev.submittedDate}</td>
                <td>
                  <Badge color="blue">{ev.overallScore} / 10</Badge>
                </td>
                <td><StatusBadge status={ev.status} /></td>
                <td>
                  <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/government/applications/${ev.applicationId}`)}>View Evaluation</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No evaluations found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default EvaluationOverview;
