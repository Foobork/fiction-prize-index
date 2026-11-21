# Fiction Prize Index 📚🏆

An open-access, static-first catalog and interactive discovery platform for major literary fiction prizes, awards, winners, shortlists, and publishing metadata.

Inspired by and modeled after Benjamin Breen’s [Book Prize Index](https://github.com/benjaminbreen/BookPrizeIndex).

---

## 📖 Overview

Award-winning fiction represents some of the finest narrative craftsmanship of our time. However, tracking and exploring literary prizes is plagued by fragmented archives, corporate press releases, and search engines prioritizing algorithmic trends over literary craft.

The **Fiction Prize Index** centralizes major world fiction awards into a unified, transparent, client-browsable catalog. Every award entry links directly back to official foundation archives for verification.

### Tracked Honors:
- **The Booker Prize** (UK / Commonwealth / Global English)
- **The Pulitzer Prize for Fiction** (Distinguished American literature)
- **National Book Award for Fiction** (US literary achievement)
- **Women's Prize for Fiction** (Full-length novels by women)
- **International Booker Prize** (Translated world literature)
- **International Dublin Literary Award** (Global library nominations)
- **The Goldsmiths Prize** (Form innovation and mold-breaking fiction)
- **Hugo Award & Nebula Award** (Speculative fiction titans)
- **National Book Critics Circle (NBCC) Award for Fiction**

---

## ✨ Key Features

1. **Master Fiction Index & Omni-Search**
   - Instant search across book titles, authors, publishers, genres, and synopses.
   - Granular multi-facet filtering by prize, outcome (`Winner` vs. `Shortlist`), publication year, and genre.
   - Dual viewing modes: Clean Editorial Grid and Data Table view.

2. **Virtual Bookshelf Simulator**
   - An interactive visual bookshelf browser inspired by Breen’s shelf simulator.
   - Realistic book spines reflecting proportional page counts, authentic binding tones, and gold-foil award seals.
   - Interactive pull-out animation on hover and click inspection.

3. **Cross-Prize Overlap ("The Fiction Overlap Club")**
   - Identifies books that captured or contested multiple major honors (e.g. *The Underground Railroad* winning both the Pulitzer and National Book Award; *Demon Copperhead* capturing both the Pulitzer and Women's Prize).

4. **Author Dossiers & Multi-Winner Hall of Fame**
   - Profiles of prolific laureates (Colson Whitehead, Hilary Mantel, Jesmyn Ward, Margaret Atwood, Barbara Kingsolver).

5. **Publishing Ecosystem Analytics**
   - Quantitative breakdowns of leading publishing houses and indie imprints (Penguin Random House, Farrar, Straus & Giroux, Faber, Riverhead, Grove Press).
   - Genre distribution trends across decades.

6. **Local-First Reading List & Exporter**
   - Save books to "Want to Read", "Currently Reading", and "Completed" shelves.
   - Stored in browser `localStorage` (zero sign-up required).
   - One-click export to formatted **Markdown Reading List** or **CSV**.

7. **Transparent Data Layer & CI Validation**
   - Fully open JSON data files (`data/prizes.json`, `data/books.json`, `data/authors.json`, `data/nominations.json`).
   - GitHub Actions CI script (`scripts/validate.ts`) verifying foreign key integrity and source URL presence on every push.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Static Site Generation)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom parchment & ink literary palette)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Storage**: Static JSON files
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20 & v22)
- npm 9+

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/foobork/fiction-prize-index.git
cd fiction-prize-index

# Install dependencies
npm install

# Validate data integrity
npm run validate

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Repository Structure

```text
fiction-prize-index/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI for build & dataset validation
├── data/
│   ├── prizes.json              # Prize foundation profiles & criteria
│   ├── books.json               # Books, synopses, genres, publishers
│   ├── authors.json             # Author biographies & nationalities
│   └── nominations.json         # Award years, outcomes, and verification links
├── scripts/
│   ├── validate.ts              # Data integrity & schema validator
│   └── enrich_openlibrary.py    # Open Library API metadata enrichment
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS styling & animations
│   │   ├── layout.tsx           # Root layout & Google Serif fonts
│   │   └── page.tsx             # Main interactive application
│   ├── components/
│   │   ├── Navbar.tsx           # Header, navigation tabs, dark mode toggle
│   │   ├── Footer.tsx           # Attribution & open data links
│   │   ├── IndexTable.tsx       # Master filter & search engine
│   │   ├── VirtualBookshelf.tsx # Visual bookshelf simulator
│   │   ├── PrizeDirectory.tsx   # Detailed prize profiles & timeline
│   │   ├── AuthorDirectory.tsx  # Author dossiers & multi-winner club
│   │   ├── AnalyticsView.tsx    # Publisher & cross-prize analytics
│   │   ├── ReadingListView.tsx  # Personal reading shelf & exporter
│   │   └── BookModal.tsx        # Book detail & citation viewer
│   ├── lib/
│   │   ├── data.ts              # Data querying & joins
│   │   └── storage.ts           # LocalStorage & Markdown/CSV export
│   └── types/
│       └── index.ts             # TypeScript interfaces
├── PROJECT_SPEC.md              # Detailed project specification
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions of past prize years, new eligible fiction prizes, or corrections are welcomed!

1. Fork the repo and create your branch (`git checkout -b feature/add-2025-booker-longlist`).
2. Add the corresponding entries in `data/books.json` and `data/nominations.json` (remember to include a verifiable `sourceUrl`).
3. Run the validation suite:
   ```bash
   npm run validate
   ```
4. Commit your changes and open a Pull Request.

---

## 📜 License

MIT License. Dedicated to the public exploration of literature.
