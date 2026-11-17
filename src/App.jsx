import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BusFront,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  CloudOff,
  Filter,
  Gauge,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  RadioTower,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SquareArrowOutUpRight,
} from 'lucide-react';

const events = [
  { id: 'EVT-2084', bus: 'CB-07', route: 'North Campus', direction: 'IN', time: '08:42:18', ago: '12 sec ago', confidence: 98.4, gate: 'Main Gate', status: 'on-time', accent: 'lime' },
  { id: 'EVT-2083', bus: 'CB-12', route: 'Lakeside Loop', direction: 'OUT', time: '08:39:04', ago: '3 min ago', confidence: 96.8, gate: 'Main Gate', status: 'departed', accent: 'blue' },
  { id: 'EVT-2082', bus: 'CB-03', route: 'West Residency', direction: 'IN', time: '08:31:51', ago: '11 min ago', confidence: 94.2, gate: 'Service Gate', status: 'delayed', accent: 'amber' },
  { id: 'EVT-2081', bus: 'CB-18', route: 'City Center', direction: 'OUT', time: '08:28:36', ago: '14 min ago', confidence: 91.6, gate: 'Main Gate', status: 'departed', accent: 'blue' },
  { id: 'EVT-2080', bus: 'CB-05', route: 'East Hostel', direction: 'IN', time: '08:17:22', ago: '25 min ago', confidence: 97.1, gate: 'Main Gate', status: 'on-time', accent: 'lime' },
  { id: 'EVT-2079', bus: 'CB-14', route: 'South Village', direction: 'IN', time: '08:03:45', ago: '39 min ago', confidence: 88.9, gate: 'Main Gate', status: 'review', accent: 'coral' },
];

const buses = [
  { bus: 'CB-03', route: 'West Residency', driver: 'A. Kumar', inTime: '08:31', outTime: '—', state: 'On campus', schedule: '08:20', delta: '+11m', status: 'delayed', color: 'amber' },
  { bus: 'CB-05', route: 'East Hostel', driver: 'N. Shah', inTime: '08:17', outTime: '—', state: 'On campus', schedule: '08:15', delta: '+2m', status: 'on-time', color: 'lime' },
  { bus: 'CB-07', route: 'North Campus', driver: 'R. Iyer', inTime: '08:42', outTime: '06:58', state: 'On campus', schedule: '08:40', delta: '+2m', status: 'on-time', color: 'lime' },
  { bus: 'CB-12', route: 'Lakeside Loop', driver: 'S. Rao', inTime: '06:49', outTime: '08:39', state: 'Off campus', schedule: '08:35', delta: '+4m', status: 'on-time', color: 'blue' },
  { bus: 'CB-14', route: 'South Village', driver: 'P. Singh', inTime: '08:03', outTime: '—', state: 'On campus', schedule: '07:55', delta: '+8m', status: 'delayed', color: 'amber' },
];

const reviewItems = [
  { id: 'RV-041', bus: 'CB-14', time: '08:03:45', reason: 'Plate partially occluded', confidence: 88.9, image: 'gate-cam-01', tone: 'coral' },
  { id: 'RV-040', bus: 'Unknown', time: '07:54:12', reason: 'Multiple vehicles crossing', confidence: 71.4, image: 'gate-cam-01', tone: 'amber' },
  { id: 'RV-039', bus: 'CB-09', time: '07:48:56', reason: 'Low light / rain glare', confidence: 84.7, image: 'gate-cam-02', tone: 'blue' },
];

const timelineEvents = [
  { bus: 'CB-12', type: 'OUT', left: '11%', width: '7%', tone: 'blue' },
  { bus: 'CB-05', type: 'IN', left: '23%', width: '6%', tone: 'lime' },
  { bus: 'CB-14', type: 'IN', left: '33%', width: '9%', tone: 'amber' },
  { bus: 'CB-03', type: 'IN', left: '44%', width: '8%', tone: 'coral' },
  { bus: 'CB-07', type: 'IN', left: '58%', width: '9%', tone: 'lime' },
  { bus: 'CB-18', type: 'OUT', left: '72%', width: '7%', tone: 'blue' },
];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Live events', icon: RadioTower, count: 6 },
  { label: 'Bus registry', icon: BusFront },
  { label: 'Analytics', icon: Gauge },
];

function StatusPill({ children, tone = 'neutral', icon: Icon }) {
  return <span className={`status-pill ${tone}`}>{Icon && <Icon size={12} strokeWidth={2.5} />}{children}</span>;
}

