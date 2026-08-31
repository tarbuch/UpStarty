import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input, EmptyState, LoadingState, Select } from '../components/ui';
import { startupService } from '../services/mockServices';
import { Search, Filter, MapPin, Building, Activity } from 'lucide-react';

const StartupDiscovery = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [maturityFilter, setMaturityFilter] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await startupService.getStartups();
      setStartups(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const domains = [...new Set(startups.map(s => s.domain))];
  const maturities = [...new Set(startups.map(s => s.maturity))];

  const filteredStartups = startups.filter(s => {
    if (domainFilter && s.domain !== domainFilter) return false;
    if (maturityFilter && s.maturity !== maturityFilter) return false;
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) || 
        s.domain.toLowerCase().includes(q) ||
        s.technologies?.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (loading) return <LoadingState message="Discovering startups..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Startup Discovery</h1>
          <p className="page-subtitle">Search the innovation ecosystem by technology, capability or domain.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <Input 
            placeholder="Search by name, technology, or keywords..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Filter size={20} color="var(--color-text-muted)" />
          <Select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} style={{ minWidth: '150px' }}>
            <option value="">All Domains</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Select value={maturityFilter} onChange={e => setMaturityFilter(e.target.value)} style={{ minWidth: '150px' }}>
            <option value="">All Maturities</option>
            {maturities.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
      </div>

      {filteredStartups.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredStartups.map(startup => (
            <Card key={startup.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{startup.name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{startup.domain}</div>
                </div>
                {startup.governmentDeployments > 0 ? (
                  <Badge color="green">Gov Proven</Badge>
                ) : (
                  <Badge color="blue">{startup.maturity}</Badge>
                )}
              </div>
              
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: 'var(--color-text-main)', flex: 1 }}>
                {startup.description}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} /> {startup.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={14} /> {startup.deployments} Total Deployments
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {startup.technologies?.slice(0, 3).map(t => (
                  <Badge key={t} color="gray" style={{ fontSize: '0.7rem' }}>{t}</Badge>
                ))}
                {startup.technologies?.length > 3 && <Badge color="gray" style={{ fontSize: '0.7rem' }}>+{startup.technologies.length - 3}</Badge>}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Readiness: <strong style={{ color: 'var(--color-text-main)' }}>{startup.pilotReadiness}</strong>
                </div>
                <Button variant="secondary" onClick={() => navigate(`/government/startups/${startup.id}`)}>View Profile</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div style={{ padding: '4rem 2rem' }}>
            <EmptyState 
              title="No startups found" 
              description="No startups match your current search and filter criteria." 
              action={
                <Button variant="secondary" onClick={() => { setSearchTerm(''); setDomainFilter(''); setMaturityFilter(''); }}>
                  Clear All Filters
                </Button>
              }
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default StartupDiscovery;
