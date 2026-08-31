import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Breadcrumb, LoadingState, ErrorState, Tabs } from '../components/ui';
import { startupService } from '../services/mockServices';
import { MapPin, Building, Activity, ShieldCheck, FileCheck } from 'lucide-react';

const StartupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await startupService.getStartupById(id);
      setStartup(data);
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingState message="Loading startup profile..." />;
  if (!startup) return <ErrorState message="Startup not found." onRetry={() => navigate('/government/startups')} />;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/government' },
        { label: 'Startup Discovery', href: '/government/startups' },
        { label: startup.name }
      ]} />

      <div className="page-header" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>{startup.name}</h1>
            {startup.governmentDeployments > 0 && <Badge color="green">Gov Proven</Badge>}
          </div>
          <p className="page-subtitle">{startup.domain} &bull; {startup.location} &bull; {startup.maturity}</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Tabs 
          tabs={['Profile', 'Innovation Passport']} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>

      {activeTab === 'Profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>About</h3>
              <p style={{ lineHeight: 1.6 }}>{startup.description}</p>
            </Card>

            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Capabilities & Offerings</h3>
              <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {startup.capabilities?.map((cap, i) => (
                  <li key={i}>{cap}</li>
                ))}
              </ul>
            </Card>
            
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Core Technologies</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {startup.technologies?.map(tech => (
                  <Badge key={tech} color="gray">{tech}</Badge>
                ))}
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Company Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <MapPin size={16} color="var(--color-text-muted)" />
                  <span style={{ color: 'var(--color-text-muted)', width: '100px' }}>Location</span>
                  <span style={{ fontWeight: 500 }}>{startup.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <Building size={16} color="var(--color-text-muted)" />
                  <span style={{ color: 'var(--color-text-muted)', width: '100px' }}>Maturity</span>
                  <span style={{ fontWeight: 500 }}>{startup.maturity}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <Activity size={16} color="var(--color-text-muted)" />
                  <span style={{ color: 'var(--color-text-muted)', width: '100px' }}>Deployments</span>
                  <span style={{ fontWeight: 500 }}>{startup.deployments} Total ({startup.governmentDeployments} Gov)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={16} color="var(--color-text-muted)" />
                  <span style={{ color: 'var(--color-text-muted)', width: '100px' }}>Readiness</span>
                  <span style={{ fontWeight: 500, color: startup.pilotReadiness === 'High' ? 'var(--color-success)' : 'var(--color-warning)' }}>{startup.pilotReadiness}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 style={{ marginBottom: '1rem' }}>Certifications</h3>
              {startup.certifications?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {startup.certifications.map(cert => (
                    <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--color-bg-main)', borderRadius: '0.25rem' }}>
                      <FileCheck size={16} color="var(--color-primary)" />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No certifications listed.</p>
              )}
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'Innovation Passport' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(27,44,193,0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Digital Innovation Passport</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>Verified credentials and past performance data.</p>
            </div>
          </div>
          
          <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: '0.5rem', backgroundColor: '#FAFAFA' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              The Innovation Passport aggregates the startup's corporate identity, certifications, and past performance across all government pilots into a single verified credential.
            </p>
            <Badge color="blue">Coming Soon</Badge>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StartupDetail;
