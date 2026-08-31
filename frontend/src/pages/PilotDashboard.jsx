import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Tabs, Breadcrumb, LoadingState, ErrorState, Table, Badge } from '../components/ui';
import { pilotService, challengeService, startupService, kpiService } from '../services/mockServices';
import { Target, CheckCircle, AlertTriangle, FileText, IndianRupee } from 'lucide-react';

const PilotDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pilot, setPilot] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [startup, setStartup] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const pData = await pilotService.getPilotById(id);
      if (pData) {
        const [cData, sData] = await Promise.all([
          challengeService.getChallengeById(pData.challengeId),
          startupService.getStartupById(pData.startupId)
        ]);
        setPilot(pData);
        setChallenge(cData);
        setStartup(sData);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleVerifyMilestone = async (milestoneId) => {
    await pilotService.verifyMilestone(id, milestoneId);
    loadData();
  };

  const handleReleasePayment = async (milestoneId) => {
    await pilotService.releasePayment(id, milestoneId);
    loadData();
  };

  if (loading) return <LoadingState message="Loading pilot dashboard..." />;
  if (!pilot) return <ErrorState message="Pilot not found." onRetry={() => navigate('/government/pilots')} />;

  const completedMilestones = pilot.milestones.filter(m => m.status === 'COMPLETED').length;
  const totalMilestones = pilot.milestones.length;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/government' },
        { label: 'Pilots', href: '/government/pilots' },
        { label: pilot.name }
      ]} />

      <div className="page-header" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>{pilot.name}</h1>
            <StatusBadge status={pilot.status} />
            <StatusBadge status={pilot.kpiStatus} />
          </div>
          <p className="page-subtitle">Startup: <strong>{startup.name}</strong> &bull; Location: {pilot.location}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           {pilot.status === 'VALIDATION' && (
             <Button onClick={() => navigate(`/government/decisions`)}>Review Scale Decision</Button>
           )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, backgroundColor: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(27,44,193,0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}>
             <Target size={24} />
           </div>
           <div style={{ flex: 1 }}>
             <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
               <span>Timeline Progress</span>
               <span>{pilot.daysElapsed} / {pilot.durationDays} Days</span>
             </div>
             <div style={{ width: '100%', backgroundColor: 'var(--color-border)', height: '8px', borderRadius: '4px' }}>
                <div style={{ width: `${Math.min((pilot.daysElapsed/pilot.durationDays)*100, 100)}%`, backgroundColor: 'var(--color-primary)', height: '100%', borderRadius: '4px' }}></div>
             </div>
           </div>
        </div>
        
        <div style={{ flex: 1, backgroundColor: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', borderRadius: '50%' }}>
             <CheckCircle size={24} />
           </div>
           <div style={{ flex: 1 }}>
             <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
               <span>Milestones</span>
               <span>{completedMilestones} / {totalMilestones}</span>
             </div>
             <div style={{ width: '100%', backgroundColor: 'var(--color-border)', height: '8px', borderRadius: '4px' }}>
                <div style={{ width: `${(completedMilestones/totalMilestones)*100}%`, backgroundColor: 'var(--color-success)', height: '100%', borderRadius: '4px' }}></div>
             </div>
           </div>
        </div>

        <div style={{ flex: 1, backgroundColor: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)', borderRadius: '50%' }}>
             <IndianRupee size={24} />
           </div>
           <div>
             <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Budget</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>₹{pilot.budget?.toLocaleString()}</div>
           </div>
        </div>
      </div>

      <Tabs 
        tabs={['Overview', 'KPI Tracking', 'Milestones & Payments', 'Evidence']} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <div style={{ marginTop: '2rem' }}>
        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <Card>
                <h3 style={{ marginBottom: '1rem' }}>Pilot Objective</h3>
                <p style={{ lineHeight: 1.6 }}>{challenge.objective}</p>
                <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Expected Outcome</h4>
                <p style={{ lineHeight: 1.6 }}>{challenge.expectedOutcome}</p>
              </Card>

              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>KPI Summary</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('KPI Tracking')}>View All KPIs</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pilot.kpiResults.map((kr, idx) => {
                     const def = challenge.kpis.find(k => k.id === kr.kpiId);
                     if (!def) return null;
                     return (
                       <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--color-bg-main)', borderRadius: '0.5rem' }}>
                         <div>
                           <div style={{ fontWeight: 500 }}>{def.name}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Target: {def.target} {def.unit} | Baseline: {def.baseline}</div>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{kr.actual}</span>
                           <StatusBadge status={kr.status} />
                         </div>
                       </div>
                     );
                  })}
                </div>
              </Card>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <Card>
                 <h3 style={{ marginBottom: '1rem' }}>Startup Profile</h3>
                 <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{startup.name}</div>
                 <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{startup.location}</div>
                 <Button variant="outline" style={{ width: '100%' }} onClick={() => navigate(`/government/startups/${startup.id}`)}>View Profile</Button>
               </Card>
            </div>
          </div>
        )}

        {activeTab === 'KPI Tracking' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>KPI Performance Matrix</h3>
              <Badge color="blue">Updated daily via API</Badge>
            </div>
            <Table headers={['KPI Name', 'Baseline', 'Target', 'Current Actual', 'Variance', 'Status']}>
              {pilot.kpiResults.map((kr, idx) => {
                 const def = challenge.kpis.find(k => k.id === kr.kpiId);
                 if (!def) return null;
                 
                 // Calculate variance % (simple mock logic)
                 let variance = 0;
                 if (def.isHigherBetter) {
                   variance = ((kr.actual - def.target) / def.target) * 100;
                 } else {
                   variance = ((def.target - kr.actual) / def.target) * 100;
                 }
                 const varianceStr = variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`;
                 const varianceColor = variance >= 0 ? 'var(--color-success)' : 'var(--color-error)';

                 return (
                   <tr key={idx}>
                     <td style={{ fontWeight: 500 }}>{def.name}</td>
                     <td>{def.baseline} {def.unit}</td>
                     <td>{def.target} {def.unit}</td>
                     <td style={{ fontWeight: 600, fontSize: '1.125rem' }}>{kr.actual}</td>
                     <td style={{ color: varianceColor, fontWeight: 500 }}>{varianceStr}</td>
                     <td><StatusBadge status={kr.status} /></td>
                   </tr>
                 );
              })}
            </Table>
          </Card>
        )}

        {activeTab === 'Milestones & Payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card>
              <h3 style={{ marginBottom: '1.5rem' }}>Milestone Deliverables & Payments</h3>
              <Table headers={['Milestone', 'Due Date', 'Deliverable Status', 'Payment Amount', 'Payment Status', 'Actions']}>
                {pilot.milestones.map((m, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500 }}>{m.name}</td>
                    <td>{m.dueDate}</td>
                    <td><StatusBadge status={m.status} /></td>
                    <td style={{ fontWeight: 600 }}>₹{m.paymentAmount?.toLocaleString() || 0}</td>
                    <td><StatusBadge status={m.paymentStatus} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {m.status === 'PENDING_VERIFICATION' && (
                          <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleVerifyMilestone(m.id)}>
                            Verify
                          </Button>
                        )}
                        {m.status === 'COMPLETED' && m.paymentStatus === 'PENDING' && (
                          <Button style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleReleasePayment(m.id)}>
                            Release Payment
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>
        )}
        
        {activeTab === 'Evidence' && (
          <Card>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Evidence & Documentation</h3>
              <Button variant="outline">View Full Library</Button>
            </div>
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Evidence library component will be integrated here.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PilotDashboard;
