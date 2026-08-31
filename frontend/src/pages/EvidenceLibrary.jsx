import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Table, LoadingState, Input, Select, EmptyState } from '../components/ui';
import { evidenceService, pilotService, startupService, challengeService, validationService } from '../services/mockServices';
import { Search, Filter } from 'lucide-react';

const EvidenceLibrary = () => {
  const navigate = useNavigate();
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const evData = await evidenceService.getEvidence();
        const validations = await validationService.getValidations();
        
        // Enrich data
        const enrichedData = await Promise.all(evData.map(async ev => {
          const pilot = await pilotService.getPilotById(ev.pilotId);
          let startupName = 'Unknown';
          let department = 'Unknown';
          let kpiName = 'Unknown';
          let baseline = 0;
          let target = 0;
          let actual = ev.actual;
          let validationStatus = 'PENDING';
          
          if (pilot) {
            const startup = await startupService.getStartupById(pilot.startupId);
            startupName = startup?.name || 'Unknown';
            const challenge = await challengeService.getChallengeById(pilot.challengeId);
            department = challenge?.departmentId || 'Unknown';
            
            const kpiDef = challenge?.kpis.find(k => k.id === ev.kpiId);
            if (kpiDef) {
              kpiName = kpiDef.name;
              baseline = kpiDef.baseline;
              target = kpiDef.target;
            }
          }
          
          const validation = validations.find(v => v.evidenceId === ev.id);
          if (validation) {
            validationStatus = validation.status;
          }
          
          return {
            ...ev,
            pilotName: pilot?.name || 'Unknown',
            startupName,
            department,
            kpiName,
            baseline,
            target,
            actual,
            validationStatus
          };
        }));
        
        setEvidenceList(enrichedData);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading evidence library..." />;

  const filteredEvidence = evidenceList.filter(ev => {
    if (statusFilter && ev.validationStatus !== statusFilter) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return ev.pilotName.toLowerCase().includes(q) || 
             ev.startupName.toLowerCase().includes(q) || 
             ev.kpiName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Evidence Library</h1>
          <p className="page-subtitle">Browse validated evidence from completed and active pilots.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <Input 
            placeholder="Search by pilot, startup, or KPI..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Filter size={20} color="var(--color-text-muted)" />
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: '180px' }}>
            <option value="">All Validation Status</option>
            <option value="VALIDATED">Validated</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CLARIFICATION_REQUIRED">Clarification Required</option>
          </Select>
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        {filteredEvidence.length > 0 ? (
          <Table headers={['Pilot', 'Startup', 'Department', 'KPI', 'Baseline', 'Target', 'Actual', 'Validation Status', 'Date', 'Action']}>
            {filteredEvidence.map(ev => (
              <tr key={ev.id}>
                <td style={{ fontWeight: 500 }}>{ev.pilotName}</td>
                <td>{ev.startupName}</td>
                <td>{ev.department}</td>
                <td>{ev.kpiName}</td>
                <td>{ev.baseline}</td>
                <td style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{ev.target}</td>
                <td style={{ fontWeight: 600 }}>{ev.actual}</td>
                <td><StatusBadge status={ev.validationStatus} /></td>
                <td>{ev.submittedDate}</td>
                <td>
                  <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/government/pilots/${ev.pilotId}`)}>View</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '4rem 2rem' }}>
            <EmptyState 
              title="No evidence found" 
              description="No evidence records match your current filters." 
              action={<Button variant="secondary" onClick={() => { setSearchQuery(''); setStatusFilter(''); }}>Clear Filters</Button>}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default EvidenceLibrary;
