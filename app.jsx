const { useEffect, useState } = React;

const SCREENS = [
  { id: "departures", label: "Coastal Departures" },
  { id: "connections", label: "Port to Airport and City" },
  { id: "interchange", label: "Best Transfer Options" },
  { id: "wayfinding", label: "Gates and Terminal Access" },
  { id: "surface", label: "Public Transport from Piraeus" },
  { id: "bagclaim", label: "Cruise Transfer Desk" },
  { id: "disruption", label: "Port Alert" }
];

const SCREEN_META = {
  departures: {
    chip: "PPA coastal feed",
    title: "Coastal Departures",
    context: "Ferry departures from Piraeus",
    source: "Source: live coastal departure feed",
    freshness: "Live updates"
  },
  connections: {
    chip: "PPA onward travel",
    title: "Port to Airport and City",
    context: "Port exit and onward travel",
    source: "Source: PPA transfer layer",
    freshness: "Refreshed every 60 sec"
  },
  interchange: {
    chip: "PPA transfer planner",
    title: "Best Transfer Options",
    context: "Passenger services and transfer guidance",
    source: "Source: PPA passenger services",
    freshness: "Live recommendations"
  },
  wayfinding: {
    chip: "PPA wayfinding",
    title: "Gates and Terminal Access",
    context: "Passenger stations and gate routing",
    source: "Source: terminal wayfinding layer",
    freshness: "Last gate confirmation active"
  },
  surface: {
    chip: "PPA transport feed",
    title: "Public Transport from Piraeus",
    context: "Port area public transport",
    source: "Source: PPA and public transport feeds",
    freshness: "Updated every minute"
  },
  bagclaim: {
    chip: "PPA cruise operations",
    title: "Cruise Transfer Desk",
    context: "Cruise arrivals and transfer readiness",
    source: "Source: PPA public cruise schedule",
    freshness: "Live transfer status"
  },
  disruption: {
    chip: "PPA passenger advisory",
    title: "Port Alert",
    context: "Berth and route advisory",
    source: "Source: terminal operations",
    freshness: "Live advisory active"
  }
};

const PPA_DEPARTURES = [
  {
    time: "14:20",
    vessel: "BLUE STAR NAXOS",
    routeSummary: "Paros Naxos Ios Santorini",
    routeFamily: "Cyclades",
    gate: "E7",
    accessNote: "Pedestrians via E6 | Vehicles via E7",
    passengerType: "Passengers and vehicles",
    status: "Boarding",
    statusTone: "boarding",
    controlNote: "Ticket control open",
    opsTag: "Vehicle boarding active",
    updatedOffset: 1
  },
  {
    time: "14:45",
    vessel: "FAST FERRIES ANDROS",
    routeSummary: "Syros Tinos Mykonos",
    routeFamily: "Cyclades",
    gate: "E6",
    accessNote: "Passengers E6 | Vehicles E7",
    passengerType: "Passengers only",
    status: "On time",
    statusTone: "on-time",
    controlNote: "Use Gate E6 for pedestrians",
    opsTag: "Pedestrian check-in open",
    updatedOffset: 4
  },
  {
    time: "15:10",
    vessel: "BLUE STAR MYCONOS",
    routeSummary: "Syros Mykonos Ikaria Fourni Samos Chios Mytilene",
    routeFamily: "Chios and Mytilene",
    gate: "E7",
    accessNote: "Vehicle access confirmed from E7",
    passengerType: "Passengers and vehicles",
    status: "Check in open",
    statusTone: "check-in-open",
    controlNote: "Port access open",
    opsTag: "Long route boarding sequence",
    updatedOffset: 3
  },
  {
    time: "15:35",
    vessel: "FLYINGCAT 3",
    routeSummary: "Aegina Poros Hydra Spetses",
    routeFamily: "Saronic islands",
    gate: "E8",
    accessNote: "Foot passengers only",
    passengerType: "Foot passengers",
    status: "Boarding",
    statusTone: "boarding",
    controlNote: "Fast ferry boarding active",
    opsTag: "Fast ferry",
    updatedOffset: 2
  },
  {
    time: "15:55",
    vessel: "NISSOS SAMOS",
    routeSummary: "Chios Mytilene Psara Oinousses",
    routeFamily: "Chios and Mytilene",
    gate: "E2",
    accessNote: "Vehicle staging in progress",
    passengerType: "Passengers and vehicles",
    status: "On time",
    statusTone: "on-time",
    controlNote: "Boarding to open at berth",
    opsTag: "Overnight service",
    updatedOffset: 6
  },
  {
    time: "16:20",
    vessel: "ASTERION II",
    routeSummary: "Heraklion",
    routeFamily: "Crete",
    gate: "E3",
    accessNote: "Boarding via shuttle bus",
    passengerType: "Passengers and vehicles",
    status: "Final call",
    statusTone: "final-call",
    controlNote: "Final pedestrian boarding",
    opsTag: "Boarding via shuttle bus",
    updatedOffset: 1
  },
  {
    time: "16:45",
    vessel: "ELYROS",
    routeSummary: "Milos Chania",
    routeFamily: "Crete",
    gate: "E3",
    accessNote: "Use covered route to E3",
    passengerType: "Passengers and vehicles",
    status: "Delayed 15 min",
    statusTone: "delayed-15-min",
    controlNote: "Await berth confirmation",
    opsTag: "Weather watch active",
    updatedOffset: 5
  },
  {
    time: "17:05",
    vessel: "SMYRNA DI LEVANTE",
    routeSummary: "Santorini Anafi Heraklion Sitia Kasos Karpathos Chalki Rhodes",
    routeFamily: "Dodecanese",
    gate: "E1",
    accessNote: "Gate text may update after berth ops",
    passengerType: "Passengers and vehicles",
    status: "Check in open",
    statusTone: "check-in-open",
    controlNote: "Last gate confirmation pending",
    opsTag: "Long-haul coastal service",
    updatedOffset: 7
  }
];

