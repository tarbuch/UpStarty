import React from 'react';
import { Card } from '../components/ui';

const PlaceholderPage = ({ title }) => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">This page is under construction or intentionally mocked.</p>
        </div>
      </div>
      <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h3 style={{ color: 'var(--color-text-muted)' }}>Content for {title} will appear here.</h3>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
