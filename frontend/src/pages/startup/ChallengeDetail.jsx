import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState, Breadcrumb, Tabs, Table } from '../../components/ui';
import { challengeService, applicationService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { MapPin, Calendar, Briefcase, FileText, Sparkles, CheckCircle, Clock } from 'lucide-react';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const loadData = async () => {
      // Get challenge with match score
      const recs = await challengeService.getRecommendedChallenges(CURRENT_STARTUP_ID);
      const ch = recs.find(c => c.id === id);
      setChallenge(ch);

      // Check if startup already applied
      const apps = await applicationService.getStartupApplications(CURRENT_STARTUP_ID);
      const app = apps.find(a => a.challengeId === id);
      setApplication(app);
      
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!challenge) return <div style={{ padding: '2rem' }}>Challenge not found.</div>;

  const isClosed = challenge.status === 'CLOSED' || challenge.status === 'PILOT';
  const hasApplied = !!application;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Challenges', href: '/startup/challenges' },
        { label: challenge.title }
      ]} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
        
        {/* Header Section */}
        <Card style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <Badge color={challenge.matchScore >= 80 ? 'green' : 'blue'}>
                  <Sparkles size={12} style={{ marginRight: '4px' }}/> {challenge.matchScore}% Match
                </Badge>
                {isClosed && <Badge color="red">Closed</Badge>}
                {!isClosed && <Badge color="green">Open</Badge>}
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>{challenge.title}</h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={16} /> Department: Govt Department
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> Location: {challenge.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> Deadline: {challenge.deadline}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px', backgroundColor: 'var(--color-background-alt)', padding: '1.5rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Budget</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>₹{(challenge.budget / 100000).toFixed(1)}L</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Pilot Duration</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{challenge.timeline.pilotDurationDays} Days</div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }}></div>
              
              {hasApplied ? (
                <Button onClick={() => navigate(`/startup/applications/${application.id}`)}>View Application</Button>
              ) : isClosed ? (
                <Button disabled variant="outline">Application Closed</Button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Button onClick={() => navigate(`/startup/challenges/${id}/eligibility`)}>Check Eligibility</Button>
                  <Button variant="outline" onClick={() => navigate(`/startup/challenges/${id}/match`)}>View AI Match Analysis</Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Content Section */}
        <Card style={{ padding: '0' }}>
          <Tabs tabs={['Overview', 'KPIs', 'Timeline', 'Eligibility & Evaluation']} activeTab={activeTab} onChange={setActiveTab} />
          
          <div style={{ padding: '2rem' }}>
            {activeTab === 'Overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Problem Statement</h3>
                  <p style={{ lineHeight: 1.6 }}>{challenge.problem}</p>
                </section>
                <section>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Objective</h3>
                  <p style={{ lineHeight: 1.6 }}>{challenge.objective}</p>
                </section>
                <section>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Expected Outcome</h3>
                  <p style={{ lineHeight: 1.6 }}>{challenge.expectedOutcome}</p>
                </section>
              </div>
            )}
            
            {activeTab === 'KPIs' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Pilot Success Metrics</h3>
                {challenge.kpis && challenge.kpis.length > 0 ? (
                  <Table headers={['KPI Name', 'Baseline', 'Target', 'Measurement Method']}>
                    {challenge.kpis.map(kpi => (
                      <tr key={kpi.id}>
                        <td style={{ fontWeight: 500 }}>{kpi.name}</td>
                        <td>{kpi.baseline} {kpi.unit}</td>
                        <td style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{kpi.target} {kpi.unit}</td>
                        <td>{kpi.measurement}</td>
                      </tr>
                    ))}
                  </Table>
                ) : (
                  <p>No KPIs defined yet.</p>
                )}
              </div>
            )}
            
            {activeTab === 'Timeline' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Challenge Timeline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--color-background-alt)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><CheckCircle size={16} color="var(--color-success)"/> Applications Open</div>
                    <div>{challenge.timeline.applicationOpening}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--color-background-alt)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><Clock size={16} color="var(--color-warning)"/> Application Deadline</div>
                    <div>{challenge.timeline.applicationDeadline}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--color-background-alt)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><PlaySquare size={16} color="var(--color-primary)"/> Expected Pilot Start</div>
                    <div>{challenge.timeline.expectedPilotStart}</div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'Eligibility & Evaluation' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Eligibility Rules</h3>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {challenge.eligibilityRules.map(rule => (
                      <li key={rule.id} style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <Shield size={18} color="var(--color-primary)" style={{ marginTop: '2px' }}/>
                        <div>
                          <div style={{ fontWeight: 500 }}>{rule.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Required</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {!hasApplied && !isClosed && (
                    <Button variant="outline" style={{ marginTop: '1rem' }} onClick={() => navigate(`/startup/challenges/${id}/eligibility`)}>Check My Eligibility</Button>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Evaluation Criteria</h3>
                  <Table headers={['Criteria', 'Weight']}>
                    {challenge.evaluationCriteria.map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                        <td>{c.weight}%</td>
                      </tr>
                    ))}
                  </Table>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Also define the Shield icon that was missing from the import
import { Shield } from 'lucide-react';

export default ChallengeDetail;