function MetricCard({ label, value, change, caption, icon: Icon, tone, progress }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-topline">
        <span className="metric-label">{label}</span>
        <span className="metric-icon"><Icon size={17} /></span>
      </div>
      <div className="metric-value-row">
        <strong>{value}</strong>
        {change && <span className="metric-change"><ArrowUpRight size={13} />{change}</span>}
      </div>
      <div className="metric-caption">{caption}</div>
      {progress !== undefined && <div className="metric-progress"><span style={{ width: `${progress}%` }} /></div>}
    </article>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [feedFilter, setFeedFilter] = useState('All events');
  const [isLive, setIsLive] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [query, setQuery] = useState('');
  const [reviewed, setReviewed] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [notice, setNotice] = useState('');

  const visibleEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery = !normalized || `${event.bus} ${event.route} ${event.direction}`.toLowerCase().includes(normalized);
      const matchesFilter = feedFilter === 'All events' || (feedFilter === 'Entries' && event.direction === 'IN') || (feedFilter === 'Exits' && event.direction === 'OUT');
      return matchesQuery && matchesFilter;
    });
  }, [feedFilter, query]);

  const markReviewed = (id) => {
    setReviewed((current) => current.includes(id) ? current : [...current, id]);
    setNotice('Review saved to the queue');
    window.setTimeout(() => setNotice(''), 2400);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><BusFront size={20} strokeWidth={2.4} /></div>
          <div><div className="brand-name">bus<span>watch</span></div><div className="brand-subtitle">gate intelligence</div></div>
        </div>
        <div className="site-switcher">
          <div className="site-avatar">NC</div>
          <div><span className="overline">MONITORING SITE</span><strong>Northbridge College</strong></div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-section-label">Workspace</div>
        <nav className="primary-nav">
          {navItems.map(({ label, icon: Icon, count }) => (
            <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label)}>
              <Icon size={18} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>
        <div className="nav-section-label">System</div>
        <nav className="primary-nav">
          <button className="nav-item" onClick={() => setNotice('Settings are ready for backend wiring')}><Settings2 size={18} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => setNotice('Help center is coming with the API integration')}><CircleHelp size={18} /><span>Help center</span></button>
        </nav>
        <div className="sidebar-spacer" />
        <div className="camera-status">
          <div className="status-dot pulse" />
          <div><strong>Gate camera online</strong><span>RTSP stream · 1080p</span></div>
          <MoreHorizontal size={16} />
        </div>
        <div className="user-row"><div className="user-avatar">AS</div><div><strong>Arjun Sharma</strong><span>Operations lead</span></div><MoreHorizontal size={16} /></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark"><BusFront size={18} /></div><strong>buswatch</strong></div>
          <div className="breadcrumb"><span>Workspace</span><span className="slash">/</span><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <div className="date-chip"><CalendarDays size={15} /><span>Mon, 16 Nov 2026</span><ChevronDown size={14} /></div>
            <button className="icon-button has-notification" aria-label="Notifications" onClick={() => setNotice('No new alerts')}><Bell size={18} /></button>
            <button className="avatar-button">AS</button>
          </div>
        </header>

        <div className="content-wrap">
          <section className="page-heading">
            <div>
              <div className="eyebrow"><span className="live-dot" /> LIVE MONITORING <span className="eyebrow-separator">•</span> GATE 01</div>
              <h1>Good morning, Arjun<span className="heading-period">.</span></h1>
              <p>Here’s the gate picture for Monday. All systems are behaving normally.</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" onClick={() => setNotice('Latest camera snapshot requested')}><RefreshCw size={15} /> Sync now</button>
              <button className={`live-toggle ${isLive ? 'enabled' : ''}`} onClick={() => setIsLive(!isLive)}>{isLive ? <Pause size={14} /> : <Play size={14} />}{isLive ? 'Pause feed' : 'Resume feed'}</button>
            </div>
          </section>

          <section className="metrics-grid" aria-label="Daily gate metrics">
            <MetricCard label="Buses detected" value="18" change="12%" caption="vs. 16 yesterday" icon={BusFront} tone="navy" />
            <MetricCard label="Entries today" value="11" change="8%" caption="9 on schedule" icon={ArrowDownRight} tone="lime" />
            <MetricCard label="Exits today" value="07" change="4%" caption="Next window at 09:15" icon={ArrowUpRight} tone="blue" />
            <MetricCard label="Avg. confidence" value="94.6%" change="2.1%" caption="Strong camera conditions" icon={ShieldCheck} tone="cream" progress={94.6} />
          </section>

          <section className="dashboard-grid">
            <div className="primary-column">
              <article className="panel live-panel">
                <div className="panel-heading">
                  <div><div className="eyebrow small">REAL-TIME STREAM</div><h2>Live event feed</h2></div>
                  <div className="panel-heading-actions"><StatusPill tone={isLive ? 'success' : 'muted'} icon={isLive ? RadioTower : Pause}>{isLive ? 'Live' : 'Paused'}</StatusPill><button className="icon-button small-icon" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /></button></div>
                </div>
                {showFilters && <div className="filter-drawer"><span>Show:</span>{['All events', 'Entries', 'Exits'].map((filter) => <button key={filter} className={feedFilter === filter ? 'selected' : ''} onClick={() => setFeedFilter(filter)}>{filter}</button>)}</div>}
                <div className="feed-toolbar">
                  <div className="search-field"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bus or route" /></div>
                  <span className="feed-count">{visibleEvents.length} events</span>
                </div>
                <div className="event-list">
                  {visibleEvents.map((event) => (
                    <button key={event.id} className={`event-row ${selectedEvent.id === event.id ? 'selected' : ''}`} onClick={() => setSelectedEvent(event)}>
                      <div className={`event-direction ${event.direction.toLowerCase()}`}>{event.direction === 'IN' ? <ArrowDownRight size={17} /> : <ArrowUpRight size={17} />}</div>
                      <div className="event-main"><div><strong>{event.bus}</strong><span className="event-route">{event.route}</span></div><span className="event-gate">{event.gate}</span></div>
                      <div className="event-confidence"><span>{event.confidence}%</span><small>confidence</small></div>
                      <div className="event-time"><strong>{event.time}</strong><span>{event.ago}</span></div>
                      <ChevronDown className="row-chevron" size={15} />
                    </button>
                  ))}
                  {!visibleEvents.length && <div className="empty-state"><Search size={21} /><strong>No matching events</strong><span>Try a different bus number or route.</span></div>}
                </div>
                <button className="panel-link" onClick={() => { setActiveNav('Live events'); setNotice('Live events view selected'); }}>Open full event log <SquareArrowOutUpRight size={14} /></button>
              </article>

              <article className="panel timeline-panel">
                <div className="panel-heading">
                  <div><div className="eyebrow small">TODAY · 05:00 — 11:00</div><h2>Gate timeline</h2></div>
                  <button className="text-button" onClick={() => setNotice('Timeline range picker is ready for API data')}>View report <SquareArrowOutUpRight size={14} /></button>
                </div>
                <div className="timeline-wrap">
                  <div className="timeline-labels"><span>05:00</span><span>06:00</span><span>07:00</span><span>08:00</span><span>09:00</span><span>10:00</span><span>11:00</span></div>
                  <div className="timeline-grid"><div className="current-line" /><div className="current-time">08:44</div>{timelineEvents.map((item) => <div key={item.bus} className="timeline-track"><span className="track-label">{item.bus}</span><div className={`timeline-bar ${item.tone}`} style={{ left: item.left, width: item.width }}><span>{item.type}</span></div></div>)}</div>
                </div>
                <div className="timeline-legend"><span><i className="legend-dot lime" /> Entry detected</span><span><i className="legend-dot blue" /> Exit detected</span><span><i className="legend-dot amber" /> Delayed</span><span className="timeline-note"><Clock3 size={13} /> Current time 08:44</span></div>
              </article>
            </div>

            <aside className="secondary-column">
              <article className="panel selected-event-panel">
                <div className="panel-heading"><div><div className="eyebrow small">SELECTED EVENT</div><h2>Detection detail</h2></div><button className="icon-button small-icon" onClick={() => setSelectedEvent(events[0])}><RefreshCw size={15} /></button></div>
                <div className="detection-visual"><div className="scan-corner top-left" /><div className="scan-corner top-right" /><div className="scan-corner bottom-left" /><div className="scan-corner bottom-right" /><div className="scan-grid" /><div className="bus-silhouette"><BusFront size={54} strokeWidth={1.1} /></div><span className="camera-label">CAM 01 · 08:42:18</span><span className="detection-box"><i /> {selectedEvent.bus} · {selectedEvent.confidence}%</span></div>
                <div className="detection-summary"><div><span className="overline">IDENTIFIED AS</span><strong>{selectedEvent.bus}</strong><span>{selectedEvent.route}</span></div><StatusPill tone="success" icon={Check}>{selectedEvent.direction === 'IN' ? 'Entry' : 'Exit'} verified</StatusPill></div>
                <div className="detail-grid"><div><span>Event ID</span><strong>{selectedEvent.id}</strong></div><div><span>Timestamp</span><strong>{selectedEvent.time}</strong></div><div><span>Gate</span><strong>{selectedEvent.gate}</strong></div><div><span>Confidence</span><strong className="confidence-number">{selectedEvent.confidence}%</strong></div></div>
                <button className="dark-button" onClick={() => setNotice(`Opening snapshot for ${selectedEvent.id}`)}>Open snapshot <SquareArrowOutUpRight size={14} /></button>
              </article>

              <article className="panel review-panel">
                <div className="panel-heading"><div><div className="eyebrow small">NEEDS ATTENTION</div><h2>Review queue <span className="heading-count">{reviewItems.length - reviewed.length}</span></h2></div><AlertTriangle className="coral-icon" size={18} /></div>
                <div className="review-list">{reviewItems.map((item) => reviewed.includes(item.id) ? null : <div className="review-item" key={item.id}><div className={`review-thumb ${item.tone}`}><BusFront size={20} /></div><div className="review-copy"><div><strong>{item.bus}</strong><span>{item.time}</span></div><span>{item.reason}</span><small>{item.confidence}% confidence · {item.image}</small></div><button className="review-check" title="Mark reviewed" onClick={() => markReviewed(item.id)}><Check size={14} /></button></div>)}</div>
                {!reviewItems.some((item) => !reviewed.includes(item.id)) && <div className="queue-clear"><Sparkles size={18} /><strong>Queue is clear</strong><span>Nice work. New exceptions will appear here.</span></div>}
                <button className="panel-link" onClick={() => setNotice('Manual review workflow opened')}>Open review workspace <SquareArrowOutUpRight size={14} /></button>
              </article>
            </aside>
          </section>

          <section className="bottom-grid">
            <article className="panel fleet-panel">
              <div className="panel-heading"><div><div className="eyebrow small">FLEET SNAPSHOT</div><h2>Bus status</h2></div><div className="panel-heading-actions"><div className="table-search"><Search size={14} /><span>Filter registry</span></div><button className="icon-button small-icon"><MoreHorizontal size={16} /></button></div></div>
              <div className="table-wrap"><table><thead><tr><th>Bus / route</th><th>Last in</th><th>Last out</th><th>Campus state</th><th>Schedule</th></tr></thead><tbody>{buses.map((bus) => <tr key={bus.bus}><td><div className="bus-cell"><span className={`bus-dot ${bus.color}`} /><div><strong>{bus.bus}</strong><span>{bus.route}</span></div></div></td><td>{bus.inTime}</td><td>{bus.outTime}</td><td><StatusPill tone={bus.state === 'On campus' ? 'success' : 'muted'}>{bus.state}</StatusPill></td><td><div className="schedule-cell"><span>{bus.schedule}</span><span className={`delta ${bus.status}`}>{bus.delta}</span></div></td></tr>)}</tbody></table></div>
              <button className="panel-link" onClick={() => { setActiveNav('Bus registry'); setNotice('Bus registry selected'); }}>View all buses <SquareArrowOutUpRight size={14} /></button>
            </article>
            <article className="panel pulse-panel">
              <div className="panel-heading"><div><div className="eyebrow small">GATE PERFORMANCE</div><h2>Today at a glance</h2></div><Gauge size={18} className="navy-icon" /></div>
              <div className="donut-row"><div className="donut"><div className="donut-inner"><strong>94.6%</strong><span>accuracy</span></div></div><div className="pulse-copy"><div><strong>Excellent</strong><span>Detection health</span></div><div><strong>04m 18s</strong><span>Avg. gate dwell</span></div></div></div>
              <div className="mini-stat-list"><div><span>Unique buses</span><strong>18 / 24</strong><div className="mini-bar"><i style={{ width: '75%' }} /></div></div><div><span>Delayed arrivals</span><strong>02</strong><div className="mini-bar warning"><i style={{ width: '22%' }} /></div></div><div><span>Data freshness</span><strong><span className="fresh-dot" /> 12 sec</strong><div className="mini-bar blue-bar"><i style={{ width: '96%' }} /></div></div></div>
            </article>
          </section>

          <footer className="page-footer"><span><span className="footer-dot" /> All systems operational</span><span>Last model sync 08:40 · YOLOv8 + ByteTrack</span><span>v0.8.4</span></footer>
        </div>
      </main>
      {notice && <div className="toast"><Check size={15} />{notice}</div>}
    </div>
  );
}

export default App;
