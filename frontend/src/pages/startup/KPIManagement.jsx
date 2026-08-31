import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState, Breadcrumb, Table, Input, Modal, Textarea, StatusBadge } from '../../components/ui';
import { pilotService } from '../../services/mockServices';
import { Target, Upload, Save, CheckCircle } from 'lucide-react';

const KPIManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pilot, setPilot] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeKpi, setActiveKpi] = useState(null);
  const [actualValue, setActualValue] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const p = await pilotService.getPilotById(id);
      setPilot(p);
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleOpenModal = (kpi) => {
    setActiveKpi(kpi);
    setActualValue(kpi.actual || '');
    setEvidenceNotes('');
    setIsModalOpen(true);
  };

  const handleSubmitKPI = async () => {
    setLoading(true);
    await pilotService.submitKPIUpdate(id, activeKpi.kpiId, actualValue, {
      title: `Evidence for ${activeKpi.name}`,
      notes: evidenceNotes
    });
    const p = await pilotService.getPilotById(id);
    setPilot(p);
    setIsModalOpen(false);
    setLoading(false);
  };

  if (loading && !pilot) return <LoadingState />;
  if (!pilot) return <div style={{ padding: '2rem' }}>Pilot not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Pilots', href: '/startup/pilots' },
        { label: pilot.name, href: `/startup/pilots/${id}` },
        { label: 'KPI Management' }
      ]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={24} /> KPI Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Submit your metrics. The Government will review and officially validate them.</p>
        </div>
      </div>

      <Card>
        <Table headers={['KPI Name', 'Baseline', 'Target', 'Current Submitted', 'Validation Status', 'Action']}>
          {pilot.kpiResults.map((kpi, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 500 }}>{kpi.name}</td>
              <td>{kpi.baseline}</td>
              <td style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{kpi.target}</td>
              <td>
                {kpi.actual !== null ? (
                  <span style={{ fontWeight: 600 }}>{kpi.actual}</span>
                ) : (
                  <span style={{ color: 'var(--color-text-muted)' }}>Not submitted</span>
                )}
              </td>
              <td>
                <StatusBadge status={kpi.validated ? 'VALIDATED' : (kpi.actual !== null ? 'PENDING_VERIFICATION' : 'PENDING')} />
              </td>
              <td>
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenModal(kpi)}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                >
                  {kpi.actual !== null ? 'Update / Submit Evidence' : 'Submit Value'}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit KPI Value">
        {activeKpi && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-background-alt)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{activeKpi.name}</div>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                <span>Baseline: {activeKpi.baseline}</span>
                <span>Target: {activeKpi.target}</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Actual Value Achieved</label>
              <Input 
                type="number" 
                value={actualValue} 
                onChange={(e) => setActualValue(e.target.value)}
                placeholder={`Enter current value`}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Supporting Evidence Notes</label>
              <Textarea 
                rows={3} 
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                placeholder="Explain how this value was measured or link to external dashboards..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitKPI}><Save size={16} style={{ marginRight: '0.5rem' }}/> Submit for Validation</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KPIManagement;
