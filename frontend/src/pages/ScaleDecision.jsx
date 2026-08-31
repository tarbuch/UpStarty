import React, { useState, useEffect } from 'react';
import { Card, Button, Textarea, Badge, LoadingState } from '../components/ui';
import { pilotService, challengeService, startupService } from '../services/mockServices';

const ScaleDecision = () => {
  const [pilots, setPilots] = useState([]);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await pilotService.getPilots();
      
      const validationPilots = await Promise.all(
        data.filter(p => p.status === 'VALIDATION').map(async p => {
          const challenge = await challengeService.getChallengeById(p.challengeId);
          const startup = await startupService.getStartupById(p.startupId);
          return {
            ...p,
            challengeName: challenge?.title || 'Unknown',
            startupName: startup?.name || 'Unknown'
          };
        })
      );
      
      setPilots(validationPilots);
      if (validationPilots.length > 0) setSelectedPilot(validationPilots[0]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    await pilotService.recordDecision(selectedPilot.id, decision, reason);
    setSubmitting(false);
    window.location.href='/government/audit';
  };

  if (loading) return <LoadingState message="Loading pilots pending validation..." />;

  if (pilots.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>No Decisions Pending</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>There are currently no pilots in the VALIDATION stage awaiting a scale decision.</p>
        <Button style={{ marginTop: '2rem' }} onClick={() => window.location.href='/government/pilots'}>View Active Pilots</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Scale Decision</h1>
          <p className="page-subtitle">Review pilot results and make a final procurement decision.</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Pilot for Review</label>
        <select 
          style={{ width: '100%', maxWidth: '400px', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}
          value={selectedPilot?.id}
          onChange={e => setSelectedPilot(pilots.find(p => p.id === e.target.value))}
        >
          {pilots.map(p => (
            <option key={p.id} value={p.id}>{p.name} - {p.startupName}</option>
          ))}
        </select>
      </div>

      {selectedPilot && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <Card>
            <h3 style={{ marginBottom: '1.5rem' }}>Validation Summary: {selectedPilot.startupName}</h3>
            
            <div style={{ padding: '1rem', backgroundColor: selectedPilot.kpiStatus === 'On Track' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', border: `1px solid ${selectedPilot.kpiStatus === 'On Track' ? 'var(--color-success)' : 'var(--color-warning)'}`, marginBottom: '1.5rem' }}>
              <h4 style={{ color: selectedPilot.kpiStatus === 'On Track' ? 'var(--color-success)' : 'var(--color-warning)', marginBottom: '0.5rem' }}>
                {selectedPilot.kpiStatus === 'On Track' ? 'SCALE RECOMMENDED' : 'REVIEW REQUIRED'}
              </h4>
              <p style={{ fontSize: '0.875rem' }}>Based on KPI performance ({selectedPilot.kpiStatus}) and milestone completion.</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.875rem' }}>Performance Data:</strong>
              <ul style={{ fontSize: '0.875rem', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
                <li>Progress: {selectedPilot.progress}%</li>
                <li>Milestones Completed: {selectedPilot.milestones.filter(m => m.status === 'COMPLETED').length} / {selectedPilot.milestones.length}</li>
                <li>Duration: {selectedPilot.daysElapsed} of {selectedPilot.durationDays} days elapsed</li>
              </ul>
            </div>
            
            <Button variant="outline" style={{ marginTop: '1rem', width: '100%' }} onClick={() => window.open(`/government/pilots/${selectedPilot.id}`)}>
              View Full Pilot Dashboard
            </Button>
          </Card>

          <Card>
            <h3 style={{ marginBottom: '1.5rem' }}>Make Decision</h3>
            
            <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', fontSize: '0.875rem', marginBottom: '1.5rem', borderRadius: '0.5rem' }}>
              <strong>Warning:</strong> This decision will be permanently recorded in the audit trail.
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <Button 
                variant={decision === 'SCALE' ? 'primary' : 'secondary'} 
                onClick={() => setDecision('SCALE')}
                style={decision === 'SCALE' ? { backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' } : { flex: 1 }}
              >
                SCALE
              </Button>
              <Button 
                variant={decision === 'EXTEND' ? 'primary' : 'secondary'} 
                onClick={() => setDecision('EXTEND')}
                style={decision === 'EXTEND' ? { backgroundColor: 'var(--color-info)', borderColor: 'var(--color-info)' } : { flex: 1 }}
              >
                EXTEND
              </Button>
              <Button 
                variant={decision === 'STOP' ? 'primary' : 'secondary'} 
                onClick={() => setDecision('STOP')}
                style={decision === 'STOP' ? { backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' } : { flex: 1 }}
              >
                STOP
              </Button>
            </div>

            {decision && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Reasoning & Comments
                  </label>
                  <Textarea 
                    rows={4} 
                    placeholder="Provide detailed reasoning for this decision (required for compliance)..." 
                    value={reason} 
                    onChange={e => setReason(e.target.value)}
                  />
                </div>
                
                <Button disabled={!reason.trim() || submitting} onClick={handleSubmit}>
                  {submitting ? 'Recording...' : 'Confirm & Record Decision'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default ScaleDecision;
