import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, StatusBadge, Table, LoadingState } from '../components/ui';
import { summaryService, pilotService, startupService, challengeService, notificationService } from '../services/mockServices';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [pilots, setPilots] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [sumData, pData, startups, cData, nData] = await Promise.all([
        summaryService.getDashboardSummary(),
        pilotService.getPilots(),
        startupService.getStartups(),
        challengeService.getChallenges(),
        notificationService.getNotifications()
      ]);
      
      const enrichedPilots = pData.map(p => ({
        ...p,
        startupName: startups.find(s => s.id === p.startupId)?.name || 'Unknown Startup',
        challengeTitle: cData.find(c => c.id === p.challengeId)?.title || 'Unknown Challenge'
      }));
      
      setSummary(sumData);
      setPilots(enrichedPilots);
      setChallenges(cData);
      setNotifications(nData.filter(n => n.type === 'ACTION_REQUIRED'));
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard data..." />;

  const pipelineCounts = {
    DRAFT: challenges.filter(c => c.status === 'DRAFT').length,
    PUBLISHED: challenges.filter(c => c.status === 'PUBLISHED').length,
    APPLICATION_OPEN: challenges.filter(c => c.status === 'APPLICATION_OPEN').length,
    EVALUATION: challenges.filter(c => c.status === 'EVALUATION').length,
    STARTUP_SELECTED: challenges.filter(c => c.status === 'STARTUP_SELECTED').length,
    PILOT: challenges.filter(c => c.status === 'PILOT').length,
    VALIDATION: pilots.filter(p => p.status === 'VALIDATION').length,
    COMPLETED: pilots.filter(p => p.status === 'COMPLETED').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Government Dashboard</h1>
          <p className="page-subtitle">Manage innovation challenges, pilots and procurement decisions.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => navigate('/government/startups')}>Find Startups</Button>
          <Button onClick={() => navigate('/government/challenges/new')}>Create Challenge</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Active Challenges</div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{summary.activeChallenges}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Applications</div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{summary.applications}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Pending Evaluations</div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{summary.pendingEvaluations}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Active Pilots</div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{summary.activePilots}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Pending Validations</div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{summary.pendingValidations}</div>
        </Card>
        <Card>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Pending Decisions</div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{summary.pendingDecisions}</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Challenge Pipeline</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {[
              { label: 'Draft', count: pipelineCounts.DRAFT, color: 'gray' },
              { label: 'Published', count: pipelineCounts.PUBLISHED, color: 'blue' },
              { label: 'Apps Open', count: pipelineCounts.APPLICATION_OPEN, color: 'blue' },
              { label: 'Evaluation', count: pipelineCounts.EVALUATION, color: 'yellow' },
              { label: 'Selected', count: pipelineCounts.STARTUP_SELECTED, color: 'green' },
              { label: 'Pilot', count: pipelineCounts.PILOT, color: 'primary' },
              { label: 'Validation', count: pipelineCounts.VALIDATION, color: 'yellow' },
              { label: 'Scale Decision', count: pipelineCounts.COMPLETED, color: 'green' }
            ].map((stage, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: `var(--color-${stage.color})` }}>{stage.count}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', textTransform: 'uppercase' }}>{stage.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Active Pilots</h3>
          <Card style={{ padding: 0 }}>
            <Table headers={['Pilot', 'Startup', 'Progress', 'Status', 'Action']}>
              {pilots.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.challengeTitle}</div>
                  </td>
                  <td>{p.startupName}</td>
                  <td style={{ minWidth: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '100%', backgroundColor: 'var(--color-border)', height: '6px', borderRadius: '3px' }}>
                        <div style={{ width: `${p.progress}%`, backgroundColor: 'var(--color-primary)', height: '100%', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem' }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td><StatusBadge status={p.kpiStatus} /></td>
                  <td>
                    <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/government/pilots/${p.id}`)}>View Dashboard</Button>
                  </td>
                </tr>
              ))}
            </Table>
            {pilots.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No active pilots found.</div>
            )}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Action Required</h3>
            <Card style={{ padding: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-error)', marginTop: '6px', flexShrink: 0 }}></div>
                      <div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>{n.message}</span>
                        <Link to={n.link} style={{ fontSize: '0.75rem', fontWeight: 600 }}>Review Now &rarr;</Link>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>You're all caught up!</div>
                )}
              </div>
            </Card>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {summary.recentActivity.map(act => (
                  <div key={act.id} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{act.title}</span>
                    <span style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }}>{act.entity}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{act.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
