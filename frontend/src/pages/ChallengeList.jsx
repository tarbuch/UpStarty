import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Table, Input, Tabs, EmptyState, LoadingState } from '../components/ui';
import { challengeService } from '../services/mockServices';
import { Search } from 'lucide-react';

const ChallengeList = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await challengeService.getChallenges();
      setChallenges(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading challenges..." />;

  const filteredChallenges = challenges.filter(c => {
    // Tab filtering
    if (activeTab === 'Drafts' && c.status !== 'DRAFT') return false;
    if (activeTab === 'Active' && !['PUBLISHED', 'APPLICATION_OPEN', 'EVALUATION', 'STARTUP_SELECTED', 'PILOT', 'VALIDATION'].includes(c.status)) return false;
    if (activeTab === 'Closed' && !['COMPLETED', 'FAILED', 'CLOSED'].includes(c.status)) return false;
    
    // Search filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    }
    
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Challenges</h1>
          <p className="page-subtitle">Manage your innovation challenges and view their status.</p>
        </div>
        <Button onClick={() => navigate('/government/challenges/new')}>Create Challenge</Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Tabs 
          tabs={['All', 'Drafts', 'Active', 'Closed']} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <Input 
            style={{ paddingLeft: '2.5rem' }} 
            placeholder="Search by title, domain or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        {filteredChallenges.length > 0 ? (
          <Table headers={['Challenge ID', 'Challenge', 'Domain', 'Status', 'Applications', 'Deadline', 'Actions']}>
            {filteredChallenges.map(c => (
              <tr key={c.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{c.id}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{c.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.location}</div>
                </td>
                <td>{c.domain}</td>
                <td><StatusBadge status={c.status} /></td>
                <td>{c.applications || 0}</td>
                <td>{c.deadline || '-'}</td>
                <td>
                  <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/government/challenges/${c.id}`)}>View</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '4rem 2rem' }}>
            <EmptyState 
              title="No challenges found" 
              description="Try adjusting your search or filters, or create a new challenge." 
              action={activeTab !== 'All' ? <Button variant="secondary" onClick={() => setActiveTab('All')}>Clear Filters</Button> : null}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChallengeList;
