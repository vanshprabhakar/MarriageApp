import React, { useState } from 'react';
import { 
  Users, ShoppingBag, Home, DollarSign, Plus, Trash2, Settings, 
  Calendar, Clock, MapPin, Check, X, ChevronRight, Share2, Camera, Upload, Edit3, MessageCircle
} from 'lucide-react';

export default function App() {
  // Navigation & View Modes
  const [viewMode, setViewMode] = useState('admin'); // 'admin' | 'guest-preview'
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' | 'shopping' | 'stay' | 'budget'
  const [selectedGuestPreview, setSelectedGuestPreview] = useState(null);

  // SaaS Wedding Profile & Dynamic Ceremonies
  const [weddingProfile, setWeddingProfile] = useState({
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
  });

  // RSVP Theme Studio State
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [rsvpTheme, setRsvpTheme] = useState({
    bgColor: '#ffffff', // white editorial default
    textColor: '#1c1917', // stone-900
    bgImage: '',
    overlayOpacity: 0.6
  });

  // Tab 1: Households & RSVPs State
  const [households, setHouseholds] = useState([
    {
      id: 1,
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
      id: 2,
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
  ]);

  // New Household Form Modal State
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilySide, setNewFamilySide] = useState('Groom');
  const [newFamilyPhone, setNewFamilyPhone] = useState('');
  const [newFamilyHeadcount, setNewFamilyHeadcount] = useState(2);
  const [newFamilyOutstation, setNewFamilyOutstation] = useState(true);
  const [newFamilySelectedEvents, setNewFamilySelectedEvents] = useState(
    weddingProfile.ceremonies.map(c => c.id)
  );

  // Tab 2: Shopping Checklist State
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Bridal Lehengas (Main Wedding)', category: 'Apparel', ceremony: 'Wedding', status: 'In Alteration', custody: 'At Designer Studio (Delhi)', owner: 'Riya' },
    { id: 2, name: 'Groom Sherwani', category: 'Apparel', ceremony: 'Wedding', status: 'Ordered', custody: 'Sartorial Tailor', owner: 'Vansh' },
    { id: 3, name: 'Pooja Thali & Silver Coins', category: 'Ritual', ceremony: 'Wedding', status: 'To Buy', custody: 'Locker #4', owner: 'Mom' }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Apparel');

  // Tab 4: Budget & Vendors State
  const [vendors, setVendors] = useState([
    { id: 1, name: 'Taj Yeshwantpur', category: 'Venue', side: 'Shared', total: 450000, paid: 150000, dueDate: '2026-10-10' },
    { id: 2, name: 'Royal Craters Catering', category: 'Catering', side: 'Bride', total: 320000, paid: 100000, dueDate: '2026-10-25' },
    { id: 3, name: 'Shutterdown Photography', category: 'Media', side: 'Groom', total: 150000, paid: 50000, dueDate: '2026-11-01' }
  ]);

  // Handlers for Dynamic Ceremonies
  const [newCeremonyName, setNewCeremonyName] = useState('');
  const [newCeremonyDate, setNewCeremonyDate] = useState('');
  const [newCeremonyTime, setNewCeremonyTime] = useState('');
  const [newCeremonyVenue, setNewCeremonyVenue] = useState('');

  const addCeremony = () => {
    if (!newCeremonyName) return;
    const id = newCeremonyName.toLowerCase().replace(/\s+/g, '-');
    const updated = [...weddingProfile.ceremonies, { id, name: newCeremonyName, date: newCeremonyDate || '24 Nov 2026', time: newCeremonyTime || '06:00 PM', venue: newCeremonyVenue || 'Grand Lawn' }];
    setWeddingProfile({ ...weddingProfile, ceremonies: updated });
    setNewCeremonyName('');
    setNewCeremonyDate('');
    setNewCeremonyTime('');
    setNewCeremonyVenue('');
  };

  const removeCeremony = (id) => {
    if (weddingProfile.ceremonies.length <= 1) {
      alert("You must keep at least one ceremony.");
      return;
    }
    const updated = weddingProfile.ceremonies.filter(c => c.id !== id);
    setWeddingProfile({ ...weddingProfile, ceremonies: updated });
  };

  // Image Upload Handler for Theme Customizer
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRsvpTheme({ ...rsvpTheme, bgImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // WhatsApp share trigger handler
  const sendWhatsAppInvite = (h) => {
    const message = encodeURIComponent(
      `Dear ${h.name},\n\nYou are cordially invited to the wedding celebrations of ${weddingProfile.groomName} & ${weddingProfile.brideName} (${weddingProfile.dateRangeLabel}).\n\nPlease view your personalized invitation and RSVP here:\nhttps://wedding-hub.app/rsvp/${h.id}`
    );
    window.open(`https://wa.me/${h.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased pb-16">
      
      {/* Top SaaS Navigation & Switcher Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl font-bold text-sm tracking-wider">
              {weddingProfile.groomName[0]}&{weddingProfile.brideName[0]}
            </div>
            <div>
              <h1 className="font-semibold text-sm sm:text-base">
                {weddingProfile.groomName} & {weddingProfile.brideName}'s Wedding Hub
              </h1>
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
                Admin Workspace
              </button>
              <button 
                onClick={() => {
                  setSelectedGuestPreview(households[0]);
                  setViewMode('guest-preview');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'guest-preview' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Guest RSVP View
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 mt-6">
        
        {viewMode === 'guest-preview' ? (
          /* ================= GUEST RSVP PORTAL VIEW ================= */
          <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl border border-stone-200 relative min-h-162.5 flex flex-col justify-between p-6 transition-all"
               style={{
                 backgroundColor: rsvpTheme.bgColor,
                 color: rsvpTheme.textColor,
                 backgroundImage: rsvpTheme.bgImage ? `url(${rsvpTheme.bgImage})` : 'none',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
            
            {/* Overlay for readability if bg image is active */}
            {rsvpTheme.bgImage && (
              <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: rsvpTheme.overlayOpacity }} />
            )}

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-widest opacity-80 font-mono">Wedding Invitation</span>
                <button 
                  onClick={() => setViewMode('admin')}
                  className="text-xs px-2.5 py-1 rounded-full bg-stone-900/10 hover:bg-stone-900/20 backdrop-blur-md transition flex items-center gap-1 font-medium"
                >
                  <X size={12} /> Exit Preview
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-3xl font-serif tracking-tight mb-1">
                  {weddingProfile.groomName} & {weddingProfile.brideName}
                </h2>
                <p className="text-xs opacity-80">{weddingProfile.dateRangeLabel} • {weddingProfile.city}</p>
                <div className="w-12 h-1px bg-stone-400 mx-auto my-4 opacity-40"></div>
                
                {/* v1.3 Editorial Greeting Layout */}
                <div className="text-left space-y-1">
                  <p className="font-semibold text-sm">Dear {selectedGuestPreview?.name || 'Sharma Family'},</p>
                  <p className="text-xs opacity-90 leading-relaxed">
                    We have reserved up to {selectedGuestPreview?.headcount || 4} seats for your family. All ceremonies feature a 100% pure vegetarian menu.
                  </p>
                </div>
              </div>

              {/* RSVP Form */}
              <div className="space-y-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-80">1. Confirm Ceremony Attendance</h3>
                
                <div className="space-y-2">
                  {weddingProfile.ceremonies.map(c => {
                    const isInvited = selectedGuestPreview?.invitedEvents?.includes(c.id);
                    return (
                      <div key={c.id} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-400/20">
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="opacity-70 text-[10px]">{c.date} • {c.time} • {c.venue}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${isInvited ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-stone-500/20 text-stone-400'}`}>
                          {isInvited ? 'Invited' : 'Not Invited'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs opacity-80 mb-1">Total Attending Headcount</label>
                  <input 
                    type="number" 
                    defaultValue={selectedGuestPreview?.headcount || 2} 
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none" 
                  />
                </div>

                {selectedGuestPreview?.isOutstation && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <label className="block text-[10px] opacity-80 mb-1">Arrival Date & Time</label>
                      <input type="date" defaultValue={selectedGuestPreview?.arrivalDate} className="w-full bg-white/20 border border-white/30 rounded-lg px-2 py-1.5 text-xs" />
                      <input type="time" defaultValue={selectedGuestPreview?.arrivalTime} className="w-full mt-1 bg-white/20 border border-white/30 rounded-lg px-2 py-1.5 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] opacity-80 mb-1">Departure Date & Time</label>
                      <input type="date" defaultValue={selectedGuestPreview?.departureDate} className="w-full bg-white/20 border border-white/30 rounded-lg px-2 py-1.5 text-xs" />
                      <input type="time" defaultValue={selectedGuestPreview?.departureTime} className="w-full mt-1 bg-white/20 border border-white/30 rounded-lg px-2 py-1.5 text-xs" />
                    </div>
                  </div>
                )}

                <button className="w-full bg-stone-900 text-white font-semibold py-2.5 rounded-lg text-sm shadow hover:bg-stone-800 transition mt-2">
                  Submit RSVP Response
                </button>
              </div>
            </div>

            <div className="relative z-10 text-center mt-6 text-[10px] opacity-60 font-mono">
              Powered by Vansh & Riya Wedding OS
            </div>
          </div>
        ) : (
          /* ================= ADMIN WORKSPACE ================= */
          <div>
            
            {/* Tab Bar */}
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
                
                {/* Ceremony Headcount Summary Header */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {weddingProfile.ceremonies.map(c => {
                    const count = households.reduce((acc, h) => h.invitedEvents.includes(c.id) ? acc + h.headcount : acc, 0);
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
                        <p className="text-xl font-bold mt-1">{count} <span className="text-xs font-normal text-stone-400">guests</span></p>
                        <p className="text-[10px] text-stone-400 mt-0.5">{c.date}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Household List & Management */}
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-base">Household & RSVP Master List</h3>
                      <p className="text-xs text-stone-500">Manage family units, WhatsApp invites, and ceremony access.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowAddFamilyModal(true)}
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

                  {/* Households Table */}
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
                              <span className="block text-[10px] text-stone-400">{h.whatsapp} • {h.headcount} seats</span>
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
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${h.status === 'Attending' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                {h.status} ({h.headcount}p)
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => sendWhatsAppInvite(h)}
                                  className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600 transition"
                                  title="Send WhatsApp Invite"
                                >
                                  <MessageCircle size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setSelectedGuestPreview(h);
                                    setViewMode('guest-preview');
                                  }}
                                  className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition"
                                  title="Preview Guest RSVP Link"
                                >
                                  <Share2 size={14} />
                                </button>
                                <button 
                                  onClick={() => setHouseholds(households.filter(item => item.id !== h.id))}
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
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-base">Shopping, Trousseau & Custody Tracker</h3>
                    <p className="text-xs text-stone-500">Track outfits, jewelry, and pooja items through stages and physical custody.</p>
                  </div>
                </div>

                {/* Add Item Form */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
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
                    <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">Assigned Owner</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Riya / Mom" 
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs" 
                      id="newItemOwnerInput"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (!newItemName) return;
                      const ownerVal = document.getElementById('newItemOwnerInput').value || 'Vansh';
                      setInventory([...inventory, {
                        id: Date.now(),
                        name: newItemName,
                        category: newItemCategory,
                        ceremony: 'General',
                        status: 'To Buy',
                        custody: 'Pending Purchase',
                        owner: ownerVal
                      }]);
                      setNewItemName('');
                    }}
                    className="bg-stone-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-stone-800 transition"
                  >
                    Add Item
                  </button>
                </div>

                {/* Inventory List */}
                <div className="space-y-2">
                  {inventory.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.name}</span>
                          <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-mono">{item.category}</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">Custody / Location: <span className="font-medium text-stone-800">{item.custody}</span> • Owner: {item.owner}</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <select 
                          value={item.status} 
                          onChange={(e) => {
                            const updated = inventory.map(i => i.id === item.id ? { ...i, status: e.target.value } : i);
                            setInventory(updated);
                          }}
                          className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium"
                        >
                          <option value="To Buy">To Buy</option>
                          <option value="Ordered">Ordered</option>
                          <option value="In Alteration">In Alteration</option>
                          <option value="Ready">Ready</option>
                          <option value="Packed">Packed</option>
                        </select>
                        <button 
                          onClick={() => setInventory(inventory.filter(i => i.id !== item.id))}
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
                  <p className="text-xs text-stone-500">Track arrival and departure dates and allocate hotel rooms for outstation guests.</p>
                </div>

                <div className="space-y-3">
                  {households.filter(h => h.isOutstation).map(h => (
                    <div key={h.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="font-semibold text-sm">{h.name} <span className="text-xs font-normal text-stone-500">({h.headcount} pax)</span></h4>
                        <p className="text-xs text-stone-600 mt-1">
                          Arrival: <span className="font-medium">{h.arrivalDate || 'Not Set'} ({h.arrivalTime || '—'})</span> • Departure: <span className="font-medium">{h.departureDate || 'Not Set'} ({h.departureTime || '—'})</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input 
                          type="text" 
                          defaultValue={h.allocatedStay} 
                          onBlur={(e) => {
                            const val = e.target.value;
                            setHouseholds(households.map(item => item.id === h.id ? { ...item, allocatedStay: val } : item));
                          }}
                          placeholder="Assign Room (e.g. Taj Room 204)"
                          className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs w-full sm:w-60"
                        />
                        <button 
                          onClick={() => sendWhatsAppInvite(h)}
                          className="bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-stone-800 transition whitespace-nowrap"
                        >
                          Send WhatsApp
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
                <div>
                  <h3 className="font-semibold text-base">Budget, Vendors & 3-Way Split Ledger</h3>
                  <p className="text-xs text-stone-500">Monitor contract costs, advances, and split expenses across Groom side, Bride side, and Shared pool.</p>
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

      {/* ADD HOUSEHOLD MODAL WITH HEADCOUNT & FUNCTION SELECTORS */}
      {showAddFamilyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Users size={18} /> Add New Household
              </h3>
              <button onClick={() => setShowAddFamilyModal(false)} className="p-1 hover:bg-stone-100 rounded-full transition">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-500 mb-1 font-medium">Family Name (e.g. Sharma Family)</label>
                <input 
                  type="text" 
                  value={newFamilyName} 
                  onChange={(e) => setNewFamilyName(e.target.value)} 
                  placeholder="Family Name & Members" 
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Side</label>
                  <select 
                    value={newFamilySide} 
                    onChange={(e) => setNewFamilySide(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs bg-white"
                  >
                    <option value="Groom">Groom Side</option>
                    <option value="Bride">Bride Side</option>
                    <option value="Mutual">Mutual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Reserved Seat Count</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="20"
                    value={newFamilyHeadcount} 
                    onChange={(e) => setNewFamilyHeadcount(parseInt(e.target.value) || 1)} 
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-500 mb-1 font-medium">WhatsApp Phone Number</label>
                <input 
                  type="text" 
                  value={newFamilyPhone} 
                  onChange={(e) => setNewFamilyPhone(e.target.value)} 
                  placeholder="+91..." 
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs" 
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="outstationCheck"
                  checked={newFamilyOutstation}
                  onChange={(e) => setNewFamilyOutstation(e.target.checked)}
                  className="rounded border-stone-300 accent-stone-900"
                />
                <label htmlFor="outstationCheck" className="text-stone-700 font-medium cursor-pointer">Outstation Guest (Requires Hotel Rooming)</label>
              </div>

              {/* Ceremony Selector Checkboxes */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-stone-700 font-semibold mb-2">Select Invited Ceremonies:</label>
                <div className="space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  {weddingProfile.ceremonies.map(c => {
                    const isChecked = newFamilySelectedEvents.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer text-xs">
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
                onClick={() => {
                  if (!newFamilyName) return;
                  setHouseholds([...households, {
                    id: Date.now(),
                    name: newFamilyName,
                    side: newFamilySide,
                    whatsapp: newFamilyPhone || '+919999999999',
                    isOutstation: newFamilyOutstation,
                    invitedEvents: newFamilySelectedEvents,
                    status: 'Pending',
                    headcount: newFamilyHeadcount,
                    arrivalDate: '2026-11-23',
                    arrivalTime: '12:00',
                    departureDate: '2026-11-26',
                    departureTime: '12:00',
                    allocatedStay: newFamilyOutstation ? 'Unassigned' : 'Local Resident'
                  }]);
                  setNewFamilyName('');
                  setNewFamilyPhone('');
                  setShowAddFamilyModal(false);
                }}
                className="w-full bg-stone-900 text-white font-medium py-2.5 rounded-lg hover:bg-stone-800 transition mt-2"
              >
                Save Household & Generate Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THEME & SAAS PROFILE CUSTOMIZER MODAL */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Settings size={18} /> SaaS Profile & RSVP Theme Studio
              </h3>
              <button onClick={() => setShowThemeModal(false)} className="p-1 hover:bg-stone-100 rounded-full transition">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              
              {/* Couple & Wedding Details */}
              <div className="space-y-3 pb-4 border-b border-stone-200">
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] font-mono">Couple & Event Metadata</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-500 mb-1">Groom Name</label>
                    <input 
                      type="text" 
                      value={weddingProfile.groomName} 
                      onChange={(e) => setWeddingProfile({ ...weddingProfile, groomName: e.target.value })} 
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Bride Name</label>
                    <input 
                      type="text" 
                      value={weddingProfile.brideName} 
                      onChange={(e) => setWeddingProfile({ ...weddingProfile, brideName: e.target.value })} 
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Date Range Label</label>
                  <input 
                    type="text" 
                    value={weddingProfile.dateRangeLabel} 
                    onChange={(e) => setWeddingProfile({ ...weddingProfile, dateRangeLabel: e.target.value })} 
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs" 
                  />
                </div>
              </div>

              {/* Dynamic Ceremonies Manager */}
              <div className="space-y-3 pb-4 border-b border-stone-200">
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] font-mono">Manage Ceremonies (Add / Subtract)</h4>
                
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
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] font-mono">Guest RSVP Portal Theme</h4>
                
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
                      <span className="text-stone-600 font-medium">Upload new background image</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {rsvpTheme.bgImage && (
                      <button 
                        onClick={() => setRsvpTheme({ ...rsvpTheme, bgImage: '' })}
                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-3 rounded-xl font-medium transition"
                        title="Remove Background Image"
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
                      max="1" 
                      step="0.05" 
                      value={rsvpTheme.overlayOpacity} 
                      onChange={(e) => setRsvpTheme({ ...rsvpTheme, overlayOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-stone-900"
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowThemeModal(false)}
                className="w-full bg-stone-900 text-white font-medium py-2.5 rounded-lg hover:bg-stone-800 transition mt-4"
              >
                Save & Close Studio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}