const PPA_CONNECTIONS = [
  {
    code: "X96",
    label: "Airport Express",
    valueType: "airport",
    tone: "amber",
    walk: "Walk 4 min",
    pickup: "Bay A2",
    bestFor: "Best for direct airport access",
    note: "Large baggage friendly"
  },
  {
    code: "M1",
    label: "Metro to Athens Center",
    valueType: "metro",
    tone: "blue",
    walk: "Walk 6 min",
    pickup: "Metro station link",
    bestFor: "Best for Monastiraki and city center",
    note: "Frequent service"
  },
  {
    code: "R",
    label: "Suburban Rail",
    valueType: "rail",
    tone: "teal",
    walk: "Walk 7 min",
    pickup: "Rail connection",
    bestFor: "Best for regional onward travel",
    note: "Good for light luggage"
  },
  {
    code: "T",
    label: "Official Taxi Rank",
    valueType: "taxi",
    tone: "cyan",
    walk: "Walk 2 min",
    pickup: "North exit",
    bestFor: "Best for fastest private transfer",
    note: "Best with heavy bags or family groups"
  },
  {
    code: "PPA",
    label: "PPA Shuttle",
    valueType: "shuttle",
    tone: "teal",
    walk: "Walk 1 min",
    pickup: "Passenger terminal loop",
    bestFor: "Best for terminal and ship transfer",
    note: "Free service"
  },
  {
    code: "C",
    label: "Cruise Coach Pickup",
    valueType: "coach",
    tone: "amber",
    walk: "Walk 3 min",
    pickup: "Coach zone C",
    bestFor: "Best for shore excursions and group travel",
    note: "Use assigned bay"
  }
];

const PPA_WAYFINDING = {
  primary: {
    icon: "E7",
    name: "To Gate E7 | Προς Πύλη Ε7",
    value: "Terminal A",
    subtitle: "Passenger Terminal A Miaoulis",
    arrow: "right"
  },
  cards: [
    { icon: "A", name: "Passenger Terminal A Miaoulis", subtitle: "Cruise Transfer Desk", arrow: "left" },
    { icon: "B", name: "Passenger Terminal B Themistocles", subtitle: "Coastal departures", arrow: "right" },
    { icon: "C", name: "Terminal C Alkimos", subtitle: "Passenger services", arrow: "right" },
    { icon: "M", name: "Metro and Rail Link | Metro", subtitle: "Exit to city and airport bus", arrow: "left" },
    { icon: "T", name: "Taxi | Ταξί", subtitle: "Official taxi rank", arrow: "up" },
    { icon: "CZ", name: "Coach Zone C", subtitle: "Cruise shuttle and tours", arrow: "right" }
  ],
  services: [
    "Customs | Τελωνείο",
    "Tourist Police | Τουριστική Αστυνομία",
    "Passport Control",
    "Free WiFi area",
    "Exit | Έξοδος"
  ]
};

