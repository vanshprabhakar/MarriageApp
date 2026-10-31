import React, { useState, useEffect } from 'react';
import {
  Users, ShoppingBag, Home, DollarSign, Plus, Trash2, Settings,
  Check, X, Share2, Upload, MessageCircle, Database, RefreshCw
} from 'lucide-react';
import { supabase } from './supabaseClient';

const LIVE_DOMAIN = 'https://marriage-app-olive.vercel.app';

const DEFAULT_PROFILE = {
  groomName: 'Vansh',
  brideName: 'Riya',
  dateRangeLabel: 'November 24–25, 2026',
  city: 'Taj Yeshwantpur, Bengaluru',
  ceremonies: [
    { id: 'haldi', name: 'Haldi', date: '24 Nov 2026', time: '10:00 AM', venue: 'Poolside Lawn' },
    { id: 'mehendi', name: 'Mehendi', date: '24 Nov 2026', time: '04:30 PM', venue: 'Garden Courtyard' },
    { id: 'sangeet', name: 'Sangeet', date: '24 Nov 2026', time: '07:30 PM', venue: 'Royal Ballroom' },
    { id: 'wedding', name: 'Wedding', date: '25 Nov 2026', time: '11:30 AM', venue: 'Main Mandap Lawn' },
    { id: 'reception', name: 'Reception', date: '25 Nov 2026', time: '08:00 PM', venue: 'Grand Banquet Hall' }
  ]
};

const DEFAULT_THEME = {
  bgColor: '#ffffff',
  textColor: '#1c1917',
  bgImage: '',
  overlayOpacity: 0.6
};

const DEFAULT_HOUSEHOLDS = [
  {
    id: 1793427119143,
    name: 'Sharma Family (Rajesh & Sunita)',
    side: 'Bride',
    whatsapp: '+919876543210',
    isOutstation: true,
    invitedEvents: ['haldi', 'mehendi', 'wedding', 'reception'],
    status: 'Attending',
    headcount: 4,
    arrivalDate: '2026-11-23',
    arrivalTime: '14:00',
    departureDate: '2026-11-26',
    departureTime: '10:00',
    allocatedStay: 'Taj Yeshwantpur - Room 304'
  },
  {
    id: 1793427119144,
    name: 'Gupta Household',
    side: 'Groom',
    whatsapp: '+919123456789',
    isOutstation: false,
    invitedEvents: ['sangeet', 'wedding', 'reception'],
    status: 'Pending',
    headcount: 2,
    arrivalDate: '',
    arrivalTime: '',
    departureDate: '',
    departureTime: '',
    allocatedStay: 'Local Resident'
  }
];

const DEFAULT_INVENTORY = [
  { id: 1, name: 'Bridal Lehenga (Main Wedding)', category: 'Apparel', ceremony: 'Wedding', status: 'In Alteration', custody: 'At Designer Studio', owner: 'Riya' },
  { id: 2, name: 'Groom Sherwani', category: 'Apparel', ceremony: 'Wedding', status: 'Ordered', custody: 'Sartorial Tailor', owner: 'Vansh' },
  { id: 3, name: 'Pooja Thali & Silver Coins', category: 'Ritual', ceremony: 'Wedding', status: 'To Buy', custody: 'Home Locker', owner: 'Mom' }
];

const DEFAULT_VENDORS = [
  { id: 1, name: 'Taj Yeshwantpur', category: 'Venue', side: 'Shared', total: 450000, paid: 150000, dueDate: '2026-10-10' },
  { id: 2, name: 'Royal Caterers', category: 'Catering', side: 'Bride', total: 320000, paid: 100000, dueDate: '2026-10-25' },
  { id: 3, name: 'Shutterdown Photography', category: 'Media', side: 'Groom', total: 150000, paid: 50000, dueDate: '2026-11-01' }
];

