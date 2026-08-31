import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Breadcrumb, LoadingState, ErrorState, Table } from '../components/ui';
import { challengeService, startupService } from '../services/mockServices';
import { Wand2, CheckCircle, AlertTriangle } from 'lucide-react';

const StartupMatching = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cData = await challengeService.getChallengeById(id);
        const mData = await startupService.matchStartupsForChallenge(id);
        setChallenge(cData);
        setMatches(mData);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingState message="Running AI matching algorithms..." />;
  if (!challenge) return <ErrorState message="Challenge not found." onRetry={() => navigate('/government/challenges')} />;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/government' },
        { label: 'Challenges', href: '/government/challenges' },
        { label: challenge.title, href: `/government/challenges/${challenge.id}` },
        { label: 'Startup Matching' }
      ]} />

      <div className="page-header" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Startup Matching</h1>
            <Badge color="blue"><Wand2 size={12} style={{ marginRight: '4px' }}/> AI Powered</Badge>
          </div>
          <p className="page-subtitle">Finding the best solutions for: <strong>{challenge.title}</strong></p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/government/challenges/${challenge.id}`)}>Back to Challenge</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {matches.map(startup => (
          <Card key={startup.id}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', borderRight: '1px solid var(--color-border)' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', border: `8px solid ${startup.matchScore > 85 ? 'var(--color-success)' : (startup.matchScore > 70 ? 'var(--color-warning)' : 'var(--color-error)')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{startup.matchScore}</span>
                </div>
                <h3 style={{ margin: 0, textAlign: 'center', marginBottom: '0.25rem' }}>{startup.name}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{startup.domain}</div>
                <Button style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => navigate(`/government/startups/${startup.id}`)}>View Profile</Button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>AI Analysis Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                     <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-main)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ color: 'var(--color-text-muted)' }}>Technology Fit</span>
                       <strong style={{ color: startup.matchAnalysis.technologyFit === 'Excellent' ? 'var(--color-success)' : 'var(--color-text-main)' }}>{startup.matchAnalysis.technologyFit}</strong>
                     </div>
                     <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-main)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ color: 'var(--color-text-muted)' }}>Domain Experience</span>
                       <strong style={{ color: startup.matchAnalysis.domainExperience === 'Direct Match' ? 'var(--color-success)' : 'var(--color-text-main)' }}>{startup.matchAnalysis.domainExperience}</strong>
                     </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16}/> Match Reasons</h4>
                    <ul style={{ paddingLeft: '1.5rem', margin: 0, fontSize: '0.875rem' }}>
                      {startup.matchAnalysis.reasons.map((r, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{r}</li>)}
                    </ul>
                  </div>
                  {startup.matchAnalysis.concerns.length > 0 && (
                    <div>
                      <h4 style={{ color: 'var(--color-warning)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertTriangle size={16}/> Potential Concerns</h4>
                      <ul style={{ paddingLeft: '1.5rem', margin: 0, fontSize: '0.875rem' }}>
                        {startup.matchAnalysis.concerns.map((r, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {matches.length === 0 && (
          <Card>
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No startup matches found for this challenge yet.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StartupMatching;
