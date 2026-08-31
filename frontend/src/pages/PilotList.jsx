import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Table, Tabs, Input, EmptyState, LoadingState } from '../components/ui';
import { pilotService, challengeService, startupService } from '../services/mockServices';
import { Search } from 'lucide-react';

const PilotList = () => {
  const navigate = useNavigate();
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await pilotService.getPilots();
      
      const enrichedData = await Promise.all(data.map(async p => {
        const challenge = await challengeService.getChallengeById(p.challengeId);
        const startup = await startupService.getStartupById(p.startupId);
        return {
          ...p,
          challengeName: challenge?.title || 'Unknown Challenge',
          startupName: startup?.name || 'Unknown Startup'
        };
      }));
      
      setPilots(enrichedData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading pilots..." />;

  const filteredPilots = pilots.filter(p => {
    if (activeTab === 'Active' && !['ACTIVE', 'PLANNED', 'VALIDATION'].includes(p.status)) return false;
    if (activeTab === 'Validation' && p.status !== 'VALIDATION') return false;
    if (activeTab === 'Completed' && !['COMPLETED', 'FAILED'].includes(p.status)) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || 
             p.startupName.toLowerCase().includes(q) || 
             p.challengeName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pilots</h1>
          <p className="page-subtitle">Track active pilots, monitor KPI performance, and manage milestones.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Tabs 
          tabs={['All', 'Active', 'Validation', 'Completed']} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <Input 
            style={{ paddingLeft: '2.5rem' }} 
            placeholder="Search pilots, startups..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        {filteredPilots.length > 0 ? (
          <Table headers={['Pilot', 'Startup', 'Location', 'Progress', 'KPI Status', 'Pilot Status', 'Actions']}>
            {filteredPilots.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.challengeName}</div>
                </td>
                <td>{p.startupName}</td>
                <td>{p.location}</td>
                <td style={{ minWidth: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '100%', backgroundColor: 'var(--color-border)', height: '6px', borderRadius: '3px' }}>
                      <div style={{ width: `${p.progress}%`, backgroundColor: 'var(--color-primary)', height: '100%', borderRadius: '3px' }}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem' }}>{p.progress}%</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    {p.daysElapsed} / {p.durationDays} days
                  </div>
                </td>
                <td><StatusBadge status={p.kpiStatus} /></td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/government/pilots/${p.id}`)}>Dashboard</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '4rem 2rem' }}>
            <EmptyState 
              title="No pilots found" 
              description="No pilots match your current filters." 
              action={activeTab !== 'All' ? <Button variant="secondary" onClick={() => setActiveTab('All')}>Clear Filters</Button> : null}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PilotList;
