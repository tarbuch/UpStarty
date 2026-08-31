import React, { useEffect, useState } from 'react';
import { Card, Badge, LoadingState, Input } from '../components/ui';
import { auditService } from '../services/mockServices';
import { Search } from 'lucide-react';

const AuditTrail = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await auditService.getAuditTrail();
      setAudits(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading secure audit trail..." />;

  const filteredAudits = audits.filter(a => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.action.toLowerCase().includes(q) || a.entityType.toLowerCase().includes(q) || a.actorId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-subtitle">Immutable log of system events, decisions, and state transitions.</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <Input 
          style={{ paddingLeft: '2.5rem' }} 
          placeholder="Search by action, entity, or actor..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {filteredAudits.map(audit => (
            <div key={audit.id} style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ width: '150px', flexShrink: 0, fontWeight: 500, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                {new Date(audit.timestamp).toLocaleString()}
              </div>
              
              <div style={{ flex: 1, paddingLeft: '2rem', borderLeft: '2px solid var(--color-border)', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '-7px', 
                  top: '4px', 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-primary)' 
                }}></div>
                
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{audit.action}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Badge color="gray">{audit.entityType}</Badge>
                  <span style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>{audit.entityId}</span>
                </div>
                
                {audit.details && Object.keys(audit.details).length > 0 && (
                  <div style={{ backgroundColor: 'var(--color-bg-main)', padding: '0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {Object.entries(audit.details).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: '0.25rem' }}>
                        <strong style={{ textTransform: 'capitalize' }}>{k}:</strong> {String(v)}
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Actor: <strong>{audit.actorId}</strong> &bull; IP: {audit.ipAddress}
                </div>
              </div>
            </div>
          ))}
          {filteredAudits.length === 0 && (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No audit logs found.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuditTrail;
