import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, LoadingState, Breadcrumb, Table } from '../../components/ui';
import { pilotService } from '../../services/mockServices';
import { Target, CheckSquare, BarChart, ExternalLink } from 'lucide-react';

const PilotDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pilot, setPilot] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const p = await pilotService.getPilotById(id);
      setPilot(p);
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!pilot) return <div style={{ padding: '2rem' }}>Pilot not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Pilots', href: '/startup/pilots' },
        { label: pilot.name }
      ]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{pilot.name}</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Department: {pilot.department}</p>
        </div>
        <StatusBadge status={pilot.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* KPI Management Card */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            <Target size={24} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>KPI Tracking</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flexGrow: 1 }}>
            Submit metrics and performance data for official Government validation. Your scale decisions depend on these results.
          </p>
          <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            <strong>{pilot.kpiResults.length}</strong> KPIs being tracked
          </div>
          <Button onClick={() => navigate(`/startup/pilots/${id}/kpis`)}>Manage KPIs</Button>
        </Card>

        {/* Milestone Management Card */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            <CheckSquare size={24} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Milestones & Payments</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flexGrow: 1 }}>
            Submit deliverables to get milestones verified. Payments are only released after government verification.
          </p>
          <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            <strong>{pilot.milestones.filter(m => m.status === 'VERIFIED').length} / {pilot.milestones.length}</strong> Milestones verified
          </div>
          <Button onClick={() => navigate(`/startup/pilots/${id}/milestones`)}>Manage Milestones</Button>
        </Card>

        {/* Evidence Library Card */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            <BarChart size={24} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Evidence Library</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flexGrow: 1 }}>
            Central repository for all documents, links, and files proving KPI metrics and milestone deliverables.
          </p>
          <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Upload supporting documentation
          </div>
          <Button onClick={() => navigate(`/startup/pilots/${id}/evidence`)}>View Evidence</Button>
        </Card>
      </div>

    </div>
  );
};

export default PilotDashboard;