const PPA_WAYFINDING_LOCALIZED = {
  primary: {
    icon: "E7",
    name: "To Gate E7 | \u03A0\u03C1\u03BF\u03C2 \u03A0\u03CD\u03BB\u03B7 E7",
    value: "Terminal A",
    subtitle: "Passenger Terminal A Miaoulis",
    arrow: "right"
  },
  cards: [
    { icon: "A", name: "Passenger Terminal A Miaoulis", subtitle: "Cruise Transfer Desk", arrow: "left" },
    { icon: "B", name: "Passenger Terminal B Themistocles", subtitle: "Coastal departures", arrow: "right" },
    { icon: "C", name: "Terminal C Alkimos", subtitle: "Passenger services", arrow: "right" },
    { icon: "M", name: "Metro and Rail Link | Metro", subtitle: "Exit to city and airport bus", arrow: "left" },
    { icon: "T", name: "Taxi | \u03A4\u03B1\u03BE\u03AF", subtitle: "Official taxi rank", arrow: "up" },
    { icon: "CZ", name: "Coach Zone C", subtitle: "Cruise shuttle and tours", arrow: "right" }
  ],
  services: [
    "Customs | \u03A4\u03B5\u03BB\u03C9\u03BD\u03B5\u03AF\u03BF",
    "Tourist Police | \u03A4\u03BF\u03C5\u03C1\u03B9\u03C3\u03C4\u03B9\u03BA\u03AE \u0391\u03C3\u03C4\u03C5\u03BD\u03BF\u03BC\u03AF\u03B1",
    "Passport Control",
    "Free WiFi area",
    "Exit | \u0388\u03BE\u03BF\u03B4\u03BF\u03C2"
  ]
};

const startTransitionSafe = React.startTransition || ((fn) => fn());

function getInitialScreen() {
  if (typeof window === "undefined") return "departures";
  const value = new URLSearchParams(window.location.search).get("screen");
  return SCREENS.some((item) => item.id === value) ? value : "departures";
}

function App() {
  const [screen, setScreen] = useState(getInitialScreen);
  const [now, setNow] = useState(new Date());
  const [live, setLive] = useState({
    phase: 0,
    airport: 58,
    metro: 24,
    taxi: 8,
    shuttle: 13,
    rail: 16,
    coachWait: 0,
    crowd: 62
  });

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    const feed = setInterval(() => {
      setLive((prev) => ({
        phase: (prev.phase + 1) % 6,
        airport: clamp(prev.airport + rand(-2, 3), 48, 66),
        metro: clamp(prev.metro + rand(-1, 2), 18, 31),
        taxi: clamp(prev.taxi + rand(-1, 1), 6, 15),
        shuttle: clamp(prev.shuttle + rand(-1, 2), 9, 20),
        rail: clamp(prev.rail + rand(-1, 2), 12, 24),
        coachWait: clamp(prev.coachWait + rand(-1, 2), 0, 8),
        crowd: clamp(prev.crowd + rand(-8, 8), 36, 92)
      }));
    }, 4200);

    return () => {
      clearInterval(clock);
      clearInterval(feed);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("screen", screen);
    window.history.replaceState({}, "", url);
  }, [screen]);

  return (
    <div className="app-shell">
      <Header now={now} />
      <TabBar active={screen} onChange={(next) => startTransitionSafe(() => setScreen(next))} />
      <main className="display-shell">
        <div className="display-frame">
          <ScreenRouter screen={screen} now={now} live={live} />
        </div>
      </main>
    </div>
  );
}

function Header({ now }) {
  return (
    <header className="chrome-shell">
      <div className="chrome-brand">
        <img
          src="assets/ppa-logo.svg"
          alt="Piraeus Port Authority"
          className="brand-logo"
        />
        <div className="brand-copy">
          <span>Powered by SmartSea</span>
        </div>
      </div>
      <div className="chrome-time">
        <span>{formatDate(now)}</span>
        <strong>{formatClock(now)}</strong>
      </div>
    </header>
  );
}

