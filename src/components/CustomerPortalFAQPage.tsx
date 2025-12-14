import { useState } from 'react';
import { 
  ChevronDown, 
  Calendar, 
  MessageCircle, 
  FileText, 
  CheckSquare, 
  Camera, 
  CreditCard,
  Home,
  ChevronRight
} from 'lucide-react';

// ========================================
// TYPES
// ========================================

type FAQSection = 'before' | 'during' | 'after';

interface FAQItem {
  question: string;
  answer: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

// ========================================
// FAQ DATA
// ========================================

const beforeProjectFAQs: FAQItem[] = [
  {
    question: "What happens after I approve my quote and contract?",
    answer: "Once you approve your quote, your project is officially scheduled. Your customer portal unlocks all tools — calendar dates, prep checklist, message center, and photo updates.",
    icon: CheckSquare
  },
  {
    question: "Do I need to prepare my home before the crew arrives?",
    answer: "Yes. You'll receive a Jobsite Readiness Checklist to review and digitally sign. It covers furniture, access, pets, electrical needs, and any project-specific prep.",
    icon: Home
  },
  {
    question: "How will I know when my job is scheduled?",
    answer: "Your portal will show all dates, and you'll receive a text and email confirmation. You can request changes inside the portal.",
    icon: Calendar
  },
  {
    question: "Can I upload photos or files before the job starts?",
    answer: "Yes — you can upload measurements, inspiration photos, or problem-area pictures. These help the team prepare.",
    icon: Camera
  },
  {
    question: "How do I communicate with the office before the project begins?",
    answer: "Use the Message Center. You can message the office or your project lead directly.",
    icon: MessageCircle
  },
  {
    question: "Will I know who's coming to my home?",
    answer: "Yes. Under 'Your Crew' you'll see headshots, bios, skill levels, and certifications.",
    icon: FileText
  }
];

const duringProjectFAQs: FAQItem[] = [
  {
    question: "How will I receive day-to-day updates?",
    answer: "You'll receive daily progress posts, photos, and occasional text reminders or schedule adjustments.",
    icon: MessageCircle
  },
  {
    question: "Can I communicate with the crew during the job?",
    answer: "Yes. Messages to the foreman are delivered instantly through your portal.",
    icon: MessageCircle
  },
  {
    question: "What if something needs extra attention?",
    answer: "Use the 'Notes & Concerns' section to flag an issue. The foreman is notified immediately.",
    icon: CheckSquare
  },
  {
    question: "How will I know if the schedule changes?",
    answer: "Any changes trigger a portal notification, text message, email, and updated calendar entry.",
    icon: Calendar
  },
  {
    question: "Will I see photos of the work as it happens?",
    answer: "Yes. Approved project photos appear in the Photo Carousel throughout the job.",
    icon: Camera
  },
  {
    question: "What if weather or material delays affect my project?",
    answer: "The office will update you with a revised plan and timeline.",
    icon: Calendar
  }
];

const afterProjectFAQs: FAQItem[] = [
  {
    question: "How do I make my final payment?",
    answer: "Your Payments tab shows your balance, payment methods, and secure checkout link.",
    icon: CreditCard
  },
  {
    question: "Can I review and approve the completed work?",
    answer: "You'll receive a Final Walkthrough Checklist, punch list items (if any), and a before/after photo set.",
    icon: CheckSquare
  },
  {
    question: "How do I request warranty or service support?",
    answer: "Use the Support Request feature, upload photos, and describe the issue. The office will reply with next steps.",
    icon: MessageCircle
  },
  {
    question: "Where can I find job photos and documents?",
    answer: "All photos, documents, and signed files live permanently under Project Files & Photos.",
    icon: FileText
  },
  {
    question: "How do I leave a review?",
    answer: "Use the built-in review tool to choose tone, highlight details, get AI-generated drafts, and submit directly to Google.",
    icon: MessageCircle
  },
  {
    question: "Will I receive care or maintenance instructions?",
    answer: "Yes. Custom care guides are available under Maintenance & Care depending on your project type.",
    icon: FileText
  }
];

const globalFAQs: FAQItem[] = [
  {
    question: "Can I access my portal from my phone?",
    answer: "Absolutely — your portal is fully mobile-friendly."
  },
  {
    question: "Who can see my messages and photos?",
    answer: "Only the assigned office team and your project crew. You can also mark files as private."
  },
  {
    question: "How long does my portal stay active?",
    answer: "Indefinitely. You can return anytime to view photos, invoices, and maintenance guides."
  }
];

// ========================================
// ACCORDION CARD COMPONENT
// ========================================

const FAQAccordionCard = ({ 
  question, 
  answer, 
  icon: Icon,
  isOpen, 
  onToggle 
}: { 
  question: string; 
  answer: string; 
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <div
      onClick={onToggle}
      style={{
        backgroundColor: isOpen ? '#F5FAFD' : 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderLeft: isOpen ? '4px solid #6BA3C8' : '4px solid transparent',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,163,200,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {Icon && (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: isOpen ? '#6BA3C8' : '#F0F0F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}>
              <Icon size={20} style={{ color: isOpen ? 'white' : '#6BA3C8' }} />
            </div>
          )}
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#2F2F2F',
            lineHeight: '1.4'
          }}>
            {question}
          </h3>
        </div>
        <ChevronDown
          size={24}
          style={{
            color: '#6BA3C8',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            flexShrink: 0
          }}
        />
      </div>
      
      {isOpen && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #E0E0E0',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4A4A4A',
          animation: 'fadeIn 0.3s ease'
        }}>
          {answer}
        </div>
      )}
    </div>
  );
};

