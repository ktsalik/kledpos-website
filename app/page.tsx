import {
  ArrowRight,
  BarChart3,
  BadgePercent,
  Boxes,
  Building2,
  ChefHat,
  CircleCheck,
  ClipboardList,
  Clock3,
  Eye,
  LayoutDashboard,
  PackageSearch,
  ReceiptText,
  ShoppingCart,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  Truck,
  Utensils,
  Users,
} from 'lucide-react';

const DEMO_URL = 'https://kledpos.tsalikidis.dev/';

function KledMark({ id, size = 42 }: { id: string; size?: number }) {
  const k = 'M10 8 H17 V20.5 L28.5 8 H37 L25 22.5 L37.5 40 H29 L19.5 26.5 L17 29 V40 H10 Z';

  return (
    <svg
      className="kled-mark"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-lit`} x1="10" y1="8" x2="30" y2="30">
          <stop stopColor="#fdba74" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="14" y1="20" x2="38" y2="42">
          <stop stopColor="#ea580c" />
          <stop offset="1" stopColor="#b93c09" />
        </linearGradient>
        <clipPath id={`${id}-above`}>
          <polygon points="0,0 48,0 48,11.5 0,33.5" />
        </clipPath>
        <clipPath id={`${id}-below`}>
          <polygon points="0,34.5 48,12.5 48,48 0,48" />
        </clipPath>
      </defs>
      <g className="mark-half mark-half-top" clipPath={`url(#${id}-above)`}>
        <path d={k} fill={`url(#${id}-lit)`} />
      </g>
      <g className="mark-half mark-half-bottom" clipPath={`url(#${id}-below)`}>
        <path d={k} fill={`url(#${id}-shade)`} />
      </g>
    </svg>
  );
}

function KledLogo({ id = 'brand' }: { id?: string }) {
  return (
    <span className="brand" aria-label="KledPOS">
      <KledMark id={id} size={40} />
      <span className="brand-word">
        Kled<span>POS</span>
      </span>
    </span>
  );
}

function HeroMockup() {
  const bars = [42, 62, 51, 76, 58, 86, 67, 96, 72, 84, 61, 74];

  return (
    <div className="product-stage" aria-label="Ενδεικτική απεικόνιση του KledPOS">
      <div className="stage-glow" />
      <div className="dashboard-window">
        <div className="window-bar">
          <span className="window-brand">
            <KledMark id="mockup" size={24} />
            <strong>KledPOS</strong>
          </span>
          <span className="window-dots"><i /><i /><i /></span>
        </div>
        <div className="dashboard-shell">
          <aside className="mock-sidebar">
            <span className="mock-nav active"><LayoutDashboard /></span>
            <span className="mock-nav"><ReceiptText /></span>
            <span className="mock-nav"><Utensils /></span>
            <span className="mock-nav"><Boxes /></span>
            <span className="mock-nav"><ShoppingBag /></span>
          </aside>
          <div className="mock-main">
            <div className="mock-head">
              <div>
                <span className="mock-eyebrow">Κεντρική εικόνα</span>
                <strong>Καλημέρα, Κώστα</strong>
              </div>
              <span className="branch-pill"><Store /> Γλυφάδα <span>⌄</span></span>
            </div>
            <div className="stat-row">
              <div className="stat-card">
                <span>Πωλήσεις σήμερα</span>
                <strong>4.860€</strong>
                <small>↗ 12,4%</small>
              </div>
              <div className="stat-card">
                <span>Ενεργές παραγγελίες</span>
                <strong>174</strong>
                <small className="live-small"><i /> live</small>
              </div>
              <div className="stat-card stat-card-wide">
                <span>Μηνιαία έσοδα</span>
                <strong>21,8k€</strong>
                <small>↗ 16,3%</small>
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-heading">
                <span><BarChart3 /> Πωλήσεις ανά κατάστημα</span>
                <small>Τελευταίοι 6 μήνες</small>
              </div>
              <div className="chart-bars">
                {bars.map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className={index % 2 ? 'bar coral' : 'bar plum'}
                    style={{ '--bar-height': `${height}%` } as React.CSSProperties}
                  />
                ))}
              </div>
              <div className="chart-labels"><span>Απρ</span><span>Μάι</span><span>Ιούν</span><span>Ιούλ</span><span>Αύγ</span><span>Σεπ</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-float float-card">
        <div className="float-topline"><span>Νέα παραγγελία</span><ReceiptText /></div>
        <div className="order-item"><span className="food-orb">B</span><span><b>Kled Classic</b><small>1 × 11,90€</small></span><b>11,90€</b></div>
        <div className="order-item"><span className="food-orb soft">F</span><span><b>Πατάτες</b><small>1 × 4,20€</small></span><b>4,20€</b></div>
        <div className="order-total"><span>Σύνολο</span><strong>16,10€</strong></div>
        <div className="send-order"><span>Αποστολή στην κουζίνα</span><ArrowRight /></div>
      </div>

      <div className="kitchen-float float-card">
        <div className="kitchen-icon"><ChefHat /></div>
        <div><small>Κουζίνα</small><strong>Παραγγελία #042</strong><span><Clock3 /> 04:28</span></div>
        <CircleCheck className="check-icon" />
      </div>
    </div>
  );
}

