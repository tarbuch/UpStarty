import React, { useEffect, useState } from 'react';
import './ui.css';
import { Check, AlertCircle, X, ChevronRight } from 'lucide-react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', style = {}, ...props }) => (
  <div className={`card ${className}`} style={style} {...props}>
    {children}
  </div>
);

export const Badge = ({ children, color = 'blue', className = '' }) => (
  <span className={`badge badge-${color} ${className}`}>
    {children}
  </span>
);

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  let color = 'gray';
  let Icon = null;
  
  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'ACTIVE':
    case 'COMPLETED':
    case 'TARGET_ACHIEVED':
    case 'ON_TRACK':
    case 'SELECTED':
    case 'ELIGIBLE':
    case 'VALIDATED':
      color = 'green';
      Icon = Check;
      break;
    case 'WARNING':
    case 'AT_RISK':
    case 'PENDING':
    case 'PENDING_VERIFICATION':
    case 'EVALUATION':
    case 'UNDER_EVALUATION':
    case 'UNDER_REVIEW':
    case 'CLARIFICATION_REQUIRED':
    case 'ELIGIBILITY_REVIEW':
    case 'SHORTLISTED':
    case 'APPLICATION_OPEN':
    case 'AGREEMENT':
    case 'DEPLOYMENT':
    case 'KPI_REVIEW':
      color = 'yellow';
      break;
    case 'ERROR':
    case 'FAILED':
    case 'REJECTED':
    case 'INELIGIBLE':
    case 'STOP':
      color = 'red';
      Icon = X;
      break;
    case 'PILOT':
    case 'PUBLISHED':
    case 'SUBMITTED':
    case 'SCALE':
    case 'EXTEND':
      color = 'blue';
      break;
    case 'DRAFT':
    case 'PLANNED':
      color = 'gray';
      break;
  }
  
  return (
    <Badge color={color}>
      {Icon && <Icon size={12} />}
      {normalized.replace(/_/g, ' ')}
    </Badge>
  );
};

export const InputGroup = ({ label, id, children }) => (
  <div className="input-group">
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
);

export const Input = React.forwardRef((props, ref) => <input ref={ref} className="input" {...props} />);
export const Textarea = React.forwardRef((props, ref) => <textarea ref={ref} className="textarea" {...props} />);
export const Select = React.forwardRef((props, ref) => <select ref={ref} className="select" {...props} />);

export const Table = ({ headers, children }) => (
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--color-text-muted)" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        return (
          <div key={idx} className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
            <div className="step-indicator">
              {isCompleted ? <Check size={14} /> : (isActive ? <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}/> : null)}
            </div>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="tabs-header">
      {tabs.map(tab => (
        <button 
          key={tab} 
          className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export const Breadcrumb = ({ items }) => {
  return (
    <div className="breadcrumbs">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span>{item.label}</span>
          )}
          {idx < items.length - 1 && <ChevronRight size={14} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export const EmptyState = ({ title, description, action }) => (
  <div className="empty-state">
    <AlertCircle size={48} color="var(--color-border)" style={{ marginBottom: '1rem' }} />
    <h3>{title}</h3>
    <p>{description}</p>
    {action && action}
  </div>
);

export const LoadingState = ({ message = 'Loading...' }) => (
  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
    <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid rgba(27, 44, 193, 0.2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
    <div>{message}</div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-error)' }}>
    <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
    <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Something went wrong</h3>
    <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>{message || 'Unable to load data.'}</p>
    {onRetry && <Button variant="outline" onClick={onRetry}>Try Again</Button>}
  </div>
);