// ========================================
// MAIN FAQ PAGE COMPONENT
// ========================================

export function CustomerPortalFAQPage() {
  const [activeTab, setActiveTab] = useState<FAQSection>('before');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (section: string, index: number) => {
    const key = `${section}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCurrentFAQs = () => {
    switch (activeTab) {
      case 'before':
        return beforeProjectFAQs;
      case 'during':
        return duringProjectFAQs;
      case 'after':
        return afterProjectFAQs;
      default:
        return beforeProjectFAQs;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8F9FA',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          fontSize: '14px',
          color: '#6A6A6A'
        }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6BA3C8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6A6A6A'}
          >
            Home
          </span>
          <ChevronRight size={16} />
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6BA3C8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6A6A6A'}
          >
            Project
          </span>
          <ChevronRight size={16} />
          <span style={{ color: '#6BA3C8', fontWeight: '600' }}>FAQ</span>
        </div>

        {/* Page Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            margin: '0 0 16px 0',
            fontSize: '40px',
            fontWeight: '700',
            color: '#2F2F2F',
            letterSpacing: '-0.5px'
          }}>
            Customer Portal – Frequently Asked Questions
          </h1>
          <p style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '500',
            color: '#6A6A6A',
            lineHeight: '1.5'
          }}>
            Everything you need to know before, during, and after your project
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { key: 'before' as FAQSection, label: 'Before Your Project' },
            { key: 'during' as FAQSection, label: 'During Your Project' },
            { key: 'after' as FAQSection, label: 'After Your Project' }
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  backgroundColor: isActive ? '#6BA3C8' : 'white',
                  color: isActive ? 'white' : '#4A4A4A',
                  border: isActive ? 'none' : '2px solid #D1D1D1',
                  borderRadius: '24px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(107,163,200,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'linear-gradient(to bottom, #7CB7DE, #6BA3C8)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#6BA3C8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#4A4A4A';
                    e.currentTarget.style.borderColor = '#D1D1D1';
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion Section */}
        <div style={{ marginBottom: '48px' }}>
          {getCurrentFAQs().map((faq, index) => (
            <FAQAccordionCard
              key={index}
              question={faq.question}
              answer={faq.answer}
              icon={faq.icon}
              isOpen={openItems[`${activeTab}-${index}`] || false}
              onToggle={() => toggleItem(activeTab, index)}
            />
          ))}
        </div>

        {/* Global FAQ Footer Section */}
        <div style={{
          marginTop: '64px',
          paddingTop: '48px',
          borderTop: '2px solid #E0E0E0'
        }}>
          <h2 style={{
            margin: '0 0 32px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#2F2F2F',
            textAlign: 'center'
          }}>
            General Questions
          </h2>
          
          {globalFAQs.map((faq, index) => (
            <FAQAccordionCard
              key={`global-${index}`}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems[`global-${index}`] || false}
              onToggle={() => toggleItem('global', index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: '64px',
          padding: '32px',
          background: 'linear-gradient(135deg, #6BA3C8 0%, #7CB7DE 100%)',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(107,163,200,0.3)'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '24px',
            fontWeight: '700',
            color: 'white'
          }}>
            Still have questions?
          </h3>
          <p style={{
            margin: '0 0 24px 0',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: '1.5'
          }}>
            Our team is here to help. Reach out anytime through your portal message center.
          </p>
          <button style={{
            backgroundColor: 'white',
            color: '#6BA3C8',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
