import { useState } from 'react';
import { Wrench, Package, ChevronLeft, Send, AlertCircle } from 'lucide-react';

interface Request {
  id: string;
  type: 'equipment' | 'materials';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  status: 'pending' | 'acknowledged' | 'completed';
  jobName?: string;
}

export function RequestsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [requestType, setRequestType] = useState<'equipment' | 'materials' | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  const [submittedRequests, setSubmittedRequests] = useState<Request[]>([]);

  const handleSubmit = () => {
    if (!requestType || !formData.title || !formData.description) return;

    const newRequest: Request = {
      id: Date.now().toString(),
      type: requestType,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      timestamp: new Date().toISOString(),
      status: 'pending',
      jobName: 'Anderson Residence'
    };

    setSubmittedRequests([newRequest, ...submittedRequests]);
    
    // Store in localStorage for dashboard to access
    const existingRequests = JSON.parse(localStorage.getItem('employee-requests') || '[]');
    localStorage.setItem('employee-requests', JSON.stringify([newRequest, ...existingRequests]));

    // Reset form
    setFormData({ title: '', description: '', priority: 'medium' });
    setRequestType(null);
    setShowForm(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'acknowledged': return '#3B82F6';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  if (showForm && requestType) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        paddingBottom: '100px'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
          padding: '20px',
          borderBottom: '1px solid #2A2A2A'
        }}>
          <button
            onClick={() => {
              setShowForm(false);
              setRequestType(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4F6A41',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <ChevronLeft size={24} />
            Back
          </button>
          <h1 style={{
            color: 'white',
            margin: 0,
            fontSize: '24px',
            fontWeight: '600'
          }}>
            {requestType === 'equipment' ? 'Equipment Repair Request' : 'Material Order Request'}
          </h1>
        </div>

        {/* Form */}
        <div style={{ padding: '20px' }}>
          {/* Title Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#9CA3AF',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {requestType === 'equipment' ? 'Equipment Name' : 'Material/Item Name'}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={requestType === 'equipment' ? 'e.g., Floor Sander' : 'e.g., Red Oak Flooring'}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#9CA3AF',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {requestType === 'equipment' ? 'Issue Description' : 'Details & Quantity'}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={requestType === 'equipment' 
                ? 'Describe the problem in detail...' 
                : 'Quantity needed, specifications, etc...'}
              rows={5}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Priority */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#9CA3AF',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Priority Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setFormData({ ...formData, priority })}
                  style={{
                    padding: '12px',
                    backgroundColor: formData.priority === priority ? getPriorityColor(priority) : '#1A1A1A',
                    border: `2px solid ${formData.priority === priority ? getPriorityColor(priority) : '#2A2A2A'}`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s'
                  }}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.description}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: formData.title && formData.description ? '#4F6A41' : '#2A2A2A',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: formData.title && formData.description ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: formData.title && formData.description ? 1 : 0.5
            }}
          >
            <Send size={20} />
            Submit Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
        padding: '20px',
        borderBottom: '1px solid #2A2A2A'
      }}>
        <h1 style={{
          color: 'white',
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Requests
        </h1>
        <p style={{
          color: '#9CA3AF',
          margin: 0,
          fontSize: '14px'
        }}>
          Report equipment issues or request materials
        </p>
      </div>

      {/* Request Type Selection */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Equipment Repair */}
          <button
            onClick={() => {
              setRequestType('equipment');
              setShowForm(true);
            }}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            <Wrench size={32} color="white" style={{ marginBottom: '12px' }} />
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              Equipment Repair
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '12px'
            }}>
              Report broken tools
            </div>
          </button>

          {/* Material Order */}
          <button
            onClick={() => {
              setRequestType('materials');
              setShowForm(true);
            }}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #4F6A41 0%, #3D5233 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 106, 65, 0.3)'
            }}
          >
            <Package size={32} color="white" style={{ marginBottom: '12px' }} />
            <div style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              Order Materials
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '12px'
            }}>
              Request supplies
            </div>
          </button>
        </div>

        {/* Recent Requests */}
        <div>
          <h2 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            Recent Requests
          </h2>

          {submittedRequests.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#1A1A1A',
              borderRadius: '16px',
              border: '1px solid #2A2A2A'
            }}>
              <AlertCircle size={48} color="#4B5563" style={{ margin: '0 auto 16px' }} />
              <p style={{
                color: '#9CA3AF',
                margin: 0,
                fontSize: '14px'
              }}>
                No requests submitted yet
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {submittedRequests.map((request) => (
                <div
                  key={request.id}
                  style={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '16px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: request.type === 'equipment' ? '#DC2626' : '#4F6A41',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {request.type === 'equipment' ? (
                        <Wrench size={20} color="white" />
                      ) : (
                        <Package size={20} color="white" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {request.title}
                      </div>
                      <div style={{
                        color: '#9CA3AF',
                        fontSize: '14px',
                        marginBottom: '8px'
                      }}>
                        {request.description}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 10px',
                          backgroundColor: getPriorityColor(request.priority) + '20',
                          color: getPriorityColor(request.priority),
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {request.priority}
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          backgroundColor: getStatusColor(request.status) + '20',
                          color: getStatusColor(request.status),
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    color: '#6B7280',
                    fontSize: '12px'
                  }}>
                    {new Date(request.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
