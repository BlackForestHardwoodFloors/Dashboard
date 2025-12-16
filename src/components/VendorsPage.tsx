/**
 * Vendors Page - Boardroom 360
 */

import { useState } from 'react';
import { Search, Plus, Building2, Phone, Mail, MapPin, Star, MoreVertical, Eye, Edit } from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalOrders: number;
  status: 'active' | 'inactive';
}

export default function VendorsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  const vendors: Vendor[] = [
    { id: '1', name: 'Oak Valley Supplies', contact: 'Robert Johnson', email: 'robert@oakvalley.com', phone: '(555) 123-4567', address: '1234 Lumber Lane, Portland, OR', category: 'Hardwood', rating: 4.8, totalOrders: 156, status: 'active' },
    { id: '2', name: 'Premium Woods Inc', contact: 'Sarah Mitchell', email: 'sarah@premiumwoods.com', phone: '(555) 234-5678', address: '567 Forest Drive, Seattle, WA', category: 'Hardwood', rating: 4.5, totalOrders: 89, status: 'active' },
    { id: '3', name: 'Finish Pro Supply', contact: 'Mike Anderson', email: 'mike@finishpro.com', phone: '(555) 345-6789', address: '890 Industrial Blvd, Denver, CO', category: 'Finishes', rating: 4.9, totalOrders: 234, status: 'active' },
    { id: '4', name: 'Hardware Direct', contact: 'Lisa Chen', email: 'lisa@hardwaredirect.com', phone: '(555) 456-7890', address: '123 Tool Street, Phoenix, AZ', category: 'Accessories', rating: 4.2, totalOrders: 67, status: 'inactive' },
  ];

  const filteredVendors = vendors.filter(v => 
    !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      <SidebarEnhanced activePage="Vendors" darkMode={darkMode} onNavigate={onNavigate} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div style={{ marginLeft: '200px', flex: 1, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>Vendors</h1>
            <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>Manage your suppliers and vendor relationships</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: accentColor, border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#FFFFFF' }}>
            <Plus style={{ width: '18px', height: '18px' }} /> Add Vendor
          </button>
        </div>

        {/* Search */}
        <div style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5', borderRadius: '8px', padding: '10px 14px', maxWidth: '400px' }}>
            <Search style={{ width: '18px', height: '18px', color: textMuted }} />
            <input type="text" placeholder="Search vendors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: textColor, fontSize: '14px' }} />
          </div>
        </div>

        {/* Vendor Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {filteredVendors.map(vendor => (
            <div key={vendor.id} style={{
              backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${accentColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 style={{ width: '24px', height: '24px', color: accentColor }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: textColor, margin: 0 }}>{vendor.name}</h3>
                      <p style={{ fontSize: '13px', color: textMuted, margin: '2px 0 0 0' }}>{vendor.category}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: vendor.status === 'active' ? '#66BB6A20' : '#9E9E9E20', borderRadius: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '500', color: vendor.status === 'active' ? '#66BB6A' : '#9E9E9E', textTransform: 'capitalize' }}>{vendor.status}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail style={{ width: '14px', height: '14px', color: textMuted }} />
                    <span style={{ fontSize: '13px', color: textMuted }}>{vendor.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone style={{ width: '14px', height: '14px', color: textMuted }} />
                    <span style={{ fontSize: '13px', color: textMuted }}>{vendor.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin style={{ width: '14px', height: '14px', color: textMuted }} />
                    <span style={{ fontSize: '13px', color: textMuted }}>{vendor.address}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${borderColor}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star style={{ width: '16px', height: '16px', color: '#FFD700', fill: '#FFD700' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: textColor }}>{vendor.rating}</span>
                    <span style={{ fontSize: '12px', color: textMuted }}>({vendor.totalOrders} orders)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '8px 12px', backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye style={{ width: '14px', height: '14px', color: textMuted }} />
                      <span style={{ fontSize: '12px', color: textMuted }}>View</span>
                    </button>
                    <button style={{ padding: '8px 12px', backgroundColor: accentColor, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Edit style={{ width: '14px', height: '14px', color: '#FFFFFF' }} />
                      <span style={{ fontSize: '12px', color: '#FFFFFF' }}>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
