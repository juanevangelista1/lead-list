# Mini Seller Console

A responsive, client-side single-page application (SPA) built with Next.js and TypeScript, designed as a lightweight console to triage and manage sales leads. The application allows users to view, filter, sort, edit, and convert leads into opportunities. All data and UI states are persisted in the browser's Local Storage, making it a fully client-side experience.

## Features

- **Lead Management**: View a comprehensive list of leads in a user-friendly, responsive table.
- **Dynamic Search & Filter**: Search leads by name or company and filter by status in real-time with debouncing.
- **Advanced Sorting**: Organize the lead list by name, status, or score.
- **Pagination**: Efficiently navigate through large volumes of data.
- **Lead Details Panel**: Click on a lead to open an accessible side panel with detailed information and actions.
- **Data Editing**: Modify a lead's email and status directly within the details panel.
- **Lead Conversion**: Convert qualified leads into sales opportunities.
- **Opportunity Tracking**: View all created opportunities in a dedicated tab.
- **Data Persistence**: All changes, including leads, opportunities, and UI state (filters, sorting, active tab), are saved to `localStorage`.
- **Dark/Light Mode**: Full support for system preference or manual toggling of color themes.
- **Responsive Design**: A fully functional and adaptive interface for both desktop and mobile devices.
- **Notifications**: Visual feedback via toasts for actions like saving or converting a lead.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14+ (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks (`useState`, `useMemo`, `useCallback`) + `useLocalStorage` (custom hook)
- **UI**: [Lucide React](https://lucide.dev/) (Icons), [React Toastify](https://fkhadra.github.io/react-toastify/introduction) (Notifications)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Utilities**: [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation and Running

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/mini-seller-console.git](https://github.com/your-username/mini-seller-console.git)
   ```
2. **Navigate to the project directory:**
   ```bash
   cd mini-seller-console
   ```
3. **Install the dependencies:**
   ```bash
   npm install
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Architecture and Core Principles

This project was architected to be scalable, readable, and maintainable by applying solid software engineering principles.

### Directory Structure (Simplified)
