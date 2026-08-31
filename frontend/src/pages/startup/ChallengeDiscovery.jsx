import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingState, Input, Select } from '../../components/ui';
import { challengeService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { Target, Calendar, Search, Sparkles, Filter } from 'lucide-react';

const ChallengeDiscovery = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      // getRecommendedChallenges already filters out DRAFTs
      const data = await challengeService.getRecommendedChallenges(CURRENT_STARTUP_ID);
      setChallenges(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState />;

  const domains = ['All', ...new Set(challenges.map(c => c.domain))];

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.problem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'All' || c.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Challenge Discovery</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Search and apply for Government innovation challenges.</p>
        </div>
      </div>

      <Card style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
          <Search size={18} color="var(--color-text-muted)" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search challenges by problem, domain, technology..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', background: 'transparent' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--color-text-muted)" />
          <Select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} style={{ width: '200px' }}>
            {domains.map(d => <option key={d} value={d}>{d === 'All' ? 'All Domains' : d}</option>)}
          </Select>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredChallenges.map(challenge => (
          <Card key={challenge.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }} className="hover-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <Badge color={challenge.matchScore >= 80 ? 'green' : 'blue'} className="mb-2">
                <Sparkles size={12} style={{ marginRight: '4px' }} /> {challenge.matchScore}% Match
              </Badge>
              {challenge.status === 'CLOSED' && <Badge color="red">Closed</Badge>}
              {challenge.status === 'PILOT' && <Badge color="gray">Pilot Stage</Badge>}
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>{challenge.title}</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Target size={14} /> {challenge.domain}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} /> Deadline: {challenge.deadline}
              </span>
            </div>
            
            <p style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
              {challenge.problem}
            </p>
            
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Budget</div>
                <div style={{ fontWeight: 600 }}>₹{(challenge.budget / 100000).toFixed(1)}L</div>
              </div>
              <Button onClick={() => navigate(`/startup/challenges/${challenge.id}`)}>
                View Details
              </Button>
            </div>
          </Card>
        ))}
        {filteredChallenges.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-background-alt)', borderRadius: '8px' }}>
            No challenges found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeDiscovery;