function PosMockup() {
  const products = [
    ['Kled Classic', '11,90€', 'B'],
    ['Kled Spicy', '12,50€', 'S'],
    ['Ντάκος Κρήτης', '5,80€', 'N'],
    ['Χωριάτικη', '8,20€', 'X'],
    ['Πατάτες', '4,20€', 'P'],
    ['Σοκολατόπιτα', '6,40€', 'Σ'],
  ];

  return (
    <div className="pos-mockup" aria-label="Ενδεικτική απεικόνιση παραγγελιοληψίας">
      <div className="pos-topbar">
        <span><KledMark id="pos-mockup" size={25} /><b>KledPOS</b></span>
        <span className="connected"><i /> Σε σύνδεση</span>
      </div>
      <div className="pos-shell">
        <div className="pos-categories">
          <span className="category-active"><Utensils /> Όλα</span>
          <span>Ορεκτικά</span>
          <span>Σαλάτες</span>
          <span>Burger</span>
          <span>Κυρίως</span>
          <span>Επιδόρπια</span>
        </div>
        <div className="product-grid">
          {products.map(([name, price, letter], index) => (
            <div className="product-tile" key={name}>
              <span className={`product-visual visual-${(index % 3) + 1}`}>{letter}</span>
              <span><b>{name}</b><small>{price}</small></span>
            </div>
          ))}
        </div>
        <div className="ticket-panel">
          <div className="ticket-title"><span>Νέα παραγγελία</span><small>Τραπέζι 06</small></div>
          <div className="ticket-lines">
            <span><b>1</b> Kled Classic <strong>11,90€</strong></span>
            <span><b>1</b> Πατάτες <strong>4,20€</strong></span>
            <span><b>2</b> Mythos 500ml <strong>11,00€</strong></span>
          </div>
          <div className="ticket-sum"><span>Σύνολο</span><strong>27,10€</strong></div>
          <span className="ticket-button">Αποστολή παραγγελίας <ArrowRight /></span>
        </div>
      </div>
    </div>
  );
}

