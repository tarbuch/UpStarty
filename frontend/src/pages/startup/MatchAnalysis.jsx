import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState, Breadcrumb } from '../../components/ui';
import { challengeService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { Sparkles, Check, X } from 'lucide-react';

const MatchAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const recs = await challengeService.getRecommendedChallenges(CURRENT_STARTUP_ID);
      const ch = recs.find(c => c.id === id);
      setChallenge(ch);
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!challenge) return <div style={{ padding: '2rem' }}>Challenge not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Challenges', href: '/startup/challenges' },
        { label: challenge.title, href: `/startup/challenges/${id}` },
        { label: 'AI Match Analysis' }
      ]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={24} /> AI Match Analysis
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Why this challenge was recommended for your startup.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/startup/challenges/${id}`)}>Back to Challenge</Button>
      </div>

      <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Overall Match Score</div>
        <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 36 36" style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-background-alt)"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={challenge.matchScore >= 80 ? 'var(--color-success)' : 'var(--color-primary)'}
              strokeWidth="3"
              strokeDasharray={`${challenge.matchScore}, 100`}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{challenge.matchScore}%</div>
        </div>
      </Card>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Match Breakdown</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Card style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Domain Alignment</h3>
            <Badge color="green">Strong Match</Badge>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Your startup's primary domain closely aligns with the challenge's domain ({challenge.domain}).
          </p>
        </Card>

        <Card style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Technological Fit</h3>
            <Badge color="green">Strong Match</Badge>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Based on your passport capabilities, you possess the core technologies needed to address this problem statement.
          </p>
        </Card>

        <Card style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Experience Level</h3>
            <Badge color="blue">Good Match</Badge>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Your previous Government deployments show you are capable of handling public sector pilot programs.
          </p>
        </Card>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <Button size="large" onClick={() => navigate(`/startup/challenges/${id}/eligibility`)}>Check Eligibility to Apply</Button>
      </div>
    </div>
  );
};

export default MatchAnalysis;