function TabBar({ active, onChange }) {
  return (
    <nav className="nav-shell">
      <div className="tab-row">
        {SCREENS.map((item) => (
          <button
            key={item.id}
            className={`tab-pill ${item.id === active ? "active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ScreenRouter({ screen, now, live }) {
  if (screen === "connections") return <ConnectionsScreen now={now} live={live} />;
  if (screen === "interchange") return <InterchangeScreen now={now} live={live} />;
  if (screen === "wayfinding") return <WayfindingScreen now={now} live={live} />;
  if (screen === "surface") return <SurfaceTransitScreen now={now} live={live} />;
  if (screen === "bagclaim") return <BagClaimScreen now={now} live={live} />;
  if (screen === "disruption") return <DisruptionScreen now={now} live={live} />;
  return <DeparturesScreen now={now} live={live} />;
}

function ScreenHeader({ screenId, now, updatedAt }) {
  const meta = SCREEN_META[screenId];

  return (
    <div className="screen-head">
      <div className="screen-head-block">
        <span className={`screen-chip ${screenId === "disruption" ? "alert-chip" : ""}`}>{meta.chip}</span>
        <div className="screen-title">{meta.title}</div>
      </div>
      <div className="screen-meta">
        <span>{meta.context}</span>
        <span>{meta.source}</span>
        <span>{`Last updated: ${updatedAt}`}</span>
        <span>{meta.freshness}</span>
        <strong>{formatClock(now)}</strong>
      </div>
    </div>
  );
}

function DeparturesScreen({ now, live }) {
  const rows = buildDepartures(now, live.phase);
  const visibleRows = rows.slice(0, 5);
  const focus = rows[0];

  return (
    <section className="screen departures-screen">
      <ScreenHeader screenId="departures" now={now} updatedAt={focus.lastUpdated} />

      <div className="departures-body">
        <div className="departures-hero departures-hero-ticker">
          <div className="hero-ticker-line">
            {`Now boarding | ${focus.vessel} | ${focus.routeSummary} | Gate ${focus.gate} | ${focus.routeFamily} | ${focus.statusTag} | ${focus.opsTag}`}
          </div>
        </div>

        <div className="departures-table">
          <div className="table-head departures-head">
            <span>Time</span>
            <span>Vessel and route</span>
            <span>Gate and access</span>
            <span>Passenger type</span>
            <span>Status</span>
          </div>
          {visibleRows.map((row, index) => (
            <div key={`${row.time}-${row.vessel}`} className={`table-row departures-row ${index === 0 ? "active" : ""}`}>
              <span className="table-time">{row.time}</span>
              <span className="departure-service-cell">
                <strong>{row.vessel}</strong>
                <em>{row.routeSummary}</em>
                <small>{row.routeFamily}</small>
              </span>
              <span className="departure-gate-cell">
                <strong>{row.gate}</strong>
                <em>{row.accessNote}</em>
              </span>
              <span className="departure-type-cell">
                <strong>{row.passengerType}</strong>
                <em>{row.controlNote}</em>
              </span>
              <span className="departure-status-cell">
                <span className={`status-badge ${statusClass(row.statusTone)}`}>{row.status}</span>
                <em>{`Updated ${row.lastUpdated}`}</em>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConnectionsScreen({ now, live }) {
  const cards = buildConnections(now, live);

  return (
    <section className="screen connections-screen">
      <ScreenHeader screenId="connections" now={now} updatedAt={formatPastTime(now, 1)} />

      <div className="connections-body">
        <div className="connections-route">
          <span className="route-node">Cruise terminal</span>
          <span className="route-line" />
          <span className="route-node">Port exit</span>
          <span className="route-line" />
          <span className="route-node">Airport and city</span>
        </div>

        <div className="connections-grid connections-grid-ppa">
          {cards.map((card) => (
            <article key={card.code} className={`connection-card connection-card-${card.tone}`}>
              <div className="connection-top">
                <div className="connection-code">{card.code}</div>
                <span className="live-dot">Live</span>
              </div>
              <div className="connection-copy">
                <div className="connection-label">{card.label}</div>
                <div className="connection-value">{card.value}</div>
                <div className="connection-bestfor">{card.bestFor}</div>
              </div>
              <div className="connection-meta-block">
                <div className="connection-meta-row">
                  <span>{card.walk}</span>
                  <strong>{card.pickup}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InterchangeScreen({ now, live }) {
  const data = buildTransferOptions(now, live);

  return (
    <section className="screen interchange-screen">
      <ScreenHeader screenId="interchange" now={now} updatedAt={formatPastTime(now, 2)} />

      <div className="interchange-body interchange-body-simple">
        <div className="interchange-layout interchange-layout-simple">
          <article className="interchange-hero-card interchange-hero-simple">
            <span className="interchange-kicker">{data.hero.kicker}</span>
            <div className="interchange-hero-title">{data.hero.title}</div>
            <div className="interchange-hero-total">{data.hero.total}</div>

            <div className="interchange-simple-steps">
              {data.hero.steps.map((step) => (
                <div key={`${step.label}-${step.value}`} className={`interchange-step-card step-${step.tone}`}>
                  <span>{step.label}</span>
                  <strong>{step.value}</strong>
                </div>
              ))}
            </div>

            <div className="interchange-simple-meta">
              {data.hero.meta.map((item) => (
                <div key={item.label} className="interchange-meta-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <div className="interchange-options-grid">
            {data.cards.map((item) => (
              <article key={item.title} className={`interchange-option-card route-${item.tone}`}>
                <div className="interchange-option-head">
                  <span>{item.title}</span>
                  <strong>{item.total}</strong>
                </div>
                <div className="interchange-option-route">{item.route}</div>
                <div className="interchange-option-foot">
                  <span>{item.bestFor}</span>
                  <strong>{item.pickup}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WayfindingScreen({ now }) {
  return (
    <section className="screen wayfinding-screen">
      <ScreenHeader screenId="wayfinding" now={now} updatedAt={formatPastTime(now, 1)} />

      <div className="wayfinding-body wayfinding-body-ppa">
        <div className={`direction-card direction-primary ${arrowClass(PPA_WAYFINDING_LOCALIZED.primary.arrow)}`}>
          <div className="direction-icon">{PPA_WAYFINDING_LOCALIZED.primary.icon}</div>
          <div className="direction-copy">
            <div className="direction-name">{PPA_WAYFINDING_LOCALIZED.primary.name}</div>
            <div className="direction-value">{PPA_WAYFINDING_LOCALIZED.primary.value}</div>
            <div className="direction-subtitle">{PPA_WAYFINDING_LOCALIZED.primary.subtitle}</div>
          </div>
        </div>

        <div className="direction-row direction-row-ppa">
          {PPA_WAYFINDING_LOCALIZED.cards.map((card) => (
            <div key={card.name} className={`direction-card direction-secondary ${arrowClass(card.arrow)}`}>
              <div className="direction-icon">{card.icon}</div>
              <div className="direction-copy">
                <div className="direction-name">{card.name}</div>
                <div className="direction-subtitle">{card.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="wayfinding-services">
          {PPA_WAYFINDING_LOCALIZED.services.map((service) => (
            <span key={service}>{service}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const PPA_PUBLIC_TRANSPORT = [
  {
    offset: 4,
    mode: "X96",
    destination: "Airport",
    bestUse: "Direct airport route",
    pickupPoint: "Bay A2",
    tone: "amber",
    type: "airport"
  },
  {
    offset: 7,
    mode: "Metro",
    destination: "Monastiraki",
    bestUse: "City center link",
    pickupPoint: "Metro station",
    tone: "blue",
    type: "metro"
  },
  {
    offset: 10,
    mode: "Metro",
    destination: "Syntagma",
    bestUse: "City center link",
    pickupPoint: "Metro station",
    tone: "blue",
    type: "metro"
  },
  {
    offset: 12,
    mode: "Rail",
    destination: "Athens Central",
    bestUse: "Regional transfer",
    pickupPoint: "Rail link",
    tone: "teal",
    type: "rail"
  },
  {
    offset: 18,
    mode: "Taxi",
    destination: "Central Athens",
    bestUse: "Direct transfer",
    pickupPoint: "North rank",
    tone: "cyan",
    type: "taxi"
  },
  {
    offset: 20,
    mode: "Shuttle",
    destination: "Passenger Terminal B",
    bestUse: "Internal port transfer",
    pickupPoint: "Loop stop",
    tone: "teal",
    type: "shuttle"
  }
];

const PPA_CRUISE_TRANSFER = [
  {
    vessel: "VIKING VESTA",
    arrivalType: "Cruise arrival",
    terminal: "Terminal A Miaoulis",
    berth: "Berth A",
    coachBay: "Coach Bay C4",
    pickupMode: "Shore excursion coach",
    status: "Disembarkation open",
    statusTone: "live"
  },
  {
    vessel: "MSC LIRICA",
    arrivalType: "Partial disembarkation",
    terminal: "Cruise terminal",
    berth: "Berth assignment live",
    coachBay: "Pickup zone B2",
    pickupMode: "Taxi and coach transfer",
    status: "Pickup active",
    statusTone: "ok"
  },
  {
    vessel: "CRUISE GUEST TRANSFER",
    arrivalType: "Internal shuttle",
    terminal: "Passenger terminal loop",
    berth: "Shuttle stop 2",
    coachBay: "PPA shuttle",
    pickupMode: "Boarding now",
    status: "Shuttle boarding",
    statusTone: "soft"
  },
  {
    vessel: "CRUISE GROUP ALPHA",
    arrivalType: "Guided excursion",
    terminal: "Coach zone C1",
    berth: "Akropolis route",
    coachBay: "Coach Bay C1",
    pickupMode: "Ready for pickup",
    status: "Meet at transfer desk",
    statusTone: "watch"
  }
];

const PPA_ALERTS = [
  {
    titleTop: "Gate E3",
    titleBottom: "departure update",
    subtitle: "Use indoor route to Gate E3",
    steps: [
      "Follow blue markers to sheltered corridor",
      "Recheck vessel and gate on the next screen",
      "Use shuttle if directed by terminal staff"
    ],
    noteSource: "Updated by terminal operations",
    source: "Source: terminal operations"
  },
  {
    titleTop: "E7 to E6",
    titleBottom: "passenger change",
    subtitle: "Passengers only use Gate E6 after berth reassignment",
    steps: [
      "Follow PPA signs for Gate E6 pedestrian access",
      "Vehicles continue via E7 until staff update",
      "Recheck route family and vessel display before boarding"
    ],
    noteSource: "Updated by terminal operations",
    source: "Source: SmartSea live advisory layer"
  },
  {
    titleTop: "Coach Bay C4",
    titleBottom: "full today",
    subtitle: "Cruise coaches moved to Bay C6",
    steps: [
      "Proceed to Coach Zone C using the marked route",
      "Check group code on the transfer desk screen",
      "Wait for coach marshal instructions before boarding"
    ],
    noteSource: "Updated by terminal operations",
    source: "Source: terminal operations"
  },
  {
    titleTop: "Weather route",
    titleBottom: "advisory active",
    subtitle: "Covered walkway guidance in effect for coastal departures",
    steps: [
      "Use indoor route signage for Gate E3 and Gate E7",
      "Expect slower pedestrian movement near berth access",
      "Check live coastal departure status before moving to gate"
    ],
    noteSource: "Updated by terminal operations",
    source: "Source: SmartSea live advisory layer"
  }
];

function SurfaceTransitScreen({ now, live }) {
  const rows = buildSurfaceRows(now, live);
  const footerNotes = [
    "Free shuttle service between passenger stations and ships",
    "Use X96 for airport access",
    "Follow signs for Metro and Rail",
    "Coach pickup by assignment only"
  ];

  return (
    <section className="screen surface-screen">
      <ScreenHeader screenId="surface" now={now} updatedAt={formatPastTime(now, 1)} />

      <div className="surface-body">
        <div className="surface-visual">
          <div className="surface-copy">
            <span className="surface-kicker">Port exit services</span>
            <div className="surface-title">Public Transport from Piraeus</div>
            <div className="surface-subtitle">
              Short-horizon departures for airport access, Athens center, rail transfer, taxi and the PPA shuttle loop.
            </div>
          </div>
          <div className="surface-terminal" />
          <div className="surface-plaza" />
          <div className="surface-palm palm-one" />
          <div className="surface-palm palm-two" />
        </div>

        <div className="surface-board">
          <div className="surface-board-head">
            <span>Time</span>
            <span>Mode</span>
            <span>Destination</span>
            <span>Best use</span>
            <span>Pickup point</span>
            <span>Status</span>
          </div>
          {rows.map((row) => (
            <div key={`${row.mode}-${row.destination}`} className="surface-row">
              <span className="surface-time">{row.time}</span>
              <span className={`surface-line line-${row.tone}`}>{row.mode}</span>
              <span className="surface-destination">{row.destination}</span>
              <span className="surface-bestuse">{row.bestUse}</span>
              <span className="surface-pickup">{row.pickupPoint}</span>
              <span className="surface-status">
                <span className={`status-badge ${statusClass(row.statusTone)}`}>{row.status}</span>
              </span>
            </div>
          ))}
          <div className="surface-footer">
            <strong>{`Updated ${formatClock(now)}`}</strong>
            <div className="surface-footer-pills">
              {footerNotes.map((note) => (
                <span key={note}>{note}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BagClaimScreen({ now, live }) {
  const data = buildCruiseTransfer(now, live.phase);

  return (
    <section className="screen bagclaim-screen">
      <ScreenHeader screenId="bagclaim" now={now} updatedAt={data.updatedAt} />

      <div className="bagclaim-body">
        <article className="bagclaim-hero">
          <div className="bagclaim-glow" />
          <div className="bagclaim-water" />
          <div className="bagclaim-cityline" />
          <div className="bagclaim-ferry" />

          <div className="bagclaim-copy">
            <span className="bagclaim-kicker">Cruise arrivals and transfer readiness</span>
            <div className="bagclaim-title">Cruise Transfer Desk</div>
            <div className="bagclaim-subtitle">
              Coach allocation, berth status, shuttle guidance and passenger services for cruise arrivals at Piraeus.
            </div>
            <div className="bagclaim-service-grid">
              {data.services.map((service) => (
                <div key={service.label} className="bagclaim-link">
                  <strong>{service.label}</strong>
                  <span>{service.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bagclaim-clock">{formatClock(now)}</div>
        </article>

        <div className="bagclaim-panel">
          <div className="bagclaim-table-head">
            <span>Vessel</span>
            <span>Terminal and berth</span>
            <span>Coach bay and pickup</span>
            <span>Status</span>
          </div>

          {data.rows.map((row) => (
            <div key={`${row.vessel}-${row.status}`} className={`bagclaim-row ${row.active ? "active" : ""}`}>
              <div className="bagclaim-origin">
                <strong>{row.vessel}</strong>
                <span>{row.arrivalType}</span>
              </div>
              <div className="bagclaim-terminal">
                <strong>{row.terminal}</strong>
                <span>{row.berth}</span>
              </div>
              <div className="bagclaim-link">
                <strong>{row.coachBay}</strong>
                <span>{row.pickupMode}</span>
              </div>
              <div className="bagclaim-status-cell">
                <span className={`bagclaim-status status-${row.statusTone}`}>{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DisruptionScreen({ now, live }) {
  const alert = buildAlert(now, live.phase);

  return (
    <section className="screen disruption-screen">
      <ScreenHeader screenId="disruption" now={now} updatedAt={alert.lastReviewed} />

      <div className="alert-grid">
        <div className="alert-body">
          <div className="alert-panel alert-arrow-panel">
            <div className="alert-title">
              {alert.titleTop}
              <br />
              {alert.titleBottom}
            </div>
            <div className="alert-subtitle">{alert.subtitle}</div>
          </div>

          <div className="alert-note-strip">
            <span>{alert.noteSource}</span>
            <span>{`Last reviewed ${alert.lastReviewed}`}</span>
            <span>Please follow PPA staff instructions</span>
            <span>{alert.source}</span>
          </div>
        </div>

        <aside className="alert-panel alert-steps">
          {alert.steps.map((step, index) => (
            <div key={`${alert.titleTop}-${index}`} className="alert-step">
              <span className="alert-step-label">{`Step 0${index + 1}`}</span>
              <div className="alert-step-value">{step}</div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}

function buildDepartures(now, phase) {
  return PPA_DEPARTURES.map((item, index) => {
    const row = {
      ...item,
      lastUpdated: formatPastTime(now, item.updatedOffset + ((phase + index) % 2))
    };

    if (row.vessel === "FLYINGCAT 3" && phase >= 4) {
      row.status = "Final call";
      row.statusTone = "final-call";
      row.controlNote = "Foot passengers final boarding";
    }

    if (row.vessel === "ELYROS" && phase % 3 === 2) {
      row.status = "Waiting to berth";
      row.statusTone = "waiting-to-berth";
      row.controlNote = "Await berth confirmation";
    }

    if (row.vessel === "SMYRNA DI LEVANTE" && (phase === 3 || phase === 4)) {
      row.gate = "E2";
      row.status = "Gate change";
      row.statusTone = "gate-change";
      row.accessNote = "Gate reassigned after berth ops";
      row.controlNote = "Recheck vessel and gate before boarding";
    }

    if (index === 0) {
      row.statusTag = `Final call in ${clamp(12 - phase, 6, 12)} min`;
    }

    return row;
  });
}

function buildConnections(now, live) {
  return PPA_CONNECTIONS.map((card) => {
    if (card.valueType === "airport") {
      return { ...card, value: `${live.airport} min total`, usage: `Updated ${formatPastTime(now, 1)}` };
    }

    if (card.valueType === "metro") {
      return { ...card, value: `${live.metro} min`, usage: "Frequent service" };
    }

    if (card.valueType === "rail") {
      return { ...card, value: `${live.rail} min wait`, usage: "Regional link" };
    }

    if (card.valueType === "taxi") {
      return { ...card, value: `${live.taxi} min queue`, usage: "Private transfer" };
    }

    if (card.valueType === "shuttle") {
      return { ...card, value: `${live.shuttle} min`, usage: "Free service" };
    }

    return { ...card, value: live.coachWait === 0 ? "Ready" : `${live.coachWait} min`, usage: "Assigned bay" };
  });
}

function buildTransferOptions(now, live) {
  const crowdValue = live.crowd > 74 ? "High" : live.crowd > 56 ? "Moderate" : "Light";

  return {
    hero: {
      kicker: "Recommended now",
      title: "Airport via X96",
      total: `${live.airport} min total`,
      steps: [
        { label: "Walk", value: "4 min", tone: "blue" },
        { label: "Bus", value: "X96", tone: "amber" },
        { label: "Pickup", value: "Bay A2", tone: "teal" }
      ],
      meta: [
        { label: "Best for", value: "Airport and luggage" },
        { label: "Accessible path", value: "Lift route open" },
        { label: "Taxi queue", value: `${live.taxi} min` }
      ]
    },
    cards: [
      {
        title: "Athens Center",
        total: `${live.metro} min`,
        tone: "blue",
        route: "Walk to Metro, then continue to Monastiraki or Syntagma",
        bestFor: "Lowest cost",
        pickup: "Metro station link"
      },
      {
        title: "Cruise Pickup",
        total: `${live.shuttle + 4} min`,
        tone: "teal",
        route: "Use the shuttle loop to reach the assigned coach area",
        bestFor: "Groups and excursions",
        pickup: "Coach Zone C"
      },
      {
        title: "Hotel Transfer",
        total: `${live.taxi + 12} min`,
        tone: "blue",
        route: "Use the official taxi rank for door to door transfer",
        bestFor: "Hotels and heavy bags",
        pickup: "North exit"
      }
    ],
    updatedAt: formatPastTime(now, 2)
  };
}

function buildSurfaceRows(now, live) {
  return PPA_PUBLIC_TRANSPORT.map((item) => {
    const status = surfaceStatus(item.type, live);

    return {
      ...item,
      time: formatFutureTime(now, item.offset),
      status: status.label,
      statusTone: status.tone
    };
  });
}

function buildCruiseTransfer(now, phase) {
  const rows = PPA_CRUISE_TRANSFER.map((item, index) => {
    const row = { ...item, active: index === phase % PPA_CRUISE_TRANSFER.length };

    if (row.vessel === "MSC LIRICA" && phase >= 3) {
      row.berth = "Berth B";
      row.status = "Partial disembarkation";
      row.statusTone = "watch";
    }

    if (row.vessel === "CRUISE GUEST TRANSFER" && phase % 2 === 0) {
      row.status = "Ready for exit";
      row.statusTone = "ok";
      row.pickupMode = "Shuttle boarding";
    }

    return row;
  });

  return {
    updatedAt: formatPastTime(now, 1 + (phase % 3)),
    services: [
      { label: "Customs office", value: "Terminal services" },
      { label: "Tourist Police", value: "Assistance point" },
      { label: "Passport Control", value: "When required" },
      { label: "Taxi rank guidance", value: "North exit" },
      { label: "Free shuttle route", value: "Shuttle stop 2" },
      { label: "Tourist information", value: "Terminal A desk" }
    ],
    rows
  };
}

function buildAlert(now, phase) {
  const alert = PPA_ALERTS[phase % PPA_ALERTS.length];

  return {
    ...alert,
    lastReviewed: formatPastTime(now, 1 + (phase % 4))
  };
}

function surfaceStatus(type, live) {
  if (type === "airport") return { label: "On time", tone: "on-time" };
  if (type === "metro") return { label: `${clamp(live.metro - 21, 3, 8)} min`, tone: "check-in-open" };
  if (type === "rail") return { label: `${live.rail} min`, tone: "check-in-open" };
  if (type === "taxi") return { label: live.taxi <= 8 ? "Available" : `${live.taxi} min`, tone: "on-time" };
  return { label: `${live.shuttle} min`, tone: "check-in-open" };
}

function arrowClass(direction) {
  return `arrow-${direction || "right"}`;
}

function statusClass(tone) {
  return `status-${tone || "on-time"}`;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatClock(date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function formatFutureTime(date, minutes) {
  return formatClock(new Date(date.getTime() + minutes * 60000));
}

function formatPastTime(date, minutes) {
  return formatClock(new Date(date.getTime() - minutes * 60000));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
