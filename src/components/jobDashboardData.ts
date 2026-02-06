import { 
  Home, 
  FileText, 
  DollarSign, 
  Hammer, 
  MessageCircle, 
  Image, 
  Star, 
  User 
} from 'lucide-react';

export type JobStatus = 'Scheduled' | 'In Progress' | 'Final Walkthrough' | 'Completed';

export interface TeamMember {
  id: string;
  name: string;
  role: 'Foreman' | 'Technician' | 'Office';
  avatar?: string;
  badges?: string[];
  contactEmail?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface NextStep {
  id: string;
  description: string;
  status: 'To Do' | 'In Review' | 'Done';
  dueDate?: Date;
}

export interface RecentUpdate {
  id: string;
  type: string;
  description: string;
  author: string;
  timestamp: Date;
}

export interface JobDashboardData {
  jobName: string;
  jobStatus: JobStatus;
  nextScheduledDate?: Date;
  teamMembers: TeamMember[];
  quote: {
    total: number;
    paid: number;
    remaining: number;
    items: QuoteItem[];
  };
  nextSteps: NextStep[];
  recentUpdates: RecentUpdate[];
}

export const mockJobData: JobDashboardData = {
  jobName: 'Osborn Residence - Hardwood Floor Refinish',
  jobStatus: 'In Progress',
  nextScheduledDate: new Date('2024-02-15T09:00:00'),
  teamMembers: [
    {
      id: 'foreman-1',
      name: 'Jack Thompson',
      role: 'Foreman',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      badges: ['NWFA Certified', '10+ Years Experience'],
      contactEmail: 'jack.thompson@boardroom360.com'
    },
    {
      id: 'tech-1',
      name: 'Maria Rodriguez',
      role: 'Technician',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      badges: ['Master Sander', 'Finishing Specialist'],
      contactEmail: 'maria.rodriguez@boardroom360.com'
    },
    {
      id: 'office-1',
      name: 'Emily Chen',
      role: 'Office',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      contactEmail: 'emily.chen@boardroom360.com'
    }
  ],
  quote: {
    total: 12500,
    paid: 6250,
    remaining: 6250,
    items: [
      { 
        id: 'item-1', 
        description: 'Floor Sanding (1500 sq ft)', 
        quantity: 1, 
        unitPrice: 4500, 
        total: 4500 
      },
      { 
        id: 'item-2', 
        description: 'Premium Wood Finish', 
        quantity: 1, 
        unitPrice: 3500, 
        total: 3500 

      },
      { 
        id: 'item-3', 
        description: 'Custom Stain', 
        quantity: 1, 
        unitPrice: 2500, 
        total: 2500 
      }
    ]
  },
  nextSteps: [
    {
      id: 'step-1',
      description: 'Confirm Stain Color Selection',
      status: 'To Do',
      dueDate: new Date('2024-02-10')
    },
    {
      id: 'step-2',
      description: 'Clear Furniture from Work Area',
      status: 'To Do',
      dueDate: new Date('2024-02-14')
    },
    {
      id: 'step-3',
      description: 'Review Change Order #2',
      status: 'In Review',
      dueDate: new Date('2024-02-16')
    }
  ],
  recentUpdates: [
    {
      id: 'update-1',
      type: 'Progress Update',
      description: 'Floor sanding completed in main living areas',
      author: 'Jack Thompson',
      timestamp: new Date('2024-02-05T14:30:00')
    },
    {
      id: 'update-2',
      type: 'Photo Set',
      description: '6 new progress photos uploaded',
      author: 'Maria Rodriguez',
      timestamp: new Date('2024-02-06T11:15:00')
    },
    {
      id: 'update-3',
      type: 'Change Order',
      description: 'Additional edge detailing requested',
      author: 'Emily Chen',
      timestamp: new Date('2024-02-07T09:45:00')
    }
  ]
};

export const dashboardTabs = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: Home 
  },
  { 
    id: 'quote', 
    label: 'Quote', 
    icon: FileText 
  },
  { 
    id: 'contract', 
    label: 'Contract', 
    icon: FileText 
  },
  { 
    id: 'changeOrders', 
    label: 'Change Orders', 
    icon: DollarSign 
  },
  { 
    id: 'stainSignOff', 
    label: 'Stain Sign-Off', 
    icon: Hammer 
  },
  { 
    id: 'filesAndPhotos', 
    label: 'Files & Photos', 
    icon: Image 
  },
  { 
    id: 'messages', 
    label: 'Messages', 
    icon: MessageCircle 
  },
  { 
    id: 'jobProgress', 
    label: 'Job Progress', 
    icon: Hammer 
  },
  { 
    id: 'faqs', 
    label: 'FAQs', 
    icon: FileText 
  },
  { 
    id: 'reviews', 
    label: 'Reviews', 
    icon: Star 
  }
];