import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState } from '../../components/ui';
import { passportService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { CheckCircle, AlertCircle, FileText, ChevronRight, Shield, Activity, Target, Zap, Layout } from 'lucide-react';

const PassportDashboard = () => {
  const navigate = useNavigate();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await passportService.getPassport(CURRENT_STARTUP_ID);
      setPassport(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState />;

  if (!passport) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Innovation Passport</h2>
        <Card style={{ padding: '2rem', textAlign: 'center', marginTop: '1rem' }}>
          <Shield size={48} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Passport Found</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>You haven't set up your Innovation Passport yet.</p>
          <Button onClick={() => navigate('/startup/passport/profile')}>Create Passport</Button>
        </Card>
      </div>
    );
  }

  const sections = [
    { id: 'profile', title: 'Company Profile', icon: Layout, completed: passport.profileCompleted, path: '/startup/passport/profile' },
    { id: 'capabilities', title: 'Capabilities', icon: Zap, completed: passport.capabilitiesCompleted, path: '/startup/passport/capabilities' },
    { id: 'technologies', title: 'Technologies', icon: Target, completed: passport.technologiesCompleted, path: '/startup/passport/technologies' },
    { id: 'deployments', title: 'Deployments', icon: Activity, completed: passport.deploymentsCompleted, path: '/startup/passport/deployments' },
    { id: 'certifications', title: 'Certifications', icon: Shield, completed: passport.certificationsCompleted, path: '/startup/passport/certifications' },
    { id: 'documents', title: 'Documents', icon: FileText, completed: passport.documentsCompleted, path: '/startup/passport/documents' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Innovation Passport</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your reusable profile, capabilities, and documents for faster applications.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Score Card */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
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
                stroke={passport.readinessScore > 80 ? 'var(--color-success)' : 'var(--color-primary)'}
                strokeWidth="3"
                strokeDasharray={`${passport.readinessScore}, 100`}
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{passport.readinessScore}%</div>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Passport Completion</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>Higher completion scores improve AI matching recommendations.</p>
        </Card>

        {/* Readiness Overview */}
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Procurement Readiness</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Registration</span>
              {passport.documents.some(d => d.type === 'Registration' && d.status === 'VERIFIED') ? <Badge color="green"><CheckCircle size={12}/> Verified</Badge> : <Badge color="yellow"><AlertCircle size={12}/> Missing</Badge>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Certifications</span>
              {passport.certificationsCompleted ? <Badge color="green"><CheckCircle size={12}/> Complete</Badge> : <Badge color="gray">Incomplete</Badge>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Government Deployments</span>
              {passport.deploymentsCompleted ? <Badge color="green"><CheckCircle size={12}/> Verified</Badge> : <Badge color="gray">0 Deployments</Badge>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Pilot Readiness</span>
              <Badge color="green"><CheckCircle size={12}/> High</Badge>
            </div>
          </div>
        </Card>

      </div>

      {/* Sections Grid */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Passport Sections</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {sections.map(section => (
          <Card 
            key={section.id}
            className="hover-card"
            style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => navigate(section.path)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '8px', backgroundColor: section.completed ? 'rgba(34, 197, 94, 0.1)' : 'var(--color-background-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: section.completed ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                <section.icon size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{section.title}</div>
                <div style={{ fontSize: '0.8rem', color: section.completed ? 'var(--color-success)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {section.completed ? <><CheckCircle size={12} /> Complete</> : 'Incomplete'}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--color-text-muted)" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PassportDashboard;
