import { useState } from 'react';
import { 
  ChevronDown, 
  Calendar, 
  MessageCircle, 
  FileText, 
  CheckSquare, 
  Camera, 
  CreditCard,
  Home
} from 'lucide-react';

// ========================================
// TYPES
// ========================================

type FAQSection = 'before' | 'during' | 'after';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

// ========================================
// FAQ DATA
// ========================================

const beforeProjectFAQs: FAQItem[] = [
  {
    id: 'before-1',
    question: 'What happens after I approve my quote and contract?',
    answer: 'Once you approve your quote, your project is officially scheduled. Your customer portal unlocks all tools — calendar dates, prep checklist, message center, and photo updates.',
    icon: <FileText size={20} />
  },
  {
    id: 'before-2',
    question: 'Do I need to prepare my home before the crew arrives?',
    answer: 'Yes. You'll receive a Jobsite Readiness Checklist to review and digitally sign. It covers furniture, access, pets, electrical needs, and any project-specific prep.',
    icon: <CheckSquare size={20} />
  },
  {
    id: 'before-3',
    question: 'How will I know when my job is scheduled?',
    answer: 'Your portal will show all dates, and you'll receive a text and email confirmation. You can request changes inside the portal.',
    icon: <Calendar size={20} />
  },
  {
    id: 'before-4',
    question: 'Can I upload photos or files before the job starts?',
    answer: 'Yes — you can upload measurements, inspiration photos, or problem-area pictures. These help the team prepare.',
    icon: <Camera size={20} />
  },
  {
    id: 'before-5',
    question: 'How do I communicate with the office before the project begins?',
    answer: 'Use the Message Center. You can message the office or your project lead directly.',
    icon: <MessageCircle size={20} />
  },
  {
    id: 'before-6',
    question: 'Will I know who's coming to my home?',
    answer: 'Yes. Under 'Your Crew' you'll see headshots, bios, skill levels, and certifications.'
  }
];

const duringProjectFAQs: FAQItem[] = [
  {
    id: 'during-1',
    question: 'How will I receive day-to-day updates?',
    answer: 'You'll receive daily progress posts, photos, and occasional text reminders or schedule adjustments.',
    icon: <MessageCircle size={20} />
  },
  {
    id: 'during-2',
    question: 'Can I communicate with the crew during the job?',
    answer: 'Yes. Messages to the foreman are delivered instantly through your portal.',
    icon: <MessageCircle size={20} />
  },
  {
    id: 'during-3',
    question: 'What if something needs extra attention?',
    answer: 'Use the 'Notes & Concerns' section to flag an issue. The foreman is notified immediately.'
  },
  {
    id: 'during-4',
    question: 'How will I know if the schedule changes?',
    answer: 'Any changes trigger a portal notification, text message, email, and updated calendar entry.',
    icon: <Calendar size={20} />
  },
  {
    id: 'during-5',
    question: 'Will I see photos of the work as it happens?',
    answer: 'Yes. Approved project photos appear in the Photo Carousel throughout the job.',
    icon: <Camera size={20} />
  },
  {
    id: 'during-6',
    question: 'What if weather or material delays affect my project?',
    answer: 'The office will update you with a revised plan and timeline.'
  }
];

const afterProjectFAQs: FAQItem[] = [
  {
    id: 'after-1',
    question: 'How do I make my final payment?',
    answer: 'Your Payments tab shows your balance, payment methods, and secure checkout link.',
    icon: <CreditCard size={20} />
  },
  {
    id: 'after-2',
    question: 'Can I review and approve the completed work?',
    answer: 'You'll receive a Final Walkthrough Checklist, punch list items (if any), and a before/after photo set.',
    icon: <CheckSquare size={20} />
  },
  {
    id: 'after-3',
    question: 'How do I request warranty or service support?',
    answer: 'Use the Support Request feature, upload photos, and describe the issue. The office will reply with next steps.'
  },
  {
    id: 'after-4',
    question: 'Where can I find job photos and documents?',
    answer: 'All photos, documents, and signed files live permanently under Project Files & Photos.',
    icon: <FileText size={20} />
  },
  {
    id: 'after-5',
    question: 'How do I leave a review?',
    answer: 'Use the built-in review tool to choose tone, highlight details, get AI-generated drafts, and submit directly to Google.'
  },
  {
    id: 'after-6',
    question: 'Will I receive care or maintenance instructions?',
    answer: 'Yes. Custom care guides are available under Maintenance & Care depending on your project type.'
  }
];

const globalFAQs: FAQItem[] = [
  {
    id: 'global-1',
    question: 'Can I access my portal from my phone?',
    answer: 'Absolutely — your portal is fully mobile-friendly.'
  },
  {
    id: 'global-2',
    question: 'Who can see my messages and photos?',
    answer: 'Only the assigned office team and your project crew. You can also mark files as private.'
  },
  {
    id: 'global-3',
    question: 'How long does my portal stay active?',
    answer: 'Indefinitely. You can return anytime to view photos, invoices, and maintenance guides.'
  }
];

// ========================================
// ACCORDION CARD COMPONENT
// ========================================

