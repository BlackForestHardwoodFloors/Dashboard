import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Send, Save, ChevronRight, Calendar, Check, Clock, FileText, PenTool } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

interface ChangeOrderItem {
  id: string;
  description: string;
  amount: number;
}

interface ChangeOrder {
  id: string;
  changeOrderDate: string;
  items: ChangeOrderItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'signed' | 'approved';
  notes: string;
  signature?: string;
  signedDate?: string;
}

interface ChangeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobName: string;
  clientName: string;
  clientPhone?: string;
  clientCell?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  scheduledDate?: string;
}

// Mock existing change orders for demo
const mockChangeOrders: ChangeOrder[] = [
  {
    id: 'co-1',
    changeOrderDate: '2024-11-18',
    items: [{ id: '1', description: 'Add master bedroom to refinish scope', amount: 850 }],
    totalAmount: 850,
    status: 'signed',
    notes: 'Customer requested additional room',
    signature: 'Linda Muir',
    signedDate: '2024-11-18'
  },
  {
    id: 'co-2',
    changeOrderDate: '2024-11-19',
    items: [{ id: '1', description: 'Custom jacobean stain upgrade', amount: 275 }],
    totalAmount: 275,
    status: 'pending',
    notes: 'Upgraded from natural to jacobean stain',
  },
];

