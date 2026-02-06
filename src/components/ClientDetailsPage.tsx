
import React, { useState } from 'react';

interface ClientDetailsPageProps {
  clientId?: number;
  showSidebar?: boolean;
  clients?: any[];
  onNavigate?: (page: string) => void;
}

/**
 * ClientDetailsPage
 * High-contrast Boardroom styling
 * Designed to live INSIDE BoardroomModal (no overlay, no positioning)
 */
const ClientDetailsPage: React.FC<ClientDetailsPageProps> = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  // Boardroom tokens (high contrast)
  const card = '#2A2A2A';
  const border = '#3F3F3F';
  const textPrimary = '#F5F5F5';
  const textSecondary = '#CFCFCF';
  const accent = '#D4A63A';

  const tabs = [
    'Overview',
    'Contacts',
    'Properties',
    'Jobs & Quotes',
    'Communication',
    'Files & Photos',
    'Billing',
  ];

  return (
    <div style={{ padding: 28, color: textPrimary }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
          Sarah & Tom Williams
        </h1>
        <div style={{ color: textSecondary, marginTop: 6 }}>
          Homeowner · Lead · #Price Sensitive
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 28,
          borderBottom: `1px solid ${border}`,
          marginBottom: 26,
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              paddingBottom: 12,
              cursor: 'pointer',
              fontWeight: 700,
              color: activeTab === tab ? accent : textSecondary,
              borderBottom:
                activeTab === tab ? `2px solid ${accent}` : 'none',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 26,
          }}
        >
          {/* Account Summary */}
          <div
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 16,
              padding: 26,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 18 }}>
              Account Summary
            </h3>

            {[
              ['Account Type', 'Homeowner'],
              ['Status', 'Lead'],
              ['Lead Source', 'Google Ads'],
              ['Assigned Manager', 'Sarah Williams'],
              ['Last Activity', 'Quote declined – 1 week ago'],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                  fontSize: 15,
                }}
              >
                <span style={{ color: textSecondary }}>{label}</span>
                <span style={{ fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Primary Contact */}
          <div
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 16,
              padding: 26,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 18 }}>
              Primary Contact
            </h3>

            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
              Sarah Williams
            </div>
            <div style={{ color: textSecondary, marginBottom: 16 }}>
              Homeowner
            </div>

            <div style={{ marginBottom: 10, fontWeight: 700 }}>
              📞 (509) 555-0789
            </div>
            <div style={{ fontWeight: 700 }}>
              ✉️ sarah.williams@email.com
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailsPage;
