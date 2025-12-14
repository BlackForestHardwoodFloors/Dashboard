/**
 * Items Page - Boardroom 360
 * Inventory management for flooring materials
 */

import { useState } from 'react';
import { Search, Plus, Package, Box, AlertTriangle, DollarSign, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  supplier: string;
}

export default function ItemsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  const items: Item[] = [
    { id: '1', sku: 'HW-OAK-001', name: 'Red Oak Hardwood 3/4"', category: 'Hardwood', quantity: 1250, unit: 'sq ft', unitPrice: 8.50, reorderLevel: 500, supplier: 'Oak Valley Supplies' },
    { id: '2', sku: 'HW-WAL-001', name: 'Black Walnut Premium', category: 'Hardwood', quantity: 450, unit: 'sq ft', unitPrice: 12.00, reorderLevel: 300, supplier: 'Premium Woods Inc' },
    { id: '3', sku: 'FN-POLY-01', name: 'Polyurethane Finish (Satin)', category: 'Finishes', quantity: 24, unit: 'gallon', unitPrice: 65.00, reorderLevel: 10, supplier: 'Finish Pro Supply' },
    { id: '4', sku: 'FN-STAIN-05', name: 'Dark Walnut Stain', category: 'Finishes', quantity: 18, unit: 'gallon', unitPrice: 45.00, reorderLevel: 8, supplier: 'Finish Pro Supply' },
    { id: '5', sku: 'ACC-NAIL-01', name: 'Flooring Nails 2"', category: 'Accessories', quantity: 50, unit: 'box', unitPrice: 25.00, reorderLevel: 20, supplier: 'Hardware Direct' },
    { id: '6', sku: 'HW-MAP-001', name: 'Maple Select Grade', category: 'Hardwood', quantity: 180, unit: 'sq ft', unitPrice: 9.25, reorderLevel: 400, supplier: 'Oak Valley Supplies' },
  ];

  const categories = ['all', 'Hardwood', 'Finishes', 'Accessories'];
  const filteredItems = items.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const lowStockItems = items.filter(i => i.quantity <= i.reorderLevel).length;
  const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      <SidebarEnhanced activePage="Items" darkMode={darkMode} onNavigate={onNavigate} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div style={{ marginLeft: '220px', flex: 1, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>Items & Inventory</h1>
            <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>Manage your flooring materials and supplies</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: accentColor, border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#FFFFFF' }}>
            <Plus style={{ width: '18px', height: '18px' }} /> Add Item
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Items', value: items.length, icon: Package, color: accentColor },
            { label: 'Low Stock', value: lowStockItems, icon: AlertTriangle, color: '#EF5350' },
            { label: 'Categories', value: categories.length - 1, icon: Box, color: '#42A5F5' },
            { label: 'Inventory Value', value: `$${(totalValue/1000).toFixed(1)}k`, icon: DollarSign, color: '#66BB6A' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: '24px', height: '24px', color: stat.color }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 4px 0' }}>{stat.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: textColor, margin: 0 }}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                backgroundColor: categoryFilter === cat ? accentColor : (darkMode ? '#3D3D3D' : '#F5F5F5'),
                color: categoryFilter === cat ? '#FFFFFF' : textMuted,
                fontSize: '13px', fontWeight: '500', cursor: 'pointer', textTransform: 'capitalize'
              }}>
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: darkMode ? '#3D3D3D' : '#F5F5F5', borderRadius: '8px', padding: '8px 12px', width: '280px' }}>
            <Search style={{ width: '18px', height: '18px', color: textMuted }} />
            <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: textColor, fontSize: '14px' }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 100px 100px 100px 80px', padding: '16px 20px', backgroundColor: darkMode ? '#252525' : '#FAFAFA', borderBottom: `1px solid ${borderColor}`, gap: '16px' }}>
            {['SKU', 'Item Name', 'Category', 'Qty', 'Unit Price', 'Total', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: '12px', fontWeight: '600', color: textMuted, textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>
          {filteredItems.map((item, i) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 100px 100px 100px 80px', padding: '16px 20px', borderBottom: i < filteredItems.length - 1 ? `1px solid ${borderColor}` : 'none', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: accentColor }}>{item.sku}</span>
              <div>
                <p style={{ fontSize: '14px', color: textColor, margin: 0 }}>{item.name}</p>
                <p style={{ fontSize: '12px', color: textMuted, margin: '2px 0 0 0' }}>{item.supplier}</p>
              </div>
              <span style={{ fontSize: '13px', color: textMuted }}>{item.category}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px', color: item.quantity <= item.reorderLevel ? '#EF5350' : textColor, fontWeight: '500' }}>{item.quantity}</span>
                <span style={{ fontSize: '12px', color: textMuted }}>{item.unit}</span>
                {item.quantity <= item.reorderLevel && <AlertTriangle style={{ width: '14px', height: '14px', color: '#EF5350' }} />}
              </div>
              <span style={{ fontSize: '14px', color: textMuted }}>${item.unitPrice.toFixed(2)}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#66BB6A' }}>${(item.quantity * item.unitPrice).toLocaleString()}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}><Edit style={{ width: '16px', height: '16px', color: textMuted }} /></button>
                <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}><MoreVertical style={{ width: '16px', height: '16px', color: textMuted }} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