export default function App() {
  // Navigation & URL Guest Lock
  const [viewMode, setViewMode] = useState('admin'); // 'admin' | 'guest-preview'
  const [isLockedGuestLink, setIsLockedGuestLink] = useState(false);
  const [activeTab, setActiveTab] = useState('guests');
  const [selectedGuestPreview, setSelectedGuestPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rsvpSubmittedToast, setRsvpSubmittedToast] = useState(false);

  // Core Data States
  const [weddingProfile, setWeddingProfile] = useState(DEFAULT_PROFILE);
  const [rsvpTheme, setRsvpTheme] = useState(DEFAULT_THEME);
  const [households, setHouseholds] = useState(DEFAULT_HOUSEHOLDS);
  const [inventory, setInventory] = useState(DEFAULT_INVENTORY);
  const [vendors, setVendors] = useState(DEFAULT_VENDORS);

  // Modals
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);

  // Add Household Form State
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilySide, setNewFamilySide] = useState('Groom');
  const [newFamilyPhone, setNewFamilyPhone] = useState('');
  const [newFamilyHeadcount, setNewFamilyHeadcount] = useState(2);
  const [newFamilyOutstation, setNewFamilyOutstation] = useState(true);
  const [newFamilySelectedEvents, setNewFamilySelectedEvents] = useState([]);

  // Add Shopping Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Apparel');
  const [newItemCustody, setNewItemCustody] = useState('');
  const [newItemOwner, setNewItemOwner] = useState('');

  // Add Vendor Form State
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('Venue');
  const [newVendorSide, setNewVendorSide] = useState('Shared');
  const [newVendorTotal, setNewVendorTotal] = useState('');
  const [newVendorPaid, setNewVendorPaid] = useState('');
  const [newVendorDue, setNewVendorDue] = useState('');

  // Dynamic Ceremony Form State
  const [newCeremonyName, setNewCeremonyName] = useState('');
  const [newCeremonyDate, setNewCeremonyDate] = useState('');
  const [newCeremonyTime, setNewCeremonyTime] = useState('');
  const [newCeremonyVenue, setNewCeremonyVenue] = useState('');

  // Guest RSVP Interactive Form State
  const [guestRsvpStatus, setGuestRsvpStatus] = useState('Attending');
  const [guestRsvpHeadcount, setGuestRsvpHeadcount] = useState(2);
  const [guestArrivalDate, setGuestArrivalDate] = useState('');
  const [guestArrivalTime, setGuestArrivalTime] = useState('');
  const [guestDepartureDate, setGuestDepartureDate] = useState('');
  const [guestDepartureTime, setGuestDepartureTime] = useState('');

  // Helper: Mapper from DB snake_case to UI camelCase
  const mapHouseholdFromDb = (h) => ({
    id: Number(h.id),
    name: h.name,
    side: h.side || 'Groom',
    whatsapp: h.whatsapp || '',
    isOutstation: Boolean(h.is_outstation),
    invitedEvents: Array.isArray(h.invited_events) ? h.invited_events : [],
    status: h.status || 'Pending',
    headcount: Number(h.headcount || 1),
    arrivalDate: h.arrival_date || '',
    arrivalTime: h.arrival_time || '',
    departureDate: h.departure_date || '',
    departureTime: h.departure_time || '',
    allocatedStay: h.allocated_stay || 'Unassigned'
  });

  // Helper: Mapper from UI camelCase to DB snake_case
  const mapHouseholdToDb = (h) => ({
    id: h.id,
    name: h.name,
    side: h.side,
    whatsapp: h.whatsapp,
    is_outstation: h.isOutstation,
    invited_events: h.invitedEvents,
    status: h.status,
    headcount: h.headcount,
    arrival_date: h.arrivalDate,
    arrival_time: h.arrivalTime,
    departure_date: h.departureDate,
    departure_time: h.departureTime,
    allocated_stay: h.allocatedStay
  });

  // 1. Load Data from Supabase (or LocalStorage fallback)
  useEffect(() => {
    async function loadAllData() {
      setIsLoading(true);
      if (supabase) {
        try {
          // Load Wedding Settings & Theme
          const { data: sData } = await supabase.from('wedding_settings').select('*').eq('id', 1).single();
          if (sData) {
            setWeddingProfile({
              groomName: sData.groom_name,
              brideName: sData.bride_name,
              dateRangeLabel: sData.date_range_label,
              city: sData.city,
              ceremonies: sData.ceremonies?.length ? sData.ceremonies : DEFAULT_PROFILE.ceremonies
            });
            if (sData.rsvp_theme && Object.keys(sData.rsvp_theme).length > 0) {
              setRsvpTheme(sData.rsvp_theme);
            }
          } else {
            // Seed initial settings row
            await supabase.from('wedding_settings').upsert([{
              id: 1,
              groom_name: DEFAULT_PROFILE.groomName,
              bride_name: DEFAULT_PROFILE.brideName,
              date_range_label: DEFAULT_PROFILE.dateRangeLabel,
              city: DEFAULT_PROFILE.city,
              ceremonies: DEFAULT_PROFILE.ceremonies,
              rsvp_theme: DEFAULT_THEME
            }]);
          }

          // Load Households
          const { data: hData } = await supabase.from('households').select('*').order('id', { ascending: true });
          if (hData && hData.length > 0) {
            setHouseholds(hData.map(mapHouseholdFromDb));
          } else {
            await supabase.from('households').insert(DEFAULT_HOUSEHOLDS.map(mapHouseholdToDb));
          }

          // Load Inventory
          const { data: iData } = await supabase.from('inventory').select('*').order('id', { ascending: true });
          if (iData && iData.length > 0) {
            setInventory(iData);
          } else {
            await supabase.from('inventory').insert(DEFAULT_INVENTORY);
          }

          // Load Vendors
          const { data: vData } = await supabase.from('vendors').select('*').order('id', { ascending: true });
          if (vData && vData.length > 0) {
            setVendors(vData.map(v => ({ ...v, total: Number(v.total), paid: Number(v.paid), dueDate: v.due_date || '' })));
          } else {
            await supabase.from('vendors').insert(DEFAULT_VENDORS.map(v => ({
              id: v.id, name: v.name, category: v.category, side: v.side, total: v.total, paid: v.paid, due_date: v.dueDate
            })));
          }
        } catch (err) {
          console.error('Supabase fetch error:', err);
        }
      } else {
        // Fallback to LocalStorage when Supabase .env keys aren't configured yet
        const savedProfile = localStorage.getItem('wh_profile');
        const savedTheme = localStorage.getItem('wh_theme');
        const savedHouseholds = localStorage.getItem('wh_households');
        const savedInventory = localStorage.getItem('wh_inventory');
        const savedVendors = localStorage.getItem('wh_vendors');

        if (savedProfile) setWeddingProfile(JSON.parse(savedProfile));
        if (savedTheme) setRsvpTheme(JSON.parse(savedTheme));
        if (savedHouseholds) setHouseholds(JSON.parse(savedHouseholds));
        if (savedInventory) setInventory(JSON.parse(savedInventory));
        if (savedVendors) setVendors(JSON.parse(savedVendors));
      }
      setIsLoading(false);
    }
    loadAllData();
  }, []);

  // Sync to localStorage as backup
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('wh_profile', JSON.stringify(weddingProfile));
      localStorage.setItem('wh_theme', JSON.stringify(rsvpTheme));
      localStorage.setItem('wh_households', JSON.stringify(households));
      localStorage.setItem('wh_inventory', JSON.stringify(inventory));
      localStorage.setItem('wh_vendors', JSON.stringify(vendors));
    }
  }, [weddingProfile, rsvpTheme, households, inventory, vendors, isLoading]);

  // 2. Auto-detect ?guest=ID from WhatsApp URL and open their Guest RSVP Portal directly
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestId = params.get('guest');
    if (guestId && households.length > 0) {
      const found = households.find(h => h.id.toString() === guestId.toString());
      if (found) {
        openGuestPortalForFamily(found);
        setIsLockedGuestLink(true);
      }
    }
  }, [households]);

  const openGuestPortalForFamily = (family) => {
    setSelectedGuestPreview(family);
    setGuestRsvpStatus(family.status === 'Pending' ? 'Attending' : family.status);
    setGuestRsvpHeadcount(family.headcount);
    setGuestArrivalDate(family.arrivalDate || '');
    setGuestArrivalTime(family.arrivalTime || '');
    setGuestDepartureDate(family.departureDate || '');
    setGuestDepartureTime(family.departureTime || '');
    setViewMode('guest-preview');
  };

  // Save Profile & Theme to Supabase
  const saveSettingsToDb = async (updatedProfile = weddingProfile, updatedTheme = rsvpTheme) => {
    if (supabase) {
      await supabase.from('wedding_settings').upsert([{
        id: 1,
        groom_name: updatedProfile.groomName,
        bride_name: updatedProfile.brideName,
        date_range_label: updatedProfile.dateRangeLabel,
        city: updatedProfile.city,
        ceremonies: updatedProfile.ceremonies,
        rsvp_theme: updatedTheme
      }]);
    }
  };

  // Add / Remove Ceremony Handlers
  const addCeremony = async () => {
    if (!newCeremonyName.trim()) return;
    const id = newCeremonyName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-3);
    const newCeremony = {
      id,
      name: newCeremonyName.trim(),
      date: newCeremonyDate || '25 Nov 2026',
      time: newCeremonyTime || '06:00 PM',
      venue: newCeremonyVenue || 'Main Lawn'
    };
    const updatedProfile = {
      ...weddingProfile,
      ceremonies: [...weddingProfile.ceremonies, newCeremony]
    };
    setWeddingProfile(updatedProfile);
    await saveSettingsToDb(updatedProfile, rsvpTheme);
    setNewCeremonyName('');
    setNewCeremonyDate('');
    setNewCeremonyTime('');
    setNewCeremonyVenue('');
  };

  const removeCeremony = async (id) => {
    if (weddingProfile.ceremonies.length <= 1) {
      alert('You must keep at least one ceremony.');
      return;
    }
    const updatedProfile = {
      ...weddingProfile,
      ceremonies: weddingProfile.ceremonies.filter(c => c.id !== id)
    };
    setWeddingProfile(updatedProfile);
    await saveSettingsToDb(updatedProfile, rsvpTheme);
  };

  // Household CRUD Operations
  const handleAddHousehold = async () => {
    if (!newFamilyName.trim()) return;
    const newFamily = {
      id: Date.now(),
      name: newFamilyName.trim(),
      side: newFamilySide,
      whatsapp: newFamilyPhone.trim() || '+919999999999',
      isOutstation: newFamilyOutstation,
      invitedEvents: newFamilySelectedEvents.length > 0 ? newFamilySelectedEvents : weddingProfile.ceremonies.map(c => c.id),
      status: 'Pending',
      headcount: newFamilyHeadcount,
      arrivalDate: '',
      arrivalTime: '',
      departureDate: '',
      departureTime: '',
      allocatedStay: newFamilyOutstation ? 'Unassigned' : 'Local Resident'
    };

    setHouseholds([...households, newFamily]);
    if (supabase) {
      await supabase.from('households').insert([mapHouseholdToDb(newFamily)]);
    }

    setNewFamilyName('');
    setNewFamilyPhone('');
    setNewFamilyHeadcount(2);
    setShowAddFamilyModal(false);
  };

  const handleDeleteHousehold = async (id) => {
    setHouseholds(households.filter(h => h.id !== id));
    if (supabase) {
      await supabase.from('households').delete().eq('id', id);
    }
  };

  const handleUpdateHouseholdStay = async (id, allocatedStay) => {
    const updated = households.map(h => h.id === id ? { ...h, allocatedStay } : h);
    setHouseholds(updated);
    if (supabase) {
      await supabase.from('households').update({ allocated_stay: allocatedStay }).eq('id', id);
    }
  };

  // Guest RSVP Submission Handler
  const handleGuestRsvpSubmit = async () => {
    if (!selectedGuestPreview) return;
    const updatedFamily = {
      ...selectedGuestPreview,
      status: guestRsvpStatus,
      headcount: guestRsvpStatus === 'Declined' ? 0 : Number(guestRsvpHeadcount),
      arrivalDate: guestArrivalDate,
      arrivalTime: guestArrivalTime,
      departureDate: guestDepartureDate,
      departureTime: guestDepartureTime
    };

    setSelectedGuestPreview(updatedFamily);
    setHouseholds(households.map(h => h.id === updatedFamily.id ? updatedFamily : h));

    if (supabase) {
      await supabase
        .from('households')
        .update(mapHouseholdToDb(updatedFamily))
        .eq('id', updatedFamily.id);
    }

    setRsvpSubmittedToast(true);
    setTimeout(() => setRsvpSubmittedToast(false), 4000);
  };

  // Shopping Inventory CRUD
  const handleAddInventoryItem = async () => {
    if (!newItemName.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      ceremony: 'Wedding',
      status: 'To Buy',
      custody: newItemCustody.trim() || 'Pending Purchase',
      owner: newItemOwner.trim() || weddingProfile.groomName
    };
    setInventory([...inventory, newItem]);
    if (supabase) {
      await supabase.from('inventory').insert([newItem]);
    }
    setNewItemName('');
    setNewItemCustody('');
    setNewItemOwner('');
  };

  const handleUpdateInventoryStatus = async (id, status) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, status } : i));
    if (supabase) {
      await supabase.from('inventory').update({ status }).eq('id', id);
    }
  };

  const handleUpdateInventoryCustody = async (id, custody) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, custody } : i));
    if (supabase) {
      await supabase.from('inventory').update({ custody }).eq('id', id);
    }
  };

  const handleDeleteInventoryItem = async (id) => {
    setInventory(inventory.filter(i => i.id !== id));
    if (supabase) {
      await supabase.from('inventory').delete().eq('id', id);
    }
  };

  // Vendor CRUD
  const handleAddVendor = async () => {
    if (!newVendorName.trim()) return;
    const newVendor = {
      id: Date.now(),
      name: newVendorName.trim(),
      category: newVendorCategory,
      side: newVendorSide,
      total: Number(newVendorTotal) || 0,
      paid: Number(newVendorPaid) || 0,
      dueDate: newVendorDue || '2026-11-15'
    };
    setVendors([...vendors, newVendor]);
    if (supabase) {
      await supabase.from('vendors').insert([{
        id: newVendor.id,
        name: newVendor.name,
        category: newVendor.category,
        side: newVendor.side,
        total: newVendor.total,
        paid: newVendor.paid,
        due_date: newVendor.dueDate
      }]);
    }
    setNewVendorName('');
    setNewVendorTotal('');
    setNewVendorPaid('');
    setShowAddVendorModal(false);
  };

  const handleDeleteVendor = async (id) => {
    setVendors(vendors.filter(v => v.id !== id));
    if (supabase) {
      await supabase.from('vendors').delete().eq('id', id);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedTheme = { ...rsvpTheme, bgImage: reader.result };
        setRsvpTheme(updatedTheme);
        saveSettingsToDb(weddingProfile, updatedTheme);
      };
      reader.readAsDataURL(file);
    }
  };

  // WhatsApp Invite Dispatcher (Uses live Vercel URL or current host)
  const sendWhatsAppInvite = (h) => {
    const baseUrl = window.location.origin.includes('localhost')
      ? LIVE_DOMAIN
      : window.location.origin;
    const guestUrl = `${baseUrl}/?guest=${h.id}`;
    const invitedNames = h.invitedEvents
      .map(eid => weddingProfile.ceremonies.find(c => c.id === eid)?.name)
      .filter(Boolean)
      .join(', ');

    const message = encodeURIComponent(
      `Dear ${h.name},\n\nWith joyful hearts, we invite you to the wedding celebrations of *${weddingProfile.groomName} & ${weddingProfile.brideName}* (${weddingProfile.dateRangeLabel} at ${weddingProfile.city}).\n\nInvited Functions: ${invitedNames}\nReserved Seats: ${h.headcount}\n\nPlease confirm your RSVP and travel details on your personal link:\n${guestUrl}`
    );
    const cleanPhone = h.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // WhatsApp Stay Allocation Dispatcher
  const sendWhatsAppStayDetails = (h) => {
    const message = encodeURIComponent(
      `Dear ${h.name},\n\nWe look forward to welcoming you to ${weddingProfile.groomName} & ${weddingProfile.brideName}'s wedding!\n\n*Your Hospitality & Room Allocation:*\nHotel/Room: *${h.allocatedStay}*\nCheck-in: ${h.arrivalDate || 'TBD'} (${h.arrivalTime || 'TBD'})\nCheck-out: ${h.departureDate || 'TBD'} (${h.departureTime || 'TBD'})\n\nSee you soon!`
    );
    const cleanPhone = h.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased pb-16">
      
      {/* Top SaaS Navigation Header (Hidden if opened by a guest via ?guest=ID link) */}
      {!isLockedGuestLink && (
        <header className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-stone-900 text-white p-2 rounded-xl font-bold text-sm tracking-wider">
                {weddingProfile.groomName?.[0] || 'V'}&{weddingProfile.brideName?.[0] || 'R'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-sm sm:text-base">
                    {weddingProfile.groomName} & {weddingProfile.brideName}'s Wedding Hub
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${supabase ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    <Database size={10} /> {supabase ? 'Supabase Live' : 'Local Mode'}
                  </span>
                </div>
                <p className="text-xs text-stone-500">{weddingProfile.dateRangeLabel} • {weddingProfile.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowThemeModal(true)}
                className="flex items-center gap-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-medium transition"
              >
                <Settings size={14} /> SaaS & RSVP Theme
              </button>
              <div className="bg-stone-100 p-1 rounded-xl flex items-center">
                <button
                  onClick={() => setViewMode('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'admin' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  Admin App
                </button>
                <button
                  onClick={() => openGuestPortalForFamily(households[0])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'guest-preview' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  Guest RSVP View
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 mt-6">
        
        {viewMode === 'guest-preview' ? (
          /* ================= GUEST RSVP PORTAL VIEW (PRD v1.3 Editorial) ================= */
          <div
            className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl border border-stone-200 relative min-h-162.5 flex flex-col justify-between p-6 transition-all"
            style={{
              backgroundColor: rsvpTheme.bgColor,
              color: rsvpTheme.textColor,
              backgroundImage: rsvpTheme.bgImage ? `url(${rsvpTheme.bgImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Optional Readability Overlay when Background Image is Uploaded */}
            {rsvpTheme.bgImage && (
              <div
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: rsvpTheme.overlayOpacity }}
              />
            )}

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] uppercase tracking-widest opacity-75 font-mono">
                  Wedding Invitation
                </span>
                {!isLockedGuestLink && (
                  <button
                    onClick={() => setViewMode('admin')}
                    className="text-xs px-2.5 py-1 rounded-full bg-stone-500/20 hover:bg-stone-500/30 backdrop-blur-md transition flex items-center gap-1 font-medium"
                  >
                    <X size={12} /> Exit Preview
                  </button>
                )}
              </div>

              {/* Editorial Couple Header & Personal Greeting */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-serif tracking-tight mb-1">
                  {weddingProfile.groomName} & {weddingProfile.brideName}
                </h2>
                <p className="text-xs opacity-80">
                  {weddingProfile.dateRangeLabel} • {weddingProfile.city}
                </p>
                <div className="w-full h-px bg-current opacity-15 my-4" />

                <div className="text-left space-y-1">
                  <p className="font-semibold text-sm">
                    Dear {selectedGuestPreview?.name || 'Guest Family'},
                  </p>
                  <p className="text-xs opacity-85 leading-relaxed">
                    We have reserved up to {selectedGuestPreview?.headcount || 2} seats for your family. All ceremonies feature a 100% pure vegetarian menu.
                  </p>
                </div>
              </div>

              {/* Step 1: Confirm Ceremony Attendance */}
              <div className="space-y-4 bg-stone-500/10 backdrop-blur-md p-4 rounded-xl border border-current/15">
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-85">
                  1. Your Invited Ceremonies
                </h3>

                <div className="space-y-2">
                  {weddingProfile.ceremonies
                    .filter(c => selectedGuestPreview?.invitedEvents?.includes(c.id))
                    .map(c => (
                      <div key={c.id} className="flex items-center justify-between text-xs py-2 border-b border-current/10 last:border-none">
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="opacity-75 text-[11px]">{c.date} • {c.time} • {c.venue}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                          Invited
                        </span>
                      </div>
                    ))}
                </div>

                {/* Attendance Status Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-medium opacity-85 mb-1.5">
                    Will you be joining us?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGuestRsvpStatus('Attending')}
                      className={`py-2 rounded-lg text-xs font-semibold border transition ${
                        guestRsvpStatus === 'Attending'
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-transparent border-current/30 opacity-75'
                      }`}
                    >
                      Joyfully Attending
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuestRsvpStatus('Declined')}
                      className={`py-2 rounded-lg text-xs font-semibold border transition ${
                        guestRsvpStatus === 'Declined'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-transparent border-current/30 opacity-75'
                      }`}
                    >
                      Regretfully Decline
                    </button>
                  </div>
                </div>

                {guestRsvpStatus === 'Attending' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium opacity-85 mb-1">
                        Total Attending Guests
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={guestRsvpHeadcount}
                        onChange={(e) => setGuestRsvpHeadcount(e.target.value)}
                        className="w-full bg-white/80 text-stone-900 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>

                    {selectedGuestPreview?.isOutstation && (
                      <div className="pt-2 border-t border-current/15 space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider opacity-85">
                          2. Outstation Arrival & Departure
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] opacity-80 mb-1">Arrival Date & Time</label>
                            <input
                              type="date"
                              value={guestArrivalDate}
                              onChange={(e) => setGuestArrivalDate(e.target.value)}
                              className="w-full bg-white/80 text-stone-900 border border-stone-300 rounded-lg px-2 py-1.5 text-xs"
                            />
                            <input
                              type="time"
                              value={guestArrivalTime}
                              onChange={(e) => setGuestArrivalTime(e.target.value)}
                              className="w-full mt-1 bg-white/80 text-stone-900 border border-stone-300 rounded-lg px-2 py-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] opacity-80 mb-1">Departure Date & Time</label>
                            <input
                              type="date"
                              value={guestDepartureDate}
                              onChange={(e) => setGuestDepartureDate(e.target.value)}
                              className="w-full bg-white/80 text-stone-900 border border-stone-300 rounded-lg px-2 py-1.5 text-xs"
                            />
                            <input
                              type="time"
                              value={guestDepartureTime}
                              onChange={(e) => setGuestDepartureTime(e.target.value)}
                              className="w-full mt-1 bg-white/80 text-stone-900 border border-stone-300 rounded-lg px-2 py-1.5 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={handleGuestRsvpSubmit}
                  className="w-full bg-stone-900 text-white font-semibold py-2.5 rounded-lg text-sm shadow hover:bg-stone-800 transition mt-2 flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Submit RSVP Response
                </button>

                {rsvpSubmittedToast && (
                  <div className="p-2.5 rounded-lg bg-emerald-600 text-white text-xs text-center font-medium">
                    Thank you! Your RSVP has been saved.
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 text-center mt-6 text-[10px] opacity-60 font-mono">
              {weddingProfile.groomName} & {weddingProfile.brideName} Wedding Hub
            </div>
          </div>
        ) : (
          /* ================= ADMIN WORKSPACE ================= */
          <div>
            {/* 4-Tab Bar */}
            <div className="flex border-b border-stone-200 mb-6 overflow-x-auto">
              {[
                { id: 'guests', label: '1. Guests & RSVPs', icon: Users },
                { id: 'shopping', label: '2. Shopping & Trousseau', icon: ShoppingBag },
                { id: 'stay', label: '3. Stay & Hospitality', icon: Home },
                { id: 'budget', label: '4. Budget & Vendors', icon: DollarSign },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'border-stone-900 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: GUESTS & RSVPS */}
            {activeTab === 'guests' && (
              <div className="space-y-6">
                {/* Ceremony Headcount Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {weddingProfile.ceremonies.map(c => {
                    const count = households.reduce(
                      (acc, h) => (h.invitedEvents.includes(c.id) && h.status !== 'Declined' ? acc + h.headcount : acc),
                      0
                    );
                    return (
                      <div key={c.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative group">
                        <button
                          onClick={() => removeCeremony(c.id)}
                          className="absolute top-2 right-2 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                          title="Remove Ceremony"
                        >
                          <Trash2 size={12} />
                        </button>
                        <p className="text-xs text-stone-500 font-medium">{c.name}</p>
                        <p className="text-xl font-bold mt-1">
                          {count} <span className="text-xs font-normal text-stone-400">guests</span>
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">{c.date}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Master List */}
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-base">Household & RSVP Master List</h3>
                      <p className="text-xs text-stone-500">
                        Click the green WhatsApp icon to dispatch a live RSVP invite link to any family.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setNewFamilySelectedEvents(weddingProfile.ceremonies.map(c => c.id));
                          setShowAddFamilyModal(true);
                        }}
                        className="bg-stone-900 text-white text-xs px-3.5 py-2 rounded-lg font-medium hover:bg-stone-800 transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus size={14} /> Add Household
                      </button>
                      <button
                        onClick={() => setShowThemeModal(true)}
                        className="bg-stone-100 text-stone-700 text-xs px-3.5 py-2 rounded-lg font-medium hover:bg-stone-200 transition flex items-center gap-1.5"
                      >
                        <Settings size={14} /> Manage Ceremonies
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-400 font-mono uppercase text-[10px]">
                          <th className="pb-3">Family / Unit</th>
                          <th className="pb-3">Side</th>
                          <th className="pb-3">Invited Ceremonies</th>
                          <th className="pb-3">RSVP Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {households.map(h => (
                          <tr key={h.id} className="hover:bg-stone-50/80 transition">
                            <td className="py-3 font-medium">
                              {h.name}
                              <span className="block text-[10px] text-stone-400">
                                {h.whatsapp} • {h.headcount} seats
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${h.side === 'Bride' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                {h.side}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {h.invitedEvents.map(eId => {
                                  const cObj = weddingProfile.ceremonies.find(c => c.id === eId);
                                  return cObj ? (
                                    <span key={eId} className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[10px]">
                                      {cObj.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                h.status === 'Attending'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : h.status === 'Declined'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {h.status} ({h.headcount}p)
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => sendWhatsAppInvite(h)}
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-700 font-medium transition flex items-center gap-1 text-[11px]"
                                  title="Send WhatsApp Invite Link"
                                >
                                  <MessageCircle size={13} /> WhatsApp
                                </button>
                                <button
                                  onClick={() => openGuestPortalForFamily(h)}
                                  className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition"
                                  title="Preview Guest RSVP View"
                                >
                                  <Share2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteHousehold(h.id)}
                                  className="p-1.5 hover:bg-red-50 rounded text-red-500 transition"
                                  title="Delete Family"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SHOPPING & TROUSSEAU */}
            {activeTab === 'shopping' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
                <div>
                  <h3 className="font-semibold text-base">Shopping, Trousseau & Custody Tracker</h3>
                  <p className="text-xs text-stone-500">
                    Track outfits, jewelry, and pooja items across stages and physical locations.
                  </p>
                </div>

                {/* Add Item Form */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Item Name</label>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="e.g. Sangeet Shoes"
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Category</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs"
                    >
                      <option value="Apparel">Apparel</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Ritual">Ritual / Pooja</option>
                      <option value="Gift">Return Gifts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Custody / Location</label>
                    <input
                      type="text"
                      value={newItemCustody}
                      onChange={(e) => setNewItemCustody(e.target.value)}
                      placeholder="e.g. Suitcase #2 / Tailor"
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Assigned Owner</label>
                    <input
                      type="text"
                      value={newItemOwner}
                      onChange={(e) => setNewItemOwner(e.target.value)}
                      placeholder="e.g. Riya / Mom"
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <button
                    onClick={handleAddInventoryItem}
                    className="bg-stone-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-stone-800 transition"
                  >
                    + Add Item
                  </button>
                </div>

                {/* Inventory List */}
                <div className="space-y-2">
                  {inventory.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.name}</span>
                          <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-mono">{item.category}</span>
                          <span className="text-[10px] text-stone-500">• Owner: {item.owner}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span>Custody:</span>
                          <input
                            type="text"
                            defaultValue={item.custody}
                            onBlur={(e) => handleUpdateInventoryCustody(item.id, e.target.value)}
                            className="bg-white border border-stone-200 rounded px-2 py-0.5 text-xs text-stone-800 font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateInventoryStatus(item.id, e.target.value)}
                          className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium"
                        >
                          <option value="To Buy">To Buy</option>
                          <option value="Ordered">Ordered</option>
                          <option value="In Alteration">In Alteration</option>
                          <option value="Ready">Ready</option>
                          <option value="Packed">Packed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteInventoryItem(item.id)}
                          className="text-stone-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: STAY & HOSPITALITY */}
            {activeTab === 'stay' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div>
                  <h3 className="font-semibold text-base">Outstation Hospitality & Rooming Matrix</h3>
                  <p className="text-xs text-stone-500">
                    View guest arrival/departure dates & times from their RSVPs and allocate rooms.
                  </p>
                </div>

                <div className="space-y-3">
                  {households.filter(h => h.isOutstation).map(h => (
                    <div key={h.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {h.name} <span className="text-xs font-normal text-stone-500">({h.headcount} pax)</span>
                        </h4>
                        <p className="text-xs text-stone-600 mt-1">
                          Arrival: <span className="font-medium">{h.arrivalDate || 'Not Set'} ({h.arrivalTime || '—'})</span> • Departure: <span className="font-medium">{h.departureDate || 'Not Set'} ({h.departureTime || '—'})</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          defaultValue={h.allocatedStay}
                          onBlur={(e) => handleUpdateHouseholdStay(h.id, e.target.value)}
                          placeholder="Assign Room (e.g. Taj Room 204)"
                          className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs w-full sm:w-60"
                        />
                        <button
                          onClick={() => sendWhatsAppStayDetails(h)}
                          className="bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-stone-800 transition whitespace-nowrap flex items-center gap-1"
                        >
                          <MessageCircle size={13} /> Send Room Info
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: BUDGET & VENDORS */}
            {activeTab === 'budget' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-base">Budget, Vendors & 3-Way Split Ledger</h3>
                    <p className="text-xs text-stone-500">
                      Track vendor contracts across Groom side, Bride side, and Shared pool.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddVendorModal(true)}
                    className="bg-stone-900 text-white text-xs px-3.5 py-2 rounded-lg font-medium hover:bg-stone-800 transition flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Vendor
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <p className="text-[10px] uppercase font-mono text-stone-500">Total Committed</p>
                    <p className="text-lg font-bold mt-1">₹{vendors.reduce((acc, v) => acc + v.total, 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <p className="text-[10px] uppercase font-mono text-stone-500">Total Paid</p>
                    <p className="text-lg font-bold mt-1 text-emerald-600">₹{vendors.reduce((acc, v) => acc + v.paid, 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <p className="text-[10px] uppercase font-mono text-stone-500">Balance Due</p>
                    <p className="text-lg font-bold mt-1 text-amber-600">₹{vendors.reduce((acc, v) => acc + (v.total - v.paid), 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Vendors Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 font-mono uppercase text-[10px]">
                        <th className="pb-3">Vendor / Service</th>
                        <th className="pb-3">Split Payer</th>
                        <th className="pb-3">Total Cost</th>
                        <th className="pb-3">Paid</th>
                        <th className="pb-3">Balance</th>
                        <th className="pb-3 text-right">Due Date</th>
                        <th className="pb-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {vendors.map(v => (
                        <tr key={v.id} className="hover:bg-stone-50 transition">
                          <td className="py-3 font-medium">
                            {v.name}
                            <span className="block text-[10px] text-stone-400">{v.category}</span>
                          </td>
                          <td className="py-3">
                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-medium">
                              {v.side} Side
                            </span>
                          </td>
                          <td className="py-3 font-semibold">₹{v.total.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-emerald-600">₹{v.paid.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-amber-600">₹{(v.total - v.paid).toLocaleString('en-IN')}</td>
                          <td className="py-3 text-right font-mono text-stone-500">{v.dueDate}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteVendor(v.id)}
                              className="text-stone-400 hover:text-red-500 p-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADD HOUSEHOLD MODAL (Headcount + Ceremony Selection Checkboxes) */}
      {showAddFamilyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Users size={18} /> Add Household & Select Functions
              </h3>
              <button onClick={() => setShowAddFamilyModal(false)} className="p-1 hover:bg-stone-100 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-500 mb-1 font-medium">Family / Unit Name</label>
                <input
                  type="text"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  placeholder="e.g. Sharma Family (Rajesh & Sunita)"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Side</label>
                  <select
                    value={newFamilySide}
                    onChange={(e) => setNewFamilySide(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Groom">Groom Side</option>
                    <option value="Bride">Bride Side</option>
                    <option value="Mutual">Mutual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Number of Guests (Seats)</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={newFamilyHeadcount}
                    onChange={(e) => setNewFamilyHeadcount(parseInt(e.target.value) || 1)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-500 mb-1 font-medium">WhatsApp Number (with country code)</label>
                <input
                  type="text"
                  value={newFamilyPhone}
                  onChange={(e) => setNewFamilyPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFamilyOutstation}
                  onChange={(e) => setNewFamilyOutstation(e.target.checked)}
                  className="rounded border-stone-300 accent-stone-900"
                />
                <span className="text-stone-700 font-medium">Outstation Guest (Needs Hotel Stay)</span>
              </label>

              <div className="pt-2 border-t border-stone-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-stone-700 font-semibold">Select Invited Functions:</label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewFamilySelectedEvents(
                        newFamilySelectedEvents.length === weddingProfile.ceremonies.length
                          ? []
                          : weddingProfile.ceremonies.map(c => c.id)
                      )
                    }
                    className="text-[11px] text-stone-500 underline"
                  >
                    {newFamilySelectedEvents.length === weddingProfile.ceremonies.length ? 'Clear All' : 'Select All'}
                  </button>
                </div>
                <div className="space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  {weddingProfile.ceremonies.map(c => {
                    const isChecked = newFamilySelectedEvents.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer text-xs py-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewFamilySelectedEvents([...newFamilySelectedEvents, c.id]);
                            } else {
                              setNewFamilySelectedEvents(newFamilySelectedEvents.filter(id => id !== c.id));
                            }
                          }}
                          className="rounded border-stone-300 accent-stone-900"
                        />
                        <span className="font-medium text-stone-800">{c.name}</span>
                        <span className="text-stone-400 text-[10px]">({c.date})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleAddHousehold}
                className="w-full bg-stone-900 text-white font-medium py-2.5 rounded-lg hover:bg-stone-800 transition mt-2"
              >
                Save Household
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base">Add Vendor Contract</h3>
              <button onClick={() => setShowAddVendorModal(false)} className="p-1 hover:bg-stone-100 rounded-full">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Vendor Name (e.g. Decor Studio)"
                value={newVendorName}
                onChange={(e) => setNewVendorName(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newVendorCategory}
                  onChange={(e) => setNewVendorCategory(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Venue">Venue</option>
                  <option value="Catering">Catering</option>
                  <option value="Decor">Decor</option>
                  <option value="Media">Photography/Media</option>
                  <option value="Makeup">Makeup/Artist</option>
                </select>
                <select
                  value={newVendorSide}
                  onChange={(e) => setNewVendorSide(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Shared">Shared Pool</option>
                  <option value="Groom">Groom Side</option>
                  <option value="Bride">Bride Side</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Total Contract Cost (₹)"
                  value={newVendorTotal}
                  onChange={(e) => setNewVendorTotal(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Advance Paid (₹)"
                  value={newVendorPaid}
                  onChange={(e) => setNewVendorPaid(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-2"
                />
              </div>
              <input
                type="date"
                value={newVendorDue}
                onChange={(e) => setNewVendorDue(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2"
              />
              <button
                onClick={handleAddVendor}
                className="w-full bg-stone-900 text-white font-medium py-2.5 rounded-lg hover:bg-stone-800 transition"
              >
                Save Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAAS PROFILE, CEREMONIES & RSVP THEME STUDIO MODAL */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Settings size={18} /> SaaS Profile & RSVP Theme Studio
              </h3>
              <button onClick={() => setShowThemeModal(false)} className="p-1 hover:bg-stone-100 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Couple & Wedding Details */}
              <div className="space-y-3 pb-4 border-b border-stone-200">
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] font-mono">
                  Couple & Event Metadata
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-500 mb-1">Groom Name</label>
                    <input
                      type="text"
                      value={weddingProfile.groomName}
                      onChange={(e) => setWeddingProfile({ ...weddingProfile, groomName: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Bride Name</label>
                    <input
                      type="text"
                      value={weddingProfile.brideName}
                      onChange={(e) => setWeddingProfile({ ...weddingProfile, brideName: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-500 mb-1">Dates Label</label>
                    <input
                      type="text"
                      value={weddingProfile.dateRangeLabel}
                      onChange={(e) => setWeddingProfile({ ...weddingProfile, dateRangeLabel: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Venue / City</label>
                    <input
                      type="text"
                      value={weddingProfile.city}
                      onChange={(e) => setWeddingProfile({ ...weddingProfile, city: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Ceremonies Manager */}
              <div className="space-y-3 pb-4 border-b border-stone-200">
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] font-mono">
                  Manage Ceremonies (Add / Subtract)
                </h4>
                <div className="space-y-2">
                  {weddingProfile.ceremonies.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-stone-50 p-2 rounded-lg border border-stone-200">
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-[10px] text-stone-400">{c.date} • {c.time} • {c.venue}</p>
                      </div>
                      <button
                        onClick={() => removeCeremony(c.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 mt-2">
                  <p className="font-medium text-stone-700">Add New Ceremony</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Ceremony Name (e.g. Cocktail)"
                      value={newCeremonyName}
                      onChange={(e) => setNewCeremonyName(e.target.value)}
                      className="border border-stone-200 rounded px-2.5 py-1.5 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g. 25 Nov 2026)"
                      value={newCeremonyDate}
                      onChange={(e) => setNewCeremonyDate(e.target.value)}
                      className="border border-stone-200 rounded px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Time (e.g. 07:00 PM)"
                      value={newCeremonyTime}
                      onChange={(e) => setNewCeremonyTime(e.target.value)}
                      className="border border-stone-200 rounded px-2.5 py-1.5 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Venue"
                      value={newCeremonyVenue}
                      onChange={(e) => setNewCeremonyVenue(e.target.value)}
                      className="border border-stone-200 rounded px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <button
                    onClick={addCeremony}
                    className="w-full bg-stone-900 text-white font-medium py-1.5 rounded hover:bg-stone-800 transition mt-1"
                  >
                    + Add Ceremony
                  </button>
                </div>
              </div>

              {/* RSVP Theme Studio */}
              <div className="space-y-3">
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] font-mono">
                  Guest RSVP Portal Theme
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-500 mb-1">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={rsvpTheme.bgColor}
                        onChange={(e) => setRsvpTheme({ ...rsvpTheme, bgColor: e.target.value })}
                        className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={rsvpTheme.bgColor}
                        onChange={(e) => setRsvpTheme({ ...rsvpTheme, bgColor: e.target.value })}
                        className="border border-stone-200 rounded px-2 py-1 flex-1 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={rsvpTheme.textColor}
                        onChange={(e) => setRsvpTheme({ ...rsvpTheme, textColor: e.target.value })}
                        className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={rsvpTheme.textColor}
                        onChange={(e) => setRsvpTheme({ ...rsvpTheme, textColor: e.target.value })}
                        className="border border-stone-200 rounded px-2 py-1 flex-1 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 mb-1">Background Image Upload</label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded-xl p-3 cursor-pointer hover:border-stone-400 bg-stone-50 transition flex-1">
                      <Upload size={16} className="text-stone-500" />
                      <span className="text-stone-600 font-medium">Upload background image</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {rsvpTheme.bgImage && (
                      <button
                        type="button"
                        onClick={() => setRsvpTheme({ ...rsvpTheme, bgImage: '' })}
                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-3 rounded-xl font-medium transition"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>

                {rsvpTheme.bgImage && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-stone-500">Readability Overlay Opacity</span>
                      <span className="font-mono">{Math.round(rsvpTheme.overlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.9"
                      step="0.05"
                      value={rsvpTheme.overlayOpacity}
                      onChange={(e) => setRsvpTheme({ ...rsvpTheme, overlayOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-stone-900"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={async () => {
                  await saveSettingsToDb(weddingProfile, rsvpTheme);
                  setShowThemeModal(false);
                }}
                className="w-full bg-stone-900 text-white font-medium py-2.5 rounded-lg hover:bg-stone-800 transition mt-4"
              >
                Save Changes to Cloud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}