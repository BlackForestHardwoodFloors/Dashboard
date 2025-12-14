import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Grid3x3, 
  List, 
  Clock, 
  MapPin,
  Filter,
  Search,
  Calendar,
  Users,
  Home,
  Tag,
  AlertCircle,
  CheckCircle2,
  Download,
  Share2,
  Trash2,
  FolderOpen,
  ChevronDown,
  Star,
  Eye,
  EyeOff,
  Zap,
  X,
  Image,
  Navigation,
  Menu
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { SidebarEnhanced } from './SidebarEnhanced';
import PhotoCard from './PhotoCard';
import PhotoDetailModal from './PhotoDetailModal';
import JobPhotoGallery from './JobPhotoGallery';

type ViewMode = 'Grid' | 'List' | 'Timeline' | 'Map';
type FilterType = 'Today' | 'This Week' | 'Before/After' | 'Employees' | 'Rooms' | 'AI Tags' | 'Problems' | 'Client-Approved';

interface Photo {
  id: string;
  url: string;
  jobId: string;
  jobName: string;
  employeeName: string;
  employeeAvatar: string;
  timestamp: string;
  room: string;
  phase: string;
  type: string;
  tags: string[];
  notes: string;
  aiSummary: string;
  showInClientPortal: boolean;
  isProblemArea: boolean;
  problemType?: string;
  gpsVerified: boolean;
  latitude?: number;
  longitude?: number;
  isFavorite: boolean;
}

interface Folder {
  id: string;
  name: string;
  photoCount: number;
  thumbnails: string[];
  showInClientPortal: boolean;
}

interface JobSite {
  id: string;
  clientName: string;
  address: string;
  recentPhotoUrl: string;
  newPhotoCount: number;
  lastPhotoTime: string;
  foremanColor: string;
  employeeInitials: string;
  employeeColor: string;
}

interface RecentPhoto {
  id: string;
  url: string;
  jobName: string;
  employeeName: string;
  employeeAvatar: string;
  timestamp: string;
  room: string;
  timeAgo: string;
  clientName: string;
  address: string;
  employeeInitials: string;
  employeeColor: string;
}

interface NearbyProject {
  id: string;
  clientName: string;
  address: string;
  photoUrl: string;
  distance: string;
  status: string;
  statusColor: string;
  latitude: number;
  longitude: number;
  employeeInitials: string;
  employeeColor: string;
}

// CompanyCam Blue - matching the Photos button in sidebar
const COMPANYCAM_BLUE = '#0F7BFF';
const GOLD_CTA = '#C9A049';

