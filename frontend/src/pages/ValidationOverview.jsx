import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Table, LoadingState } from '../components/ui';
import { validationService, pilotService, startupService, challengeService, evidenceService } from '../services/mockServices';

const ValidationOverview = () => {
  const navigate = useNavigate();
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const valData = await validationService.getValidations();
        
        // Enrich data
        const enrichedData = await Promise.all(valData.map(async v => {
          const evidence = (await evidenceService.getEvidence()).find(e => e.id === v.evidenceId);
          let pilotName = 'Unknown';
          let startupName = 'Unknown';
          let challengeTitle = 'Unknown';
          let kpiName = 'Unknown KPI';
          
          if (evidence) {
            const pilot = await pilotService.getPilotById(evidence.pilotId);
            if (pilot) {
              pilotName = pilot.name;
              const startup = await startupService.getStartupById(pilot.startupId);
              startupName = startup?.name || 'Unknown';
              const challenge = await challengeService.getChallengeById(pilot.challengeId);
              challengeTitle = challenge?.title || 'Unknown';
              
              const kpiDef = challenge?.kpis.find(k => k.id === evidence.kpiId);
              if (kpiDef) kpiName = kpiDef.name;
            }
          }
          
          return {
            ...v,
            pilotName,
            startupName,
            challengeTitle,
            kpiName,
            evidenceTitle: evidence?.title || 'Unknown Evidence',
          };
        }));
        
        setValidations(enrichedData);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading validations..." />;

  const pending = validations.filter(v => v.status === 'PENDING').length;
  const underReview = validations.filter(v => v.status === 'UNDER_REVIEW').length;
  const validated = validations.filter(v => v.status === 'VALIDATED').length;
  const clarification = validations.filter(v => v.status === 'CLARIFICATION_REQUIRED').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pilot Validations</h1>
          <p className="page-subtitle">Review independently validated pilot results and pending validation activity.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Pending Validation</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{pending}</div>
        </Card>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Under Review</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-info)' }}>{underReview}</div>
        </Card>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Validated</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>{validated}</div>
        </Card>
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Clarification Required</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning)' }}>{clarification}</div>
        </Card>
      </div>

      <Card style={{ padding: 0 }}>
        {validations.length > 0 ? (
          <Table headers={['Pilot', 'Startup', 'Challenge', 'KPI', 'Evidence', 'Submitted', 'Validation Status', 'Action']}>
            {validations.map(v => (
              <tr key={v.id}>
                <td style={{ fontWeight: 500 }}>{v.pilotName}</td>
                <td>{v.startupName}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{v.challengeTitle}</td>
                <td>{v.kpiName}</td>
                <td>{v.evidenceTitle}</td>
                <td>{v.submittedDate}</td>
                <td><StatusBadge status={v.status} /></td>
                <td>
                  <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/government/pilots/${v.pilotId}`)}>View Evidence</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No validations found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default ValidationOverview;
