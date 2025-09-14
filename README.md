# Mini Seller Console

A responsive, client-side single-page application (SPA) built with Next.js and TypeScript, designed as a lightweight console to triage and manage sales leads. The application allows users to view, filter, sort, edit, and convert leads into opportunities. All data and UI states are persisted in the browser's Local Storage, making it a fully client-side experience.

## Features

- **Lead Management**: View a comprehensive list of leads in a user-friendly, responsive table.
- **Dynamic Search & Filter**: Search leads by name or company and filter by status in real-time.
- **Advanced Sorting**: Organize the lead list by name, status, or score in ascending or descending order.
- **Pagination**: Efficiently navigate through large volumes of data.
- **Lead Details Panel**: Click on a lead to open a side panel with detailed information and actions.
- **Data Editing**: Modify a lead's email and status directly within the details panel.
- **Lead Conversion**: Convert qualified leads into sales opportunities with a single click.
- **Opportunity Tracking**: View all created opportunities in a dedicated tab.
- **Data Persistence**: All changes, including leads, opportunities, and UI state (filters, sorting, active tab), are saved to `localStorage`.
- **Responsive Design**: A fully functional and adaptive interface for both desktop and mobile devices.
- **Notifications**: Visual feedback via toasts for actions like saving or converting a lead.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14+ (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

## Getting Started

Follow the instructions below to set up and run the project in your local development environment.

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

## Architecture and Applied Concepts

This project was architected to be scalable, readable, and maintainable by applying solid software engineering principles.

### Directory Structure

src
├── app
│ ├── components/ # React components, organized by feature
│ │ ├── leads/
│ │ ├── opportunities/
│ │ ├── layout/
│ │ └── ui/ # Generic, reusable UI components
│ ├── hooks/ # Custom hooks for reusable logic
│ ├── services/ # Service layer to simulate API calls
│ └── ... # Next.js pages and layouts
├── lib/ # Utility functions, types, and error classes
└── public/
└── data/ # Static data (e.g., leads.json)

### Engineering Concepts

- **Separation of Concerns**:

  - **Custom Hooks**: Business logic, such as managing the leads' state (filtering, sorting, pagination), is abstracted into the `useLeads` hook. This keeps UI components clean and focused solely on presentation.
  - **Service Layer**: Data interaction is isolated in the `services` folder. The `ApiService` abstract class defines a contract that makes it easy to replace the current simulation with a real API in the future without impacting the rest of the application.

- **SOLID Principles**:

  - **S (Single Responsibility Principle)**: Each component and hook has a single responsibility. For example, `Pagination` only handles page navigation, while `useDebounce` has the sole purpose of delaying a state update.
  - **O (Open/Closed Principle)**: The `ApiService` is open for extension (new services like `LeadServiceAPI` can inherit from it) but closed for modification.
  - **I (Interface Segregation Principle)**: Component props are specific to what they need, preventing dependencies on unnecessary props.

- **DRY (Don't Repeat Yourself)**:
  - The creation of generic UI components like `EditableField` and `Label` in `src/app/components/ui` allows them to be reused across different parts of the application, avoiding code duplication and ensuring visual consistency.
  - Hooks like `useLocalStorage` and `useClickOutside` encapsulate complex logic that is used by multiple components.