const FAQAccordionCard = ({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      style={{
        width: '100%',
        padding: '16px 20px',
        borderRadius: '16px',
        backgroundColor: isOpen ? '#F5FAFD' : 'white',
        borderLeft: isOpen ? '4px solid #6BA3C8' : '4px solid transparent',
        boxShadow: isOpen 
          ? '0 4px 16px rgba(107, 163, 200, 0.15)' 
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
        marginBottom: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateY(0)',
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 163, 200, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isOpen 
          ? '0 4px 16px rgba(107, 163, 200, 0.15)' 
          : '0 2px 8px rgba(0, 0, 0, 0.06)';
      }}
      onClick={onToggle}
    >
      {/* Question Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {item.icon && (
            <div style={{ 
              color: '#6BA3C8',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
          )}
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            color: '#2F2F2F',
            lineHeight: '1.4'
          }}>
            {item.question}
          </h3>
        </div>
        <ChevronDown
          size={24}
          style={{
            color: '#6BA3C8',
            transition: 'transform 0.3s ease, opacity 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0
          }}
        />
      </div>

      {/* Answer Body */}
      <div style={{
        maxHeight: isOpen ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
        opacity: isOpen ? 1 : 0
      }}>
        <p style={{
          margin: '16px 0 0 0',
          paddingLeft: item.icon ? '32px' : '0',
          fontSize: '16px',
          lineHeight: '1.5',
          color: '#4A4A4A'
        }}>
          {item.answer}
        </p>
      </div>
    </div>
  );
};

// ========================================
// MAIN FAQ PAGE COMPONENT
// ========================================

export const CustomerPortalFAQ = () => {
  const [activeTab, setActiveTab] = useState<FAQSection>('before');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (id: string) => {
    setOpenItems({ ...openItems, [id]: !openItems[id] });
  };

  const tabs: { id: FAQSection; label: string }[] = [
    { id: 'before', label: 'Before Your Project' },
    { id: 'during', label: 'During Your Project' },
    { id: 'after', label: 'After Your Project' }
  ];

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
      backgroundColor: '#F9FAFB',
      paddingBottom: '40px'
    }}>
      {/* Breadcrumb Navigation */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        fontSize: '14px',
        color: '#6A6A6A'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Home size={16} style={{ color: '#6BA3C8' }} />
          <span style={{ color: '#6BA3C8', cursor: 'pointer' }}>Home</span>
          <span>›</span>
          <span style={{ color: '#6BA3C8', cursor: 'pointer' }}>Support</span>
          <span>›</span>
          <span>FAQ</span>
        </div>
      </div>

      {/* Header Section */}
      <div style={{
        padding: '48px 20px 32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #6BA3C8 0%, #7CB7DE 100%)',
        color: 'white'
      }}>
        <h1 style={{
          margin: '0 0 12px 0',
          fontSize: 'clamp(28px, 5vw, 40px)',
          fontWeight: 'bold',
          letterSpacing: '-0.02em'
        }}>
          Customer Portal – Frequently Asked Questions
        </h1>
        <p style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '500',
          color: 'rgba(255, 255, 255, 0.95)',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.5'
        }}>
          Everything you need to know before, during, and after your project
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        padding: '24px 20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              borderRadius: '24px',
              border: activeTab === tab.id ? 'none' : '2px solid #D1D1D1',
              backgroundColor: activeTab === tab.id ? '#6BA3C8' : 'white',
              color: activeTab === tab.id ? 'white' : '#4A4A4A',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: activeTab === tab.id 
                ? 'linear-gradient(180deg, #7CB7DE 0%, #6BA3C8 100%)'
                : 'white',
              boxShadow: activeTab === tab.id 
                ? '0 4px 12px rgba(107, 163, 200, 0.3)'
                : '0 2px 4px rgba(0, 0, 0, 0.05)',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'linear-gradient(180deg, #7CB7DE 0%, #6BA3C8 100%)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#6BA3C8';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#4A4A4A';
                e.currentTarget.style.borderColor = '#D1D1D1';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 20px'
      }}>
        {/* Current Section FAQs */}
        <div style={{ marginBottom: '48px' }}>
          {getCurrentFAQs().map((item) => (
            <FAQAccordionCard
              key={item.id}
              item={item}
              isOpen={openItems[item.id] || false}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>

        {/* Global FAQs Section */}
        <div style={{
          marginTop: '56px',
          paddingTop: '32px',
          borderTop: '2px solid #E5E7EB'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2F2F2F',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            General Questions
          </h2>
          {globalFAQs.map((item) => (
            <FAQAccordionCard
              key={item.id}
              item={item}
              isOpen={openItems[item.id] || false}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>

        {/* Contact Support CTA */}
        <div style={{
          marginTop: '48px',
          padding: '32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #588CAF 0%, #6BA3C8 100%)',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(107, 163, 200, 0.25)'
        }}>
          <MessageCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.9 }} />
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>
            Still have questions?
          </h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '16px', opacity: 0.95 }}>
            Our support team is here to help you every step of the way.
          </p>
          <button style={{
            padding: '14px 32px',
            borderRadius: '12px',
            border: '2px solid white',
            backgroundColor: 'white',
            color: '#6BA3C8',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#6BA3C8';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortalFAQ;
