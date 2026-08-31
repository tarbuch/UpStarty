import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, InputGroup, LoadingState, Breadcrumb, Badge } from '../../components/ui';
import { passportService, CURRENT_STARTUP_ID, startupService } from '../../services/mockServices';
import { X, Plus } from 'lucide-react';

const PassportCapabilities = () => {
  const navigate = useNavigate();
  const [capabilities, setCapabilities] = useState([]);
  const [newCap, setNewCap] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const startup = await startupService.getStartupById(CURRENT_STARTUP_ID);
      setCapabilities([...(startup.capabilities || [])]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAdd = () => {
    if (newCap.trim()) {
      setCapabilities([...capabilities, newCap.trim()]);
      setNewCap('');
    }
  };

  const handleRemove = (idx) => {
    setCapabilities(capabilities.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    await passportService.updatePassport(CURRENT_STARTUP_ID, { capabilitiesCompleted: capabilities.length > 0 });
    setSaving(false);
    navigate('/startup/passport');
  };

  if (loading) return <LoadingState />;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Innovation Passport', href: '/startup/passport' },
        { label: 'Capabilities' }
      ]} />
      
      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>Capabilities</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>List your startup's core capabilities. These are used by AI to match you with relevant challenges.</p>
      </div>

      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <Input 
              placeholder="e.g. Route Optimization, Acoustic Analysis..." 
              value={newCap} 
              onChange={e => setNewCap(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <Button onClick={handleAdd}><Plus size={16} style={{ marginRight: '0.5rem' }}/> Add</Button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {capabilities.map((cap, idx) => (
            <div key={idx} style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              padding: '0.5rem 1rem', backgroundColor: 'var(--color-background-alt)', 
              borderRadius: '20px', fontSize: '0.9rem' 
            }}>
              {cap}
              <button 
                onClick={() => handleRemove(idx)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                <X size={14} color="var(--color-text-muted)" />
              </button>
            </div>
          ))}
          {capabilities.length === 0 && <span style={{ color: 'var(--color-text-muted)' }}>No capabilities added yet.</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '3rem' }}>
          <Button variant="outline" onClick={() => navigate('/startup/passport')}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Capabilities'}</Button>
        </div>
      </Card>
    </div>
  );
};

export default PassportCapabilities;
