import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Tabs, Breadcrumb, LoadingState, ErrorState, Table } from '../components/ui';
import { challengeService, applicationService, startupService } from '../services/mockServices';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cData, appData, startups] = await Promise.all([
          challengeService.getChallengeById(id),
          applicationService.getApplicationsForChallenge(id),
          startupService.getStartups()
        ]);
        setChallenge(cData);
        
        const enrichedApps = appData.map(app => ({
          ...app,
          startupName: startups.find(s => s.id === app.startupId)?.name || 'Unknown'
        }));
        setApplications(enrichedApps);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingState message="Loading challenge details..." />;
  if (!challenge) return <ErrorState message="Challenge not found." onRetry={() => navigate('/government/challenges')} />;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/government' },
        { label: 'Challenges', href: '/government/challenges' },
        { label: challenge.title }
      ]} />

      <div className="page-header" style={{ marginTop: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>{challenge.title}</h1>
            <StatusBadge status={challenge.status} />
          </div>
          <p className="page-subtitle">{challenge.domain} &bull; {challenge.location} &bull; Created: {challenge.createdDate}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {challenge.status === 'DRAFT' && <Button>Publish Challenge</Button>}
          {['PUBLISHED', 'APPLICATION_OPEN'].includes(challenge.status) && (
             <Button onClick={() => navigate(`/government/challenges/${id}/match`)}>Find Matches</Button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Tabs 
          tabs={['Overview', `Applications (${applications.length})`, 'Evaluation Criteria', 'Timeline']} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Problem Statement</h3>
              <p style={{ lineHeight: 1.6, color: 'var(--color-text-main)' }}>{challenge.problem}</p>
            </Card>
            
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Objective & Outcomes</h3>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Objective</h4>
                <p>{challenge.objective}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Expected Outcome</h4>
                <p>{challenge.expectedOutcome}</p>
              </div>
            </Card>

            {challenge.kpis && challenge.kpis.length > 0 && (
              <Card>
                <h3 style={{ marginBottom: '1rem' }}>Key Performance Indicators (KPIs)</h3>
                <Table headers={['KPI Name', 'Baseline', 'Target', 'Unit']}>
                  {challenge.kpis.map((kpi, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}>{kpi.name}</td>
                      <td>{kpi.baseline}</td>
                      <td style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{kpi.target}</td>
                      <td>{kpi.unit}</td>
                    </tr>
                  ))}
                </Table>
              </Card>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Challenge Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Department</span>
                  <span style={{ fontWeight: 500 }}>{challenge.departmentId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Budget</span>
                  <span style={{ fontWeight: 500 }}>₹{challenge.budget?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Deadline</span>
                  <span style={{ fontWeight: 500 }}>{challenge.deadline}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Pilot Duration</span>
                  <span style={{ fontWeight: 500 }}>{challenge.timeline?.pilotDurationDays} Days</span>
                </div>
              </div>
            </Card>

            {challenge.eligibilityRules && challenge.eligibilityRules.length > 0 && (
              <Card>
                <h3 style={{ marginBottom: '1rem' }}>Eligibility Rules</h3>
                <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  {challenge.eligibilityRules.map((rule, idx) => (
                    <li key={idx}>{rule.name} {rule.required && <span style={{ color: 'var(--color-error)', marginLeft: '4px' }}>*</span>}</li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab.startsWith('Applications') && (
        <Card style={{ padding: 0 }}>
          <Table headers={['Application ID', 'Startup', 'Submitted', 'Match Score', 'Status', 'Action']}>
            {applications.map(app => (
              <tr key={app.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{app.id}</td>
                <td style={{ fontWeight: 500 }}>{app.startupName}</td>
                <td>{app.submittedDate}</td>
                <td>
                  <span style={{ 
                    color: app.matchScore > 85 ? 'var(--color-success)' : (app.matchScore > 70 ? 'var(--color-warning)' : 'var(--color-error)'),
                    fontWeight: 600
                  }}>
                    {app.matchScore}%
                  </span>
                </td>
                <td><StatusBadge status={app.status} /></td>
                <td>
                  <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/government/applications/${app.id}`)}>Review</Button>
                </td>
              </tr>
            ))}
          </Table>
          {applications.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No applications have been submitted for this challenge yet.
            </div>
          )}
        </Card>
      )}

      {activeTab === 'Evaluation Criteria' && (
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Expert Evaluation Weights</h3>
          {challenge.evaluationCriteria && challenge.evaluationCriteria.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {challenge.evaluationCriteria.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ width: '200px', fontWeight: 500 }}>{c.name}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ width: '100%', backgroundColor: 'var(--color-border)', height: '12px', borderRadius: '6px' }}>
                      <div style={{ width: `${c.weight}%`, backgroundColor: 'var(--color-primary)', height: '100%', borderRadius: '6px' }}></div>
                    </div>
                  </div>
                  <div style={{ width: '50px', textAlign: 'right', fontWeight: 600 }}>{c.weight}%</div>
                </div>
              ))}
            </div>
          ) : (
             <div style={{ color: 'var(--color-text-muted)' }}>No evaluation criteria defined.</div>
          )}
        </Card>
      )}

      {activeTab === 'Timeline' && (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--color-border)' }}></div>
            
            {[
              { label: 'Challenge Created', date: challenge.createdDate, completed: true },
              { label: 'Applications Open', date: challenge.timeline?.applicationOpening, completed: new Date() >= new Date(challenge.timeline?.applicationOpening) },
              { label: 'Application Deadline', date: challenge.timeline?.applicationDeadline, completed: new Date() >= new Date(challenge.timeline?.applicationDeadline) },
              { label: 'Expected Pilot Start', date: challenge.timeline?.expectedPilotStart, completed: false }
            ].map((event, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', position: 'relative', zIndex: 1, paddingLeft: '32px' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '11px', 
                  top: '4px',
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  backgroundColor: event.completed ? 'var(--color-primary)' : 'var(--color-border)',
                  border: '2px solid var(--color-bg-card)'
                }}></div>
                <div>
                  <div style={{ fontWeight: 600, color: event.completed ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>{event.label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{event.date || 'TBD'}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
};

export default ChallengeDetail;
