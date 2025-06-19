# Quintech DataChat Translator (Powered by Firebase Studio & Genkit)

This is a Next.js application bootstrapped with Firebase Studio, designed to translate natural language queries into SQL or SAP HANA queries and visualize the results. It leverages Genkit for AI capabilities and ShadCN UI components for a modern user interface.

## Features

*   Natural language to SQL/HANA translation.
*   Data fetching from SQL Server or SAP HANA (requires configuration).
*   Multiple data visualization options: Table, Chart, and AI-generated Summary.
*   Built with Next.js (App Router), React, Tailwind CSS.
*   AI functionalities powered by Genkit.

## Getting Started

First, ensure you have Node.js (version 20 or higher) and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add your database connection details and any necessary API keys for Genkit (e.g., Google AI). Refer to the placeholder comments in `src/ai/flows/natural-language-to-sql.ts` and `src/ai/flows/natural-language-to-hana.ts` for required environment variables like:
    *   `SQLSERVER_HOST`
    *   `SQLSERVER_USER`
    *   `SQLSERVER_PASSWORD`
    *   `SQLSERVER_DATABASE`
    *   `SQLSERVER_PORT` (optional)
    *   `SQLSERVER_ENCRYPT` (optional)
    *   `SQLSERVER_TRUST_SERVER_CERTIFICATE` (optional)
    *   `HANA_HOST`
    *   `HANA_PORT`
    *   `HANA_USER`
    *   `HANA_PASSWORD`
    *   `GOOGLE_API_KEY` (or similar, depending on your Genkit AI provider)


4.  **Run the development server:**
    The application uses two development servers: one for the Next.js frontend and one for Genkit flows.

    In one terminal, run the Next.js dev server:
    ```bash
    npm run dev
    ```
    This will typically start the frontend on `http://localhost:9002`.

    In another terminal, run the Genkit dev server:
    ```bash
    npm run genkit:dev
    ```
    Or for auto-reloading on Genkit flow changes:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit development UI, usually on `http://localhost:4000`.

5.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the application.

## Key Project Files

*   `src/app/page.tsx`: The main page component.
*   `src/app/actions.ts`: Server Actions for handling form submissions and AI calls.
*   `src/ai/flows/`: Contains the Genkit AI flow definitions.
    *   `natural-language-to-sql.ts`: Translates natural language to SQL and executes queries.
    *   `natural-language-to-hana.ts`: Translates natural language to HANA SQL and executes queries.
    *   `data-summarization.ts`: Summarizes query results using AI.
*   `src/components/data-chat/`: UI components for the query input, results display, table, chart, and summary views.
*   `src/ai/genkit.ts`: Genkit global instance configuration.
*   `public/`: Static assets.
*   `globals.css`: Global styles and Tailwind CSS theme configuration.
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `next.config.ts`: Next.js configuration.

## Publishing

This project includes a GitHub Actions workflow (`.github/workflows/npm-publish-github-packages.yml`) to publish the package to GitHub Packages when a new release is created on GitHub.

To publish manually or to another registry, ensure you have updated `package.json` appropriately and use:
```bash
npm publish
```

## Learn More

*   [Next.js Documentation](https://nextjs.org/docs)
*   [Genkit Documentation](https://firebase.google.com/docs/genkit)
*   [ShadCN UI](https://ui.shadcn.com/)
*   [Tailwind CSS](https://tailwindcss.com/)

This project was initiated using Firebase Studio.
```