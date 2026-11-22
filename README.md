# Mostly Fiction 📚🏆

An open-access, static-first catalog and interactive discovery platform for major literary fiction prizes, awards, winners, shortlists, and publishing metadata.

Inspired by and modeled after Benjamin Breen’s [Book Prize Index](https://book-prize-index.vercel.app).

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
- **National Book Critics Circle (NBCC) Award for Fiction** (American critics honor)
- **Nobel Prize in Literature** (Fiction & prose laureates)

### 📊 Dataset Scorecard & Historical Coverage

The index currently catalogs **11 prizes**, **1,341 authors**, **2,178 books**, and **2,641 nominations**:

| Prize | Scope / Focus | Award Years | Winners | Historical Coverage |
| :--- | :--- | :---: | :---: | :---: |
| **The Booker Prize** | UK, Commonwealth & Global English | 1969–2026 | 62 | **100% Complete** (+ 283 shortlists 1969–2026) |
| **The Pulitzer Prize for Fiction** | American literary distinction | 1918–2026 | 100 | **100% Complete** (+ 95 finalists 1980–2026) |
| **National Book Award for Fiction** | US national literary achievement | 1950–2026 | 76 | **100% Complete** (+ 369 finalists 1951–2026) |
| **Women's Prize for Fiction** | Full-length novels by women worldwide | 1996–2026 | 31 | **100% Complete** (+ 155 shortlists 1996–2026) |
| **International Booker Prize** | Translated fiction into English | 2005–2026 | 17 | **100% Complete** (+ 55 shortlists 2016–2026) |
| **International Dublin Literary Award** | Public library nominations worldwide | 1996–2026 | 31 | **100% Complete** (+ 228 shortlists 1996–2026) |
| **The Goldsmiths Prize** | Mould-breaking fiction & novel form | 2013–2026 | 14 | **100% Complete** (+ 70 shortlists 2013–2026) |
| **Hugo Award for Best Novel** | World Science Fiction Convention | 1953–2026 | 78 | **100% Complete** (+ 287 finalists 1956–2026) |
| **Nebula Award for Best Novel** | Science Fiction & Fantasy Writers (SFWA) | 1965–2026 | 67 | **100% Complete** (+ 322 finalists 1965–2025) |
| **National Book Critics Circle (NBCC)** | American professional book critics | 1975–2025 | 53 | **100% Complete** (+ 175 finalists 1976–2025) |
| **Nobel Prize in Literature** | Master novelists & prose laureates | 1905–2025 | 73 | **Complete Fiction Roster** (Nominees sealed 50 yrs) |

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

7. **First-Class Translator Credits**
   - Dedicated translator attribution for translated literature (International Booker, Dublin Literary Award, Nobel Prize).
   - Translators indexed as searchable criteria across table, grid, modal, and export formats.

8. **Mobile & iPhone Responsive Navigation**
   - Adaptive bottom drawer sheet modal for smartphones.
   - Native browser back-button (`popstate`) integration to dismiss modals smoothly.
   - URL deep-linking support (`?book=<bookId>`) for direct sharing of book dossiers.

9. **High-Fidelity Cover Art & Authentic Spines**
   - Verified book cover artwork with Open Library fallback.
   - Dynamic proportional spine thickness based on physical page count, custom binding colors, and foil seals.

10. **Transparent Data Layer & CI Validation**
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

## 👥 Curators & Authors

- [@foobork](https://github.com/foobork)
- [@midlevels](https://github.com/midlevels)

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
