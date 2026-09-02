import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState, StatusBadge } from '../../components/ui';
import { challengeService, applicationService, pilotService, activityService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { Target, FileText, PlaySquare, AlertCircle, Sparkles, Activity, Calendar, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [recs, apps, pils, acts] = await Promise.all([
        challengeService.getRecommendedChallenges(CURRENT_STARTUP_ID),
        applicationService.getStartupApplications(CURRENT_STARTUP_ID),
        pilotService.getStartupPilots(CURRENT_STARTUP_ID),
        activityService.getStartupActivity(CURRENT_STARTUP_ID)
      ]);
      setRecommended(recs.slice(0, 3));
      setApplications(apps);
      setPilots(pils);
      setRecentActivity(acts);
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

  // Build Action Required
  const actionRequired = [];
  
  // 1. Clarification Required
  applications.filter(a => a.status === 'CLARIFICATION_REQUIRED').forEach(app => {
    actionRequired.push({
      id: `clarify-${app.id}`,
      type: 'warning',
      title: 'Clarification Required',
      desc: `For Application: ${app.id}`, // Can join with challenge title if needed
      actionText: 'View Details',
      actionUrl: `/startup/applications/${app.id}`
    });
  });

  // 2. Drafts
  applications.filter(a => a.status === 'DRAFT').forEach(app => {
    actionRequired.push({
      id: `draft-${app.id}`,
      type: 'info',
      title: 'Draft Application Pending',
      desc: `Finish your application for Challenge ${app.challengeId}`,
      actionText: 'Continue Draft',
      actionUrl: `/startup/applications/new/${app.challengeId}`
    });
  });

  // 3. Milestones Due
  pilots.forEach(p => {
    p.milestones.filter(m => m.status === 'PENDING').forEach(m => {
      actionRequired.push({
        id: `ms-${m.id}`,
        type: 'primary',
        title: 'Milestone Deliverable Due',
        desc: `${m.name} for Pilot: ${p.name}`,
        actionText: 'Submit Evidence',
        actionUrl: `/startup/pilots/${p.id}/milestones`
      });
    });
  });

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
                {actionRequired.length === 0 ? (
                   <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>No action required at this time.</div>
                ) : (
                  actionRequired.map((act, i) => (
                    <React.Fragment key={act.id}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <AlertCircle size={20} color={act.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{act.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{act.desc}</div>
                          <Button variant="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => navigate(act.actionUrl)}>{act.actionText}</Button>
                        </div>
                      </div>
                      {i < actionRequired.length - 1 && <div style={{ borderBottom: '1px solid var(--color-border)' }}></div>}
                    </React.Fragment>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h2>
            <Card style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentActivity.length === 0 ? (
                  <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>No recent activity.</div>
                ) : (
                  recentActivity.map((act) => (
                    <div key={act.id} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', marginTop: '6px' }}></div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{act.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{act.entity} • {act.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