export function ChangeOrderModal({
  isOpen,
  onClose,
  jobName,
  clientName,
  clientPhone = '',
  clientCell = '',
  address,
  city = '',
  state = '',
  zip = '',
  scheduledDate = '',
}: ChangeOrderModalProps) {
  const { colors } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // View state: 'list' shows all change orders, 'edit' shows form
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingOrder, setEditingOrder] = useState<ChangeOrder | null>(null);
  
  // Existing change orders
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(mockChangeOrders);
  
  // Form state for new/editing order
  const [changeOrderDate, setChangeOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<ChangeOrderItem[]>([
    { id: '1', description: '', amount: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (view === 'edit' && canvasRef.current && signatureMethod === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        // Draw signature line
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, canvas.height - 30);
        ctx.lineTo(canvas.width - 20, canvas.height - 30);
        ctx.stroke();
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
      }
    }
  }, [view, signatureMethod]);

  if (!isOpen) return null;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', amount: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: 'description' | 'amount', value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalBeforeTax = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  const startNewOrder = () => {
    setEditingOrder(null);
    setChangeOrderDate(new Date().toISOString().split('T')[0]);
    setItems([{ id: '1', description: '', amount: 0 }]);
    setNotes('');
    setHasSignature(false);
    setSignatureMethod('draw');
    setTypedSignature('');
    setAgreedToTerms(false);
    setView('edit');
  };

  const editOrder = (order: ChangeOrder) => {
    setEditingOrder(order);
    setChangeOrderDate(order.changeOrderDate);
    setItems(order.items);
    setNotes(order.notes);
    setHasSignature(!!order.signature);
    setSignatureMethod('draw');
    setTypedSignature(order.signature || '');
    setAgreedToTerms(!!order.signature);
    setView('edit');
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (signatureMethod === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Redraw signature line
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, canvas.height - 30);
      ctx.lineTo(canvas.width - 20, canvas.height - 30);
      ctx.stroke();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
    } else {
      setTypedSignature('');
    }
    setHasSignature(false);
  };

  const isSignatureComplete = () => {
    if (signatureMethod === 'type') {
      return typedSignature.trim().length > 0;
    }
    return hasSignature;
  };

  const handleSubmit = () => {
    const signed = isSignatureComplete() && agreedToTerms;
    const signatureName = signatureMethod === 'type' ? typedSignature : clientName;
    
    const newOrder: ChangeOrder = {
      id: editingOrder?.id || `co-${Date.now()}`,
      changeOrderDate,
      items,
      totalAmount: totalBeforeTax,
      status: signed ? 'signed' : 'pending',
      notes,
      signature: signed ? signatureName : undefined,
      signedDate: signed ? new Date().toISOString().split('T')[0] : undefined,
    };
    
    if (editingOrder) {
      setChangeOrders(changeOrders.map(co => co.id === editingOrder.id ? newOrder : co));
    } else {
      setChangeOrders([...changeOrders, newOrder]);
    }
    
    console.log('Change Order Saved:', newOrder);
    setView('list');
  };

  const handleSendToClient = () => {
    console.log('Sending to client for signature...');
    handleSubmit();
  };

  const getStatusColor = (status: ChangeOrder['status']) => {
    switch (status) {
      case 'draft': return '#666';
      case 'pending': return '#FBBF24';
      case 'signed': return '#4F6A41';
      case 'approved': return '#22C55E';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: ChangeOrder['status']) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'pending': return 'Awaiting Signature';
      case 'signed': return 'Signed';
      case 'approved': return 'Approved';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#6B5D4F',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {view === 'edit' && (
              <button
                onClick={() => setView('list')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ← Back
              </button>
            )}
            <div>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0 }}>
                {view === 'list' ? 'Change Orders' : (editingOrder ? 'Edit Change Order' : 'New Change Order')}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '4px 0 0 0' }}>
                {jobName} • {clientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color="#fff" />
          </button>
        </div>

        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
              {/* Job Info Summary */}
              <div style={{
                backgroundColor: colors.background,
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px',
              }}>
                <p style={{ color: colors.textSecondary, fontSize: '12px', margin: 0 }}>
                  {address}
                </p>
                <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '2px 0 0 0' }}>
                  {city}{city && state ? ', ' : ''}{state} {zip}
                </p>
              </div>

              {/* Change Orders List */}
              {changeOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <FileText size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: '16px' }} />
                  <p style={{ color: colors.textSecondary, fontSize: '15px', margin: 0 }}>
                    No change orders yet
                  </p>
                  <p style={{ color: colors.textSecondary, fontSize: '13px', margin: '8px 0 0 0', opacity: 0.7 }}>
                    Create one to track additional work requests
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {changeOrders.map((order, index) => (
                    <div
                      key={order.id}
                      onClick={() => editOrder(order)}
                      style={{
                        backgroundColor: colors.background,
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        border: `1px solid ${colors.border}`,
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ color: colors.text, fontSize: '15px', fontWeight: '600' }}>
                              Change Order #{index + 1}
                            </span>
                            <span style={{
                              backgroundColor: getStatusColor(order.status),
                              color: '#fff',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={12} color={colors.textSecondary} />
                            <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
                              {formatDate(order.changeOrderDate)}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ color: colors.text, fontSize: '18px', fontWeight: '700' }}>
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '10px' }}>
                        {order.items.slice(0, 2).map((item, i) => (
                          <p key={i} style={{ 
                            color: colors.textSecondary, 
                            fontSize: '13px', 
                            margin: i === 0 ? 0 : '4px 0 0 0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            • {item.description || 'No description'}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p style={{ color: colors.textSecondary, fontSize: '12px', margin: '4px 0 0 0', opacity: 0.7 }}>
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>

                      {order.signature && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          marginTop: '10px',
                          paddingTop: '10px',
                          borderTop: `1px solid ${colors.border}`,
                        }}>
                          <Check size={14} color="#4F6A41" />
                          <span style={{ color: '#4F6A41', fontSize: '12px' }}>
                            Signed by {order.signature} on {formatDate(order.signedDate!)}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <ChevronRight size={18} color={colors.textSecondary} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* New Change Order Button */}
            <div style={{
              padding: '16px 20px',
              borderTop: `1px solid ${colors.border}`,
            }}>
              <button
                onClick={startNewOrder}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#6B5D4F',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Plus size={20} />
                New Change Order
              </button>
            </div>
          </>
        )}

        {/* EDIT VIEW */}
        {view === 'edit' && (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
              {/* Change Order Date */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  color: colors.textSecondary, 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Change Order Date
                </label>
                <input
                  type="date"
                  value={changeOrderDate}
                  onChange={(e) => setChangeOrderDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.background,
                    color: colors.text,
                    fontSize: '15px',
                  }}
                />
              </div>

              {/* Client Info Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                backgroundColor: colors.background,
                borderRadius: '12px',
                padding: '14px',
              }}>
                <div>
                  <label style={{ color: colors.textSecondary, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                    Submitted To
                  </label>
                  <p style={{ color: colors.text, fontSize: '15px', margin: '4px 0 0 0', fontWeight: '600' }}>
                    {clientName}
                  </p>
                </div>
                <div>
                  <label style={{ color: colors.textSecondary, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                    Phone
                  </label>
                  <p style={{ color: colors.text, fontSize: '15px', margin: '4px 0 0 0' }}>
                    {clientPhone || clientCell || '—'}
                  </p>
                </div>
              </div>

              {/* Change Order Items */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  color: colors.text, 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  Work to add or change:
                </label>
                
                {items.map((item, index) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '10px',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{ flex: 1 }}>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description of work..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: `1px solid ${colors.border}`,
                          backgroundColor: colors.background,
                          color: colors.text,
                          fontSize: '14px',
                          resize: 'vertical',
                          minHeight: '60px',
                        }}
                      />
                    </div>
                    <div style={{ width: '100px' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: colors.textSecondary,
                          fontSize: '14px',
                        }}>$</span>
                        <input
                          type="number"
                          value={item.amount || ''}
                          onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          style={{
                            width: '100%',
                            padding: '12px 12px 12px 24px',
                            borderRadius: '8px',
                            border: `1px solid ${colors.border}`,
                            backgroundColor: colors.background,
                            color: colors.text,
                            fontSize: '14px',
                            textAlign: 'right',
                          }}
                        />
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(220, 38, 38, 0.1)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={18} color="#DC2626" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: `1px dashed ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.textSecondary,
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={18} />
                  Add Item
                </button>
              </div>

              {/* Total */}
              <div style={{
                backgroundColor: '#6B5D4F',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>
                    Total before tax:
                  </span>
                  <span style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>
                    ${totalBeforeTax.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  color: colors.textSecondary, 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.background,
                    color: colors.text,
                    fontSize: '14px',
                    resize: 'vertical',
                    minHeight: '60px',
                  }}
                />
              </div>

              {/* Signature Section - Adobe Sign Style */}
              <div style={{ 
                marginBottom: '20px',
                backgroundColor: '#F7F9FC',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #E1E5EB',
              }}>
                {/* Header with icon */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #E1E5EB',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#0066CC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <PenTool size={18} color="#fff" />
                  </div>
                  <div>
                    <h4 style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: '700', margin: 0 }}>
                      Sign Document
                    </h4>
                    <p style={{ color: '#666', fontSize: '12px', margin: '2px 0 0 0' }}>
                      Please sign below to accept this change order
                    </p>
                  </div>
                </div>

                {/* Signature Method Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  <button
                    onClick={() => setSignatureMethod('draw')}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: signatureMethod === 'draw' ? '#0066CC' : '#fff',
                      border: `1px solid ${signatureMethod === 'draw' ? '#0066CC' : '#D1D5DB'}`,
                      borderRadius: '8px',
                      color: signatureMethod === 'draw' ? '#fff' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <PenTool size={16} />
                    Draw
                  </button>
                  <button
                    onClick={() => setSignatureMethod('type')}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: signatureMethod === 'type' ? '#0066CC' : '#fff',
                      border: `1px solid ${signatureMethod === 'type' ? '#0066CC' : '#D1D5DB'}`,
                      borderRadius: '8px',
                      color: signatureMethod === 'type' ? '#fff' : '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    ✎ Type
                  </button>
                </div>

                {/* Draw Signature */}
                {signatureMethod === 'draw' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      border: '2px solid #D1D5DB',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      position: 'relative',
                    }}>
                      {/* Sign Here indicator */}
                      {!hasSignature && (
                        <div style={{
                          position: 'absolute',
                          left: '20px',
                          bottom: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#9CA3AF',
                          fontSize: '14px',
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}>
                          <span style={{ fontSize: '20px', color: '#0066CC' }}>✕</span>
                          <span>Sign here</span>
                        </div>
                      )}
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={150}
                        style={{
                          width: '100%',
                          height: '150px',
                          cursor: 'crosshair',
                          touchAction: 'none',
                        }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                    </div>
                    {hasSignature && (
                      <button
                        onClick={clearSignature}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '6px 12px',
                          backgroundColor: '#fff',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          color: '#374151',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}

                {/* Type Signature */}
                {signatureMethod === 'type' && (
                  <div>
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => {
                        setTypedSignature(e.target.value);
                        setHasSignature(e.target.value.trim().length > 0);
                      }}
                      placeholder="Type your full name"
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '2px solid #D1D5DB',
                        backgroundColor: '#fff',
                        color: '#1A1A1A',
                        fontSize: '16px',
                        marginBottom: '12px',
                      }}
                    />
                    {typedSignature && (
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#fff',
                        border: '2px solid #D1D5DB',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}>
                        <p style={{ 
                          color: '#1A1A1A', 
                          fontSize: '28px', 
                          fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                          fontStyle: 'italic',
                          margin: 0,
                          borderBottom: '1px solid #9CA3AF',
                          paddingBottom: '8px',
                          display: 'inline-block',
                        }}>
                          {typedSignature}
                        </p>
                        <p style={{ color: '#6B7280', fontSize: '11px', margin: '8px 0 0 0' }}>
                          Signature preview
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Agreement Checkbox */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginTop: '16px',
                  cursor: 'pointer',
                  padding: '12px',
                  backgroundColor: agreedToTerms ? 'rgba(0, 102, 204, 0.05)' : '#fff',
                  borderRadius: '8px',
                  border: `1px solid ${agreedToTerms ? '#0066CC' : '#E1E5EB'}`,
                }}>
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: '#0066CC',
                      cursor: 'pointer',
                      marginTop: '2px',
                    }}
                  />
                  <span style={{ color: '#374151', fontSize: '13px', lineHeight: '1.5' }}>
                    I agree to the terms stated above. By signing, I acknowledge that this change order 
                    will become part of the original contract and I authorize Black Forest Hardwood Floors, LLC 
                    to perform the additional work at the stated price.
                  </span>
                </label>

                {/* Signature Status */}
                {isSignatureComplete() && agreedToTerms && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#ECFDF5',
                    borderRadius: '8px',
                    border: '1px solid #A7F3D0',
                  }}>
                    <Check size={18} color="#059669" />
                    <span style={{ color: '#059669', fontSize: '13px', fontWeight: '600' }}>
                      Signature complete - ready to submit
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{
              padding: '16px 20px',
              borderTop: `1px solid ${colors.border}`,
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  color: colors.text,
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={handleSendToClient}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#6B5D4F',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Send size={18} />
                Send to Client
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChangeOrderModal;
