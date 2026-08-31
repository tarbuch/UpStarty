import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, InputGroup, Textarea, LoadingState, Breadcrumb } from '../../components/ui';
import { passportService, CURRENT_STARTUP_ID, startupService } from '../../services/mockServices';

const PassportProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Mock data combination
      const startup = await startupService.getStartupById(CURRENT_STARTUP_ID);
      setProfile({
        name: startup.name,
        legalName: startup.name + ' Pvt Ltd',
        registration: 'U72900KA2023PTC123456',
        year: '2023',
        location: startup.location,
        contactName: 'Jane Doe',
        contactEmail: 'jane@ecoroute.ai',
        contactPhone: '+91 9876543210',
        website: 'https://ecoroute.ai',
        description: startup.description,
        teamSize: '15'
      });
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await passportService.updatePassport(CURRENT_STARTUP_ID, { profileCompleted: true });
    setSaving(false);
    navigate('/startup/passport');
  };

  if (loading) return <LoadingState />;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Innovation Passport', href: '/startup/passport' },
        { label: 'Company Profile' }
      ]} />
      
      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>Company Profile</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Basic information about your startup.</p>
      </div>

      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputGroup label="Startup Name" id="name">
            <Input id="name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
          </InputGroup>
          <InputGroup label="Legal Entity Name" id="legalName">
            <Input id="legalName" value={profile.legalName} onChange={e => setProfile({...profile, legalName: e.target.value})} />
          </InputGroup>
          
          <InputGroup label="Registration Number (CIN/LLPIN)" id="registration">
            <Input id="registration" value={profile.registration} onChange={e => setProfile({...profile, registration: e.target.value})} />
          </InputGroup>
          <InputGroup label="Founding Year" id="year">
            <Input id="year" type="number" value={profile.year} onChange={e => setProfile({...profile, year: e.target.value})} />
          </InputGroup>

          <InputGroup label="Primary Location" id="location">
            <Input id="location" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
          </InputGroup>
          <InputGroup label="Team Size" id="teamSize">
            <Input id="teamSize" type="number" value={profile.teamSize} onChange={e => setProfile({...profile, teamSize: e.target.value})} />
          </InputGroup>

          <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid var(--color-border)', margin: '1rem 0' }}></div>

          <h3 style={{ gridColumn: '1 / -1', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Contact Information</h3>

          <InputGroup label="Primary Contact Name" id="contactName">
            <Input id="contactName" value={profile.contactName} onChange={e => setProfile({...profile, contactName: e.target.value})} />
          </InputGroup>
          <InputGroup label="Contact Email" id="contactEmail">
            <Input id="contactEmail" type="email" value={profile.contactEmail} onChange={e => setProfile({...profile, contactEmail: e.target.value})} />
          </InputGroup>
          
          <InputGroup label="Contact Phone" id="contactPhone">
            <Input id="contactPhone" value={profile.contactPhone} onChange={e => setProfile({...profile, contactPhone: e.target.value})} />
          </InputGroup>
          <InputGroup label="Website" id="website">
            <Input id="website" type="url" value={profile.website} onChange={e => setProfile({...profile, website: e.target.value})} />
          </InputGroup>

          <div style={{ gridColumn: '1 / -1' }}>
            <InputGroup label="Company Description" id="description">
              <Textarea id="description" rows={4} value={profile.description} onChange={e => setProfile({...profile, description: e.target.value})} />
            </InputGroup>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="outline" onClick={() => navigate('/startup/passport')}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button>
        </div>
      </Card>
    </div>
  );
};

export default PassportProfile;
