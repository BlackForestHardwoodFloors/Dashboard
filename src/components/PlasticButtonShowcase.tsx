import { PlasticButton } from './PlasticButton';
import {
  Home, Calendar, UserCircle, FileText, FileSignature,
  ClipboardList, Briefcase, Clock3, MessageSquare, Camera,
  Download, Save, Trash2, Check, X, Plus, ArrowRight
} from 'lucide-react';

export function PlasticButtonShowcase() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
      padding: '48px 32px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '48px',
            color: '#ffffff',
            margin: '0 0 16px 0',
            fontWeight: 700
          }}>
            Boardroom 360 Button System
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#a0a0a0',
            margin: 0
          }}>
            Realistic Plastic 3D Buttons with Glossy Finish
          </p>
        </div>

        {/* All Button Variants Grid */}
        <div style={{
          background: '#2d2d2d',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #3d3d3d'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#ffffff',
            margin: '0 0 32px 0',
            fontWeight: 600
          }}>
            All Button Variants
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Dashboard (Amber)</p>
              <PlasticButton variant="dashboard" icon={<Home />}>
                Dashboard
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Calendar (Teal)</p>
              <PlasticButton variant="calendar" icon={<Calendar />}>
                Calendar
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Client (Sage)</p>
              <PlasticButton variant="client" icon={<UserCircle />}>
                Client
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Quotes (Olive)</p>
              <PlasticButton variant="quotes" icon={<FileText />}>
                Quotes
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Contracts (Forest)</p>
              <PlasticButton variant="contracts" icon={<FileSignature />}>
                Contracts
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Jobs (Dark Olive)</p>
              <PlasticButton variant="jobs" icon={<ClipboardList />}>
                Jobs
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Work Orders (Teal Gray)</p>
              <PlasticButton variant="workOrders" icon={<Briefcase />}>
                Work Orders
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Time Sheet (Coral)</p>
              <PlasticButton variant="timeSheet" icon={<Clock3 />}>
                Time Sheet
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Messages (Plum)</p>
              <PlasticButton variant="messages" icon={<MessageSquare />}>
                Messages
              </PlasticButton>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Photos (CompanyCam Blue)</p>
              <PlasticButton variant="photos" icon={<Camera />}>
                Photos
              </PlasticButton>
            </div>
          </div>
        </div>

        {/* Size Variations */}
        <div style={{
          background: '#2d2d2d',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #3d3d3d'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#ffffff',
            margin: '0 0 32px 0',
            fontWeight: 600
          }}>
            Size Variations
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Small (36px)</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <PlasticButton variant="dashboard" size="small" icon={<Save />}>
                  Save
                </PlasticButton>
                <PlasticButton variant="calendar" size="small" icon={<Download />}>
                  Download
                </PlasticButton>
                <PlasticButton variant="client" size="small" icon={<Plus />}>
                  Add New
                </PlasticButton>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Medium (48px) - Default</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <PlasticButton variant="quotes" size="medium" icon={<Check />}>
                  Approve Quote
                </PlasticButton>
                <PlasticButton variant="contracts" size="medium" icon={<FileSignature />}>
                  Sign Contract
                </PlasticButton>
                <PlasticButton variant="jobs" size="medium" icon={<ArrowRight />}>
                  Start Job
                </PlasticButton>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '12px' }}>Large (56px)</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <PlasticButton variant="timeSheet" size="large" icon={<Clock3 />}>
                  Clock In Now
                </PlasticButton>
                <PlasticButton variant="photos" size="large" icon={<Camera />}>
                  Take Photo
                </PlasticButton>
              </div>
            </div>
          </div>
        </div>

        {/* With/Without Icons */}
        <div style={{
          background: '#2d2d2d',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #3d3d3d'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#ffffff',
            margin: '0 0 32px 0',
            fontWeight: 600
          }}>
            With & Without Icons
          </h2>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <PlasticButton variant="dashboard" icon={<Home />}>
              With Icon
            </PlasticButton>
            <PlasticButton variant="calendar">
              Without Icon
            </PlasticButton>
            <PlasticButton variant="client" icon={<UserCircle />}>
              View Client Profile
            </PlasticButton>
            <PlasticButton variant="quotes">
              Create New Quote
            </PlasticButton>
          </div>
        </div>

        {/* Full Width Buttons */}
        <div style={{
          background: '#2d2d2d',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #3d3d3d'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#ffffff',
            margin: '0 0 32px 0',
            fontWeight: 600
          }}>
            Full Width Buttons
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <PlasticButton variant="contracts" fullWidth icon={<FileSignature />}>
              Sign & Submit Contract
            </PlasticButton>
            <PlasticButton variant="jobs" fullWidth icon={<ClipboardList />}>
              Create New Job
            </PlasticButton>
            <PlasticButton variant="photos" fullWidth size="large" icon={<Camera />}>
              Open Camera System
            </PlasticButton>
          </div>
        </div>

        {/* Disabled State */}
        <div style={{
          background: '#2d2d2d',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid #3d3d3d'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#ffffff',
            margin: '0 0 32px 0',
            fontWeight: 600
          }}>
            Disabled State
          </h2>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <PlasticButton variant="dashboard" disabled icon={<Home />}>
              Dashboard
            </PlasticButton>
            <PlasticButton variant="calendar" disabled icon={<Calendar />}>
              Calendar
            </PlasticButton>
            <PlasticButton variant="client" disabled icon={<UserCircle />}>
              Client
            </PlasticButton>
            <PlasticButton variant="quotes" disabled>
              Disabled Button
            </PlasticButton>
          </div>
        </div>

        {/* Action Buttons Group */}
        <div style={{
          background: '#2d2d2d',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid #3d3d3d'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#ffffff',
            margin: '0 0 32px 0',
            fontWeight: 600
          }}>
            Common Action Groups
          </h2>
          
          {/* Primary Actions */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '16px', color: '#ffffff', marginBottom: '16px', fontWeight: 600 }}>
              Primary Actions
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <PlasticButton variant="client" icon={<Plus />}>
                New Client
              </PlasticButton>
              <PlasticButton variant="quotes" icon={<FileText />}>
                New Quote
              </PlasticButton>
              <PlasticButton variant="contracts" icon={<FileSignature />}>
                New Contract
              </PlasticButton>
              <PlasticButton variant="jobs" icon={<ClipboardList />}>
                New Job
              </PlasticButton>
            </div>
          </div>

          {/* Approval Actions */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '16px', color: '#ffffff', marginBottom: '16px', fontWeight: 600 }}>
              Approval Actions
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <PlasticButton variant="client" icon={<Check />}>
                Approve
              </PlasticButton>
              <PlasticButton variant="timeSheet" icon={<X />}>
                Reject
              </PlasticButton>
            </div>
          </div>

          {/* Media Actions */}
          <div>
            <p style={{ fontSize: '16px', color: '#ffffff', marginBottom: '16px', fontWeight: 600 }}>
              Media & Communication
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <PlasticButton variant="photos" icon={<Camera />}>
                Take Photo
              </PlasticButton>
              <PlasticButton variant="messages" icon={<MessageSquare />}>
                Send Message
              </PlasticButton>
              <PlasticButton variant="calendar" icon={<Calendar />}>
                Schedule
              </PlasticButton>
            </div>
          </div>
        </div>

        {/* Interactive Demo Note */}
        <div style={{
          background: 'linear-gradient(135deg, #4F6A41 0%, #55624C 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '32px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '16px',
            color: 'white',
            margin: 0,
            fontWeight: 500
          }}>
            💡 <strong>Try it!</strong> Hover over any button to see the glossy highlight effect. 
            Click and hold to see the pressed/active state with inset shadow.
          </p>
        </div>
      </div>
    </div>
  );
}