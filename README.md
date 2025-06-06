# ⚡ Note: our database subscription has expired, current deployed version does not demonstrate what the project does.

## Check out our [demo video](https://drive.google.com/file/d/1V2eDSnKD8XKmrrpyPzoNU3cGX-uuC4Oq/view?usp=drive_link) to see how it all works

Interactive Graph for Blockchain Data Visualization.  


![telegram-cloud-photo-size-2-5316521372274526998-y](https://github.com/user-attachments/assets/4eef272b-fda4-494f-9b46-751f45597b75)


## 🚀 Features

 - 🔎 Search by address, tx, block, or snapshot name

- 📈 Graph visualization using @xyflow/react

- ⚙️ Filtering by from, to, and action

- 💾 Snapshot saving and reloading support

- 🧠 Custom nodes with security-related info

## 🧱 Tech Stack

- **React 19 + Vite**
- **TypeScript**
- **Redux Toolkit Query** for API queries
- **React Flow (@xyflow/react)** for graph visualization
- **Tailwind CSS** 
- **Framer Motion** 
- **Radix UI** — dropdowns, tooltips
- **Lucide Icons**

## 🛠️ Install

```bash
# 1. Clone the repository
git clone https://github.com/DecodeFi/mvp-frontend.git
cd mvp-frontend

# 2. Install dependencies.
# Так как в зависимостях установлен React 19, есть конфликты, поэтому с флагом --legacy-peer-deps
 или npm install --legacy-peer-deps

# 3. Run the project
npm run dev

# Folder structure:
├── backend/
│   └── apiSlice.ts         # RTK Query endpoints
│
├── redux/
│   └── store.ts            # Redux store configuration
│
├── src/
│   ├── assets/             # Icons and visual assets
│   │
│   ├── components/
│   │   ├── graph-nodes/    # Graph node components (NodeHeader, etc.)
│   │   ├── graph-filters/  # UI filters for from/to addresses
│   │   ├── ContractTable/  # Address detail view
│   │   ├── Header/         # Page header
│   │   ├── SearchBar/      # Search input component
│   │   └── ui/             # Common UI components (Button, etc.)
│   │
│   ├── helpers/
│   │   ├── buildGraphFromData.ts     # Generate graph from traces
│   │   ├── buildGraphFromSnapshot.ts # Generate graph from snapshot
│   │   ├── detectSearchType.ts       # Determine input type
│   │   ├── truncateAddress.ts        # Address shortening utility
│   │
│   ├── hooks/
│   │   └── useBalance.ts    # Custom React hooks
│   │
│   └── lib/                # Shared libraries and utilities
│
├── pages/
│   └── GraphPage.tsx       # Main graph visualization component