export default function PhotosPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>('Grid');
  const [selectedJob, setSelectedJob] = useState('All Jobs');
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If a job is selected, show the JobPhotoGallery
  if (selectedJobId) {
    return (
      <JobPhotoGallery
        jobId={selectedJobId}
        onBack={() => setSelectedJobId(null)}
        onNavigate={onNavigate}
      />
    );
  }

  // Active jobsites with recent photo activity
  const activeJobSites: JobSite[] = [
    {
      id: 'job1',
      clientName: 'Anderson, Sarah',
      address: '742 Evergreen Terrace',
      recentPhotoUrl: 'https://images.unsplash.com/photo-1615875221248-cd6de5422865?w=600',
      newPhotoCount: 8,
      lastPhotoTime: '2 hours ago',
      foremanColor: '#42A5F5',
      employeeInitials: 'MJ',
      employeeColor: '#FF5722'
    },
    {
      id: 'job2',
      clientName: 'Martinez, Robert',
      address: '88 Maple Drive',
      recentPhotoUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600',
      newPhotoCount: 5,
      lastPhotoTime: '4 hours ago',
      foremanColor: '#66BB6A',
      employeeInitials: 'SC',
      employeeColor: '#9C27B0'
    },
    {
      id: 'job3',
      clientName: 'Thompson, Jennifer',
      address: '1500 Oak Boulevard',
      recentPhotoUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600',
      newPhotoCount: 12,
      lastPhotoTime: '6 hours ago',
      foremanColor: '#FFA726',
      employeeInitials: 'CR',
      employeeColor: '#4CAF50'
    },
    {
      id: 'job4',
      clientName: 'Wilson, David',
      address: '234 Pine Street',
      recentPhotoUrl: 'https://images.unsplash.com/photo-1601063936640-a0e4e4ed081c?w=600',
      newPhotoCount: 3,
      lastPhotoTime: '8 hours ago',
      foremanColor: '#9C27B0',
      employeeInitials: 'AR',
      employeeColor: '#FF9800'
    },
    {
      id: 'job5',
      clientName: 'Garcia, Emily',
      address: '456 Elm Avenue',
      recentPhotoUrl: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=600',
      newPhotoCount: 7,
      lastPhotoTime: '1 day ago',
      foremanColor: '#FF9800',
      employeeInitials: 'JL',
      employeeColor: '#2196F3'
    },
    {
      id: 'job6',
      clientName: 'Chen, Michael',
      address: '789 Birch Lane',
      recentPhotoUrl: 'https://images.unsplash.com/photo-1711915442858-2a5bb7ba67d8?w=600',
      newPhotoCount: 15,
      lastPhotoTime: '1 day ago',
      foremanColor: '#EF5350',
      employeeInitials: 'MJ',
      employeeColor: '#FF5722'
    }
  ];

  // Company Feed - Recent photos in chronological order
  const companyFeed: RecentPhoto[] = [
    {
      id: 'recent1',
      url: 'https://images.unsplash.com/photo-1615875221248-cd6de5422865?w=600',
      jobName: 'Anderson Living Room',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2024-11-17T14:30:00',
      room: 'Living Room',
      timeAgo: '15 min ago',
      clientName: 'Anderson',
      address: '742 Evergreen Terrace',
      employeeInitials: 'MJ',
      employeeColor: '#FF5722'
    },
    {
      id: 'recent2',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600',
      jobName: 'Martinez Main Area',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://i.pravatar.cc/150?img=45',
      timestamp: '2024-11-17T14:00:00',
      room: 'Main Area',
      timeAgo: '45 min ago',
      clientName: 'Martinez',
      address: '88 Maple Drive',
      employeeInitials: 'SC',
      employeeColor: '#9C27B0'
    },
    {
      id: 'recent3',
      url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600',
      jobName: 'Thompson Staircase',
      employeeName: 'Carlos Rodriguez',
      employeeAvatar: 'https://i.pravatar.cc/150?img=33',
      timestamp: '2024-11-17T13:30:00',
      room: 'Staircase',
      timeAgo: '1 hour ago',
      clientName: 'Thompson',
      address: '1500 Oak Boulevard',
      employeeInitials: 'CR',
      employeeColor: '#4CAF50'
    },
    {
      id: 'recent4',
      url: 'https://images.unsplash.com/photo-1601063936640-a0e4e4ed081c?w=600',
      jobName: 'Wilson Kitchen',
      employeeName: 'Alex Rivera',
      employeeAvatar: 'https://i.pravatar.cc/150?img=8',
      timestamp: '2024-11-17T13:00:00',
      room: 'Kitchen',
      timeAgo: '1.5 hours ago',
      clientName: 'Wilson',
      address: '234 Pine Street',
      employeeInitials: 'AR',
      employeeColor: '#FF9800'
    },
    {
      id: 'recent5',
      url: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=600',
      jobName: 'Garcia Main Hall',
      employeeName: 'Jordan Lee',
      employeeAvatar: 'https://i.pravatar.cc/150?img=25',
      timestamp: '2024-11-17T12:30:00',
      room: 'Main Hall',
      timeAgo: '2 hours ago',
      clientName: 'Garcia',
      address: '456 Elm Avenue',
      employeeInitials: 'JL',
      employeeColor: '#2196F3'
    },
    {
      id: 'recent6',
      url: 'https://images.unsplash.com/photo-1711915442858-2a5bb7ba67d8?w=600',
      jobName: 'Chen Office',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://i.pravatar.cc/150?img=45',
      timestamp: '2024-11-17T11:45:00',
      room: 'Office',
      timeAgo: '2.5 hours ago',
      clientName: 'Chen',
      address: '789 Birch Lane',
      employeeInitials: 'SC',
      employeeColor: '#9C27B0'
    }
  ];

  // Nearby Projects based on GPS
  const nearbyProjects: NearbyProject[] = [
    {
      id: 'nearby1',
      clientName: 'Baker, Michael',
      address: '892 Riverside Drive',
      photoUrl: 'https://images.unsplash.com/photo-1622193736115-9032b599ef61?w=600',
      distance: '0.8 mi',
      status: 'In Progress',
      statusColor: '#FFA726',
      latitude: 47.6590,
      longitude: -117.4255,
      employeeInitials: 'MJ',
      employeeColor: '#FF5722'
    },
    {
      id: 'nearby2',
      clientName: 'Davis, Patricia',
      address: '156 Lakewood Avenue',
      photoUrl: 'https://images.unsplash.com/photo-1693948568453-a3564f179a84?w=600',
      distance: '1.2 mi',
      status: 'Starting Soon',
      statusColor: '#42A5F5',
      latitude: 47.6595,
      longitude: -117.4245,
      employeeInitials: 'SC',
      employeeColor: '#9C27B0'
    },
    {
      id: 'nearby3',
      clientName: 'Miller, James',
      address: '430 Forest Lane',
      photoUrl: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=600',
      distance: '1.5 mi',
      status: 'Completed',
      statusColor: '#66BB6A',
      latitude: 47.6585,
      longitude: -117.4265,
      employeeInitials: 'CR',
      employeeColor: '#4CAF50'
    },
    {
      id: 'nearby4',
      clientName: 'White, Susan',
      address: '721 Park Boulevard',
      photoUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600',
      distance: '2.1 mi',
      status: 'In Progress',
      statusColor: '#FFA726',
      latitude: 47.6605,
      longitude: -117.4235,
      employeeInitials: 'AR',
      employeeColor: '#FF9800'
    },
    {
      id: 'nearby5',
      clientName: 'Brown, Richard',
      address: '283 Cedar Street',
      photoUrl: 'https://images.unsplash.com/photo-1690310588789-8fcee016f619?w=600',
      distance: '2.4 mi',
      status: 'In Progress',
      statusColor: '#FFA726',
      latitude: 47.6570,
      longitude: -117.4275,
      employeeInitials: 'JL',
      employeeColor: '#2196F3'
    },
    {
      id: 'nearby6',
      clientName: 'Taylor, Linda',
      address: '567 Sunset Drive',
      photoUrl: 'https://images.unsplash.com/photo-1680637301521-13652448f0e5?w=600',
      distance: '2.8 mi',
      status: 'Completed',
      statusColor: '#66BB6A',
      latitude: 47.6560,
      longitude: -117.4285,
      employeeInitials: 'SC',
      employeeColor: '#9C27B0'
    }
  ];

  // Sample data
  const jobs = [
    'All Jobs',
    'Oak Mansion - Living Room Refinish',
    'Downtown Loft - New Installation',
    'Suburban Home - Staircase Repair',
    'Historic Building - Full Restoration',
    'Modern Condo - Kitchen Floors'
  ];

  const folders: Folder[] = [
    {
      id: '1',
      name: 'Before the Job',
      photoCount: 42,
      thumbnails: [
        'https://images.unsplash.com/photo-1615875221248-cd6de5422865?w=400', 
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400', 
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400'
      ],
      showInClientPortal: true
    },
    {
      id: '2',
      name: 'Installation Progress',
      photoCount: 87,
      thumbnails: [
        'https://images.unsplash.com/photo-1601063936640-a0e4e4ed081c?w=400',
        'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=400',
        'https://images.unsplash.com/photo-1711915442858-2a5bb7ba67d8?w=400'
      ],
      showInClientPortal: true
    },
    {
      id: '3',
      name: 'Completed Work',
      photoCount: 34,
      thumbnails: [
        'https://images.unsplash.com/photo-1690310588789-8fcee016f619?w=400',
        'https://images.unsplash.com/photo-1680637301521-13652448f0e5?w=400',
        'https://images.unsplash.com/photo-1622193736115-9032b599ef61?w=400'
      ],
      showInClientPortal: true
    },
    {
      id: '4',
      name: 'Problem Areas',
      photoCount: 12,
      thumbnails: [
        'https://images.unsplash.com/photo-1693948568453-a3564f179a84?w=400',
        'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=400',
        'https://images.unsplash.com/photo-1615875221248-cd6de5422865?w=400'
      ],
      showInClientPortal: false
    }
  ];

  const photos: Photo[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1615875221248-cd6de5422865?w=600',
      jobId: 'job1',
      jobName: 'Oak Mansion - Living Room',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '2 hours ago',
      room: 'Living Room',
      phase: 'Installation',
      type: 'Progress',
      tags: ['oak', 'progress', 'living-room'],
      notes: 'First coat applied, looking great',
      aiSummary: 'Oak hardwood installation in progress. Floor appears level with even stain application.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600',
      jobId: 'job2',
      jobName: 'Downtown Loft - Installation',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://i.pravatar.cc/150?img=45',
      timestamp: '4 hours ago',
      room: 'Main Area',
      phase: 'Sanding',
      type: 'Progress',
      tags: ['walnut', 'sanding'],
      notes: 'Sanding complete, ready for staining',
      aiSummary: 'Walnut floor sanding completed. Surface is smooth and ready for finishing.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6597,
      longitude: -117.4250,
      isFavorite: true
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600',
      jobId: 'job3',
      jobName: 'Suburban Home - Stairs',
      employeeName: 'Carlos Rodriguez',
      employeeAvatar: 'https://i.pravatar.cc/150?img=33',
      timestamp: '6 hours ago',
      room: 'Staircase',
      phase: 'Before',
      type: 'Before',
      tags: ['stairs', 'before', 'oak'],
      notes: 'Heavy wear on treads, needs full refinish',
      aiSummary: 'Pre-existing staircase shows significant wear. Treads need complete refinishing.',
      showInClientPortal: false,
      isProblemArea: true,
      problemType: 'Heavy Wear',
      gpsVerified: true,
      latitude: 47.6580,
      longitude: -117.4270,
      isFavorite: false
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1601063936640-a0e4e4ed081c?w=600',
      jobId: 'job1',
      jobName: 'Oak Mansion - Kitchen',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '8 hours ago',
      room: 'Kitchen',
      phase: 'Staining',
      type: 'Progress',
      tags: ['mahogany', 'kitchen', 'staining'],
      notes: 'Custom stain mix - client approved',
      aiSummary: 'Mahogany stain application in kitchen. Color consistency is excellent.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=600',
      jobId: 'job4',
      jobName: 'Historic Building',
      employeeName: 'Alex Rivera',
      employeeAvatar: 'https://i.pravatar.cc/150?img=8',
      timestamp: '1 day ago',
      room: 'Main Hall',
      phase: 'Completion',
      type: 'After',
      tags: ['restoration', 'historic', 'completed'],
      notes: 'Restoration complete - matches original 1920s finish',
      aiSummary: 'Historic floor restoration completed. Finish matches period-appropriate specifications.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6600,
      longitude: -117.4240,
      isFavorite: true
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1711915442858-2a5bb7ba67d8?w=600',
      jobId: 'job5',
      jobName: 'Modern Condo - Kitchen',
      employeeName: 'Jordan Lee',
      employeeAvatar: 'https://i.pravatar.cc/150?img=25',
      timestamp: '1 day ago',
      room: 'Kitchen',
      phase: 'Installation',
      type: 'Progress',
      tags: ['modern', 'oak', 'kitchen'],
      notes: 'Wide plank oak - looking beautiful',
      aiSummary: 'Wide plank oak installation. Clean lines and professional execution.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6575,
      longitude: -117.4265,
      isFavorite: false
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1690310588789-8fcee016f619?w=600',
      jobId: 'job2',
      jobName: 'Downtown Loft',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://i.pravatar.cc/150?img=45',
      timestamp: '2 days ago',
      room: 'Bedroom',
      phase: 'Installation',
      type: 'Progress',
      tags: ['walnut', 'bedroom'],
      notes: 'Client requested darker stain',
      aiSummary: 'Walnut bedroom floor with custom dark stain application.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6597,
      longitude: -117.4250,
      isFavorite: false
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1680637301521-13652448f0e5?w=600',
      jobId: 'job3',
      jobName: 'Suburban Home',
      employeeName: 'Carlos Rodriguez',
      employeeAvatar: 'https://i.pravatar.cc/150?img=33',
      timestamp: '2 days ago',
      room: 'Dining Room',
      phase: 'Before',
      type: 'Before',
      tags: ['before', 'dining-room'],
      notes: 'Water damage in corner - needs repair',
      aiSummary: 'Pre-existing condition shows water damage requiring subfloor repair.',
      showInClientPortal: false,
      isProblemArea: true,
      problemType: 'Water Damage',
      gpsVerified: true,
      latitude: 47.6580,
      longitude: -117.4270,
      isFavorite: false
    },
    {
      id: '9',
      url: 'https://images.unsplash.com/photo-1622193736115-9032b599ef61?w=600',
      jobId: 'job4',
      jobName: 'Historic Building',
      employeeName: 'Alex Rivera',
      employeeAvatar: 'https://i.pravatar.cc/150?img=8',
      timestamp: '3 days ago',
      room: 'Entry Hall',
      phase: 'Sanding',
      type: 'Progress',
      tags: ['historic', 'sanding'],
      notes: 'Original 1920s oak - being very careful',
      aiSummary: 'Careful sanding of original historic oak flooring.',
      showInClientPortal: false,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6600,
      longitude: -117.4240,
      isFavorite: true
    },
    {
      id: '10',
      url: 'https://images.unsplash.com/photo-1693948568453-a3564f179a84?w=600',
      jobId: 'job5',
      jobName: 'Modern Condo',
      employeeName: 'Jordan Lee',
      employeeAvatar: 'https://i.pravatar.cc/150?img=25',
      timestamp: '3 days ago',
      room: 'Living Room',
      phase: 'Completion',
      type: 'After',
      tags: ['completed', 'modern', 'oak'],
      notes: 'Client loves it - requesting us for second property',
      aiSummary: 'Completed modern oak installation. Client approved and very satisfied.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6575,
      longitude: -117.4265,
      isFavorite: true
    },
    {
      id: '11',
      url: 'https://images.unsplash.com/photo-1666871525829-a71efce76005?w=600',
      jobId: 'job1',
      jobName: 'Oak Mansion',
      employeeName: 'Mike Johnson',
      employeeAvatar: 'https://i.pravatar.cc/150?img=12',
      timestamp: '4 days ago',
      room: 'Master Bedroom',
      phase: 'Installation',
      type: 'Progress',
      tags: ['oak', 'bedroom'],
      notes: 'Herringbone pattern - coming together nicely',
      aiSummary: 'Herringbone oak pattern installation showing excellent craftsmanship.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6588,
      longitude: -117.4260,
      isFavorite: false
    },
    {
      id: '12',
      url: 'https://images.unsplash.com/photo-1615875221248-cd6de5422865?w=600',
      jobId: 'job2',
      jobName: 'Downtown Loft',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://i.pravatar.cc/150?img=45',
      timestamp: '5 days ago',
      room: 'Office',
      phase: 'Completion',
      type: 'After',
      tags: ['walnut', 'completed', 'office'],
      notes: 'Final photos - ready for client walkthrough',
      aiSummary: 'Completed walnut office floor ready for final inspection.',
      showInClientPortal: true,
      isProblemArea: false,
      gpsVerified: true,
      latitude: 47.6597,
      longitude: -117.4250,
      isFavorite: true
    }
  ];

  const handlePhotoClick = (photo: Photo) => {
    const index = photos.findIndex(p => p.id === photo.id);
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
    setShowDetailModal(true);
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < photos.length - 1) {
      const newIndex = selectedPhotoIndex + 1;
      setSelectedPhotoIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      const newIndex = selectedPhotoIndex - 1;
      setSelectedPhotoIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0D0D0D', overflow: 'hidden' }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 999,
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowMobileSidebar(false)}
          />
          {/* Sidebar Drawer */}
          <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            zIndex: 1000,
            transform: showMobileSidebar ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease'
          }}>
            <SidebarEnhanced 
              activePage="Photos" 
              darkMode={true} 
              onNavigate={(page) => {
                setShowMobileSidebar(false);
                onNavigate?.(page);
              }} 
            />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <SidebarEnhanced activePage="Photos" darkMode={true} onNavigate={onNavigate} />
      )}

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: isMobile ? '0' : '220px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: isMobile ? '16px' : '24px 32px',
          borderBottom: '1px solid #262626',
          backgroundColor: '#0D0D0D'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isMobile ? '16px' : '20px',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: COMPANYCAM_BLUE,
                    border: 'none',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Menu style={{ width: '24px', height: '24px', color: 'white' }} />
                </button>
              )}
              <div>
                <h1 style={{ color: '#FFFFFF', fontSize: isMobile ? '20px' : '28px', fontWeight: '700', margin: '0 0 4px 0' }}>
                  Photos
                </h1>
                {!isMobile && (
                  <p style={{ color: '#A0A0A0', fontSize: '14px', margin: 0 }}>
                    All jobsite photos organized by job, date, and employee
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!isMobile && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {/* TODO: Open camera */}}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: COMPANYCAM_BLUE,
                    border: 'none',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(15,123,255,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(15,123,255,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,123,255,0.3)';
                  }}
                >
                  <Camera size={18} />
                  Take Photo
                </button>

                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: '#262626',
                    border: '1px solid #3D3D3D',
                    borderRadius: '10px',
                    color: '#E0E0E0',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3D3D3D';
                    e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#262626';
                    e.currentTarget.style.borderColor = '#3D3D3D';
                  }}
                >
                  <Upload size={18} />
                  Upload
                </button>
              </div>
            )}
          </div>

          {/* View Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: '#1A1A1A',
              border: '1px solid #3D3D3D',
              borderRadius: '10px',
              padding: '4px'
            }}>
              {(['Grid', 'List'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: viewMode === mode ? COMPANYCAM_BLUE : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: viewMode === mode ? '#FFFFFF' : '#A0A0A0',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {mode === 'Grid' ? <Grid3x3 size={16} /> : <List size={16} />}
                  {mode}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{
              flex: 1,
              maxWidth: '400px',
              position: 'relative'
            }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#888'
              }} />
              <input
                type="text"
                placeholder="Search photos by job, employee, room, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 44px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #3D3D3D',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COMPANYCAM_BLUE;
                  e.target.style.backgroundColor = '#262626';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3D3D3D';
                  e.target.style.backgroundColor = '#1A1A1A';
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ 
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}>
          
          {/* Carousel Rows */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 32px'
          }}>
            
            {/* Active Jobsites Row */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{
                color: '#E0E0E0',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Camera size={18} color={COMPANYCAM_BLUE} />
                Current Jobsites
                <span style={{
                  color: '#888',
                  fontSize: '13px',
                  fontWeight: '400'
                }}>
                  • {activeJobSites.length} jobs with new photos
                </span>
              </h3>
              
              <div 
                className="carousel-scroll"
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  paddingBottom: '16px',
                  paddingTop: '12px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                {activeJobSites.map((jobSite) => {
                  // Extract last name from "LastName, FirstName" format
                  const lastName = jobSite.clientName.split(',')[0].trim();
                  const isHovered = hoveredCard === jobSite.id;
                  
                  return (
                    <div
                      key={jobSite.id}
                      onMouseEnter={() => setHoveredCard(jobSite.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => {
                        // TODO: Navigate to job's photo gallery
                        console.log('Navigate to job:', jobSite.id);
                        setSelectedJobId(jobSite.id);
                      }}
                      style={{
                        minWidth: '320px',
                        height: '220px',
                        backgroundColor: '#262626',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        boxShadow: isHovered 
                          ? `0 8px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(15,123,255,0.15), -4px 0 8px -2px rgba(15,123,255,0.5), 0 -4px 8px -2px rgba(15,123,255,0.5), 4px 0 8px -2px rgba(15,123,255,0.5), 0 6px 8px -2px rgba(15,123,255,0.5)`
                          : '0 2px 8px rgba(0,0,0,0.2)',
                        border: `1px solid ${isHovered ? 'rgba(15,123,255,0.5)' : '#3D3D3D'}`,
                        position: 'relative'
                      }}
                    >
                      {/* Employee Color Bar - Left */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: jobSite.employeeColor,
                        zIndex: 2
                      }} />

                      {/* Photo Background */}
                      <div style={{
                        height: '140px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img 
                          src={jobSite.recentPhotoUrl}
                          alt={jobSite.clientName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
                        }} />

                        {/* New Photos Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          backgroundColor: COMPANYCAM_BLUE,
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: '700',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          +{jobSite.newPhotoCount}
                        </div>

                        {/* Add Photo Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Open camera for this specific job
                            console.log('Open camera for job:', jobSite.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: isHovered ? 1 : 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = COMPANYCAM_BLUE;
                            e.currentTarget.style.borderColor = COMPANYCAM_BLUE;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                          }}
                        >
                          <Camera size={16} color="#FFFFFF" />
                        </button>

                        {/* Employee Initials Badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(15,123,255,0.95)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#FFFFFF',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}>
                          {jobSite.employeeInitials}
                        </div>
                      </div>

                      {/* Job Info */}
                      <div style={{
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        <h4 style={{
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: '700',
                          margin: 0,
                          lineHeight: '1.2',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {lastName}
                        </h4>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#A0A0A0',
                          fontSize: '12px'
                        }}>
                          <MapPin size={12} />
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {jobSite.address}
                          </span>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#888',
                          fontSize: '11px',
                          marginTop: '2px'
                        }}>
                          <Clock size={11} />
                          {jobSite.lastPhotoTime}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Company Feed Row */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{
                color: '#E0E0E0',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Image size={18} color={COMPANYCAM_BLUE} />
                Company Feed
                <span style={{
                  color: '#888',
                  fontSize: '13px',
                  fontWeight: '400'
                }}>
                  • Latest photos from all jobs
                </span>
              </h3>
              
              <div 
                className="carousel-scroll"
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  paddingBottom: '16px',
                  paddingTop: '12px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                {companyFeed.map((photo) => {
                  const isHovered = hoveredCard === photo.id;
                  
                  return (
                    <div
                      key={photo.id}
                      onMouseEnter={() => setHoveredCard(photo.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => {
                        console.log('Open photo:', photo.id);
                        // Map client name to job ID
                        const jobMap: { [key: string]: string } = {
                          'Anderson': 'job1',
                          'Martinez': 'job2',
                          'Thompson': 'job3',
                          'Wilson': 'job4',
                          'Garcia': 'job5',
                          'Chen': 'job6'
                        };
                        const jobId = jobMap[photo.clientName];
                        if (jobId) {
                          setSelectedJobId(jobId);
                        }
                      }}
                      style={{
                        minWidth: '320px',
                        height: '220px',
                        backgroundColor: '#262626',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        boxShadow: isHovered 
                          ? `0 8px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(15,123,255,0.15), -4px 0 8px -2px rgba(15,123,255,0.5), 0 -4px 8px -2px rgba(15,123,255,0.5), 4px 0 8px -2px rgba(15,123,255,0.5), 0 6px 8px -2px rgba(15,123,255,0.5)`
                          : '0 2px 8px rgba(0,0,0,0.2)',
                        border: `1px solid ${isHovered ? 'rgba(15,123,255,0.5)' : '#3D3D3D'}`,
                        position: 'relative'
                      }}
                    >
                      {/* Employee Color Bar - Left */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: photo.employeeColor,
                        zIndex: 2
                      }} />

                      {/* Photo Background */}
                      <div style={{
                        height: '140px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img 
                          src={photo.url}
                          alt={photo.jobName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
                        }} />

                        {/* Employee Initials Badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(15,123,255,0.95)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#FFFFFF',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}>
                          {photo.employeeInitials}
                        </div>

                        {/* Time Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {photo.timeAgo}
                        </div>
                      </div>

                      {/* Photo Info */}
                      <div style={{
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        <h4 style={{
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: '700',
                          margin: 0,
                          lineHeight: '1.2',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {photo.clientName}
                        </h4>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#A0A0A0',
                          fontSize: '12px'
                        }}>
                          <MapPin size={12} />
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {photo.address}
                          </span>
                        </div>
                        
                        <div style={{
                          color: '#888',
                          fontSize: '11px'
                        }}>
                          {photo.room}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nearby Projects Row */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{
                color: '#E0E0E0',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Navigation size={18} color={COMPANYCAM_BLUE} />
                Nearby Projects
                <span style={{
                  color: '#888',
                  fontSize: '13px',
                  fontWeight: '400'
                }}>
                  • Within 3 miles
                </span>
              </h3>
              
              <div 
                className="carousel-scroll"
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  paddingBottom: '16px',
                  paddingTop: '12px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              >
                {nearbyProjects.map((project) => {
                  // Extract last name from "LastName, FirstName" format
                  const lastName = project.clientName.split(',')[0].trim();
                  const isHovered = hoveredCard === project.id;
                  
                  return (
                    <div
                      key={project.id}
                      onMouseEnter={() => setHoveredCard(project.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => {
                        console.log('Navigate to nearby project:', project.id);
                      }}
                      style={{
                        minWidth: '320px',
                        height: '220px',
                        backgroundColor: '#262626',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        boxShadow: isHovered 
                          ? `0 8px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(15,123,255,0.15), -4px 0 8px -2px rgba(15,123,255,0.5), 0 -4px 8px -2px rgba(15,123,255,0.5), 4px 0 8px -2px rgba(15,123,255,0.5), 0 6px 8px -2px rgba(15,123,255,0.5)`
                          : '0 2px 8px rgba(0,0,0,0.2)',
                        border: `1px solid ${isHovered ? 'rgba(15,123,255,0.5)' : '#3D3D3D'}`,
                        position: 'relative'
                      }}
                    >
                      {/* Employee Color Bar - Left */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: project.employeeColor,
                        zIndex: 2
                      }} />

                      {/* Photo Background */}
                      <div style={{
                        height: '140px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img 
                          src={project.photoUrl}
                          alt={project.clientName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
                        }} />

                        {/* Distance Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          backgroundColor: '#1A1A1A',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: '700',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid rgba(15,123,255,0.3)'
                        }}>
                          <Navigation size={10} color={COMPANYCAM_BLUE} />
                          {project.distance}
                        </div>

                        {/* Employee Initials Badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(15,123,255,0.95)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#FFFFFF',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}>
                          {project.employeeInitials}
                        </div>

                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          backgroundColor: project.statusColor,
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: '700',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                        }}>
                          {project.status}
                        </div>
                      </div>

                      {/* Project Info */}
                      <div style={{
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        <h4 style={{
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: '700',
                          margin: 0,
                          lineHeight: '1.2',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {lastName}
                        </h4>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#A0A0A0',
                          fontSize: '12px'
                        }}>
                          <MapPin size={11} />
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {project.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Detail Modal */}
      {showDetailModal && selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPhoto(null);
          }}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
          canGoNext={selectedPhotoIndex < photos.length - 1}
          canGoPrev={selectedPhotoIndex > 0}
        />
      )}
    </div>
  );
}