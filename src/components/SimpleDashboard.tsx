import { useState } from 'react';
import { Home, Calendar, UserCircle, Settings, Moon, Sun } from 'lucide-react';

export function SimpleDashboard() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: darkMode ? '#1E1E1E' : '#F5F5F5' 
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: '96px', 
        backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
        borderRight: '1px solid #3D3D3D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 0',
        gap: '12px'
      }}>
        {/* Menu Buttons */}
        <button style={{
          width: '56px',
          height: '56px',
          backgroundColor: '#D4A024',
          border: 'none',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Home style={{ width: '24px', height: '24px', color: 'white' }} />
        </button>

        <button style={{
          width: '56px',
          height: '56px',
          backgroundColor: '#42A5F5',
          border: 'none',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Calendar style={{ width: '24px', height: '24px', color: 'white' }} />
        </button>

        <button style={{
          width: '56px',
          height: '56px',
          backgroundColor: '#66BB6A',
          border: 'none',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <UserCircle style={{ width: '24px', height: '24px', color: 'white' }} />
        </button>

        <button style={{
          width: '56px',
          height: '56px',
          backgroundColor: '#78909C',
          border: 'none',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Settings style={{ width: '24px', height: '24px', color: 'white' }} />
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: darkMode ? '#3D3D3D' : '#E5E5E5',
            border: 'none',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          {darkMode ? (
            <Moon style={{ width: '20px', height: '20px', color: 'white' }} />
          ) : (
            <Sun style={{ width: '20px', height: '20px', color: '#666666' }} />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '32px',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold',
            color: darkMode ? '#FFFFFF' : '#1E1E1E',
            margin: '0 0 8px 0'
          }}>
            Boardroom 360 Dashboard
          </h1>
          <p style={{ 
            fontSize: '14px',
            color: darkMode ? '#A0A0A0' : '#666666',
            margin: 0
          }}>
            Admin Portal
          </p>
        </div>

        {/* Photo Section */}
        <div style={{
          backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: darkMode ? '1px solid #3D3D3D' : '1px solid #E5E5E5'
        }}>
          <h2 style={{ 
            fontSize: '20px',
            color: darkMode ? '#FFFFFF' : '#1E1E1E',
            margin: '0 0 16px 0'
          }}>
            Recent Job Photos
          </h2>
          <div style={{
            width: '100%',
            height: '240px',
            backgroundColor: darkMode ? '#1E1E1E' : '#F5F5F5',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: darkMode ? '#A0A0A0' : '#666666'
          }}>
            <div>Photo Carousel</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: darkMode ? '1px solid #3D3D3D' : '1px solid #E5E5E5'
          }}>
            <div style={{ 
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#66BB6A',
              marginBottom: '8px'
            }}>
              $284k
            </div>
            <p style={{ 
              fontSize: '14px',
              color: darkMode ? '#A0A0A0' : '#666666',
              margin: 0
            }}>
              Monthly Revenue
            </p>
          </div>

          <div style={{
            backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: darkMode ? '1px solid #3D3D3D' : '1px solid #E5E5E5'
          }}>
            <div style={{ 
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#FFA726',
              marginBottom: '8px'
            }}>
              $42k
            </div>
            <p style={{ 
              fontSize: '14px',
              color: darkMode ? '#A0A0A0' : '#666666',
              margin: 0
            }}>
              Pending Invoices
            </p>
          </div>

          <div style={{
            backgroundColor: darkMode ? '#2D2D2D' : '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: darkMode ? '1px solid #3D3D3D' : '1px solid #E5E5E5'
          }}>
            <div style={{ 
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#42A5F5',
              marginBottom: '8px'
            }}>
              32
            </div>
            <p style={{ 
              fontSize: '14px',
              color: darkMode ? '#A0A0A0' : '#666666',
              margin: 0
            }}>
              Active Team Members
            </p>
          </div>
        </div>

        {/* Success Message */}
        <div style={{
          backgroundColor: '#4F6A41',
          color: 'white',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          ✅ Dashboard loaded successfully! All systems operational.
        </div>
      </div>
    </div>
  );
}
