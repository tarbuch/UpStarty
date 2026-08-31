import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, LoadingState, Breadcrumb } from '../../components/ui';
import { applicationService, challengeService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { FileText, ArrowLeft, Send } from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const apps = await applicationService.getStartupApplications(CURRENT_STARTUP_ID);
      const app = apps.find(a => a.id === id);
      
      if (app) {
        setApplication(app);
        const recs = await challengeService.getRecommendedChallenges(CURRENT_STARTUP_ID);
        const ch = recs.find(c => c.id === app.challengeId);
        setChallenge(ch);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!application) return <div style={{ padding: '2rem' }}>Application not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Applications', href: '/startup/applications' },
        { label: application.id }
      ]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Application Details</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{challenge?.title || 'Unknown Challenge'}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <Card style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--color-primary)" /> Submission Content
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Solution Proposal</h3>
                <p style={{ lineHeight: 1.6 }}>{application.data?.solution || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Technical Architecture</h3>
                <p style={{ lineHeight: 1.6 }}>{application.data?.architecture || 'Not provided'}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--color-background-alt)', padding: '1rem', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Proposed Timeline</div>
                  <div style={{ fontWeight: 600 }}>{application.data?.timeline ? `${application.data.timeline} Months` : 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Estimated Budget</div>
                  <div style={{ fontWeight: 600 }}>{application.data?.budget ? `₹${application.data.budget}` : 'N/A'}</div>
                </div>
              </div>
            </div>
          </Card>
          
          {application.status === 'CLARIFICATION_REQUIRED' && (
            <Card style={{ padding: '2rem', border: '1px solid var(--color-warning)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-warning)', marginBottom: '1rem' }}>Clarification Required</h3>
              <p style={{ marginBottom: '1rem' }}>The evaluation committee has requested more information regarding your proposed architecture.</p>
              <textarea style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1rem' }} rows={4} placeholder="Provide your response here..."></textarea>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button><Send size={16} style={{ marginRight: '0.5rem' }}/> Submit Clarification</Button>
              </div>
            </Card>
          )}

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Application Meta</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Application ID</div>
                <div style={{ fontWeight: 500 }}>{application.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Submitted Date</div>
                <div style={{ fontWeight: 500 }}>{application.submittedDate || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Eligibility Status</div>
                <StatusBadge status={application.eligibilityStatus} />
              </div>
            </div>
          </Card>

          {application.status === 'SELECTED' && (
            <Card style={{ padding: '1.5rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Congratulations!</h3>
              <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', opacity: 0.9 }}>Your application has been selected for a pilot.</p>
              <Button style={{ backgroundColor: 'white', color: 'var(--color-primary)', width: '100%' }} onClick={() => navigate('/startup/pilots')}>Go to Pilots</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
