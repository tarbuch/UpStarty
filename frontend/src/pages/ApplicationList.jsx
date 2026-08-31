import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Table, Badge, Tabs, Input, EmptyState, LoadingState } from '../components/ui';
import { applicationService, challengeService, startupService } from '../services/mockServices';
import { Search } from 'lucide-react';

const ApplicationList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await applicationService.getApplications();
      const enrichedData = await Promise.all(data.map(async app => {
        const startup = await startupService.getStartupById(app.startupId);
        const challenge = await challengeService.getChallengeById(app.challengeId);
        return { ...app, startup, challenge };
      }));
      setApplications(enrichedData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading applications..." />;

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'Pending Review' && app.status !== 'SUBMITTED') return false;
    if (activeTab === 'Evaluation' && app.status !== 'UNDER_EVALUATION') return false;
    if (activeTab === 'Selected' && app.status !== 'SELECTED') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return app.startup?.name.toLowerCase().includes(q) || app.challenge?.title.toLowerCase().includes(q) || app.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">Review startup applications and expert evaluations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Tabs 
          tabs={['All', 'Pending Review', 'Evaluation', 'Selected']} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <Input 
            style={{ paddingLeft: '2.5rem' }} 
            placeholder="Search by startup or challenge..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        {filteredApplications.length > 0 ? (
          <Table headers={['Application ID', 'Startup', 'Challenge', 'Match Score', 'Status', 'Expert Score', 'Submitted Date', 'Actions']}>
            {filteredApplications.map(app => (
              <tr key={app.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{app.id}</td>
                <td style={{ fontWeight: 500 }}>{app.startup?.name}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{app.challenge?.title}</td>
                <td>
                  <Badge color={app.matchScore > 85 ? 'green' : (app.matchScore > 70 ? 'yellow' : 'red')}>
                    {app.matchScore}%
                  </Badge>
                </td>
                <td><StatusBadge status={app.status} /></td>
                <td style={{ fontWeight: 600 }}>{app.expertScore ? `${app.expertScore} / 10` : '-'}</td>
                <td>{app.submittedDate}</td>
                <td>
                  <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => navigate(`/government/applications/${app.id}`)}>Review</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '4rem 2rem' }}>
            <EmptyState 
              title="No applications found" 
              description="No applications match your current filters." 
              action={activeTab !== 'All' ? <Button variant="secondary" onClick={() => setActiveTab('All')}>Clear Filters</Button> : null}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicationList;
