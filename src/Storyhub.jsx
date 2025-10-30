import React from 'react'


const Storyhub = () => {
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    desks: [],
    status: null,
    triad: null
  });
  const [activeTags, setActiveTags] = useState([]); // New: Active tag filters
  const [showAllTags, setShowAllTags] = useState(false); // Show all tags or just top 12
  const [tagSearch, setTagSearch] = useState(''); // Search term for tags
  const [tagSearchFocused, setTagSearchFocused] = useState(false); // Is tag search input focused
  const [tagFocusedIndex, setTagFocusedIndex] = useState(-1); // Keyboard navigation index
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [tableViewDensity, setTableViewDensity] = useState('brief'); // 'brief' or 'detailed'
  const [sortColumn, setSortColumn] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('story');
  const [editingItem, setEditingItem] = useState(null);
  const [timeFilter, setTimeFilter] = useState('any-time'); // 'any-time', 'today', 'tomorrow', 'this-week', 'next-week', 'next-month'
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState(null);
  const [contextMenuItem, setContextMenuItem] = useState(null);
  
  // TRIAD Review modal state
  const [showTriadReviewModal, setShowTriadReviewModal] = useState(false);
  const [triadReviewItem, setTriadReviewItem] = useState(null);
  
  // TRIAD Action modal state (for approve/reject)
  const [showTriadActionModal, setShowTriadActionModal] = useState(false);
  const [triadAction, setTriadAction] = useState(null); // 'approve' or 'reject'
  const [triadActionItem, setTriadActionItem] = useState(null);

  // User permissions - in real app this would come from auth/user context
  const currentUser = {
    id: 'user123',
    name: 'Current User',
    isTriadMember: true, // Set to true to see TRIAD actions, false to hide them
    permissions: ['triad-review', 'triad-approve', 'triad-reject']
  };

  const desks = ['Politics', 'Business', 'International', 'National', 'Sports', 'Health', 'Science', 'Graphics', 'Photo', 'Streaming'];

  // Helper function to calculate TRIAD review time remaining
  const getTriadTimeRemaining = (triadReview) => {
    if (!triadReview?.expectedCompletionDate) return null;
    
    const now = new Date();
    const expected = new Date(triadReview.expectedCompletionDate);
    const diffMs = expected - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    const isOverdue = diffMs < 0;
    const isUrgent = Math.abs(diffHours) < 4;
    
    let timeText = '';
    if (isOverdue) {
      const overdueDays = Math.abs(diffDays);
      const overdueHours = Math.abs(diffHours) % 24;
      if (overdueDays > 0) {
        timeText = `${overdueDays}d ${overdueHours}h overdue`;
      } else {
        timeText = `${Math.abs(diffHours)}h overdue`;
      }
    } else {
      if (diffDays > 0) {
        const remainingHours = diffHours % 24;
        timeText = `${diffDays}d ${remainingHours}h remaining`;
      } else {
        timeText = `${diffHours}h remaining`;
      }
    }
    
    return {
      isOverdue,
      isUrgent,
      timeText,
      diffHours
    };
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalType(item.type);
    setShowModal(true);
  };

  const handleSave = (formData) => {
    // Handle save logic here
    setShowModal(false);
    setEditingItem(null);
  };

  // Context menu handlers
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    if (item.type !== 'story') return; // Only show context menu for stories
    
    setContextMenu({
      x: e.pageX,
      y: e.pageY
    });
    setContextMenuItem(item);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
    setContextMenuItem(null);
  };

  const handleTriadReviewRequest = () => {
    setTriadReviewItem(contextMenuItem);
    setShowTriadReviewModal(true);
    closeContextMenu();
  };

  const handleTriadReviewSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urgency = formData.get('urgency');
    const requestedDate = new Date();
    
    // Calculate expected completion date based on urgency
    const expectedCompletionDate = new Date(requestedDate);
    if (urgency === 'urgent') {
      // Same day - add 8 hours
      expectedCompletionDate.setHours(expectedCompletionDate.getHours() + 8);
    } else {
      // Standard - add 36 hours (1.5 days)
      expectedCompletionDate.setHours(expectedCompletionDate.getHours() + 36);
    }
    
    // Update the item in the items array (in a real app, this would update via API)
    const updatedItems = items.map(item => {
      if (item.id === triadReviewItem.id) {
        return {
          ...item,
          triad: 'review-requested',
          triadReview: {
            status: 'review-requested',
            requestedDate: requestedDate.toISOString(),
            expectedCompletionDate: expectedCompletionDate.toISOString(),
            requestedBy: 'Current User', // Would be actual user
            urgency: urgency,
            reason: formData.get('reason')
          }
        };
      }
      return item;
    });
    
    console.log('TRIAD Review Requested:', {
      story: triadReviewItem.title,
      urgency: urgency,
      reason: formData.get('reason'),
      requestedBy: currentUser.name,
      requestedAt: requestedDate.toISOString(),
      expectedCompletion: expectedCompletionDate.toISOString()
    });
    
    // Close modal and show success message
    setShowTriadReviewModal(false);
    setTriadReviewItem(null);
    alert(`TRIAD review requested successfully!\nExpected completion: ${expectedCompletionDate.toLocaleString()}`);
  };

  // TRIAD action handlers
  const handleTriadStartReview = () => {
    const item = contextMenuItem;
    console.log('Starting TRIAD review for:', item.title);
    
    // Update item status to in-review
    // In real app, this would call API
    alert(`Started TRIAD review for: ${item.title}\nReviewer: ${currentUser.name}`);
    closeContextMenu();
  };

  const handleTriadApprove = () => {
    setTriadAction('approve');
    setTriadActionItem(contextMenuItem);
    setShowTriadActionModal(true);
    closeContextMenu();
  };

  const handleTriadReject = () => {
    setTriadAction('reject');
    setTriadActionItem(contextMenuItem);
    setShowTriadActionModal(true);
    closeContextMenu();
  };

  const handleTriadActionSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const notes = formData.get('notes');
    const actionDate = new Date();
    
    console.log(`TRIAD ${triadAction}:`, {
      story: triadActionItem.title,
      action: triadAction,
      reviewer: currentUser.name,
      notes: notes,
      actionDate: actionDate.toISOString()
    });
    
    // Update item status (in real app, this would update via API)
    const statusMessage = triadAction === 'approve' 
      ? `Story "${triadActionItem.title}" has been approved by TRIAD.`
      : `Story "${triadActionItem.title}" has been rejected by TRIAD.`;
    
    setShowTriadActionModal(false);
    setTriadAction(null);
    setTriadActionItem(null);
    alert(statusMessage + `\nReviewer: ${currentUser.name}`);
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) closeContextMenu();
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  // Sample data - 12 of each type
  const items = [
    // ========== STORIES (12) ==========
    {
      id: 1,
      type: 'story',
      title: 'Federal Reserve Signals Rate Cuts Ahead',
      description: 'Chair Powell hints at policy shift in Jackson Hole speech',
      desk: 'Business',
      status: 'published',
      author: 'M. Bouchard',
      updated: 'Oct 20',
      estimatedPublishDate: 'Oct 28',
      created: 'Oct 6',
      tags: ['economy', 'fed', 'interest-rates'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 3,
      canEdit: true
    },
    {
      id: 2,
      type: 'story',
      title: 'Supreme Court Takes Up Abortion Case',
      description: 'Justices to hear challenge to state restrictions',
      desk: 'Politics',
      status: 'published',
      author: 'C. Kline',
      updated: 'Oct 27',
      estimatedPublishDate: 'Oct 28',
      created: 'Oct 13',
      tags: ['scotus', 'abortion', 'politics'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 6,
      hasSponsor: false,
      linkedItems: 5,
      canEdit: true
    },
    {
      id: 3,
      type: 'story',
      title: 'Hurricane Milton Makes Landfall in Florida',
      description: 'Category 4 storm brings catastrophic flooding to Gulf Coast',
      desk: 'National',
      status: 'published',
      author: 'M. Hilk',
      updated: 'Oct 21',
      estimatedPublishDate: 'Oct 29',
      created: 'Oct 12',
      tags: ['hurricane', 'weather', 'florida'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 12,
      hasSponsor: false,
      linkedItems: 18,
      canEdit: false
    },
    {
      id: 4,
      type: 'story',
      title: 'Israel and Hamas Reach Temporary Ceasefire',
      description: 'Six-week pause allows for humanitarian aid delivery',
      desk: 'International',
      status: 'published',
      author: 'P. Rucker',
      updated: 'Oct 17',
      estimatedPublishDate: 'Oct 29',
      created: 'Oct 4',
      tags: ['middle-east', 'israel', 'gaza'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 8,
      hasSponsor: false,
      linkedItems: 14,
      canEdit: true
    },
    {
      id: 5,
      type: 'story',
      title: 'Lakers Eliminate Nuggets in Game 7',
      description: 'LeBron James scores 35 in playoff thriller',
      desk: 'Sports',
      status: 'published',
      author: 'J. DuLac',
      updated: 'Oct 27',
      estimatedPublishDate: 'Oct 30',
      created: 'Oct 16',
      tags: ['nba', 'playoffs', 'lakers'],
      triad: null,
      hasNotes: false,
      hasSponsor: true,
      linkedItems: 6,
      canEdit: true
    },
    {
      id: 6,
      type: 'story',
      title: 'New Alzheimer\'s Drug Shows Promise in Trials',
      description: 'Phase 3 results exceed expectations for memory loss treatment',
      desk: 'Health',
      status: 'published',
      author: 'B. Pearson',
      updated: 'Oct 13',
      estimatedPublishDate: 'Oct 31',
      created: 'Oct 13',
      tags: ['alzheimers', 'medical', 'breakthrough'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 5,
      hasSponsor: false,
      linkedItems: 4,
      canEdit: true
    },
    {
      id: 7,
      type: 'story',
      title: 'SpaceX Launches First Moon Mission Since Apollo',
      description: 'Artemis III astronauts depart for lunar surface',
      desk: 'Science',
      status: 'published',
      author: 'D. Tome',
      updated: 'Oct 4',
      estimatedPublishDate: 'Nov 1',
      created: 'Oct 20',
      tags: ['space', 'nasa', 'moon'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 7,
      hasSponsor: false,
      linkedItems: 9,
      canEdit: true
    },
    {
      id: 8,
      type: 'story',
      title: 'Tech Giants Face New Antitrust Lawsuits',
      description: 'DOJ files monopoly charges against Google and Apple',
      desk: 'Business',
      status: 'published',
      author: 'M. Koetter',
      updated: 'Oct 22',
      estimatedPublishDate: 'Nov 2',
      created: 'Oct 6',
      tags: ['antitrust', 'tech', 'legal'],
      triad: 'pending',
      hasNotes: true,
      noteCount: 9,
      hasSponsor: false,
      linkedItems: 11,
      canEdit: true
    },
    {
      id: 9,
      type: 'story',
      title: 'Senate Passes Bipartisan Infrastructure Bill',
      description: '$500 billion package includes roads, bridges, broadband',
      desk: 'Politics',
      status: 'published',
      author: 'A. Tsui',
      updated: 'Oct 28',
      estimatedPublishDate: 'Nov 5',
      created: 'Oct 9',
      tags: ['infrastructure', 'senate', 'legislation'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 6,
      canEdit: true
    },
    {
      id: 10,
      type: 'story',
      title: 'Wildfire Forces Evacuation of 50,000 in California',
      description: 'Fast-moving blaze threatens suburbs of Los Angeles',
      desk: 'National',
      status: 'published',
      author: 'A. Nutter',
      updated: 'Oct 13',
      estimatedPublishDate: 'Nov 8',
      created: 'Oct 17',
      tags: ['wildfire', 'california', 'evacuation'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 10,
      hasSponsor: false,
      linkedItems: 15,
      canEdit: false
    },
    {
      id: 11,
      type: 'story',
      title: 'Ukraine Retakes Key Eastern City',
      description: 'Military gains momentum in Donbas region',
      desk: 'International',
      status: 'published',
      author: 'A. Wills',
      updated: 'Oct 16',
      estimatedPublishDate: 'Nov 15',
      created: 'Oct 16',
      tags: ['ukraine', 'war', 'russia'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 6,
      hasSponsor: false,
      linkedItems: 8,
      canEdit: true
    },
    {
      id: 12,
      type: 'story',
      title: 'MLB World Series Goes to Game 7',
      description: 'Yankees and Dodgers tied in historic championship',
      desk: 'Sports',
      status: 'published',
      author: 'A. Charalambides',
      updated: 'Oct 21',
      estimatedPublishDate: 'Nov 22',
      created: 'Oct 21',
      tags: ['mlb', 'world-series', 'baseball'],
      triad: null,
      hasNotes: false,
      hasSponsor: true,
      linkedItems: 7,
      canEdit: true
    },


    {
      id: 301,
      type: 'story',
      title: 'Asian Markets Rally on Fed Comments',
      description: 'Regional stocks surge following Powell remarks on rates',
      desk: 'Business',
      status: 'published',
      author: 'M. Bouchard',
      updated: 'Oct 4',
      created: 'Oct 4',
      estimatedPublishDate: 'Oct 4',
      tags: ['markets', 'asia', 'stocks'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true
    },
    {
      id: 302,
      type: 'asset',
      title: 'Market Performance Chart - Asian Indices',
      description: 'Stock market performance visualization',
      desk: 'Graphics',
      status: 'published',
      author: 'C. Kline',
      updated: 'Oct 4',
      created: 'Oct 4',
      estimatedPublishDate: 'Oct 4',
      tags: ['chart', 'markets', 'data'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 303,
      type: 'event',
      title: 'Economic Policy Forum',
      description: 'Panel discussion on global economic outlook',
      desk: 'Business',
      status: 'published',
      author: 'M. Hilk',
      updated: 'Oct 4',
      created: 'Oct 3',
      estimatedPublishDate: 'Oct 4',
      date: 'Oct 4',
      location: 'Washington DC',
      tags: ['economics', 'policy', 'event'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 304,
      type: 'story',
      title: 'Semiconductor Industry Reports Strong Q3',
      description: 'Chip makers exceed earnings expectations',
      desk: 'Business',
      status: 'published',
      author: 'P. Rucker',
      updated: 'Oct 4',
      created: 'Oct 4',
      estimatedPublishDate: 'Oct 4',
      tags: ['semiconductors', 'earnings', 'tech'],
      triad: 'approved',
      hasNotes: false,
      noteCount: 0,
      hasSponsor: true,
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 305,
      type: 'story',
      title: 'Hurricane Season Outlook Updated',
      description: 'NOAA revises forecast as tropical activity increases',
      desk: 'National',
      status: 'idea',
      author: 'J. DuLac',
      updated: 'Oct 5',
      created: 'Oct 5',
      estimatedPublishDate: 'Oct 5',
      tags: ['hurricane', 'weather', 'forecast'],
      triad: 'review-requested',
      triadReview: {
        status: 'review-requested',
        requestedDate: '2025-10-29T10:30:00Z',
        expectedCompletionDate: '2025-10-29T18:30:00Z', // Urgent - 8 hours
        requestedBy: 'J. DuLac',
        urgency: 'urgent',
        reason: 'Story contains unconfirmed forecast data and potential evacuation recommendations that need legal review before publication.'
      },
      hasNotes: true,
      noteCount: 1,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 306,
      type: 'asset',
      title: 'Hurricane Tracking Map Interactive',
      description: 'Real-time storm tracker with projections',
      desk: 'Graphics',
      status: 'draft',
      author: 'B. Pearson',
      updated: 'Oct 5',
      created: 'Oct 5',
      estimatedPublishDate: 'Oct 5',
      tags: ['interactive', 'weather', 'map'],
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 307,
      type: 'story',
      title: 'NASA Announces Mars Sample Return Mission',
      description: 'Agency sets timeline for bringing Martian rocks to Earth',
      desk: 'Science',
      status: 'published',
      author: 'D. Tome',
      updated: 'Oct 5',
      created: 'Oct 5',
      estimatedPublishDate: 'Oct 5',
      tags: ['nasa', 'mars', 'space'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 3,
      canEdit: true
    },
    {
      id: 308,
      type: 'event',
      title: 'NASA Mars Mission Briefing',
      description: 'Officials present sample return timeline',
      desk: 'Science',
      status: 'published',
      author: 'M. Koetter',
      updated: 'Oct 5',
      created: 'Oct 4',
      estimatedPublishDate: 'Oct 5',
      date: 'Oct 5',
      location: 'Kennedy Space Center',
      tags: ['nasa', 'mars', 'briefing'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 309,
      type: 'story',
      title: 'Senate Debates Infrastructure Bill',
      description: 'Bipartisan negotiations continue on transportation funding',
      desk: 'Politics',
      status: 'draft',
      author: 'A. Tsui',
      updated: 'Oct 6',
      created: 'Oct 5',
      estimatedPublishDate: 'Oct 6',
      tags: ['congress', 'infrastructure', 'politics'],
      triad: 'pending',
      hasNotes: true,
      noteCount: 5,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true
    },
    {
      id: 310,
      type: 'event',
      title: 'Senate Infrastructure Vote',
      description: 'Key procedural vote on transportation bill',
      desk: 'Politics',
      status: 'published',
      author: 'A. Nutter',
      updated: 'Oct 6',
      created: 'Oct 5',
      estimatedPublishDate: 'Oct 6',
      date: 'Oct 6',
      location: 'US Capitol',
      tags: ['senate', 'vote', 'infrastructure'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 311,
      type: 'asset',
      title: 'Infrastructure Bill Breakdown Chart',
      description: 'Funding allocation by category',
      desk: 'Graphics',
      status: 'published',
      author: 'A. Wills',
      updated: 'Oct 6',
      created: 'Oct 6',
      estimatedPublishDate: 'Oct 6',
      tags: ['chart', 'infrastructure', 'politics'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 312,
      type: 'story',
      title: 'Major Cyberattack Targets Financial Institutions',
      description: 'Federal agencies investigate coordinated breach',
      desk: 'Business',
      status: 'published',
      author: 'A. Charalambides',
      updated: 'Oct 6',
      created: 'Oct 6',
      estimatedPublishDate: 'Oct 6',
      tags: ['cybersecurity', 'finance', 'breaking'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 8,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true
    },
    {
      id: 313,
      type: 'story',
      title: 'Tech Startup Funding Hits Record High',
      description: 'Q3 venture capital investment surpasses expectations',
      desk: 'Business',
      status: 'published',
      author: 'T. Turner',
      updated: 'Oct 9',
      created: 'Oct 9',
      estimatedPublishDate: 'Oct 9',
      tags: ['startups', 'vc', 'tech'],
      triad: 'approved',
      hasNotes: false,
      noteCount: 0,
      hasSponsor: true,
      linkedItems: 3,
      canEdit: true
    },
    {
      id: 314,
      type: 'asset',
      title: 'VC Funding Trends Chart',
      description: 'Quarterly investment data visualization',
      desk: 'Graphics',
      status: 'published',
      author: 'M. Bouchard',
      updated: 'Oct 9',
      created: 'Oct 9',
      estimatedPublishDate: 'Oct 9',
      tags: ['chart', 'vc', 'data'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 315,
      type: 'event',
      title: 'Tech Investment Summit',
      description: 'Annual gathering of VCs and founders',
      desk: 'Business',
      status: 'published',
      author: 'C. Kline',
      updated: 'Oct 9',
      created: 'Oct 8',
      estimatedPublishDate: 'Oct 9',
      date: 'Oct 9',
      location: 'San Francisco',
      tags: ['tech', 'summit', 'investment'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 316,
      type: 'story',
      title: 'Streaming Service Announces Price Increase',
      description: 'Major platform raises subscription fees 15%',
      desk: 'Entertainment',
      status: 'published',
      author: 'M. Hilk',
      updated: 'Oct 9',
      created: 'Oct 9',
      estimatedPublishDate: 'Oct 9',
      tags: ['streaming', 'entertainment', 'pricing'],
      triad: null,
      hasNotes: false,
      noteCount: 0,
      hasSponsor: false,
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 317,
      type: 'asset',
      title: 'Streaming Price Comparison Chart',
      description: 'Platform pricing across major services',
      desk: 'Graphics',
      status: 'published',
      author: 'P. Rucker',
      updated: 'Oct 9',
      created: 'Oct 9',
      estimatedPublishDate: 'Oct 9',
      tags: ['chart', 'streaming', 'data'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 318,
      type: 'story',
      title: 'UN Climate Report Shows Accelerating Warming',
      description: 'Latest IPCC findings reveal worsening trends',
      desk: 'International',
      status: 'published',
      author: 'J. DuLac',
      updated: 'Oct 10',
      created: 'Oct 10',
      estimatedPublishDate: 'Oct 10',
      tags: ['climate', 'un', 'environment'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 7,
      hasSponsor: false,
      linkedItems: 4,
      canEdit: true
    },
    {
      id: 319,
      type: 'asset',
      title: 'Global Temperature Anomaly Map',
      description: 'Interactive map showing warming patterns',
      desk: 'Graphics',
      status: 'published',
      author: 'B. Pearson',
      updated: 'Oct 10',
      created: 'Oct 10',
      estimatedPublishDate: 'Oct 10',
      tags: ['interactive', 'climate', 'map'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 320,
      type: 'event',
      title: 'UN Climate Report Release',
      description: 'IPCC presents findings to member nations',
      desk: 'International',
      status: 'published',
      author: 'D. Tome',
      updated: 'Oct 10',
      created: 'Oct 9',
      estimatedPublishDate: 'Oct 10',
      date: 'Oct 10',
      location: 'Geneva',
      tags: ['un', 'climate', 'report'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 321,
      type: 'story',
      title: 'Renewable Energy Investment Reaches All-Time High',
      description: 'Global spending on clean energy exceeds fossil fuels',
      desk: 'Business',
      status: 'draft',
      author: 'M. Koetter',
      updated: 'Oct 10',
      created: 'Oct 10',
      estimatedPublishDate: 'Oct 10',
      tags: ['renewable', 'energy', 'investment'],
      triad: 'pending',
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true
    },
    {
      id: 322,
      type: 'asset',
      title: 'Clean Energy Investment Graph',
      description: 'Year-over-year investment trends',
      desk: 'Graphics',
      status: 'draft',
      author: 'A. Tsui',
      updated: 'Oct 10',
      created: 'Oct 10',
      estimatedPublishDate: 'Oct 10',
      tags: ['chart', 'energy', 'data'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 323,
      type: 'story',
      title: 'Oscar Nominations Announced',
      description: 'Academy reveals contenders for major film awards',
      desk: 'Entertainment',
      status: 'published',
      author: 'A. Nutter',
      updated: 'Oct 11',
      created: 'Oct 11',
      estimatedPublishDate: 'Oct 11',
      tags: ['oscars', 'film', 'awards'],
      triad: null,
      hasNotes: false,
      noteCount: 0,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true
    },
    {
      id: 324,
      type: 'asset',
      title: 'Oscar Nominees Gallery',
      description: 'Photo gallery of nominated films and actors',
      desk: 'Photo',
      status: 'published',
      author: 'A. Wills',
      updated: 'Oct 11',
      created: 'Oct 11',
      estimatedPublishDate: 'Oct 11',
      tags: ['photo', 'oscars', 'entertainment'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 325,
      type: 'story',
      title: 'Major Earthquake Strikes Pacific Region',
      description: 'Magnitude 7.2 quake triggers tsunami warnings',
      desk: 'International',
      status: 'draft',
      author: 'A. Charalambides',
      updated: 'Oct 11',
      created: 'Oct 11',
      estimatedPublishDate: 'Oct 11',
      tags: ['earthquake', 'tsunami', 'breaking'],
      triad: 'pending',
      hasNotes: true,
      noteCount: 10,
      hasSponsor: false,
      linkedItems: 3,
      canEdit: true
    },
    {
      id: 326,
      type: 'event',
      title: 'Emergency Response Briefing',
      description: 'Officials provide earthquake damage assessment',
      desk: 'International',
      status: 'published',
      author: 'T. Turner',
      updated: 'Oct 11',
      created: 'Oct 11',
      estimatedPublishDate: 'Oct 11',
      date: 'Oct 11',
      location: 'Tokyo',
      tags: ['earthquake', 'emergency', 'briefing'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 327,
      type: 'asset',
      title: 'Earthquake Intensity Map',
      description: 'Seismic activity visualization',
      desk: 'Graphics',
      status: 'published',
      author: 'M. Bouchard',
      updated: 'Oct 11',
      created: 'Oct 11',
      estimatedPublishDate: 'Oct 11',
      tags: ['map', 'earthquake', 'data'],
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 328,
      type: 'story',
      title: 'NFL Playoff Picture Takes Shape',
      description: 'Key matchups determine postseason contenders',
      desk: 'Sports',
      status: 'published',
      author: 'C. Kline',
      updated: 'Oct 11',
      created: 'Oct 11',
      estimatedPublishDate: 'Oct 11',
      tags: ['nfl', 'playoffs', 'sports'],
      triad: null,
      hasNotes: false,
      noteCount: 0,
      hasSponsor: true,
      linkedItems: 1,
      canEdit: true
    },


    {
      id: 401,
      type: 'story',
      title: 'Grocery Prices Show Signs of Stabilization',
      description: 'Inflation data suggests easing pressure on food costs',
      desk: 'Business',
      status: 'idea',
      author: 'M. Bouchard',
      updated: 'Oct 28',
      created: 'Oct 28',
      estimatedPublishDate: 'Oct 30',
      tags: ['inflation', 'groceries', 'economy'],
      triad: 'review-requested',
      hasNotes: true,
      noteCount: 1,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 402,
      type: 'story',
      title: 'High School Launches AI Literacy Program',
      description: 'District introduces mandatory tech education curriculum',
      desk: 'National',
      status: 'draft',
      author: 'C. Kline',
      updated: 'Oct 27',
      created: 'Oct 26',
      estimatedPublishDate: 'Oct 29',
      tags: ['education', 'ai', 'technology'],
      triad: 'pending',
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 403,
      type: 'story',
      title: 'Breakthrough in Quantum Computing Announced',
      description: 'Scientists achieve error correction milestone',
      desk: 'Science',
      status: 'idea',
      author: 'M. Hilk',
      updated: 'Oct 28',
      created: 'Oct 27',
      estimatedPublishDate: 'Nov 1',
      tags: ['quantum', 'computing', 'research'],
      triad: 'review-requested',
      hasNotes: true,
      noteCount: 2,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 404,
      type: 'story',
      title: 'Housing Market Shows Mixed Signals',
      description: 'Home sales decline but prices remain elevated',
      desk: 'Business',
      status: 'draft',
      author: 'P. Rucker',
      updated: 'Oct 27',
      created: 'Oct 25',
      estimatedPublishDate: 'Oct 29',
      tags: ['housing', 'real-estate', 'economy'],
      triad: 'pending',
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true
    },
    {
      id: 405,
      type: 'story',
      title: 'Water Crisis Deepens in Southwest',
      description: 'Colorado River levels reach historic lows',
      desk: 'National',
      status: 'idea',
      author: 'J. DuLac',
      updated: 'Oct 28',
      created: 'Oct 28',
      estimatedPublishDate: 'Oct 31',
      tags: ['drought', 'water', 'southwest'],
      triad: 'review-requested',
      hasNotes: true,
      noteCount: 5,
      hasSponsor: false,
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 406,
      type: 'story',
      title: 'Social Media Platform Tests Paid Verification',
      description: 'Company introduces subscription tier for blue checks',
      desk: 'Business',
      status: 'draft',
      author: 'B. Pearson',
      updated: 'Oct 26',
      created: 'Oct 24',
      estimatedPublishDate: 'Oct 28',
      tags: ['social-media', 'tech', 'business'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 2,
      hasSponsor: false,
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 407,
      type: 'story',
      title: 'Local Restaurant Industry Faces Labor Shortage',
      description: 'Owners struggle to fill positions as wages rise',
      desk: 'Business',
      status: 'idea',
      author: 'D. Tome',
      updated: 'Oct 27',
      created: 'Oct 26',
      estimatedPublishDate: 'Oct 30',
      tags: ['restaurants', 'labor', 'economy'],
      triad: 'review-requested',
      hasNotes: false,
      noteCount: 0,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 408,
      type: 'story',
      title: 'Winter Storm Forecast Predicts Heavy Snow',
      description: 'Meteorologists track system approaching Northeast',
      desk: 'National',
      status: 'draft',
      author: 'M. Koetter',
      updated: 'Oct 28',
      created: 'Oct 27',
      estimatedPublishDate: 'Oct 29',
      tags: ['weather', 'winter', 'storm'],
      triad: 'pending',
      hasNotes: true,
      noteCount: 6,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true
    },
    {
      id: 409,
      type: 'story',
      title: 'Renewable Energy Storage Breakthrough',
      description: 'New battery technology promises longer duration',
      desk: 'Science',
      status: 'idea',
      author: 'A. Tsui',
      updated: 'Oct 28',
      created: 'Oct 28',
      estimatedPublishDate: 'Nov 2',
      tags: ['energy', 'battery', 'technology'],
      triad: 'review-requested',
      hasNotes: true,
      noteCount: 1,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 410,
      type: 'story',
      title: 'University Tuition Increases Spark Protests',
      description: 'Students organize demonstrations against rising costs',
      desk: 'National',
      status: 'draft',
      author: 'A. Nutter',
      updated: 'Oct 27',
      created: 'Oct 26',
      estimatedPublishDate: 'Oct 29',
      tags: ['education', 'tuition', 'protests'],
      triad: 'pending',
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 1,
      canEdit: true
    },
    {
      id: 411,
      type: 'story',
      title: 'Airline Announces Fleet Modernization Plan',
      description: 'Major carrier to add 50 fuel-efficient aircraft',
      desk: 'Business',
      status: 'idea',
      author: 'A. Wills',
      updated: 'Oct 28',
      created: 'Oct 27',
      estimatedPublishDate: 'Oct 31',
      tags: ['aviation', 'airlines', 'business'],
      triad: 'review-requested',
      hasNotes: false,
      noteCount: 0,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 412,
      type: 'story',
      title: 'Mental Health Services Expand in Rural Areas',
      description: 'Telehealth initiative reaches underserved communities',
      desk: 'Health',
      status: 'draft',
      author: 'A. Charalambides',
      updated: 'Oct 27',
      created: 'Oct 25',
      estimatedPublishDate: 'Oct 30',
      tags: ['mental-health', 'telehealth', 'rural'],
      triad: 'approved',
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true
    },


    {
      id: 501,
      type: 'story',
      title: 'Celebrity Endorsement Deal Falls Through',
      description: 'Major brand partnership collapses amid controversy',
      desk: 'Entertainment',
      status: 'idea',
      author: 'T. Turner',
      updated: 'Oct 26',
      created: 'Oct 25',
      estimatedPublishDate: 'Oct 28',
      tags: ['celebrity', 'endorsement', 'business'],
      triad: 'not-required',
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 502,
      type: 'story',
      title: 'Local Business Faces Health Code Violations',
      description: 'Restaurant temporarily closed pending inspection',
      desk: 'National',
      status: 'draft',
      author: 'M. Bouchard',
      updated: 'Oct 25',
      created: 'Oct 24',
      estimatedPublishDate: 'Oct 27',
      tags: ['restaurant', 'health', 'local'],
      triad: 'not-required',
      hasNotes: true,
      noteCount: 5,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },
    {
      id: 503,
      type: 'story',
      title: 'Unverified Social Media Trend Goes Viral',
      description: 'Misleading claims spread rapidly across platforms',
      desk: 'Business',
      status: 'idea',
      author: 'C. Kline',
      updated: 'Oct 27',
      created: 'Oct 26',
      estimatedPublishDate: 'Oct 29',
      tags: ['social-media', 'misinformation', 'viral'],
      triad: 'not-required',
      hasNotes: true,
      noteCount: 2,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true
    },

    // ========== ASSETS (12) ==========
    {
      id: 20,
      type: 'asset',
      title: 'Hurricane Milton Satellite Loop',
      description: '72-hour satellite imagery showing storm development',
      desk: 'Graphics',
      status: 'published',
      author: 'T. Turner',
      updated: 'Oct 11',
      estimatedPublishDate: 'Oct 11',
      created: 'Oct 9',
      tags: ['hurricane', 'weather', 'satellite'],
      triad: null,
      hasNotes: true,
      noteCount: 2,
      hasSponsor: false,
      linkedItems: 3,
      aspectRatio: '16:9',
      canEdit: true,
      assetType: 'graphic'
    },
    {
      id: 21,
      type: 'asset',
      title: 'Federal Reserve Decision Explainer',
      description: 'Interactive graphic showing rate history and projections',
      desk: 'Graphics',
      status: 'published',
      author: 'M. Bouchard',
      updated: 'Oct 22',
      estimatedPublishDate: 'Oct 22',
      created: 'Oct 11',
      tags: ['economy', 'fed', 'interactive'],
      triad: null,
      hasNotes: false,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true,
      assetType: 'interactive'
    },
    {
      id: 22,
      type: 'asset',
      title: 'Gaza Ceasefire Map',
      description: 'Territory controlled by each side with aid corridors',
      desk: 'Graphics',
      status: 'published',
      author: 'C. Kline',
      updated: 'Oct 4',
      estimatedPublishDate: 'Oct 4',
      created: 'Oct 28',
      tags: ['map', 'middle-east', 'ceasefire'],
      triad: null,
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 4,
      canEdit: true,
      assetType: 'graphic'
    },
    {
      id: 23,
      type: 'asset',
      title: 'Artemis Launch Sequence Video',
      description: '2-minute video of rocket liftoff and separation',
      desk: 'Photo',
      status: 'published',
      author: 'M. Hilk',
      updated: 'Oct 28',
      estimatedPublishDate: 'Oct 28',
      created: 'Oct 16',
      tags: ['space', 'nasa', 'video'],
      triad: null,
      hasNotes: false,
      hasSponsor: false,
      linkedItems: 2,
      aspectRatio: '16:9',
      canEdit: true,
      assetType: 'video'
    },
    {
      id: 24,
      type: 'asset',
      title: 'Hurricane Damage Photo Gallery',
      description: '30 photos documenting destruction across Florida',
      desk: 'Photo',
      status: 'published',
      author: 'P. Rucker',
      updated: 'Oct 6',
      estimatedPublishDate: 'Oct 6',
      created: 'Oct 11',
      tags: ['photo', 'hurricane', 'damage'],
      triad: null,
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 3,
      canEdit: false,
      assetType: 'photo'
    },
    {
      id: 25,
      type: 'asset',
      title: 'Antitrust Cases Timeline',
      description: 'Interactive timeline of major tech monopoly cases',
      desk: 'Graphics',
      status: 'published',
      author: 'J. DuLac',
      updated: 'Oct 18',
      estimatedPublishDate: 'Oct 18',
      created: 'Oct 9',
      tags: ['timeline', 'antitrust', 'tech'],
      triad: null,
      hasNotes: true,
      noteCount: 2,
      hasSponsor: false,
      linkedItems: 5,
      canEdit: true,
      assetType: 'interactive'
    },
    {
      id: 26,
      type: 'asset',
      title: 'Lakers Game 7 Photo Package',
      description: 'Key moments from playoff elimination game',
      desk: 'Photo',
      status: 'published',
      author: 'B. Pearson',
      updated: 'Oct 12',
      estimatedPublishDate: 'Oct 12',
      created: 'Oct 5',
      tags: ['photo', 'nba', 'playoffs'],
      triad: null,
      hasNotes: false,
      hasSponsor: true,
      linkedItems: 1,
      canEdit: true,
      assetType: 'photo'
    },
    {
      id: 27,
      type: 'asset',
      title: 'Infrastructure Bill Breakdown',
      description: 'Infographic showing where $500B will be spent',
      desk: 'Graphics',
      status: 'published',
      author: 'D. Tome',
      updated: 'Oct 9',
      estimatedPublishDate: 'Oct 9',
      created: 'Oct 9',
      tags: ['infographic', 'infrastructure', 'budget'],
      triad: null,
      hasNotes: true,
      noteCount: 1,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true,
      assetType: 'graphic'
    },
    {
      id: 28,
      type: 'asset',
      title: 'California Wildfire Map',
      description: 'Live-updating map of fire perimeter and evacuations',
      desk: 'Graphics',
      status: 'published',
      author: 'M. Koetter',
      updated: 'Oct 4',
      estimatedPublishDate: 'Oct 4',
      created: 'Oct 16',
      tags: ['map', 'wildfire', 'live'],
      triad: null,
      hasNotes: true,
      noteCount: 5,
      hasSponsor: false,
      linkedItems: 4,
      canEdit: false,
      assetType: 'interactive'
    },
    {
      id: 29,
      type: 'asset',
      title: 'Supreme Court Portrait Series',
      description: 'Individual portraits of all nine justices',
      desk: 'Photo',
      status: 'published',
      author: 'A. Tsui',
      updated: 'Oct 16',
      estimatedPublishDate: 'Oct 16',
      created: 'Oct 20',
      tags: ['photo', 'scotus', 'portrait'],
      triad: null,
      hasNotes: false,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true,
      assetType: 'photo'
    },
    {
      id: 30,
      type: 'asset',
      title: 'Ukraine War Map Update',
      description: 'Territory gains and losses over past 30 days',
      desk: 'Graphics',
      status: 'published',
      author: 'A. Nutter',
      updated: 'Oct 20',
      estimatedPublishDate: 'Oct 20',
      created: 'Oct 21',
      tags: ['map', 'ukraine', 'war'],
      triad: null,
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 3,
      canEdit: true,
      assetType: 'graphic'
    },
    {
      id: 31,
      type: 'asset',
      title: 'Alzheimer\'s Drug Mechanism Explainer',
      description: 'Animated graphic showing how treatment works',
      desk: 'Graphics',
      status: 'published',
      author: 'A. Wills',
      updated: 'Oct 5',
      estimatedPublishDate: 'Oct 5',
      created: 'Oct 5',
      tags: ['medical', 'explainer', 'alzheimers'],
      triad: null,
      hasNotes: true,
      noteCount: 2,
      hasSponsor: false,
      linkedItems: 1,
      canEdit: true,
      assetType: 'graphic'
    },

    // ========== EVENTS (12) ==========
    {
      id: 40,
      type: 'event',
      title: 'Federal Reserve Press Conference',
      description: 'Chair Powell discusses rate decision',
      desk: 'Business',
      status: null,
      author: 'A. Charalambides',
      eventDate: 'Oct 26',
      eventTime: '14:30',
      location: 'Washington, D.C.',
      updated: 'Oct 6',
      created: 'Oct 20',
      tags: ['fed', 'economy', 'press-conference'],
      triad: null,
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 4,
      canEdit: true
    },
    {
      id: 41,
      type: 'event',
      title: 'Supreme Court Oral Arguments',
      description: 'Abortion rights case begins',
      desk: 'Politics',
      status: null,
      author: 'T. Turner',
      eventDate: 'Oct 27',
      eventTime: '10:00',
      location: 'Supreme Court',
      updated: 'Oct 17',
      created: 'Oct 9',
      tags: ['scotus', 'abortion', 'oral-arguments'],
      triad: null,
      hasNotes: true,
      noteCount: 5,
      hasSponsor: false,
      linkedItems: 6,
      canEdit: true
    },
    {
      id: 42,
      type: 'event',
      title: 'Hurricane Milton Briefing',
      description: 'NOAA and FEMA update on storm response',
      desk: 'National',
      status: null,
      author: 'M. Bouchard',
      eventDate: 'Oct 25',
      eventTime: '16:00',
      location: 'Virtual',
      updated: 'Oct 6',
      created: 'Oct 16',
      tags: ['hurricane', 'briefing', 'fema'],
      triad: null,
      hasNotes: true,
      noteCount: 8,
      hasSponsor: false,
      linkedItems: 7,
      canEdit: false
    },
    {
      id: 43,
      type: 'event',
      title: 'UN Security Council Meeting on Gaza',
      description: 'Emergency session to discuss ceasefire',
      desk: 'International',
      status: null,
      author: 'C. Kline',
      eventDate: 'Oct 26',
      eventTime: '09:00',
      location: 'New York',
      updated: 'Oct 10',
      created: 'Oct 13',
      tags: ['un', 'gaza', 'ceasefire'],
      triad: null,
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 5,
      canEdit: true
    },
    {
      id: 44,
      type: 'event',
      title: 'Lakers vs Nuggets Game 7',
      description: 'NBA Western Conference Finals deciding game',
      desk: 'Sports',
      status: null,
      author: 'M. Hilk',
      eventDate: 'Oct 24',
      eventTime: '20:00',
      location: 'Crypto.com Arena',
      updated: 'Oct 6',
      created: 'Oct 20',
      tags: ['nba', 'playoffs', 'game-7'],
      triad: null,
      hasNotes: false,
      hasSponsor: true,
      linkedItems: 8,
      canEdit: true
    },
    {
      id: 45,
      type: 'event',
      title: 'FDA Advisory Committee Meeting',
      description: 'Panel reviews Alzheimer\'s drug application',
      desk: 'Health',
      status: null,
      author: 'P. Rucker',
      eventDate: 'Oct 28',
      eventTime: '11:00',
      location: 'Virtual',
      updated: 'Oct 4',
      created: 'Oct 6',
      tags: ['fda', 'alzheimers', 'approval'],
      triad: null,
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 3,
      canEdit: true
    },
    {
      id: 46,
      type: 'event',
      title: 'NASA Artemis III Landing',
      description: 'Astronauts touch down at lunar south pole',
      desk: 'Science',
      status: null,
      author: 'J. DuLac',
      eventDate: 'Oct 27',
      eventTime: '08:30',
      location: 'Moon',
      updated: 'Oct 22',
      created: 'Oct 10',
      tags: ['nasa', 'moon', 'landing'],
      triad: null,
      hasNotes: true,
      noteCount: 6,
      hasSponsor: false,
      linkedItems: 9,
      canEdit: true
    },
    {
      id: 47,
      type: 'event',
      title: 'Tech CEO Congressional Testimony',
      description: 'Google and Apple executives face antitrust questions',
      desk: 'Business',
      status: null,
      author: 'B. Pearson',
      eventDate: 'Oct 29',
      eventTime: '09:30',
      location: 'Capitol Hill',
      updated: 'Oct 6',
      created: 'Oct 21',
      tags: ['antitrust', 'congress', 'tech'],
      triad: null,
      hasNotes: true,
      noteCount: 7,
      hasSponsor: false,
      linkedItems: 10,
      canEdit: true
    },
    {
      id: 48,
      type: 'event',
      title: 'Infrastructure Bill Signing Ceremony',
      description: 'President signs $500B package into law',
      desk: 'Politics',
      status: null,
      author: 'D. Tome',
      eventDate: 'Oct 26',
      eventTime: '13:00',
      location: 'White House',
      updated: 'Oct 23',
      created: 'Oct 22',
      tags: ['infrastructure', 'signing', 'white-house'],
      triad: null,
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 5,
      canEdit: true
    },
    {
      id: 49,
      type: 'event',
      title: 'California Fire Containment Update',
      description: 'Cal Fire press conference on firefighting progress',
      desk: 'National',
      status: null,
      author: 'M. Koetter',
      eventDate: 'Oct 26',
      eventTime: '15:00',
      location: 'Los Angeles',
      updated: 'Oct 4',
      created: 'Oct 24',
      tags: ['wildfire', 'cal-fire', 'briefing'],
      triad: null,
      hasNotes: true,
      noteCount: 6,
      hasSponsor: false,
      linkedItems: 7,
      canEdit: false
    },
    {
      id: 50,
      type: 'event',
      title: 'Ukraine Military Briefing',
      description: 'Defense officials discuss eastern offensive',
      desk: 'International',
      status: null,
      author: 'A. Tsui',
      eventDate: 'Oct 25',
      eventTime: '12:00',
      location: 'Kyiv',
      updated: 'Oct 10',
      created: 'Oct 6',
      tags: ['ukraine', 'military', 'briefing'],
      triad: null,
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 6,
      canEdit: true
    },
    {
      id: 51,
      type: 'event',
      title: 'World Series Game 7',
      description: 'Yankees vs Dodgers championship decider',
      desk: 'Sports',
      status: null,
      author: 'A. Nutter',
      eventDate: 'Oct 26',
      eventTime: '19:00',
      location: 'Yankee Stadium',
      updated: 'Oct 27',
      created: 'Oct 4',
      tags: ['mlb', 'world-series', 'game-7'],
      triad: null,
      hasNotes: false,
      hasSponsor: true,
      linkedItems: 8,
      canEdit: true
    },

    // ========== GUIDANCE (12) ==========
    {
      id: 60,
      type: 'guidance',
      title: 'Pass on Minor Fed Official Speech',
      description: 'Regional Fed president remarks don\'t add newsworthy info',
      desk: 'Business',
      status: null,
      author: 'A. Wills',
      updated: 'Oct 11',
      created: 'Oct 12',
      tags: ['guidance', 'fed'],
      triad: null,
      hasNotes: true,
      noteCount: 1,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true,
      guidanceType: 'pass'
    },
    {
      id: 61,
      type: 'guidance',
      title: 'Alert: Potential Supreme Court Leak',
      description: 'Sources indicate opinion may drop early, all hands on deck',
      desk: 'Politics',
      status: null,
      author: 'A. Charalambides',
      updated: 'Oct 5',
      created: 'Oct 24',
      tags: ['guidance', 'scotus', 'alert'],
      triad: null,
      hasNotes: true,
      noteCount: 6,
      hasSponsor: false,
      linkedItems: 3,
      canEdit: true,
      guidanceType: 'alert'
    },
    {
      id: 62,
      type: 'guidance',
      title: 'Fold Minor Hurricane Updates',
      description: 'Combine routine storm updates into evening roundup',
      desk: 'National',
      status: null,
      author: 'T. Turner',
      updated: 'Oct 13',
      created: 'Oct 21',
      tags: ['guidance', 'hurricane'],
      triad: null,
      hasNotes: true,
      noteCount: 2,
      hasSponsor: false,
      linkedItems: 1,
      canEdit: false,
      guidanceType: 'fold'
    },
    {
      id: 63,
      type: 'guidance',
      title: 'Pass on Routine Ceasefire Violation',
      description: 'Small-scale incident doesn\'t warrant standalone story',
      desk: 'International',
      status: null,
      author: 'International Editor',
      updated: 'Oct 28',
      created: 'Oct 12',
      tags: ['guidance', 'gaza'],
      triad: null,
      hasNotes: true,
      noteCount: 1,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true,
      guidanceType: 'pass'
    },
    {
      id: 64,
      type: 'guidance',
      title: 'Alert: NASA May Move Up Landing',
      description: 'Monitor for potential schedule change, have crew ready',
      desk: 'Science',
      status: null,
      author: 'Science Editor',
      updated: 'Oct 22',
      created: 'Oct 24',
      tags: ['guidance', 'nasa', 'alert'],
      triad: null,
      hasNotes: true,
      noteCount: 4,
      hasSponsor: false,
      linkedItems: 5,
      canEdit: true,
      guidanceType: 'alert'
    },
    {
      id: 65,
      type: 'guidance',
      title: 'Fold Routine Earnings Reports',
      description: 'Combine multiple tech earnings into single analysis piece',
      desk: 'Business',
      status: null,
      author: 'Business Editor',
      updated: 'Oct 23',
      created: 'Oct 23',
      tags: ['guidance', 'earnings'],
      triad: null,
      hasNotes: true,
      noteCount: 2,
      hasSponsor: false,
      linkedItems: 4,
      canEdit: true,
      guidanceType: 'fold'
    },
    {
      id: 66,
      type: 'guidance',
      title: 'Pass on Minor Congressional Vote',
      description: 'Procedural vote not significant enough for coverage',
      desk: 'Politics',
      status: null,
      author: 'Politics Editor',
      updated: 'Oct 25',
      created: 'Oct 21',
      tags: ['guidance', 'congress'],
      triad: null,
      hasNotes: false,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true,
      guidanceType: 'pass'
    },
    {
      id: 67,
      type: 'guidance',
      title: 'Alert: Wildfire Spreading Rapidly',
      description: 'Fire jumped containment lines, prepare for major coverage',
      desk: 'National',
      status: null,
      author: 'National Editor',
      updated: 'Oct 25',
      created: 'Oct 23',
      tags: ['guidance', 'wildfire', 'alert'],
      triad: null,
      hasNotes: true,
      noteCount: 8,
      hasSponsor: false,
      linkedItems: 6,
      canEdit: false,
      guidanceType: 'alert'
    },
    {
      id: 68,
      type: 'guidance',
      title: 'Fold Minor Ukraine Skirmishes',
      description: 'Include small engagements in daily war update',
      desk: 'International',
      status: null,
      author: 'International Editor',
      updated: 'Oct 24',
      created: 'Oct 24',
      tags: ['guidance', 'ukraine'],
      triad: null,
      hasNotes: true,
      noteCount: 1,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true,
      guidanceType: 'fold'
    },
    {
      id: 69,
      type: 'guidance',
      title: 'Pass on Routine Sports Injury',
      description: 'Minor player injury not newsworthy outside sports section',
      desk: 'Sports',
      status: null,
      author: 'Sports Editor',
      updated: 'Oct 24',
      created: 'Oct 24',
      tags: ['guidance', 'sports'],
      triad: null,
      hasNotes: false,
      hasSponsor: false,
      linkedItems: 0,
      canEdit: true,
      guidanceType: 'pass'
    },
    {
      id: 70,
      type: 'guidance',
      title: 'Alert: FDA May Fast-Track Approval',
      description: 'Sources say Alzheimer\'s drug decision coming early',
      desk: 'Health',
      status: null,
      author: 'Health Editor',
      updated: 'Oct 25',
      created: 'Oct 25',
      tags: ['guidance', 'fda', 'alert'],
      triad: null,
      hasNotes: true,
      noteCount: 3,
      hasSponsor: false,
      linkedItems: 2,
      canEdit: true,
      guidanceType: 'alert'
    },
    {
      id: 71,
      type: 'guidance',
      title: 'Fold Minor Antitrust Filings',
      description: 'Combine procedural legal docs into weekly roundup',
      desk: 'Business',
      status: null,
      author: 'Business Editor',
      updated: 'Oct 25',
      created: 'Oct 25',
      tags: ['guidance', 'antitrust'],
      triad: null,
      hasNotes: true,
      noteCount: 1,
      hasSponsor: false,
      linkedItems: 1,
      canEdit: true,
      guidanceType: 'fold'
    },

    // ========== STORYLINES (12) ==========
    {
      id: 80,
      type: 'storyline',
      title: 'Hurricane Milton Coverage',
      description: 'Comprehensive tracking of Category 4 storm impact on Florida',
      desk: 'National',
      status: null,
      author: 'K. Williams',
      updated: 'Ongoing',
      created: 'Oct 22',
      tags: ['hurricane', 'milton', 'florida'],
      triad: null,
      hasNotes: true,
      noteCount: 15,
      hasSponsor: false,
      linkedItems: 28,
      canEdit: false,
      deskLeads: ['K. Williams', 'E. Rodriguez'],
      slackChannel: '#storyline-milton',
      storylineNotes: 'Major Category 4 hurricane causing catastrophic flooding along Florida Gulf Coast. Coverage includes storm tracking, damage assessment, evacuation efforts, and recovery operations.',
      storylineAssets: [
        { id: 1000, type: 'video', title: 'Video Asset 1' },
        { id: 1001, type: 'video', title: 'Video Asset 2' },
        { id: 1002, type: 'video', title: 'Video Asset 3' },
        { id: 1003, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1004, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1005, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1006, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1007, type: 'photo', title: 'Photo Asset 1' }
      ],
      storylineStories: [
        { id: 3, type: 'story', title: 'Hurricane Milton Makes Landfall in Florida' }
      ],
      storylineEvents: [
        { id: 42, title: 'Hurricane Milton Briefing', date: 'Nov 12' }
      ]
    },
    {
      id: 81,
      type: 'storyline',
      title: 'Federal Reserve Rate Policy 2025',
      description: 'Coverage of Fed decisions and economic impact',
      desk: 'Business',
      status: null,
      author: 'J. Martinez',
      updated: 'Ongoing',
      created: 'Oct 10',
      tags: ['fed', 'economy', 'rates'],
      triad: null,
      hasNotes: true,
      noteCount: 12,
      hasSponsor: false,
      linkedItems: 18,
      canEdit: true,
      deskLeads: ['J. Martinez', 'L. Park'],
      slackChannel: '#storyline-fed-policy',
      storylineNotes: 'Ongoing coverage of Federal Reserve monetary policy decisions, interest rate changes, and economic indicators. Focus on inflation data and Powell statements.',
      storylineAssets: [
        { id: 1100, type: 'video', title: 'Video Asset 1' },
        { id: 1101, type: 'video', title: 'Video Asset 2' },
        { id: 1102, type: 'video', title: 'Video Asset 3' },
        { id: 1103, type: 'video', title: 'Video Asset 4' },
        { id: 1104, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1105, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1106, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1107, type: 'graphic', title: 'Graphic Asset 4' },
        { id: 1108, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1109, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1110, type: 'photo', title: 'Photo Asset 1' },
        { id: 1111, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 1, type: 'story', title: 'Federal Reserve Signals Rate Cuts Ahead' }
      ],
      storylineEvents: [
        { id: 40, title: 'Federal Reserve Press Conference', date: 'Oct 26' }
      ]
    },
    {
      id: 82,
      type: 'storyline',
      title: 'Supreme Court 2025-26 Term',
      description: 'Major cases including abortion, voting rights, and gun control',
      desk: 'Politics',
      status: null,
      author: 'A. Chen',
      updated: 'Ongoing',
      created: 'Oct 5',
      tags: ['scotus', 'term', 'cases'],
      triad: null,
      hasNotes: true,
      noteCount: 22,
      hasSponsor: false,
      linkedItems: 31,
      canEdit: true,
      deskLeads: ['A. Chen', 'D. Thompson'],
      slackChannel: '#storyline-scotus-term',
      storylineNotes: 'Complete coverage of Supreme Court 2025-26 term including major cases on abortion rights, voting access, gun regulations, and administrative law. Oral arguments, decisions, and analysis.',
      storylineAssets: [
        { id: 1200, type: 'video', title: 'Video Asset 1' },
        { id: 1201, type: 'video', title: 'Video Asset 2' },
        { id: 1202, type: 'video', title: 'Video Asset 3' },
        { id: 1203, type: 'video', title: 'Video Asset 4' },
        { id: 1204, type: 'video', title: 'Video Asset 5' },
        { id: 1205, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1206, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1207, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1208, type: 'graphic', title: 'Graphic Asset 4' },
        { id: 1209, type: 'graphic', title: 'Graphic Asset 5' },
        { id: 1210, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1211, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1212, type: 'interactive', title: 'Interactive Asset 3' },
        { id: 1213, type: 'photo', title: 'Photo Asset 1' },
        { id: 1214, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 2, type: 'story', title: 'Supreme Court Takes Up Abortion Case' }
      ],
      storylineEvents: [
        { id: 41, title: 'Supreme Court Oral Arguments', date: 'Oct 27' }
      ]
    },
    {
      id: 83,
      type: 'storyline',
      title: 'Israel-Gaza Conflict 2025',
      description: 'Ongoing coverage of ceasefire negotiations and humanitarian crisis',
      desk: 'International',
      status: null,
      author: 'M. Cohen',
      updated: 'Ongoing',
      created: 'Oct 11',
      tags: ['gaza', 'israel', 'conflict'],
      triad: null,
      hasNotes: true,
      noteCount: 34,
      hasSponsor: false,
      linkedItems: 47,
      canEdit: true,
      deskLeads: ['M. Cohen', 'R. Hassan'],
      slackChannel: '#storyline-gaza',
      storylineNotes: 'Comprehensive coverage of Israel-Gaza conflict including ceasefire negotiations, humanitarian aid efforts, diplomatic initiatives, and regional implications. UN involvement and international response.',
      storylineAssets: [
        { id: 1300, type: 'video', title: 'Video Asset 1' },
        { id: 1301, type: 'video', title: 'Video Asset 2' },
        { id: 1302, type: 'video', title: 'Video Asset 3' },
        { id: 1303, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1304, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1305, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1306, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1307, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1308, type: 'photo', title: 'Photo Asset 1' },
        { id: 1309, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 4, type: 'story', title: 'Israel and Hamas Reach Temporary Ceasefire' }
      ],
      storylineEvents: [
        { id: 43, title: 'UN Security Council Meeting on Gaza', date: 'Oct 26' }
      ]
    },
    {
      id: 84,
      type: 'storyline',
      title: 'NBA Playoffs 2025',
      description: 'Complete coverage from conference finals through championship',
      desk: 'Sports',
      status: null,
      author: 'T. Johnson',
      updated: 'Ongoing',
      created: 'Oct 10',
      tags: ['nba', 'playoffs', 'basketball'],
      triad: null,
      hasNotes: true,
      noteCount: 8,
      hasSponsor: true,
      linkedItems: 24,
      canEdit: true,
      deskLeads: ['T. Johnson', 'B. Anderson'],
      slackChannel: '#storyline-nba-playoffs',
      storylineNotes: 'Complete playoff coverage including game recaps, player features, analysis, and championship series. Focus on Lakers-Nuggets conference finals.',
      storylineAssets: [
        { id: 1400, type: 'video', title: 'Video Asset 1' },
        { id: 1401, type: 'video', title: 'Video Asset 2' },
        { id: 1402, type: 'video', title: 'Video Asset 3' },
        { id: 1403, type: 'video', title: 'Video Asset 4' },
        { id: 1404, type: 'video', title: 'Video Asset 5' },
        { id: 1405, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1406, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1407, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1408, type: 'graphic', title: 'Graphic Asset 4' },
        { id: 1409, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1410, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1411, type: 'interactive', title: 'Interactive Asset 3' },
        { id: 1412, type: 'photo', title: 'Photo Asset 1' },
        { id: 1413, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 5, type: 'story', title: 'Lakers Eliminate Nuggets in Game 7' }
      ],
      storylineEvents: [
        { id: 44, title: 'Lakers vs Nuggets Game 7', date: 'Oct 24' }
      ]
    },
    {
      id: 85,
      type: 'storyline',
      title: 'Artemis Moon Program',
      description: 'NASA\'s return to the moon and lunar base plans',
      desk: 'Science',
      status: null,
      author: 'R. Kumar',
      updated: 'Ongoing',
      created: 'Oct 18',
      tags: ['nasa', 'artemis', 'moon'],
      triad: null,
      hasNotes: true,
      noteCount: 18,
      hasSponsor: false,
      linkedItems: 26,
      canEdit: true,
      deskLeads: ['R. Kumar'],
      slackChannel: '#storyline-artemis',
      storylineNotes: 'Coverage of NASA Artemis program including launch, lunar landing, scientific objectives, and plans for permanent lunar base. First crewed moon mission since Apollo.',
      storylineAssets: [
        { id: 1500, type: 'video', title: 'Video Asset 1' },
        { id: 1501, type: 'video', title: 'Video Asset 2' },
        { id: 1502, type: 'video', title: 'Video Asset 3' },
        { id: 1503, type: 'video', title: 'Video Asset 4' },
        { id: 1504, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1505, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1506, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1507, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1508, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1509, type: 'photo', title: 'Photo Asset 1' },
        { id: 1510, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 7, type: 'story', title: 'SpaceX Launches First Moon Mission Since Apollo' }
      ],
      storylineEvents: [
        { id: 46, title: 'NASA Artemis III Landing', date: 'Oct 27' }
      ]
    },
    {
      id: 86,
      type: 'storyline',
      title: 'Tech Antitrust Cases',
      description: 'DOJ lawsuits against major tech companies',
      desk: 'Business',
      status: null,
      author: 'L. Park',
      updated: 'Ongoing',
      created: 'Oct 12',
      tags: ['antitrust', 'tech', 'legal'],
      triad: null,
      hasNotes: true,
      noteCount: 20,
      hasSponsor: false,
      linkedItems: 29,
      canEdit: true,
      deskLeads: ['L. Park', 'J. Martinez'],
      slackChannel: '#storyline-tech-antitrust',
      storylineNotes: 'DOJ monopoly lawsuits against Google, Apple, and other major tech companies. Coverage of legal proceedings, regulatory actions, and potential breakup scenarios.',
      storylineAssets: [
        { id: 1600, type: 'video', title: 'Video Asset 1' },
        { id: 1601, type: 'video', title: 'Video Asset 2' },
        { id: 1602, type: 'video', title: 'Video Asset 3' },
        { id: 1603, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1604, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1605, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1606, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1607, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1608, type: 'photo', title: 'Photo Asset 1' }
      ],
      storylineStories: [
        { id: 8, type: 'story', title: 'Tech Giants Face New Antitrust Lawsuits' }
      ],
      storylineEvents: [
        { id: 47, title: 'Tech CEO Congressional Testimony', date: 'Oct 29' }
      ]
    },
    {
      id: 87,
      type: 'storyline',
      title: '2026 Infrastructure Implementation',
      description: 'Tracking $500B bill rollout across states',
      desk: 'Politics',
      status: null,
      author: 'D. Thompson',
      updated: 'Ongoing',
      created: 'Oct 20',
      tags: ['infrastructure', 'implementation'],
      triad: null,
      hasNotes: true,
      noteCount: 11,
      hasSponsor: false,
      linkedItems: 15,
      canEdit: true,
      deskLeads: ['D. Thompson'],
      slackChannel: '#storyline-infrastructure',
      storylineNotes: 'Tracking implementation of $500 billion infrastructure package across states. Coverage of project announcements, funding allocation, construction progress, and economic impact.',
      storylineAssets: [
        { id: 1700, type: 'video', title: 'Video Asset 1' },
        { id: 1701, type: 'video', title: 'Video Asset 2' },
        { id: 1702, type: 'video', title: 'Video Asset 3' },
        { id: 1703, type: 'video', title: 'Video Asset 4' },
        { id: 1704, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1705, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1706, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1707, type: 'graphic', title: 'Graphic Asset 4' },
        { id: 1708, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1709, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1710, type: 'interactive', title: 'Interactive Asset 3' },
        { id: 1711, type: 'photo', title: 'Photo Asset 1' },
        { id: 1712, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 9, type: 'story', title: 'Senate Passes Bipartisan Infrastructure Bill' }
      ],
      storylineEvents: [
        { id: 48, title: 'Infrastructure Bill Signing Ceremony', date: 'Oct 26' }
      ]
    },
    {
      id: 88,
      type: 'storyline',
      title: 'California Wildfire Season 2025',
      description: 'Coverage of major fires and climate connection',
      desk: 'National',
      status: null,
      author: 'E. Rodriguez',
      updated: 'Ongoing',
      created: 'Oct 18',
      tags: ['wildfire', 'california', 'climate'],
      triad: null,
      hasNotes: true,
      noteCount: 25,
      hasSponsor: false,
      linkedItems: 38,
      canEdit: false,
      deskLeads: ['E. Rodriguez', 'K. Williams'],
      slackChannel: '#storyline-wildfires',
      storylineNotes: 'Comprehensive wildfire coverage including fire tracking, evacuation orders, containment efforts, air quality impacts, and climate change connection. Focus on Los Angeles area threats.',
      storylineAssets: [
        { id: 1800, type: 'video', title: 'Video Asset 1' },
        { id: 1801, type: 'video', title: 'Video Asset 2' },
        { id: 1802, type: 'video', title: 'Video Asset 3' },
        { id: 1803, type: 'video', title: 'Video Asset 4' },
        { id: 1804, type: 'video', title: 'Video Asset 5' },
        { id: 1805, type: 'video', title: 'Video Asset 6' },
        { id: 1806, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1807, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1808, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1809, type: 'graphic', title: 'Graphic Asset 4' },
        { id: 1810, type: 'graphic', title: 'Graphic Asset 5' },
        { id: 1811, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1812, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1813, type: 'interactive', title: 'Interactive Asset 3' },
        { id: 1814, type: 'photo', title: 'Photo Asset 1' },
        { id: 1815, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 10, type: 'story', title: 'Wildfire Forces Evacuation of 50,000 in California' }
      ],
      storylineEvents: [
        { id: 49, title: 'California Fire Containment Update', date: 'Oct 26' }
      ]
    },
    {
      id: 89,
      type: 'storyline',
      title: 'Ukraine War: Eastern Offensive',
      description: 'Ukrainian military advances in Donbas region',
      desk: 'International',
      status: null,
      author: 'N. Ivanov',
      updated: 'Ongoing',
      created: 'Oct 6',
      tags: ['ukraine', 'war', 'offensive'],
      triad: null,
      hasNotes: true,
      noteCount: 19,
      hasSponsor: false,
      linkedItems: 32,
      canEdit: true,
      deskLeads: ['N. Ivanov', 'M. Cohen'],
      slackChannel: '#storyline-ukraine-offensive',
      storylineNotes: 'Coverage of Ukrainian military offensive in eastern Donbas region. Territory gains, Russian response, international support, and strategic analysis.',
      storylineAssets: [
        { id: 1900, type: 'video', title: 'Video Asset 1' },
        { id: 1901, type: 'video', title: 'Video Asset 2' },
        { id: 1902, type: 'video', title: 'Video Asset 3' },
        { id: 1903, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 1904, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 1905, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 1906, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 1907, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 1908, type: 'photo', title: 'Photo Asset 1' },
        { id: 1909, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 11, type: 'story', title: 'Ukraine Retakes Key Eastern City' }
      ],
      storylineEvents: [
        { id: 50, title: 'Ukraine Military Briefing', date: 'Oct 25' }
      ]
    },
    {
      id: 90,
      type: 'storyline',
      title: 'Alzheimer\'s Treatment Breakthrough',
      description: 'New drug trials and FDA approval process',
      desk: 'Health',
      status: null,
      author: 'Dr. S. Patel',
      updated: 'Ongoing',
      created: 'Oct 16',
      tags: ['alzheimers', 'breakthrough', 'fda'],
      triad: null,
      hasNotes: true,
      noteCount: 13,
      hasSponsor: false,
      linkedItems: 17,
      canEdit: true,
      deskLeads: ['Dr. S. Patel'],
      slackChannel: '#storyline-alzheimers',
      storylineNotes: 'Coverage of promising Alzheimer\'s drug trials showing significant memory improvement. FDA review process, patient impact, cost considerations, and broader implications for dementia treatment.',
      storylineAssets: [
        { id: 2000, type: 'video', title: 'Video Asset 1' },
        { id: 2001, type: 'video', title: 'Video Asset 2' },
        { id: 2002, type: 'video', title: 'Video Asset 3' },
        { id: 2003, type: 'video', title: 'Video Asset 4' },
        { id: 2004, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 2005, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 2006, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 2007, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 2008, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 2009, type: 'photo', title: 'Photo Asset 1' },
        { id: 2010, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 6, type: 'story', title: 'New Alzheimer\'s Drug Shows Promise in Trials' }
      ],
      storylineEvents: [
        { id: 45, title: 'FDA Advisory Committee Meeting', date: 'Oct 28' }
      ]
    },
    {
      id: 91,
      type: 'storyline',
      title: 'MLB World Series 2025',
      description: 'Yankees vs Dodgers championship series',
      desk: 'Sports',
      status: null,
      author: 'B. Anderson',
      updated: 'Ongoing',
      created: 'Oct 23',
      tags: ['mlb', 'world-series', 'baseball'],
      triad: null,
      hasNotes: true,
      noteCount: 6,
      hasSponsor: true,
      linkedItems: 19,
      canEdit: true,
      deskLeads: ['B. Anderson', 'T. Johnson'],
      slackChannel: '#storyline-world-series',
      storylineNotes: 'Historic World Series matchup between Yankees and Dodgers. Game recaps, player profiles, series analysis, and championship coverage. Series tied going into Game 7.',
      storylineAssets: [
        { id: 2100, type: 'video', title: 'Video Asset 1' },
        { id: 2101, type: 'video', title: 'Video Asset 2' },
        { id: 2102, type: 'video', title: 'Video Asset 3' },
        { id: 2103, type: 'video', title: 'Video Asset 4' },
        { id: 2104, type: 'graphic', title: 'Graphic Asset 1' },
        { id: 2105, type: 'graphic', title: 'Graphic Asset 2' },
        { id: 2106, type: 'graphic', title: 'Graphic Asset 3' },
        { id: 2107, type: 'graphic', title: 'Graphic Asset 4' },
        { id: 2108, type: 'interactive', title: 'Interactive Asset 1' },
        { id: 2109, type: 'interactive', title: 'Interactive Asset 2' },
        { id: 2110, type: 'photo', title: 'Photo Asset 1' },
        { id: 2111, type: 'photo', title: 'Photo Asset 2' }
      ],
      storylineStories: [
        { id: 12, type: 'story', title: 'MLB World Series Goes to Game 7' }
      ],
      storylineEvents: [
        { id: 51, title: 'World Series Game 7', date: 'Oct 26' }
      ]
    }
  ];

  const getTypeBadgeClass = (type) => {
    const classes = {
      story: 'text-blue-600 font-semibold',
      asset: 'text-purple-600 font-semibold',
      storyline: 'text-yellow-600 font-semibold',
      guidance: 'text-green-700 font-semibold',
      event: 'text-red-600 font-semibold',
      streaming: 'text-cyan-600 font-semibold'
    };
    return classes[type] || 'text-gray-600 font-semibold';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      idea: 'bg-yellow-100 text-yellow-700',
      draft: 'bg-blue-100 text-blue-700',
      published: 'bg-green-100 text-green-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      // Type filter
      if (activeFilters.type !== 'all' && item.type !== activeFilters.type) return false;
      
      // Desk filter
      if (activeFilters.desks.length > 0 && !activeFilters.desks.includes(item.desk)) return false;
      
      // Status filter
      if (activeFilters.status !== null && item.status !== activeFilters.status) return false;
      
      // TRIAD filter
      if (activeFilters.triad !== null && item.triad !== activeFilters.triad) return false;
      
      // Tag filter - item must have ANY active tag (OR logic)
      if (activeTags.length > 0) {
        const itemTags = item.tags || [];
        const hasAnyTag = activeTags.some(tag => itemTags.includes(tag));
        if (!hasAnyTag) return false;
      }
      
      // Time filter - based on estimatedPublishDate or date (for events)
      if (timeFilter !== 'any-time') {
        const dateField = item.estimatedPublishDate || item.date;
        if (dateField) {
          const parseDate = (dateStr) => {
            // Parse "Oct 28" or "Nov 4" format
            const months = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
            const match = dateStr.match(/(\w+) (\d+)/);
            if (!match) return null;
            return { month: months[match[1]], day: parseInt(match[2]) };
          };
          
          const itemDate = parseDate(dateField);
          if (itemDate) { // Only filter if we can parse the date
            // Today is Oct 28, 2025
            const today = { month: 10, day: 28 };
            
            if (timeFilter === 'today') {
              if (itemDate.month !== today.month || itemDate.day !== today.day) return false;
            } else if (timeFilter === 'tomorrow') {
              // Tomorrow is Oct 29
              if (itemDate.month !== 10 || itemDate.day !== 29) return false;
            } else if (timeFilter === 'this-week') {
              // This week: Oct 28-Nov 3 (rest of current week)
              if (itemDate.month === 10 && itemDate.day >= 28 && itemDate.day <= 31) {
                // Oct 28-31
              } else if (itemDate.month === 11 && itemDate.day >= 1 && itemDate.day <= 3) {
                // Nov 1-3
              } else {
                return false;
              }
            } else if (timeFilter === 'next-week') {
              // Next week: Nov 4-10
              if (itemDate.month !== 11 || itemDate.day < 4 || itemDate.day > 10) return false;
            } else if (timeFilter === 'next-month') {
              // Next month: November (any date >= Nov 11)
              if (itemDate.month !== 11 || itemDate.day < 11) return false;
            }
          }
        }
      }
      
      // Search filter
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });

    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal = a[sortColumn] || '';
        let bVal = b[sortColumn] || '';
        
        // Special handling for date columns (created, updated)
        if (sortColumn === 'created' || sortColumn === 'updated') {
          // Parse "Oct 25" format into comparable number
          const parseDate = (dateStr) => {
            if (!dateStr) return 0;
            const match = dateStr.match(/Oct (\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          aVal = parseDate(aVal);
          bVal = parseDate(bVal);
        }
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [items, activeFilters, activeTags, searchTerm, sortColumn, sortDirection, timeFilter]);

  // Compute today's items for Daily View
  const todayItems = useMemo(() => {
    return filteredItems.filter(item => {
      const itemDate = item.estimatedPublishDate || item.date || '';
      return itemDate === 'Oct 28';
    });
  }, [filteredItems]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-black text-white flex items-center justify-between px-0 py-0 border-b border-gray-800">
        <div className="flex items-center">
          {/* App Switcher - Red Waffle */}
          <button className="bg-red-600 hover:bg-red-700 p-3 h-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="white" viewBox="0 0 30 30">
              <rect x="3" y="3" width="6" height="6" rx="1"/>
              <rect x="12" y="3" width="6" height="6" rx="1"/>
              <rect x="21" y="3" width="6" height="6" rx="1"/>
              <rect x="3" y="12" width="6" height="6" rx="1"/>
              <rect x="12" y="12" width="6" height="6" rx="1"/>
              <rect x="21" y="12" width="6" height="6" rx="1"/>
              <rect x="3" y="21" width="6" height="6" rx="1"/>
              <rect x="12" y="21" width="6" height="6" rx="1"/>
              <rect x="21" y="21" width="6" height="6" rx="1"/>
            </svg>
          </button>
          
          {/* Navigation Links */}
          <div className="flex items-center h-full">
            <button className="px-6 py-3 text-lg hover:bg-gray-900">NewsApps</button>
            <div className="h-8 w-px bg-gray-400"></div>
            <button className="px-6 py-3 text-lg font-medium">Storyhub</button>
          </div>
        </div>
        
        {/* Right Side - User Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
              P
            </div>
            <span className="text-sm">Pearson, Bryan</span>
          </div>
          <button className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-xs">
            ?
          </button>
          <button className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path d="M4 10a2 2 0 100-4 2 2 0 000 4z"/>
              <path d="M16 10a2 2 0 100-4 2 2 0 000 4z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-300 p-4 overflow-y-auto">
        {/* Search */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Search</h3>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Type Filter */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Type</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveFilters({ ...activeFilters, type: 'all' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.type === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, type: 'storyline' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.type === 'storyline'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Storylines
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, type: 'story' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.type === 'story'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, type: 'asset' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.type === 'asset'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, type: 'guidance' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.type === 'guidance'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Guidance
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, type: 'event' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.type === 'event'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, type: 'streaming' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.type === 'streaming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Streaming
            </button>
          </div>
        </div>

        {/* Desk/Team Filter */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Desk/Team</h3>
          <div className="space-y-1">
            {desks.map(desk => (
              <label key={desk} className="flex items-center px-3 py-1 hover:bg-gray-100 rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={activeFilters.desks.includes(desk)}
                  onChange={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      desks: prev.desks.includes(desk)
                        ? prev.desks.filter(d => d !== desk)
                        : [...prev.desks, desk]
                    }));
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{desk}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Status</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveFilters({ ...activeFilters, status: null })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.status === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, status: 'idea' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.status === 'idea'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Idea
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, status: 'draft' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.status === 'draft'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, status: 'published' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.status === 'published'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published
            </button>
          </div>
        </div>

        {/* TRIAD Filter */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-gray-800 mb-2">TRIAD</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveFilters({ ...activeFilters, triad: null })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.triad === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, triad: 'approved' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.triad === 'approved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, triad: 'pending' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.triad === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, triad: 'review-requested' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.triad === 'review-requested'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Review Requested
            </button>
            <button
              onClick={() => setActiveFilters({ ...activeFilters, triad: 'not-required' })}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                activeFilters.triad === 'not-required'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Not Required
            </button>
          </div>
        </div>

        {/* Quick Views */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Quick Views</h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              My Items
            </button>
            <button className="w-full text-left px-3 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              Today
            </button>
            <button className="w-full text-left px-3 py-1.5 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              This Week
            </button>
          </div>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => {
            setActiveFilters({ type: 'all', desks: [], status: null, triad: null });
            setActiveTags([]);
            setSearchTerm('');
            setSortColumn(null);
            setSortDirection('asc');
          }}
          className="w-full px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
          <div className="flex gap-0">
            <button
              onClick={() => setViewMode('list')}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                viewMode === 'daily'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Calendar
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setEditingItem(null);
                setModalType('story');
                setShowModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
            >
              + Idea
            </button>
            <button 
              onClick={() => {
                setEditingItem(null);
                setModalType('storyline');
                setShowModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
            >
              + New Storyline
            </button>
            <button 
              onClick={() => {
                setEditingItem(null);
                setModalType('guidance');
                setShowModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
            >
              + Guidance
            </button>
            <button 
              onClick={() => {
                setEditingItem(null);
                setModalType('event');
                setShowModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
            >
              + Event
            </button>
          </div>
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="flex-1 overflow-auto">
            {/* Time Filters and View Density Row */}
            <div className="bg-white px-6 py-4 border-b border-gray-300 flex items-center justify-between">
              <div className="flex gap-0 rounded-full overflow-hidden border border-gray-300 inline-flex">
                <button
                  onClick={() => setTimeFilter('any-time')}
                  className={`px-5 py-2 text-sm font-medium transition-colors ${
                    timeFilter === 'any-time'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Any Time
                </button>
                <button
                  onClick={() => setTimeFilter('today')}
                  className={`px-5 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    timeFilter === 'today'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimeFilter('tomorrow')}
                  className={`px-5 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    timeFilter === 'tomorrow'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => setTimeFilter('this-week')}
                  className={`px-5 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    timeFilter === 'this-week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeFilter('next-week')}
                  className={`px-5 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    timeFilter === 'next-week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next Week
                </button>
                <button
                  onClick={() => setTimeFilter('next-month')}
                  className={`px-5 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    timeFilter === 'next-month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next Month
                </button>
              </div>

              {/* Key Actions Button Bar */}
              {currentUser.isTriadMember && (() => {
                const reviewRequestedCount = items.filter(item => item.triad === 'review-requested').length;
                const inReviewCount = items.filter(item => item.triad === 'in-review').length;
                const totalPending = reviewRequestedCount + inReviewCount;
                
                return (
                  <div className="flex gap-0 rounded-full overflow-hidden border border-gray-300 inline-flex">
                    <button
                      onClick={() => setActiveFilters({ ...activeFilters, triad: 'review-requested' })}
                      className={`px-5 py-2 text-sm font-medium transition-colors ${
                        activeFilters.triad === 'review-requested'
                          ? 'bg-red-600 text-white'
                          : totalPending > 0
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      title="Stories awaiting TRIAD review"
                    >
                      TRIAD {totalPending > 0 ? `(${totalPending})` : ''}
                    </button>
                    <button
                      onClick={() => {
                        // Filter to show only items owned by current user
                        setSearchTerm(currentUser.name);
                      }}
                      className={`px-5 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                        searchTerm === currentUser.name
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      title="Show only my items"
                    >
                      My Items
                    </button>
                    <button
                      disabled
                      className="px-5 py-2 text-sm font-medium transition-colors border-l border-gray-300 bg-white text-gray-400 cursor-not-allowed"
                      title="Coming soon"
                    >
                      Breaking
                    </button>
                  </div>
                );
              })()}

              {/* View Density Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">View:</span>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    onClick={() => setTableViewDensity('brief')}
                    className={`px-3 py-2 text-sm font-medium rounded-l-lg border ${
                      tableViewDensity === 'brief'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    title="Brief View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTableViewDensity('detailed')}
                    className={`px-3 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                      tableViewDensity === 'detailed'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    title="Detailed View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Tags Row */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-700">Tags:</span>
                {(() => {
                  // Calculate tag frequency from all items
                  const tagCounts = {};
                  items.forEach(item => {
                    if (item.tags) {
                      item.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                      });
                    }
                  });
                  
                  // Sort by frequency and get top 15
                  const topTags = Object.entries(tagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 15)
                    .map(([tag, count]) => ({ tag, count }));
                  
                  return topTags.map(({ tag, count }, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (activeTags.includes(tag)) {
                          setActiveTags(activeTags.filter(t => t !== tag));
                        } else {
                          setActiveTags([...activeTags, tag]);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {tag}
                      <span className={`text-xs ${activeTags.includes(tag) ? 'text-blue-100' : 'text-gray-500'}`}>
                        ({count})
                      </span>
                    </button>
                  ));
                })()}
              </div>
            </div>

            {/* Active Tags Display */}
            {activeTags.length > 0 && (
              <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-blue-900">Active Tags:</span>
                  {activeTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium"
                    >
                      {tag}
                      <button
                        onClick={() => setActiveTags(activeTags.filter(t => t !== tag))}
                        className="hover:bg-blue-700 rounded-full p-0.5"
                        title="Remove tag filter"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => setActiveTags([])}
                    className="text-xs text-blue-800 hover:text-blue-900 font-medium underline"
                  >
                    Clear all tags
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700" onClick={() => handleSort('type')}>
                      <div className="flex items-center gap-1">
                        Type
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'type' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1">
                        Title
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'title' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700 w-44" onClick={() => handleSort('author')}>
                      <div className="flex items-center gap-1">
                        Owner(s)
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'author' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700" onClick={() => handleSort('desk')}>
                      <div className="flex items-center gap-1">
                        Desk/Team
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'desk' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-1">
                        Status
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700" onClick={() => handleSort('created')}>
                      <div className="flex items-center gap-1">
                        Created
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'created' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700" onClick={() => handleSort('updated')}>
                      <div className="flex items-center gap-1">
                        Pub Date
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'updated' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700 w-48" onClick={() => handleSort('triad')}>
                      <div className="flex items-center gap-1">
                        TRIAD
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'triad' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase cursor-pointer hover:bg-gray-700" onClick={() => handleSort('linkedItems')}>
                      <div className="flex items-center gap-1">
                        Details
                        <span className="text-gray-400 text-base">
                          {sortColumn === 'linkedItems' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                        tableViewDensity === 'detailed' ? 'align-top' : ''
                      }`}
                      onClick={() => {
                        setSelectedItem(item);
                        setViewMode('detail');
                      }}
                      onContextMenu={(e) => handleContextMenu(e, item)}
                    >
                      {/* Brief View */}
                      {tableViewDensity === 'brief' && (
                        <>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs uppercase ${getTypeBadgeClass(item.type)}`}>
                                {item.type}
                              </span>
                              {/* Asset Type Icon */}
                              {item.type === 'asset' && (() => {
                                const isPhoto = item.desk === 'Photo' || item.tags?.includes('photo');
                                const isVideo = item.tags?.includes('video') || item.title.toLowerCase().includes('video') || item.title.toLowerCase().includes('loop');
                                const isMap = item.tags?.includes('map') || item.title.toLowerCase().includes('map');
                                const isInteractive = item.tags?.includes('interactive');
                                const isChart = item.tags?.includes('chart') || item.title.toLowerCase().includes('chart') || item.title.toLowerCase().includes('graph');
                                
                                if (isVideo) {
                                  return (
                                    <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Video">
                                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                                    </svg>
                                  );
                                } else if (isPhoto) {
                                  return (
                                    <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Photo">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                                    </svg>
                                  );
                                } else if (isMap) {
                                  return (
                                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Map">
                                      <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"/>
                                    </svg>
                                  );
                                } else if (isInteractive) {
                                  return (
                                    <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Interactive">
                                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                                    </svg>
                                  );
                                } else if (isChart) {
                                  return (
                                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Chart">
                                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                                    </svg>
                                  );
                                } else {
                                  return (
                                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Graphic">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                                    </svg>
                                  );
                                }
                              })()}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                                setViewMode('detail');
                              }}
                              className="font-medium text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                            >
                              {item.title}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                          <td className="px-4 py-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {item.author}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {item.desk}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {item.status ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.created || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.updated}</td>
                          <td className="px-4 py-3">
                            {item.type === 'story' && item.triad ? (
                              <span className={`px-3 py-1 text-white text-xs font-medium rounded ${
                                item.triad === 'approved' ? 'bg-green-600' :
                                item.triad === 'pending' ? 'bg-yellow-600' :
                                item.triad === 'review-requested' ? 'bg-red-600' :
                                item.triad === 'not-required' ? 'bg-gray-500' :
                                'bg-gray-600'
                              }`}>
                                {item.triad === 'approved' ? 'Approved' :
                                 item.triad === 'pending' ? 'Pending' :
                                 item.triad === 'review-requested' ? 'Review Requested' :
                                 item.triad === 'not-required' ? 'Not Required' :
                                 'No Status'}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-gray-600 flex items-center gap-2">
                              <span>{item.linkedItems} {item.linkedItems === 1 ? 'item' : 'items'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(item);
                                  setViewMode('detail');
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View
                              </button>
                              {item.canEdit && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(item);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </>
                      )}

                      {/* Detailed View */}
                      {tableViewDensity === 'detailed' && (
                        <>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs uppercase font-semibold ${getTypeBadgeClass(item.type)}`}>
                                {item.type}
                              </span>
                              {/* Asset Type Icon */}
                              {item.type === 'asset' && (() => {
                                const isPhoto = item.desk === 'Photo' || item.tags?.includes('photo');
                                const isVideo = item.tags?.includes('video') || item.title.toLowerCase().includes('video') || item.title.toLowerCase().includes('loop');
                                const isMap = item.tags?.includes('map') || item.title.toLowerCase().includes('map');
                                const isInteractive = item.tags?.includes('interactive');
                                const isChart = item.tags?.includes('chart') || item.title.toLowerCase().includes('chart') || item.title.toLowerCase().includes('graph');
                                
                                if (isVideo) {
                                  return (
                                    <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Video">
                                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                                    </svg>
                                  );
                                } else if (isPhoto) {
                                  return (
                                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Photo">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                                    </svg>
                                  );
                                } else if (isMap) {
                                  return (
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Map">
                                      <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"/>
                                    </svg>
                                  );
                                } else if (isInteractive) {
                                  return (
                                    <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Interactive">
                                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                                    </svg>
                                  );
                                } else if (isChart) {
                                  return (
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Chart">
                                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                                    </svg>
                                  );
                                } else {
                                  return (
                                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Graphic">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                                    </svg>
                                  );
                                }
                              })()}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(item);
                                  setViewMode('detail');
                                }}
                                className="font-semibold text-base text-blue-600 hover:text-blue-800 hover:underline text-left block"
                              >
                                {item.title}
                              </button>
                              {item.tags && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.tags.slice(0, 3).map((tag, idx) => (
                                    <button
                                      key={idx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!activeTags.includes(tag)) {
                                          setActiveTags([...activeTags, tag]);
                                        }
                                      }}
                                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs hover:bg-blue-100 hover:text-blue-800 transition-colors cursor-pointer"
                                      title={`Filter by ${tag}`}
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-700 max-w-md">
                              {item.description}
                              {item.type === 'storyline' && item.storylineNotes && (
                                <div className="mt-2 text-xs text-gray-600 italic">
                                  {item.storylineNotes.substring(0, 120)}...
                                </div>
                              )}
                              {item.type === 'storyline' && item.storylineAssets && (
                                <div className="mt-3">
                                  <div className="text-xs font-semibold text-gray-700 mb-2">Assets ({item.storylineAssets.length})</div>
                                  <div className="flex flex-wrap gap-1">
                                    {item.storylineAssets.slice(0, 10).map((asset, idx) => (
                                      <div
                                        key={idx}
                                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white ${
                                          asset.type === 'video' ? 'bg-purple-500' :
                                          asset.type === 'graphic' ? 'bg-blue-500' :
                                          asset.type === 'interactive' ? 'bg-green-500' :
                                          'bg-orange-500'
                                        }`}
                                        title={asset.title}
                                      >
                                        {asset.type === 'video' ? 'V' :
                                         asset.type === 'graphic' ? 'G' :
                                         asset.type === 'interactive' ? 'I' :
                                         'Photo'}
                                      </div>
                                    ))}
                                    {item.storylineAssets.length > 10 && (
                                      <div className="w-8 h-8 rounded bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                        +{item.storylineAssets.length - 10}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {item.author}
                            </span>
                            {item.type === 'storyline' && item.deskLeads && item.deskLeads.length > 1 && (
                              <div className="mt-1 text-xs text-gray-500">
                                +{item.deskLeads.length - 1} more
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {item.desk}
                            </span>
                            {item.type === 'storyline' && item.slackChannel && (
                              <div className="mt-1 text-xs text-gray-500">
                                {item.slackChannel}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {item.status ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{item.created || '—'}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{item.updated}</td>
                          <td className="px-4 py-4">
                            {item.type === 'story' && item.triad ? (
                              <span className={`px-3 py-1 text-white text-xs font-medium rounded ${
                                item.triad === 'approved' ? 'bg-green-600' :
                                item.triad === 'pending' ? 'bg-yellow-600' :
                                item.triad === 'review-requested' ? 'bg-red-600' :
                                item.triad === 'not-required' ? 'bg-gray-500' :
                                'bg-gray-600'
                              }`}>
                                {item.triad === 'approved' ? 'Approved' :
                                 item.triad === 'pending' ? 'Pending' :
                                 item.triad === 'review-requested' ? 'Review Requested' :
                                 item.triad === 'not-required' ? 'Not Required' :
                                 'No Status'}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-gray-600">
                              <div>{item.linkedItems} {item.linkedItems === 1 ? 'item' : 'items'}</div>
                              {item.hasNotes && (
                                <div className="mt-1 text-gray-500">
                                  {item.noteCount} {item.noteCount === 1 ? 'note' : 'notes'}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(item);
                                  setViewMode('detail');
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View
                              </button>
                              {item.canEdit && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(item);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Daily View */}
        {viewMode === 'daily' && (
          <div className="flex-1 overflow-auto">
            {/* Header with View Toggle */}
            <div className="bg-white px-6 py-4 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Today's Publishing Schedule - October 28, 2025</h2>
              
              {/* View Density Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">View:</span>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    onClick={() => setTableViewDensity('brief')}
                    className={`px-3 py-2 text-sm font-medium rounded-l-lg border ${
                      tableViewDensity === 'brief'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    title="Brief View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTableViewDensity('detailed')}
                    className={`px-3 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                      tableViewDensity === 'detailed'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    title="Detailed View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {todayItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No items scheduled for today (Oct 28)</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {filteredItems.length === 0 
                      ? 'No items match your current filters' 
                      : `${filteredItems.length} items available - try adjusting filters`}
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="bg-gray-800 text-white px-4 py-3 rounded-t font-semibold">
                    Today — {todayItems.length} {todayItems.length === 1 ? 'item' : 'items'}
                  </div>
                  <div className="bg-white rounded-b-lg shadow p-4">
                    <div className={`grid gap-3 ${
                      tableViewDensity === 'brief' ? 'grid-cols-12' : 'grid-cols-4'
                    }`}>
                      {todayItems.map((item) => {
                        const isBrief = tableViewDensity === 'brief';
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedItem(item);
                              setViewMode('detail');
                            }}
                            className={`rounded border-l-4 text-left hover:shadow-lg transition-all ${
                              isBrief ? 'p-3' : 'p-4'
                            } ${
                              item.type === 'story' && item.status === 'idea' ? 'bg-red-50 border-red-500' :
                              item.type === 'story' && item.status === 'draft' ? 'bg-yellow-50 border-yellow-500' :
                              item.type === 'story' ? 'bg-blue-50 border-blue-500' :
                              item.type === 'asset' ? 'bg-purple-50 border-purple-500' :
                              item.type === 'event' ? 'bg-green-50 border-green-500' :
                              item.type === 'guidance' ? 'bg-orange-50 border-orange-500' :
                              'bg-gray-50 border-gray-500'
                            }`}
                          >
                            {isBrief ? (
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                                    item.type === 'story' ? 'bg-blue-100 text-blue-800' :
                                    item.type === 'asset' ? 'bg-purple-100 text-purple-800' :
                                    item.type === 'event' ? 'bg-green-100 text-green-800' :
                                    item.type === 'guidance' ? 'bg-orange-100 text-orange-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.type}
                                  </span>
                                  {item.triad && (
                                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                                      item.triad === 'approved' ? 'bg-green-600 text-white' : 
                                      item.triad === 'pending' ? 'bg-yellow-600 text-white' :
                                      item.triad === 'review-requested' ? 'bg-red-600 text-white' :
                                      item.triad === 'not-required' ? 'bg-gray-500 text-white' :
                                      'bg-gray-600 text-white'
                                    }`}>
                                      {item.triad === 'approved' ? 'A' : 
                                       item.triad === 'pending' ? 'P' :
                                       item.triad === 'review-requested' ? 'RR' :
                                       item.triad === 'not-required' ? 'N/A' : '-'}
                                    </span>
                                  )}
                                </div>
                                <div className="font-semibold text-xs text-gray-900 mb-1 line-clamp-2">
                                  {item.title}
                                </div>
                                <div className="text-xs text-gray-600">{item.desk}</div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                                    item.type === 'story' ? 'bg-blue-100 text-blue-800' :
                                    item.type === 'asset' ? 'bg-purple-100 text-purple-800' :
                                    item.type === 'event' ? 'bg-green-100 text-green-800' :
                                    item.type === 'guidance' ? 'bg-orange-100 text-orange-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.type}
                                  </span>
                                  {item.triad && (
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      item.triad === 'approved' ? 'bg-green-600 text-white' : 
                                      item.triad === 'pending' ? 'bg-yellow-600 text-white' :
                                      item.triad === 'review-requested' ? 'bg-red-600 text-white' :
                                      item.triad === 'not-required' ? 'bg-gray-500 text-white' :
                                      'bg-gray-600 text-white'
                                    }`}>
                                      {item.triad === 'approved' ? 'Approved' : 
                                       item.triad === 'pending' ? 'Pending' :
                                       item.triad === 'review-requested' ? 'Review Requested' :
                                       item.triad === 'not-required' ? 'Not Required' : 
                                       '—‹ No Status'}
                                    </span>
                                  )}
                                </div>
                                <div className="font-bold text-sm text-gray-900 mb-2 line-clamp-2">
                                  {item.title}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                                    {item.description}
                                  </div>
                                )}
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-medium text-gray-700">{item.desk}</span>
                                  {item.author && (
                                    <span className="text-gray-500">{item.author}</span>
                                  )}
                                </div>
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {item.tags.slice(0, 3).map((tag, i) => (
                                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Streaming Calendar</h2>
                <div className="flex gap-3">
                  <select className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Desks</option>
                    {desks.map(desk => (
                      <option key={desk}>{desk}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Legend */}
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Desk Color Guide:</h4>
                <div className="grid grid-cols-5 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>National</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span>Politics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <span>Business</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <span>International</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-600 rounded"></div>
                    <span>Sports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-pink-600 rounded"></div>
                    <span>Health</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-600 rounded"></div>
                    <span>Science</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-300 text-sm text-gray-600">
                  <span className="font-semibold">Note:</span> Darker shades indicate paid content
                </div>
              </div>

              {/* Weekly Calendar */}
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left text-sm font-semibold w-32">Time</th>
                      <th className="border border-gray-300 p-3 text-sm font-semibold">Mon 10/21</th>
                      <th className="border border-gray-300 p-3 text-sm font-semibold">Tue 10/22</th>
                      <th className="border border-gray-300 p-3 text-sm font-semibold">Wed 10/23</th>
                      <th className="border border-gray-300 p-3 text-sm font-semibold">Thu 10/24</th>
                      <th className="border border-gray-300 p-3 text-sm font-semibold">Fri 10/25</th>
                      <th className="border border-gray-300 p-3 text-sm font-semibold">Sat 10/26</th>
                      <th className="border border-gray-300 p-3 text-sm font-semibold">Sun 10/27</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 6 AM */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">6:00 AM</td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs mb-2">
                          <div className="font-semibold">Morning News</div>
                          <div className="opacity-90">National</div>
                        </div>
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Market Preview</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs mb-2">
                          <div className="font-semibold">Morning News</div>
                          <div className="opacity-90">National</div>
                        </div>
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Market Preview</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs mb-2">
                          <div className="font-semibold">Morning News</div>
                          <div className="opacity-90">National</div>
                        </div>
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Market Preview</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs mb-2">
                          <div className="font-semibold">Morning News</div>
                          <div className="opacity-90">National</div>
                        </div>
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Market Preview</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs mb-2">
                          <div className="font-semibold">Morning News</div>
                          <div className="opacity-90">National</div>
                        </div>
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Market Preview</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Weekend Edition</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Weekend Edition</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                    </tr>

                    {/* 9 AM */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">9:00 AM</td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Markets Live</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Markets Live</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Markets Live</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Markets Live</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-emerald-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Markets Live</div>
                          <div className="opacity-90">Business</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-orange-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Sports Preview</div>
                          <div className="opacity-90">Sports</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-orange-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Sports Recap</div>
                          <div className="opacity-90">Sports</div>
                        </div>
                      </td>
                    </tr>

                    {/* 12 PM */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">12:00 PM</td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Midday Brief</div>
                          <div className="opacity-90">Politics</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Midday Brief</div>
                          <div className="opacity-90">Politics</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Midday Brief</div>
                          <div className="opacity-90">Politics</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Midday Brief</div>
                          <div className="opacity-90">Politics</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Midday Brief</div>
                          <div className="opacity-90">Politics</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Weekend Roundup</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Weekend Roundup</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                    </tr>

                    {/* 2 PM */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">2:00 PM</td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-purple-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">International Hour</div>
                          <div className="opacity-90">International</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-purple-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">International Hour</div>
                          <div className="opacity-90">International</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-purple-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">International Hour</div>
                          <div className="opacity-90">International</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-purple-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">International Hour</div>
                          <div className="opacity-90">International</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-purple-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">International Hour</div>
                          <div className="opacity-90">International</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-orange-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Sports Central</div>
                          <div className="opacity-90">Sports</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-orange-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Sports Central</div>
                          <div className="opacity-90">Sports</div>
                        </div>
                      </td>
                    </tr>

                    {/* 3 PM - Paid Content */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">3:00 PM</td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Deep Dive Politics</div>
                          <div className="opacity-90">Politics | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-emerald-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Deep Dive Business</div>
                          <div className="opacity-90">Business | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-teal-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Deep Dive Science</div>
                          <div className="opacity-90">Science | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-pink-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Deep Dive Health</div>
                          <div className="opacity-90">Health | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Deep Dive Politics</div>
                          <div className="opacity-90">Politics | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-orange-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Sports Analysis</div>
                          <div className="opacity-90">Sports | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-orange-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Sports Analysis</div>
                          <div className="opacity-90">Sports | PAID</div>
                        </div>
                      </td>
                    </tr>

                    {/* 6 PM */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">6:00 PM</td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Evening News</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Evening News</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Evening News</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Evening News</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Evening Analysis</div>
                          <div className="opacity-90">Politics | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Weekend News</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-blue-600 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Weekend News</div>
                          <div className="opacity-90">National</div>
                        </div>
                      </td>
                    </tr>

                    {/* 8 PM - Prime Time Paid */}
                    <tr>
                      <td className="border border-gray-300 p-3 text-sm font-medium bg-gray-50">8:00 PM</td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Prime Analysis</div>
                          <div className="opacity-90">Politics | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Prime Analysis</div>
                          <div className="opacity-90">Politics | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Prime Analysis</div>
                          <div className="opacity-90">Politics | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Prime Analysis</div>
                          <div className="opacity-90">Politics | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-red-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Prime Analysis</div>
                          <div className="opacity-90">Politics | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-orange-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Sports Special</div>
                          <div className="opacity-90">Sports | PAID</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="bg-orange-700 text-white p-2 rounded text-xs">
                          <div className="font-semibold">Sports Special</div>
                          <div className="opacity-90">Sports | PAID</div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'detail' && selectedItem && (
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <button
              onClick={() => setViewMode('list')}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              &larr; Back to List
            </button>
            
            {selectedItem.type === 'storyline' ? (
              /* Enhanced Storyline View with 5 Sections */
              <div className="space-y-6">
                {/* 1. Header Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold uppercase">
                          Storyline
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                      <p className="text-gray-600">{selectedItem.description}</p>
                    </div>
                    {selectedItem.canEdit && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Edit Storyline
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-2">Desk Leads</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.deskLeads?.map((lead, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {lead}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-2">Desk</div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {selectedItem.desk}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-2">Slack Channel</div>
                      <a 
                        href="#"
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium hover:bg-purple-200 inline-flex items-center gap-2"
                      >
                        {selectedItem.slackChannel}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. Notes Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Notes</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedItem.storylineNotes}</p>
                </div>

                {/* 3. Assets Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Assets ({selectedItem.storylineAssets?.length || 0})</h3>
                  
                  {/* Videos */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Videos</h4>
                    <div className="grid grid-cols-10 gap-1.5">
                      {selectedItem.storylineAssets?.filter(a => a.type === 'video').map((asset, idx) => (
                        <div key={idx} className="group relative">
                          <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded border border-gray-300 hover:border-purple-400 transition-colors flex items-center justify-center cursor-pointer">
                            <svg className="w-4 h-4 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      ))}
                      {(!selectedItem.storylineAssets?.filter(a => a.type === 'video').length) && (
                        <div className="col-span-10 text-sm text-gray-500 italic py-4">No videos</div>
                      )}
                    </div>
                  </div>

                  {/* Graphics */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Graphics</h4>
                    <div className="grid grid-cols-10 gap-1.5">
                      {selectedItem.storylineAssets?.filter(a => a.type === 'graphic').map((asset, idx) => (
                        <div key={idx} className="group relative">
                          <div className={`aspect-square bg-gradient-to-br ${
                            idx % 3 === 0 ? 'from-green-400 to-teal-500' :
                            idx % 3 === 1 ? 'from-blue-400 to-cyan-500' :
                            'from-orange-400 to-red-500'
                          } rounded border border-gray-300 hover:border-purple-400 transition-colors flex items-center justify-center cursor-pointer`}>
                            <svg className="w-4 h-4 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                      {(!selectedItem.storylineAssets?.filter(a => a.type === 'graphic').length) && (
                        <div className="col-span-10 text-sm text-gray-500 italic py-4">No graphics</div>
                      )}
                    </div>
                  </div>

                  {/* Interactives */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Interactives</h4>
                    <div className="grid grid-cols-10 gap-1.5">
                      {selectedItem.storylineAssets?.filter(a => a.type === 'interactive').map((asset, idx) => (
                        <div key={idx} className="group relative">
                          <div className={`aspect-square bg-gradient-to-br ${
                            idx % 2 === 0 ? 'from-pink-400 to-purple-600' : 'from-purple-400 to-indigo-600'
                          } rounded border border-gray-300 hover:border-purple-400 transition-colors flex items-center justify-center cursor-pointer`}>
                            <svg className="w-4 h-4 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                          </div>
                        </div>
                      ))}
                      {(!selectedItem.storylineAssets?.filter(a => a.type === 'interactive').length) && (
                        <div className="col-span-10 text-sm text-gray-500 italic py-4">No interactives</div>
                      )}
                    </div>
                  </div>

                  {/* Photos */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Photos</h4>
                    <div className="grid grid-cols-10 gap-1.5">
                      {selectedItem.storylineAssets?.filter(a => a.type === 'photo').map((asset, idx) => (
                        <div key={idx} className="group relative">
                          <div className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-500 rounded border border-gray-300 hover:border-purple-400 transition-colors flex items-center justify-center cursor-pointer">
                            <svg className="w-4 h-4 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                      {(!selectedItem.storylineAssets?.filter(a => a.type === 'photo').length) && (
                        <div className="col-span-10 text-sm text-gray-500 italic py-4">No photos</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Stories Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Stories ({selectedItem.storylineStories?.length || 0})</h3>
                  <div className="space-y-3">
                    {selectedItem.storylineStories?.map((story, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs uppercase font-semibold text-blue-600">
                                {story.type}
                              </span>
                            </div>
                            <h4 className="font-bold text-base text-gray-900">{story.title}</h4>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!selectedItem.storylineStories?.length) && (
                      <div className="text-sm text-gray-500 italic">No stories</div>
                    )}
                  </div>
                </div>

                {/* 5. Events Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Events ({selectedItem.storylineEvents?.length || 0})</h3>
                  <div className="space-y-3">
                    {selectedItem.storylineEvents?.map((event, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                                EVENT
                              </span>
                              <span className="text-sm text-gray-600">{event.date}</span>
                            </div>
                            <h4 className="font-bold text-base text-gray-900">{event.title}</h4>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!selectedItem.storylineEvents?.length) && (
                      <div className="text-sm text-gray-500 italic">No events</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Item Detail View */
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        selectedItem.type === 'story' ? 'bg-blue-100 text-blue-800' :
                        selectedItem.type === 'asset' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedItem.type.toUpperCase()}
                      </span>
                      {selectedItem.status && (
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusBadgeClass(selectedItem.status)}`}>
                          {selectedItem.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedItem.title}</h2>
                    <p className="text-gray-600 mt-2">{selectedItem.description}</p>
                  </div>
                  {selectedItem.canEdit && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Edit
                    </button>
                  )}
                </div>

                {/* Media Placeholder for Assets */}
                {selectedItem.type === 'asset' && (
                  <div className="mb-6 max-w-md">
                    {/* Determine asset type from desk and tags */}
                    {(() => {
                      const isPhoto = selectedItem.desk === 'Photo' || selectedItem.tags.includes('photo');
                      const isVideo = selectedItem.tags.includes('video') || selectedItem.title.toLowerCase().includes('video') || selectedItem.title.toLowerCase().includes('loop');
                      const isMap = selectedItem.tags.includes('map') || selectedItem.title.toLowerCase().includes('map');
                      const isInteractive = selectedItem.tags.includes('interactive');
                      const isChart = selectedItem.tags.includes('chart') || selectedItem.title.toLowerCase().includes('chart') || selectedItem.title.toLowerCase().includes('graph');
                      
                      if (isVideo) {
                        return (
                          <div className="bg-gray-900 rounded h-64 w-full flex items-center justify-center">
                            <div className="text-center text-white">
                              <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                              </svg>
                              <p className="text-xs font-medium opacity-75">Video Asset</p>
                            </div>
                          </div>
                        );
                      } else if (isPhoto) {
                        return (
                          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded h-64 w-full flex items-center justify-center">
                            <div className="text-center text-purple-800">
                              <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                              </svg>
                              <p className="text-xs font-medium">Photo Gallery</p>
                            </div>
                          </div>
                        );
                      } else if (isMap) {
                        return (
                          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded h-64 w-full flex items-center justify-center border-2 border-green-200">
                            <div className="text-center text-green-800">
                              <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"/>
                              </svg>
                              <p className="text-xs font-medium">Interactive Map</p>
                            </div>
                          </div>
                        );
                      } else if (isInteractive) {
                        return (
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded h-64 w-full flex items-center justify-center border-2 border-indigo-200">
                            <div className="text-center text-indigo-800">
                              <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                              </svg>
                              <p className="text-xs font-medium">Interactive Graphic</p>
                            </div>
                          </div>
                        );
                      } else if (isChart) {
                        return (
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded h-64 w-full flex items-center justify-center border-2 border-blue-200">
                            <div className="text-center text-blue-800">
                              <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                              </svg>
                              <p className="text-xs font-medium">Chart / Graph</p>
                            </div>
                          </div>
                        );
                      } else {
                        // Default graphic placeholder
                        return (
                          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded h-64 w-full flex items-center justify-center border-2 border-gray-300">
                            <div className="text-center text-gray-700">
                              <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                              </svg>
                              <p className="text-xs font-medium">Graphic Asset</p>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">Owner(s)</div>
                    <div className="text-base text-gray-900">{selectedItem.author}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">Desk/Team</div>
                    <div className="text-base text-gray-900">{selectedItem.desk}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">Last Updated</div>
                    <div className="text-base text-gray-900">{selectedItem.updated}</div>
                  </div>
                  {selectedItem.type === 'story' && selectedItem.triad && (
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">TRIAD Status</div>
                      <div>
                        <span className={`px-3 py-1 text-white text-sm font-semibold rounded ${
                          selectedItem.triad === 'review-needed' ? 'bg-red-600' :
                          selectedItem.triad === 'in-review' ? 'bg-yellow-600' :
                          selectedItem.triad === 'approved' ? 'bg-green-600' :
                          'bg-gray-600'
                        }`}>
                          {selectedItem.triad === 'review-needed' ? 'Review Needed' :
                           selectedItem.triad === 'in-review' ? 'In Review' :
                           selectedItem.triad === 'approved' ? 'Approved' :
                           'Rejected'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* TRIAD Approval History */}
                {selectedItem.type === 'story' && selectedItem.triadReview && (
                  <div className="mb-6 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">TRIAD Review History</h3>
                    <div className="space-y-3">
                      {/* Review Requested */}
                      {selectedItem.triadReview.requestedDate && (
                        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                              📋
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Review Requested</span>
                              <span className="text-sm text-gray-600">
                                {new Date(selectedItem.triadReview.requestedDate).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-700 mt-1">
                              <span className="font-medium">By:</span> {selectedItem.triadReview.requestedBy}
                            </div>
                            {selectedItem.triadReview.urgency && (
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">Urgency:</span> {selectedItem.triadReview.urgency}
                              </div>
                            )}
                            {selectedItem.triadReview.reason && (
                              <div className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">Reason:</span> {selectedItem.triadReview.reason}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Started Review */}
                      {selectedItem.triadReview.startedDate && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              👁️
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Review Started</span>
                              <span className="text-sm text-gray-600">
                                {new Date(selectedItem.triadReview.startedDate).toLocaleString()}
                              </span>
                            </div>
                            {selectedItem.triadReview.reviewedBy && (
                              <div className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">Reviewer:</span> {selectedItem.triadReview.reviewedBy}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Approved */}
                      {selectedItem.triadReview.status === 'approved' && selectedItem.triadReview.completedDate && (
                        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              ✓
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Approved</span>
                              <span className="text-sm text-gray-600">
                                {new Date(selectedItem.triadReview.completedDate).toLocaleString()}
                              </span>
                            </div>
                            {selectedItem.triadReview.reviewedBy && (
                              <div className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">By:</span> {selectedItem.triadReview.reviewedBy}
                              </div>
                            )}
                            {selectedItem.triadReview.reviewNotes && (
                              <div className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border border-green-100">
                                <span className="font-medium">Notes:</span> {selectedItem.triadReview.reviewNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Rejected */}
                      {selectedItem.triadReview.status === 'rejected' && selectedItem.triadReview.completedDate && (
                        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              ✗
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Rejected</span>
                              <span className="text-sm text-gray-600">
                                {new Date(selectedItem.triadReview.completedDate).toLocaleString()}
                              </span>
                            </div>
                            {selectedItem.triadReview.reviewedBy && (
                              <div className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">By:</span> {selectedItem.triadReview.reviewedBy}
                              </div>
                            )}
                            {selectedItem.triadReview.reviewNotes && (
                              <div className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border border-red-100">
                                <span className="font-medium">Reason:</span> {selectedItem.triadReview.reviewNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expected Completion */}
                      {selectedItem.triadReview.expectedCompletionDate && selectedItem.triadReview.status !== 'approved' && selectedItem.triadReview.status !== 'rejected' && (
                        <div className="text-sm text-gray-600 italic mt-2">
                          Expected completion: {new Date(selectedItem.triadReview.expectedCompletionDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!activeTags.includes(tag)) {
                            setActiveTags([...activeTags, tag]);
                          }
                          setViewMode('list'); // Switch back to list view to see filtered results
                        }}
                        className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-800 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
                        title={`Filter by ${tag}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Tracking */}
                {selectedItem.type === 'story' && (
                  <div className="mb-6 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Timeline</h3>
                    <div className="space-y-3">
                      {/* Created */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                            ✏️
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">Story Created</span>
                            <span className="text-sm text-gray-600">
                              {selectedItem.created}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">By:</span> {selectedItem.author}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Desk:</span> {selectedItem.desk}
                          </div>
                        </div>
                      </div>

                      {/* Last Updated */}
                      {selectedItem.updated && selectedItem.updated !== selectedItem.created && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              🔄
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Last Updated</span>
                              <span className="text-sm text-gray-600">
                                {selectedItem.updated}
                              </span>
                            </div>
                            {selectedItem.lastEditedBy && (
                              <div className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">By:</span> {selectedItem.lastEditedBy}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Status Changes */}
                      {selectedItem.status && (
                        <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              📊
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Current Status</span>
                              <span className={`px-3 py-1 rounded text-xs font-semibold ${
                                selectedItem.status === 'published' ? 'bg-green-100 text-green-800' :
                                selectedItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                selectedItem.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                selectedItem.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {selectedItem.status.toUpperCase()}
                              </span>
                            </div>
                            {selectedItem.estimatedPublishDate && (
                              <div className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">Estimated Publish:</span> {selectedItem.estimatedPublishDate}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Collaboration */}
                      {(selectedItem.hasNotes || selectedItem.linkedItems > 0) && (
                        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                              👥
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">Collaboration</span>
                            </div>
                            <div className="flex gap-4 mt-2 text-sm text-gray-700">
                              {selectedItem.hasNotes && (
                                <div>
                                  <span className="font-medium">Notes:</span> {selectedItem.noteCount || 0}
                                </div>
                              )}
                              {selectedItem.linkedItems > 0 && (
                                <div>
                                  <span className="font-medium">Linked Items:</span> {selectedItem.linkedItems}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedItem.linkedItems && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Linked Items</div>
                    <div className="text-base text-gray-900 bg-gray-50 px-4 py-2 rounded">
                      {selectedItem.linkedItems} items
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rich Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl my-8 flex flex-col max-h-[calc(100vh-4rem)]">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit' : 'New'} {modalType === 'story' ? 'Story' : 
                     modalType === 'event' ? 'Event' : 
                     modalType === 'guidance' ? 'Guidance' : 
                     modalType === 'storyline' ? 'Storyline' : 'Item'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium px-3 py-1 hover:bg-gray-100 rounded"
              >
                Close
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave({});
              }} id="modalForm" className="space-y-5">
              
              {/* STORY MODAL */}
              {modalType === 'story' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Text Article</option>
                      <option>Video Story</option>
                      <option>Photo Essay</option>
                      <option>Interactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title/Headline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter headline"
                      defaultValue={editingItem?.title}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Budget Line) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Brief summary"
                      rows="4"
                      defaultValue={editingItem?.description}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Story Owners <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px]">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        J. Smith (Reporter)
                        <button type="button" className="text-blue-600 hover:text-blue-800 text-xs ml-1">×</button>
                      </span>
                      <input
                        type="text"
                        placeholder="Add owner..."
                        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Idea</option>
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Publish Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Embargo Date/Time
                    </label>
                    <input
                      type="datetime-local"
                      placeholder="mm/dd/yyyy, --:-- --"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desk/Team Tags <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px]">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Politics
                        <button type="button" className="text-blue-600 hover:text-blue-800 text-xs ml-1">×</button>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Associated Storyline
                    </label>
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>None</option>
                      <option>Climate Crisis 2025</option>
                      <option>2026 Midterm Elections</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="triad" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                    <label htmlFor="triad" className="text-sm font-medium text-gray-700">
                      TRIAD Review Required
                    </label>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Linked Assets</h3>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 mb-3"
                    >
                      + Link Asset
                    </button>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded uppercase">ASSET</span>
                          <span className="text-sm">Climate Infographic</span>
                        </div>
                        <button type="button" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                          Unlink
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Freeform Notes</h3>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      + Add Note
                    </button>
                  </div>
                </div>
              )}

              {/* EVENT MODAL */}
              {modalType === 'event' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter event name"
                      defaultValue={editingItem?.title}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Brief description"
                      rows="3"
                      defaultValue={editingItem?.description}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      placeholder="mm/dd/yyyy"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      placeholder="--:-- --"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Event location"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Team</label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px]">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        T. Brown
                        <button type="button" className="text-blue-600 hover:text-blue-800 font-bold">Close</button>
                      </span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-2">Event Details (Notes)</h3>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      + Add Note
                    </button>
                    <p className="text-sm text-gray-500 italic mt-2">
                      Use notes for coverage logistics, schedules, camera positions, etc.
                    </p>
                  </div>
                </div>
              )}

              {/* GUIDANCE MODAL */}
              {modalType === 'guidance' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title/Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., PASS: Study Name"
                      defaultValue={editingItem?.title}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guidance Type</label>
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Pass Decision</option>
                      <option>Folded into Broader Story</option>
                      <option>Internal Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Explain decision or alert"
                      rows="4"
                      defaultValue={editingItem?.description}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desk/Team Awareness <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px]">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Science
                        <button type="button" className="text-blue-600 hover:text-blue-800 font-bold">Close</button>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attach to Storyline</label>
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Select Storyline</option>
                      <option>Climate Crisis 2025</option>
                      <option>2026 Midterm Elections</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STORYLINE MODAL */}
              {modalType === 'storyline' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Storyline Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter storyline name"
                      defaultValue={editingItem?.title}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Describe coverage area"
                      rows="4"
                      defaultValue={editingItem?.description}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Storyline Type</label>
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Specific Event</option>
                      <option>Ongoing Coverage</option>
                      <option>Breaking News</option>
                      <option>Investigation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator(s)</label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px]">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        L. Davis
                        <button type="button" className="text-blue-600 hover:text-blue-800 font-bold">Close</button>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desk/Team Tags <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px]">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        International
                        <button type="button" className="text-blue-600 hover:text-blue-800 font-bold">Close</button>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        placeholder="mm/dd/yyyy"
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="date"
                        placeholder="mm/dd/yyyy"
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Stories & Assets</h3>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                      >
                        + Add Story
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                      >
                        + Add Asset
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded uppercase">STORY</span>
                          <span className="text-xs">Climate Summit Agreement</span>
                        </div>
                        <button type="button" className="px-2 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-50">
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded uppercase">ASSET</span>
                          <span className="text-xs">Climate Infographic</span>
                        </div>
                        <button type="button" className="px-2 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-50">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </form>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0 bg-white">
              <button
                type="submit"
                form="modalForm"
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Save {modalType === 'story' ? 'Story' : 
                      modalType === 'event' ? 'Event' : 
                      modalType === 'guidance' ? 'Guidance' : 
                      modalType === 'storyline' ? 'Storyline' : 'Item'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && contextMenuItem && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* TRIAD Section - Only for TRIAD members */}
          {currentUser.isTriadMember && (
            <>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                TRIAD
              </div>
              
              {/* Start Review - Only show if review-requested */}
              {contextMenuItem.triad === 'review-requested' && (
                <button
                  onClick={handleTriadStartReview}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-gray-700"
                >
                  <span>Start Review</span>
                </button>
              )}
              
              {/* Approve - Show if review-requested or in-review */}
              {(contextMenuItem.triad === 'review-requested' || contextMenuItem.triad === 'in-review') && (
                <button
                  onClick={handleTriadApprove}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-green-700"
                >
                  <span>Approve</span>
                </button>
              )}
              
              {/* Reject - Show if review-requested or in-review */}
              {(contextMenuItem.triad === 'review-requested' || contextMenuItem.triad === 'in-review') && (
                <button
                  onClick={handleTriadReject}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-700"
                >
                  <span>Reject</span>
                </button>
              )}
              
              <div className="border-t border-gray-200 my-1"></div>
            </>
          )}
          
          {/* Request TRIAD Review - For non-TRIAD users or stories without review */}
          {(!contextMenuItem.triad || contextMenuItem.triad === 'rejected') && (
            <>
              <button
                onClick={handleTriadReviewRequest}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-gray-700"
              >
                <span>Request TRIAD Review</span>
              </button>
              
              <div className="border-t border-gray-200 my-1"></div>
            </>
          )}
          
          {/* Other Actions */}
          <button
            disabled
            className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
            title="Coming soon"
          >
            <span>Copy Link</span>
          </button>
          
          <button
            disabled
            className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
            title="Coming soon"
          >
            <span>Add Note</span>
          </button>
          
          <button
            disabled
            className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
            title="Coming soon"
          >
            <span>Convert Idea to Draft</span>
          </button>
          
          <div className="border-t border-gray-200 my-1"></div>
          
          <button
            disabled
            className="w-full px-4 py-2 text-left text-sm text-red-400 cursor-not-allowed flex items-center gap-2"
            title="Coming soon"
          >
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* TRIAD Review Request Modal */}
      {showTriadReviewModal && triadReviewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">Request TRIAD Review</h2>
              <button
                onClick={() => {
                  setShowTriadReviewModal(false);
                  setTriadReviewItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium px-3 py-1 hover:bg-gray-100 rounded"
              >
                Close
              </button>
            </div>

            {/* Story Info */}
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold uppercase">
                  Story
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{triadReviewItem.title}</h3>
                  <p className="text-sm text-gray-600">{triadReviewItem.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{triadReviewItem.desk}</span>
                    <span>•</span>
                    <span>{triadReviewItem.author}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form - Scrollable */}
            <div className="overflow-y-auto flex-1">
              <form id="triadReviewForm" onSubmit={handleTriadReviewSubmit} className="p-6">
                <div className="space-y-5">
                  {/* Urgency Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Urgency Level <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input 
                          type="radio" 
                          name="urgency" 
                          value="standard" 
                          defaultChecked 
                          className="mt-1"
                          required
                        />
                        <div>
                          <div className="font-medium text-gray-900">Standard (24-48 hours)</div>
                          <div className="text-sm text-gray-600">Regular review timeline for non-urgent stories</div>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 p-3 border border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                        <input 
                          type="radio" 
                          name="urgency" 
                          value="urgent" 
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-orange-700">Urgent (Same day)</div>
                          <div className="text-sm text-orange-600">For time-sensitive stories requiring immediate review</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Reason for Review */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reason"
                      rows="4"
                      placeholder="Explain why this story needs TRIAD review (e.g., contains legal claims, sensitive content, unconfirmed reports, etc.)"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Be specific to help TRIAD prioritize and review effectively
                    </p>
                  </div>

                  {/* Attachments Section (Placeholder) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">
                        Attach scripts, documents, or reference materials
                      </p>
                      <p className="text-xs text-gray-400 mt-1">(Feature coming soon)</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0 bg-white">
              <button
                type="submit"
                form="triadReviewForm"
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Review Request
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTriadReviewModal(false);
                  setTriadReviewItem(null);
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRIAD Action Modal (Approve/Reject) */}
      {showTriadActionModal && triadActionItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {triadAction === 'approve' ? 'Approve Story' : 'Reject Story'}
              </h2>
              <button
                onClick={() => {
                  setShowTriadActionModal(false);
                  setTriadAction(null);
                  setTriadActionItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Story Info */}
            <div className={`p-6 border-b border-gray-200 flex-shrink-0 ${
              triadAction === 'approve' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold uppercase">
                  Story
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{triadActionItem.title}</h3>
                  <p className="text-sm text-gray-600">{triadActionItem.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{triadActionItem.desk}</span>
                    <span>•</span>
                    <span>{triadActionItem.author}</span>
                  </div>
                  {triadActionItem.triadReview && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600">
                        <p><strong>Requested by:</strong> {triadActionItem.triadReview.requestedBy}</p>
                        <p><strong>Reason:</strong> {triadActionItem.triadReview.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form - Scrollable */}
            <div className="overflow-y-auto flex-1">
              <form id="triadActionForm" onSubmit={handleTriadActionSubmit} className="p-6">
                <div className="space-y-5">
                  {/* Review Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {triadAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="notes"
                      rows="6"
                      placeholder={
                        triadAction === 'approve'
                          ? 'Add any notes or conditions for approval...'
                          : 'Explain why this story is being rejected and what needs to be changed...'
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {triadAction === 'approve'
                        ? 'Document any conditions or observations for the approval'
                        : 'Be specific to help the author understand what needs to be addressed'
                      }
                    </p>
                  </div>

                  {triadAction === 'approve' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 text-xl">✓</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900">Ready to approve</p>
                          <p className="text-xs text-green-700 mt-1">
                            This story will be marked as TRIAD approved and ready for publication.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {triadAction === 'reject' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-red-600 text-xl">✗</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">Ready to reject</p>
                          <p className="text-xs text-red-700 mt-1">
                            The author will be notified and can address your feedback before resubmitting.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0 bg-white">
              <button
                type="submit"
                form="triadActionForm"
                className={`px-6 py-2.5 font-medium rounded-lg transition-colors ${
                  triadAction === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {triadAction === 'approve' ? 'Approve Story' : 'Reject Story'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTriadActionModal(false);
                  setTriadAction(null);
                  setTriadActionItem(null);
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Storyhub;