function InventoryMockup() {
  const stockRows = [
    ['Μοσχαρίσιος κιμάς', '12,4 kg', 'Επαρκές', 'good'],
    ['Ψωμάκι brioche', '90 τεμ.', 'Χαμηλό', 'low'],
    ['Τσένταρ', '0 kg', 'Εξαντλήθηκε', 'out'],
    ['Πατάτες', '34,2 kg', 'Επαρκές', 'good'],
  ];

  return (
    <div className="inventory-mockup" aria-label="Ενδεικτική απεικόνιση διαχείρισης αποθέματος">
      <div className="inventory-head">
        <div><small>ΑΠΟΘΕΜΑ</small><strong>Επισκόπηση καταστήματος</strong></div>
        <span><Store /> Γλυφάδα⌄</span>
      </div>
      <div className="inventory-stats">
        <div><span>Αξία αποθέματος</span><strong>4.336€</strong></div>
        <div><span>Χαμηλό απόθεμα</span><strong>10</strong></div>
        <div><span>Εξαντλήθηκαν</span><strong>7</strong></div>
      </div>
      <div className="stock-list">
        <div className="stock-header"><span>Υλικό</span><span>Διαθέσιμο</span><span>Κατάσταση</span></div>
        {stockRows.map(([item, quantity, status, tone]) => (
          <div className="stock-row" key={item}>
            <span><i className="stock-icon"><Boxes /></i>{item}</span>
            <b>{quantity}</b>
            <em className={`stock-status ${tone}`}>{status}</em>
          </div>
        ))}
      </div>
      <div className="restock-toast"><Truck /><span><b>Έτοιμο για ανεφοδιασμό</b><small>3 προτάσεις αγοράς δημιουργήθηκαν</small></span><ArrowRight /></div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="logo-link" href="#top"><KledLogo id="header-logo" /></a>
        <nav className="desktop-nav" aria-label="Κύρια πλοήγηση">
          <a href="#flow">Η πλατφόρμα</a>
          <a href="#features">Δυνατότητες</a>
          <a href="#contact">Επικοινωνία</a>
        </nav>
        <div className="header-actions">
          <a className="login-link" href={DEMO_URL} target="_blank" rel="noreferrer">Σύνδεση</a>
          <a className="button button-small" href={DEMO_URL} target="_blank" rel="noreferrer">
            Live demo <ArrowRight />
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="hero-copy">
          <div className="availability-pill reveal-one">
            <span className="pulse-dot" />
            Για κάθε σημείο της λειτουργίας σας
          </div>
          <h1 className="reveal-two">
            Το εστιατόριό σας.<br />
            Σε <em>μία</em> ροή.
          </h1>
          <p className="hero-lede reveal-three">
            Παραγγελίες, κουζίνα, απόθεμα και εικόνα της επιχείρησης — συνδεδεμένα σε ένα σύγχρονο, απλό περιβάλλον.
          </p>
          <div className="hero-actions reveal-four">
            <a className="button button-primary" href={DEMO_URL} target="_blank" rel="noreferrer">
              Δείτε το live demo <ArrowRight />
            </a>
            <a className="text-link" href="#flow">Ανακαλύψτε το KledPOS <span>↓</span></a>
          </div>
          <div className="hero-note reveal-four">
            <span><CircleCheck /> Για ένα ή περισσότερα καταστήματα</span>
            <span><Sparkles /> Απλό από την πρώτη ημέρα</span>
          </div>
        </div>
        <HeroMockup />
      </section>

      <section className="flow-section" id="flow">
        <div className="section-intro flow-intro">
          <span className="section-kicker">ΜΙΑ ΕΝΙΑΙΑ ΡΟΗ</span>
          <h2>Ό,τι συμβαίνει σήμερα,<br />συνδέεται <em>αυτόματα.</em></h2>
          <p>Λιγότερα ξεχωριστά εργαλεία. Λιγότερη διπλή δουλειά. Κάθε ομάδα βλέπει ακριβώς ό,τι χρειάζεται, τη στιγμή που το χρειάζεται.</p>
        </div>
        <div className="flow-track">
          <div className="flow-line" aria-hidden="true"><i /><i /><i /></div>
          <article className="flow-step">
            <span className="flow-number">01</span>
            <i className="flow-icon"><ReceiptText /></i>
            <h3>Η παραγγελία μπαίνει</h3>
            <p>Από το ταμείο ή το κινητό του σερβιτόρου, χωρίς περιττά βήματα.</p>
          </article>
          <article className="flow-step">
            <span className="flow-number">02</span>
            <i className="flow-icon"><ChefHat /></i>
            <h3>Η κουζίνα ενημερώνεται</h3>
            <p>Οι παραγγελίες φτάνουν καθαρά στην κατάλληλη θέση εργασίας.</p>
          </article>
          <article className="flow-step">
            <span className="flow-number">03</span>
            <i className="flow-icon"><Boxes /></i>
            <h3>Το απόθεμα κινείται</h3>
            <p>Οι ποσότητες ακολουθούν τις πωλήσεις και δείχνουν έγκαιρα τι τελειώνει.</p>
          </article>
          <article className="flow-step">
            <span className="flow-number">04</span>
            <i className="flow-icon"><Eye /></i>
            <h3>Η εικόνα γίνεται καθαρή</h3>
            <p>Πωλήσεις, κόστος και απόδοση όλων των καταστημάτων σε μία ματιά.</p>
          </article>
        </div>
      </section>

      <section className="showcase-section" id="features">
        <article className="showcase-row order-showcase">
          <div className="showcase-copy">
            <span className="section-kicker">ΑΠΟ ΤΗ ΣΑΛΑ ΣΤΗΝ ΚΟΥΖΙΝΑ</span>
            <h2>Η ομάδα σας κινείται<br />στον ίδιο <em>ρυθμό.</em></h2>
            <p>Η παραγγελία ξεκινά εκεί που βρίσκεται ο πελάτης και φτάνει στην κουζίνα έτοιμη για εκτέλεση — με λιγότερη αναμονή και καθαρή προτεραιότητα.</p>
            <ul className="feature-points">
              <li><CircleCheck /> Ταμείο, παραγγελιοληψία και KDS</li>
              <li><CircleCheck /> Ζωντανή εικόνα τρεχουσών παραγγελιών</li>
              <li><CircleCheck /> Κατάλογος, επιλογές και διαθεσιμότητα</li>
            </ul>
          </div>
          <div className="showcase-canvas pos-canvas">
            <span className="canvas-caption">ΠΑΡΑΓΓΕΛΙΟΛΗΨΙΑ / POS</span>
            <PosMockup />
            <span className="mini-status status-order"><ChefHat /><b>Στην κουζίνα</b><small>#042 · μόλις τώρα</small></span>
          </div>
        </article>

        <article className="showcase-row stock-showcase">
          <div className="showcase-canvas inventory-canvas">
            <span className="canvas-caption">ΑΠΟΘΕΜΑ / ΑΓΟΡΕΣ</span>
            <InventoryMockup />
            <span className="mini-status status-stock"><PackageSearch /><b>Χαμηλό απόθεμα</b><small>Χρειάζονται έλεγχο 10 υλικά</small></span>
          </div>
          <div className="showcase-copy">
            <span className="section-kicker">ΑΠΟΘΕΜΑ ΠΟΥ ΜΙΛΑΕΙ</span>
            <h2>Ξέρετε τι υπάρχει.<br />Και τι έρχεται <em>μετά.</em></h2>
            <p>Το KledPOS συνδέει συνταγές, πωλήσεις, αποθέματα και αγορές. Έτσι βλέπετε τι καταναλώνεται, τι χάνεται και τι πρέπει να παραγγελθεί.</p>
            <ul className="feature-points">
              <li><CircleCheck /> Απόθεμα και μεταφορές ανά κατάστημα</li>
              <li><CircleCheck /> Προμηθευτές και παραγγελίες αγοράς</li>
              <li><CircleCheck /> Καταγραφή απωλειών και αναφορές</li>
            </ul>
          </div>
        </article>
      </section>

      <section className="capabilities-section">
        <div className="section-intro capabilities-intro">
          <span className="section-kicker">ΚΑΘΕ ΥΠΗΡΕΣΙΑ, ΕΝΑ ΠΕΡΙΒΑΛΛΟΝ</span>
          <h2>Από το πρώτο τραπέζι<br />ως την τελική <em>απόφαση.</em></h2>
        </div>
        <div className="capability-grid">
          <article className="capability-card orange-card">
            <span className="capability-icon"><ReceiptText /></span><span className="capability-index">01</span>
            <h3>POS & παραγγελίες</h3>
            <p>Γρήγορη παραγγελιοληψία για ταμείο και σέρβις, με ζωντανή πορεία κάθε παραγγελίας.</p>
          </article>
          <article className="capability-card">
            <span className="capability-icon"><ChefHat /></span><span className="capability-index">02</span>
            <h3>Οθόνη κουζίνας</h3>
            <p>Καθαρή σειρά εκτέλεσης, χρόνοι και κατάσταση παραγγελιών για κάθε πόστο.</p>
          </article>
          <article className="capability-card">
            <span className="capability-icon"><ClipboardList /></span><span className="capability-index">03</span>
            <h3>Κατάλογος & συνταγές</h3>
            <p>Είδη, κατηγορίες, επιλογές, τιμές και συνταγές οργανωμένα από ένα σημείο.</p>
          </article>
          <article className="capability-card">
            <span className="capability-icon"><Boxes /></span><span className="capability-index">04</span>
            <h3>Απόθεμα</h3>
            <p>Τρέχουσες ποσότητες, όρια, μεταφορές και ιστορικό κίνησης ανά κατάστημα.</p>
          </article>
          <article className="capability-card">
            <span className="capability-icon"><ShoppingCart /></span><span className="capability-index">05</span>
            <h3>Αγορές & προμηθευτές</h3>
            <p>Παραγγελίες αγοράς, παραλαβές και εικόνα δαπανών χωρίς σκόρπιες λίστες.</p>
          </article>
          <article className="capability-card">
            <span className="capability-icon"><Trash2 /></span><span className="capability-index">06</span>
            <h3>Απώλειες</h3>
            <p>Καταγραφή φύρας και αιτιών, ώστε το πραγματικό κόστος να είναι πάντα ορατό.</p>
          </article>
        </div>
      </section>

      <section className="branches-section">
        <div className="branches-grid" aria-hidden="true" />
        <div className="branches-copy">
          <span className="dark-kicker">ΠΟΛΛΑ ΚΑΤΑΣΤΗΜΑΤΑ. ΜΙΑ ΕΙΚΟΝΑ.</span>
          <h2>Κάθε σημείο λειτουργεί αυτόνομα.<br />Εσείς τα βλέπετε <em>όλα μαζί.</em></h2>
          <p>Συγκρίνετε πωλήσεις, παραγγελίες και απόθεμα ανά κατάστημα, χωρίς να χάνετε τη συνολική εικόνα της επιχείρησης.</p>
          <div className="branch-benefits">
            <span><Building2 /> Ενιαία διαχείριση</span>
            <span><BarChart3 /> Αναφορές ανά σημείο</span>
            <span><Users /> Ρόλοι για την ομάδα</span>
          </div>
        </div>
        <div className="branch-visual">
          <div className="network-map">
            <span className="network-line line-a" /><span className="network-line line-b" /><span className="network-line line-c" />
            <span className="hq-node"><KledMark id="branch-hq" size={30} /><b>Κεντρική εικόνα</b><small>Όλα τα καταστήματα</small></span>
            <span className="branch-node node-one"><Store /><b>Γλυφάδα</b><small><i /> Ανοιχτό</small></span>
            <span className="branch-node node-two"><Store /><b>Σύνταγμα</b><small><i /> Ανοιχτό</small></span>
            <span className="branch-node node-three"><Store /><b>Πειραιάς</b><small><i /> Ανοιχτό</small></span>
          </div>
          <div className="overview-pill"><span><small>Συνολικές πωλήσεις</small><b>€12.480</b></span><span><small>Ενεργές παραγγελίες</small><b>68</b></span><span><small>Καταστήματα</small><b>03</b></span></div>
        </div>
      </section>

      <section className="insight-section">
        <div className="insight-copy">
          <span className="section-kicker">ΛΙΓΟΤΕΡΗ ΑΝΑΖΗΤΗΣΗ. ΠΙΟ ΚΑΘΑΡΗ ΑΠΟΦΑΣΗ.</span>
          <h2>Η καθημερινότητα μπροστά σας,<br />χωρίς θόρυβο.</h2>
        </div>
        <div className="insight-cards">
          <article><span><BarChart3 /></span><strong>Ζωντανή εικόνα πωλήσεων</strong><p>Σήμερα, αυτόν τον μήνα ή ανά κατάστημα.</p></article>
          <article><span><BadgePercent /></span><strong>Απόδοση καταλόγου</strong><p>Τι πουλάει περισσότερο και τι χρειάζεται προσοχή.</p></article>
          <article><span><Boxes /></span><strong>Κατάσταση αποθέματος</strong><p>Χαμηλά, εξαντλημένα και όσα λήγουν σύντομα.</p></article>
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="cta-orb" aria-hidden="true" />
        <span className="section-kicker">ΔΕΙΤΕ ΤΟ ΣΕ ΛΕΙΤΟΥΡΓΙΑ</span>
        <h2>Μία πλατφόρμα.<br /><em>Όλη</em> η λειτουργία σας.</h2>
        <p>Περιηγηθείτε στο KledPOS με έτοιμα δεδομένα και δείτε πώς συνδέεται η καθημερινότητα ενός σύγχρονου εστιατορίου.</p>
        <a className="button button-primary button-large" href={DEMO_URL} target="_blank" rel="noreferrer">Ανοίξτε το live demo <ArrowRight /></a>
      </section>

      <footer className="site-footer">
        <KledLogo id="footer-logo" />
        <p>Η διαχείριση του εστιατορίου σας, απλά.</p>
        <div className="footer-links"><a href="#flow">Η πλατφόρμα</a><a href="#features">Δυνατότητες</a><a href={DEMO_URL} target="_blank" rel="noreferrer">Live demo ↗</a></div>
        <small>© 2026 KledPOS</small>
      </footer>
    </main>
  );
}
