import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState, Breadcrumb } from '../../components/ui';
import { challengeService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';

const EligibilityCheck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const recs = await challengeService.getRecommendedChallenges(CURRENT_STARTUP_ID);
      const ch = recs.find(c => c.id === id);
      setChallenge(ch);

      const check = await challengeService.checkEligibility(CURRENT_STARTUP_ID, id);
      setEligibilityData(check);
      
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingState message="Checking your Innovation Passport against rules..." />;
  if (!challenge) return <div style={{ padding: '2rem' }}>Challenge not found.</div>;

  const { eligible, rules } = eligibilityData;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Challenges', href: '/startup/challenges' },
        { label: challenge.title, href: `/startup/challenges/${id}` },
        { label: 'Eligibility Check' }
      ]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={24} /> Eligibility Verification
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Automated screening based on your Innovation Passport.</p>
        </div>
      </div>

      <Card style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', backgroundColor: eligible ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)', border: `1px solid ${eligible ? 'var(--color-success)' : 'var(--color-error)'}` }}>
        {eligible ? (
          <>
            <CheckCircle size={48} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-success)', marginBottom: '0.5rem' }}>You are Eligible!</h2>
            <p style={{ color: 'var(--color-text-main)' }}>Your startup meets all the mandatory criteria for this challenge.</p>
          </>
        ) : (
          <>
            <XCircle size={48} color="var(--color-error)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-error)', marginBottom: '0.5rem' }}>Eligibility Requirements Not Met</h2>
            <p style={{ color: 'var(--color-text-main)' }}>Please review the failed criteria below and update your passport if necessary.</p>
          </>
        )}
      </Card>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Detailed Rule Evaluation</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rules.map((rule, idx) => (
          <Card key={idx} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              {rule.startupStatus === 'PASS' ? (
                <CheckCircle size={20} color="var(--color-success)" style={{ marginTop: '2px' }} />
              ) : (
                <XCircle size={20} color="var(--color-error)" style={{ marginTop: '2px' }} />
              )}
              <div>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{rule.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Required</div>
              </div>
            </div>
            <Badge color={rule.startupStatus === 'PASS' ? 'green' : 'red'}>
              {rule.startupStatus === 'PASS' ? 'Passed' : 'Failed'}
            </Badge>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
        <Button variant="outline" onClick={() => navigate(`/startup/challenges/${id}`)}>Back to Challenge</Button>
        {eligible ? (
          <Button onClick={() => navigate(`/startup/applications/new/${id}`)}>Start Application</Button>
        ) : (
          <Button onClick={() => navigate('/startup/passport')}>Update Innovation Passport</Button>
        )}
      </div>
    </div>
  );
};

export default EligibilityCheck;
