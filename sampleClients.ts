/**
 * Demo client data shared between ClientsPage and CalendarPage.
 * Keep this file purely as sample/mock data so we can demo "fully completed" client tabs
 * without relying on the backend yet.
 */
export const sampleClients = [
  {
    id: '1',
    accountName: 'Lisa & John Anderson',
    clientType: 'Homeowner',
    status: 'Active',
    primaryContact: {
      id: 'c1',
      firstName: 'Lisa',
      lastName: 'Anderson',
      role: 'Homeowner',
      phones: ['(509) 555-0123'],
      emails: ['lisa.anderson@email.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Phone'
    },
    contacts: [
      {
        id: 'c1',
        firstName: 'Lisa',
        lastName: 'Anderson',
        role: 'Homeowner',
        phones: ['(509) 555-0123'],
        emails: ['lisa.anderson@email.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Phone'
      },
      {
        id: 'c2',
        firstName: 'John',
        lastName: 'Anderson',
        role: 'Spouse',
        phones: ['(509) 555-0124'],
        emails: ['john.anderson@email.com'],
        isPrimary: false,
        receiveSMS: true,
        receiveEmail: false,
        portalAccess: false,
        preferredContact: 'SMS'
      }
    ],
    properties: [
      {
        id: 'p1',
        address: '123 Main Street',
        city: 'Spokane',
        state: 'WA',
        zip: '99201',
        region: 'North Spokane',
        nickname: 'Primary Residence',
        notes: 'Two dogs, please close gates. Hardwood in living areas.',
        tags: ['High-End', 'Pet Friendly'],
        propertyType: 'Primary'
      }
    ],
    jobs: [
      {
        id: 'j1',
        jobNumber: 'JOB-2024-001',
        status: 'Completed',
        propertyId: 'p1',
        assignedForeman: 'Mike Rodriguez',
        startDate: '2024-01-15',
        endDate: '2024-01-18',
        revenue: 12500,
        progress: 100
      }
    ],
    quotes: [
      {
        id: 'q1',
        quoteNumber: 'QT-2024-045',
        status: 'Accepted',
        propertyId: 'p1',
        amount: 12500,
        date: '2024-01-10'
      }
    ],
    tags: ['VIP', 'Repeat Customer', 'High-End'],
    lastActivity: 'Job completed - 2 weeks ago',
    leadSource: 'Referral',
    assignedManager: 'Sarah Williams',
    lifetimeValue: 28750,
    avatar: 'https://images.unsplash.com/photo-1755914305030-bfc5c0196d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    photos: [
      'https://images.unsplash.com/photo-1693948568453-a3564f179a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkd29vZCUyMGZsb29yaW5nJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2MzQ0MzA4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758548157126-e4c0477f796e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmbG9vciUyMHRpbGVzfGVufDF8fHx8MTc2MzQ0MzA4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1512324725833-abbc95d06090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmbG9vcmluZyUyMGhvbWV8ZW58MXx8fHwxNzYzNDQzMDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1611072337226-1140ab367200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB3b29kJTIwZmxvb3J8ZW58MXx8fHwxNzYzNDQzMDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1759503167282-20525a9a5b80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGZsb29yaW5nJTIwcHJvamVjdHxlbnwxfHx8fDE3NjM0NDMwODh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ]
  },
  {
    id: '2',
    accountName: 'Summit Builders, Inc.',
    clientType: 'Contractor',
    status: 'Active',
    pricingTier: 'Preferred',
    primaryContact: {
      id: 'c3',
      firstName: 'David',
      lastName: 'Chen',
      role: 'General Contractor',
      phones: ['(509) 555-0234'],
      emails: ['david@summitbuilders.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c3',
        firstName: 'David',
        lastName: 'Chen',
        role: 'General Contractor',
        phones: ['(509) 555-0234'],
        emails: ['david@summitbuilders.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Email'
      }
    ],
    properties: [
      {
        id: 'p2',
        address: '456 Oak Avenue',
        city: 'Spokane',
        state: 'WA',
        zip: '99202',
        region: 'Downtown',
        nickname: 'Oak Development',
        notes: 'Multi-unit development project',
        tags: ['Commercial', 'Multi-Unit'],
        propertyType: 'Commercial'
      }
    ],
    jobs: [
      {
        id: 'j2',
        jobNumber: 'JOB-2024-012',
        status: 'In Progress',
        propertyId: 'p2',
        assignedForeman: 'James Cooper',
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        revenue: 45000,
        progress: 65
      }
    ],
    quotes: [
      {
        id: 'q2',
        quoteNumber: 'QT-2024-087',
        status: 'Sent',
        propertyId: 'p2',
        amount: 35000,
        date: '2024-02-10'
      }
    ],
    tags: ['Preferred Partner', 'Volume Discount'],
    lastActivity: 'Quote sent - 3 days ago',
    leadSource: 'Website',
    assignedManager: 'Tom Johnson',
    lifetimeValue: 185000,
    avatar: 'https://images.unsplash.com/photo-1763046472163-32c74523903e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '3',
    accountName: 'Maria Garcia - Interior Design',
    clientType: 'Designer',
    status: 'Active',
    primaryContact: {
      id: 'c4',
      firstName: 'Maria',
      lastName: 'Garcia',
      role: 'Interior Designer',
      phones: ['(509) 555-0345'],
      emails: ['maria@garciadesign.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c4',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'Interior Designer',
        phones: ['(509) 555-0345'],
        emails: ['maria@garciadesign.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Email'
      }
    ],
    properties: [],
    jobs: [],
    quotes: [
      {
        id: 'q3',
        quoteNumber: 'QT-2024-098',
        status: 'Draft',
        propertyId: 'p3',
        amount: 18500,
        date: '2024-02-14'
      }
    ],
    tags: ['Designer Network', 'Showroom Partner'],
    lastActivity: 'Draft quote created - 1 day ago',
    leadSource: 'Trade Show',
    assignedManager: 'Sarah Williams',
    lifetimeValue: 52000,
    avatar: 'https://images.unsplash.com/photo-1685514823717-7e1ff6ee0563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '4',
    accountName: 'Thompson Property Management',
    clientType: 'Property Manager',
    status: 'Active',
    primaryContact: {
      id: 'c5',
      firstName: 'Robert',
      lastName: 'Thompson',
      role: 'Property Manager',
      phones: ['(509) 555-0456'],
      emails: ['robert@thompsonpm.com'],
      isPrimary: true,
      receiveSMS: false,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c5',
        firstName: 'Robert',
        lastName: 'Thompson',
        role: 'Property Manager',
        phones: ['(509) 555-0456'],
        emails: ['robert@thompsonpm.com'],
        isPrimary: true,
        receiveSMS: false,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Email'
      }
    ],
    properties: [
      {
        id: 'p4',
        address: '789 Pine Street',
        city: 'Spokane',
        state: 'WA',
        zip: '99203',
        region: 'South Hill',
        nickname: 'Pine Apartments',
        notes: 'Multi-family rental units',
        tags: ['Rental', 'Multi-Family'],
        propertyType: 'Rental'
      }
    ],
    jobs: [
      {
        id: 'j3',
        jobNumber: 'JOB-2024-008',
        status: 'Scheduled',
        propertyId: 'p4',
        assignedForeman: 'Carlos Martinez',
        startDate: '2024-03-01',
        endDate: '2024-03-05',
        revenue: 22000,
        progress: 0
      }
    ],
    quotes: [],
    tags: ['Volume Customer', 'Monthly Service'],
    lastActivity: 'Job scheduled - 5 days ago',
    leadSource: 'Google Ads',
    assignedManager: 'Tom Johnson',
    lifetimeValue: 95000,
    avatar: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '5',
    accountName: 'Jennifer Martinez',
    clientType: 'Homeowner',
    status: 'Lead',
    primaryContact: {
      id: 'c6',
      firstName: 'Jennifer',
      lastName: 'Martinez',
      role: 'Homeowner',
      phones: ['(509) 555-0567'],
      emails: ['jennifer.martinez@email.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: false,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c6',
        firstName: 'Jennifer',
        lastName: 'Martinez',
        role: 'Homeowner',
        phones: ['(509) 555-0567'],
        emails: ['jennifer.martinez@email.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: false,
        preferredContact: 'Email'
      }
    ],
    properties: [
      {
        id: 'p5',
        address: '321 Elm Street',
        city: 'Spokane',
        state: 'WA',
        zip: '99204',
        region: 'West Spokane',
        nickname: 'Martinez Residence',
        notes: 'Kitchen remodel project',
        tags: ['New Lead'],
        propertyType: 'Primary'
      }
    ],
    jobs: [],
    quotes: [
      {
        id: 'q4',
        quoteNumber: 'QT-2024-102',
        status: 'Draft',
        propertyId: 'p5',
        amount: 15000,
        date: '2024-02-15'
      }
    ],
    tags: ['New Lead'],
    lastActivity: 'Draft quote - Today',
    leadSource: 'Website',
    assignedManager: 'Sarah Williams',
    lifetimeValue: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '6',
    accountName: 'Pacific Construction LLC',
    clientType: 'Contractor',
    status: 'Active',
    primaryContact: {
      id: 'c7',
      firstName: 'Michael',
      lastName: 'Wong',
      role: 'Project Manager',
      phones: ['(509) 555-0678'],
      emails: ['michael@pacificconstruction.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: true,
      preferredContact: 'Phone'
    },
    contacts: [
      {
        id: 'c7',
        firstName: 'Michael',
        lastName: 'Wong',
        role: 'Project Manager',
        phones: ['(509) 555-0678'],
        emails: ['michael@pacificconstruction.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: true,
        preferredContact: 'Phone'
      }
    ],
    properties: [
      {
        id: 'p6',
        address: '555 Riverside Ave',
        city: 'Spokane',
        state: 'WA',
        zip: '99201',
        region: 'Downtown',
        nickname: 'Riverside Tower',
        notes: 'Commercial high-rise project',
        tags: ['Commercial', 'High-Rise'],
        propertyType: 'Commercial'
      }
    ],
    jobs: [],
    quotes: [
      {
        id: 'q5',
        quoteNumber: 'QT-2024-095',
        status: 'Sent',
        propertyId: 'p6',
        amount: 125000,
        date: '2024-02-12'
      }
    ],
    tags: ['Commercial Partner'],
    lastActivity: 'Quote sent - 3 days ago',
    leadSource: 'Referral',
    assignedManager: 'Tom Johnson',
    lifetimeValue: 320000,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '7',
    accountName: 'Sarah & Tom Williams',
    clientType: 'Homeowner',
    status: 'Lead',
    primaryContact: {
      id: 'c8',
      firstName: 'Sarah',
      lastName: 'Williams',
      role: 'Homeowner',
      phones: ['(509) 555-0789'],
      emails: ['sarah.williams@email.com'],
      isPrimary: true,
      receiveSMS: true,
      receiveEmail: true,
      portalAccess: false,
      preferredContact: 'Email'
    },
    contacts: [
      {
        id: 'c8',
        firstName: 'Sarah',
        lastName: 'Williams',
        role: 'Homeowner',
        phones: ['(509) 555-0789'],
        emails: ['sarah.williams@email.com'],
        isPrimary: true,
        receiveSMS: true,
        receiveEmail: true,
        portalAccess: false,
        preferredContact: 'Email'
      }
    ],
    properties: [
      {
        id: 'p7',
        address: '888 Maple Drive',
        city: 'Spokane',
        state: 'WA',
        zip: '99205',
        region: 'North Spokane',
        nickname: 'Williams Home',
        notes: 'Basement renovation',
        tags: ['Renovation'],
        propertyType: 'Primary'
      }
    ],
    jobs: [],
    quotes: [
      {
        id: 'q6',
        quoteNumber: 'QT-2024-089',
        status: 'Declined',
        propertyId: 'p7',
        amount: 28000,
        date: '2024-02-08'
      }
    ],
    tags: ['Price Sensitive'],
    lastActivity: 'Quote declined - 1 week ago',
    leadSource: 'Google Ads',
    assignedManager: 'Sarah Williams',
    lifetimeValue: 0,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
] as const;

export type SampleClient = typeof sampleClients[number];
