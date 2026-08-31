import React from 'react';
import { Card, Button, Input, Tabs } from '../components/ui';
import { User, Bell, Shield, Key } from 'lucide-react';

const Settings = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings & Profile</h1>
          <p className="page-subtitle">Manage your account, notifications, and platform preferences.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        <Card style={{ padding: '0' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-main)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)' }}>
              <User size={18} /> My Profile
            </div>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              <Bell size={18} /> Notifications
            </div>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              <Key size={18} /> Security & Access
            </div>
            <div style={{ padding: '1rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              <Shield size={18} /> Department Admin
            </div>
          </div>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Profile Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
              <Input defaultValue="Rajiv Sharma" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Title / Designation</label>
              <Input defaultValue="Joint Secretary of Innovation" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Department</label>
              <Input defaultValue="Ministry of Urban Development" disabled />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
              <Input defaultValue="rajiv.sharma@gov.in" disabled />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <Button variant="secondary">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
