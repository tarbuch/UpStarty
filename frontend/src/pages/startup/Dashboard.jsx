import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState, StatusBadge } from '../../components/ui';
import { challengeService, applicationService, pilotService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { Target, FileText, PlaySquare, AlertCircle, Sparkles, ArrowRight, Activity, Calendar } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pilots, setPilots] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [recs, apps, pils] = await Promise.all([
        challengeService.getRecommendedChallenges(CURRENT_STARTUP_ID),
        applicationService.getStartupApplications(CURRENT_STARTUP_ID),
        pilotService.getStartupPilots(CURRENT_STARTUP_ID)
      ]);
      setRecommended(recs.slice(0, 3));
      setApplications(apps);
      setPilots(pils);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState />;

  // Calculate stats
  const activeApps = applications.filter(a => ['DRAFT', 'SUBMITTED', 'UNDER_EVALUATION', 'ELIGIBILITY_REVIEW', 'SHORTLISTED'].includes(a.status)).length;
  const underEval = applications.filter(a => a.status === 'UNDER_EVALUATION').length;
  const selectedApps = applications.filter(a => a.status === 'SELECTED').length;
  const activePilots = pilots.filter(p => ['ACTIVE', 'VALIDATION'].includes(p.status)).length;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Startup Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Discover opportunities, manage applications and track your pilots.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={() => navigate('/startup/passport')}>Update Passport</Button>
          <Button onClick={() => navigate('/startup/challenges')}>Explore Challenges</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
            <FileText size={18} /> Active Applications
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{activeApps}</div>
        </Card>
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
            <Activity size={18} /> Under Evaluation
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{underEval}</div>
        </Card>
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
            <Target size={18} /> Selected
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{selectedApps}</div>
        </Card>
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
            <PlaySquare size={18} /> Active Pilots
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{activePilots}</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recommended Challenges */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--color-primary)" /> Recommended for You
            </h2>
            <Button variant="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => navigate('/startup/challenges')}>View All</Button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommended.map(challenge => (
              <Card key={challenge.id} style={{ padding: '1.5rem' }} className="hover-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{challenge.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Target size={14} /> {challenge.domain}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} /> Deadline: {challenge.deadline}
                      </span>
                    </div>
                  </div>
                  <Badge color={challenge.matchScore >= 80 ? 'green' : 'blue'}>
                    <Sparkles size={12} /> {challenge.matchScore}% Match
                  </Badge>
                </div>
                <p style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {challenge.problem}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button onClick={() => navigate(`/startup/challenges/${challenge.id}`)}>View Challenge</Button>
                  <Button variant="outline" onClick={() => navigate(`/startup/challenges/${challenge.id}/match`)}>Why this match?</Button>
                </div>
              </Card>
            ))}
            {recommended.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-background-alt)', borderRadius: '8px' }}>
                No recommended challenges at this time.
              </div>
            )}
          </div>
        </div>

        {/* Action Required & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Action Required</h2>
            <Card style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <AlertCircle size={20} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Eligibility Clarification Required</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>For Application: AquaSense for Water Leakage</div>
                    <Button variant="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => navigate('/startup/applications/application-004')}>View Details</Button>
                  </div>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)' }}></div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <AlertCircle size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Pilot Milestone Due in 2 days</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Mid-Pilot KPI Review</div>
                    <Button variant="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => navigate('/startup/pilots/pilot-001/milestones')}>Submit Evidence</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h2>
            <Card style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', marginTop: '6px' }}></div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Application Selected!</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Waste Collection Route Optimization</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', marginTop: '6px' }}></div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Payment Released</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Phase 1 Rollout (10 trucks)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-text-muted)', marginTop: '6px' }}></div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Application Submitted</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Waste Collection Route Optimization</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
