import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Tabs, Breadcrumb, LoadingState, ErrorState, Badge, Textarea, Modal } from '../components/ui';
import { applicationService, challengeService, startupService, evaluationService, pilotService } from '../services/mockServices';
import { CheckCircle, XCircle, AlertTriangle, FileText, Check } from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [startup, setStartup] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');

  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [eligibilityReview, setEligibilityReview] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const application = await applicationService.getApplicationById(id);
        if (application) {
          const [c, s, evals] = await Promise.all([
            challengeService.getChallengeById(application.challengeId),
            startupService.getStartupById(application.startupId),
            evaluationService.getEvaluationsForApplication(id)
          ]);
          setApp(application);
          setChallenge(c);
          setStartup(s);
          setEvaluations(evals);

          // Initialize eligibility review state
          if (application.eligibilityDetails) {
            const initReview = {};
            application.eligibilityDetails.forEach(d => {
              initReview[d.ruleId] = { status: d.status, notes: d.notes || '' };
            });
            setEligibilityReview(initReview);
          } else if (c?.eligibilityRules) {
             const initReview = {};
             c.eligibilityRules.forEach(r => {
               initReview[r.id] = { status: 'PENDING', notes: '' };
             });
             setEligibilityReview(initReview);
          }
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleEligibilitySubmit = async () => {
    setSubmitting(true);
    const details = Object.keys(eligibilityReview).map(ruleId => ({
      ruleId,
      status: eligibilityReview[ruleId].status,
      notes: eligibilityReview[ruleId].notes
    }));
    const isEligible = details.every(d => d.status === 'PASS');
    const finalStatus = isEligible ? 'ELIGIBLE' : 'INELIGIBLE';
    
    await applicationService.updateEligibility(id, finalStatus, details);
    setApp(prev => ({ ...prev, eligibilityStatus: finalStatus, eligibilityDetails: details, status: isEligible ? 'UNDER_EVALUATION' : 'REJECTED' }));
    setEligibilityModalOpen(false);
    setSubmitting(false);
  };

  const handleSelectPilot = async () => {
    setSubmitting(true);
    await applicationService.selectStartup(id);
    
    // Auto-create a pilot for demo purposes
    await pilotService.createPilot({
      challengeId: challenge.id,
      startupId: startup.id,
      name: `${challenge.title} Pilot - ${startup.name}`,
      location: challenge.location,
      durationDays: challenge.timeline.pilotDurationDays || 90,
      startDate: new Date().toISOString().split('T')[0],
      budget: challenge.budget,
      kpis: challenge.kpis,
      milestones: [
        { name: 'Phase 1 Rollout', dueDate: '2026-11-01', payment: challenge.budget * 0.3 },
        { name: 'Mid-Pilot Review', dueDate: '2026-12-01', payment: challenge.budget * 0.3 },
        { name: 'Final Validation', dueDate: '2027-01-01', payment: challenge.budget * 0.4 }
      ]
    });
    
    setSubmitting(false);
    navigate(`/government/challenges/${challenge.id}`);
  };

  if (loading) return <LoadingState message="Loading application details..." />;
  if (!app) return <ErrorState message="Application not found." onRetry={() => navigate('/government/applications')} />;

  const isEligibilityComplete = Object.values(eligibilityReview).every(r => r.status !== 'PENDING');

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/government' },
        { label: 'Applications', href: '/government/applications' },
        { label: `${startup.name} App` }
      ]} />

      <div className="page-header" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>{startup.name}</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="page-subtitle">Applying for: <strong style={{ color: 'var(--color-text-main)' }}>{challenge.title}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
           {app.status === 'SUBMITTED' && (
             <Button onClick={() => setEligibilityModalOpen(true)}>Screen Eligibility</Button>
           )}
           {app.status === 'UNDER_EVALUATION' && evaluations.length > 0 && (
             <Button onClick={handleSelectPilot} disabled={submitting}>Select for Pilot</Button>
           )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, backgroundColor: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(27,44,193,0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}>
             <CheckCircle size={24} />
           </div>
           <div>
             <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>AI Match Score</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{app.matchScore}%</div>
           </div>
        </div>
        <div style={{ flex: 1, backgroundColor: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ padding: '1rem', backgroundColor: app.eligibilityStatus === 'ELIGIBLE' ? 'rgba(16,185,129,0.1)' : (app.eligibilityStatus === 'INELIGIBLE' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'), color: app.eligibilityStatus === 'ELIGIBLE' ? 'var(--color-success)' : (app.eligibilityStatus === 'INELIGIBLE' ? 'var(--color-error)' : 'var(--color-warning)'), borderRadius: '50%' }}>
             {app.eligibilityStatus === 'ELIGIBLE' ? <CheckCircle size={24} /> : (app.eligibilityStatus === 'INELIGIBLE' ? <XCircle size={24} /> : <AlertTriangle size={24}/>)}
           </div>
           <div>
             <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Eligibility Status</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{app.eligibilityStatus || 'PENDING SCREENING'}</div>
           </div>
        </div>
        <div style={{ flex: 1, backgroundColor: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ padding: '1rem', backgroundColor: 'rgba(27,44,193,0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}>
             <FileText size={24} />
           </div>
           <div>
             <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Expert Score</div>
             <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{app.expertScore ? `${app.expertScore}/10` : 'Pending'}</div>
           </div>
        </div>
      </div>

      <Tabs 
        tabs={['Overview & AI Summary', 'Eligibility', 'Expert Evaluations']} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <div style={{ marginTop: '2rem' }}>
        {activeTab === 'Overview & AI Summary' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0 }}>AI Application Summary</h3>
                  <Badge color="blue">Generated by AI</Badge>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Problem Understanding</h4>
                    <p style={{ lineHeight: 1.6 }}>{app.aiSummary.problemUnderstanding}</p>
                  </div>
                  {app.aiSummary.solutionApproach && (
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Solution Approach</h4>
                      <p style={{ lineHeight: 1.6 }}>{app.aiSummary.solutionApproach}</p>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5rem' }}>
                      <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16}/> Strengths</h4>
                      <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        {app.aiSummary.strengths.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                      </ul>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.5rem' }}>
                      <h4 style={{ color: 'var(--color-warning)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle size={16}/> Risks & Weaknesses</h4>
                      <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        {app.aiSummary.weaknesses?.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                        {app.aiSummary.risks?.map((s, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <Card>
                <h3 style={{ marginBottom: '1rem' }}>Startup Profile</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Location</span>
                    <span style={{ fontWeight: 500 }}>{startup.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Maturity</span>
                    <span style={{ fontWeight: 500 }}>{startup.maturity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Deployments</span>
                    <span style={{ fontWeight: 500 }}>{startup.deployments} ({startup.governmentDeployments} Gov)</span>
                  </div>
                  
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Core Technologies</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {startup.technologies?.map(t => <Badge key={t} color="gray">{t}</Badge>)}
                    </div>
                  </div>
                </div>
                <Button variant="outline" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate(`/government/startups/${startup.id}`)}>View Full Profile</Button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'Eligibility' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Eligibility Screening</h3>
              {app.status === 'SUBMITTED' && (
                <Button variant="secondary" onClick={() => setEligibilityModalOpen(true)}>Edit Screening</Button>
              )}
            </div>
            
            {challenge.eligibilityRules?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {challenge.eligibilityRules.map(rule => {
                  const detail = app.eligibilityDetails?.find(d => d.ruleId === rule.id);
                  const status = detail ? detail.status : 'PENDING';
                  return (
                    <div key={rule.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', backgroundColor: status === 'PASS' ? 'rgba(16,185,129,0.02)' : (status === 'FAIL' ? 'rgba(239,68,68,0.02)' : 'transparent') }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 500 }}>{rule.name} {rule.required && <span style={{ color: 'var(--color-error)' }}>*</span>}</div>
                        <StatusBadge status={status} />
                      </div>
                      {detail?.notes && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '0.25rem' }}>
                          <strong>Notes:</strong> {detail.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>No eligibility rules defined for this challenge.</p>
            )}
          </Card>
        )}

        {activeTab === 'Expert Evaluations' && (
          <div>
            {evaluations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {evaluations.map(ev => (
                  <Card key={ev.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                      <div>
                        <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>Evaluator: {ev.expertId}</h4>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Submitted: {ev.submittedDate}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>{ev.overallScore} / 10</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Overall Score</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h5 style={{ margin: 0, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Criteria Scores</h5>
                        {Object.entries(ev.scores).map(([crit, score]) => (
                          <div key={crit} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{crit}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px' }}>
                                <div style={{ width: `${(score/10)*100}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '3px' }}></div>
                              </div>
                              <span style={{ fontSize: '0.875rem', fontWeight: 600, width: '20px', textAlign: 'right' }}>{score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '1rem' }}>Expert Comments</h5>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, backgroundColor: 'var(--color-bg-main)', padding: '1rem', borderRadius: '0.5rem' }}>
                          "{ev.comments}"
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No expert evaluations have been submitted yet.
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={eligibilityModalOpen} onClose={() => setEligibilityModalOpen(false)} title="Eligibility Screening">
        <div style={{ marginBottom: '1.5rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Review the startup's submitted documents and verify they meet all mandatory requirements.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {challenge.eligibilityRules?.map(rule => (
              <div key={rule.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem' }}>
                <div style={{ fontWeight: 500, marginBottom: '1rem' }}>{rule.name} {rule.required && <span style={{ color: 'var(--color-error)' }}>*</span>}</div>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <Button 
                    variant={eligibilityReview[rule.id]?.status === 'PASS' ? 'primary' : 'outline'} 
                    onClick={() => setEligibilityReview(prev => ({...prev, [rule.id]: {...prev[rule.id], status: 'PASS'}}))}
                    style={{ flex: 1, backgroundColor: eligibilityReview[rule.id]?.status === 'PASS' ? 'var(--color-success)' : '', borderColor: eligibilityReview[rule.id]?.status === 'PASS' ? 'var(--color-success)' : '' }}
                  >
                    Pass
                  </Button>
                  <Button 
                    variant={eligibilityReview[rule.id]?.status === 'FAIL' ? 'primary' : 'outline'} 
                    onClick={() => setEligibilityReview(prev => ({...prev, [rule.id]: {...prev[rule.id], status: 'FAIL'}}))}
                    style={{ flex: 1, backgroundColor: eligibilityReview[rule.id]?.status === 'FAIL' ? 'var(--color-error)' : '', borderColor: eligibilityReview[rule.id]?.status === 'FAIL' ? 'var(--color-error)' : '' }}
                  >
                    Fail
                  </Button>
                </div>
                
                <Textarea 
                  placeholder="Review notes (optional)" 
                  rows={2} 
                  value={eligibilityReview[rule.id]?.notes} 
                  onChange={e => setEligibilityReview(prev => ({...prev, [rule.id]: {...prev[rule.id], notes: e.target.value}}))}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <Button variant="secondary" onClick={() => setEligibilityModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEligibilitySubmit} disabled={submitting || !isEligibilityComplete}>
            {submitting ? 'Saving...' : 'Complete Screening'}
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default ApplicationDetail;
