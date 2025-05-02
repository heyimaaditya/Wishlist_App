# Live Link =  https://shared-wishlist-app-50338.web.app

# Shared Product Wishlist App

A full-stack application allowing multiple users to create shared wishlists and manage products collaboratively in real-time.

## Features

*   **User Authentication:** Secure signup and login using Firebase Authentication (Email/Password). Users are redirected after successful authentication.
*   **Wishlist Management:**
    *   Create new wishlists.
    *   View all wishlists associated with your account (currently only lists you create).
    *   View details of a specific wishlist.
    *   Update wishlists (name, description - only by owner).
    *   Delete wishlists (only by owner).
*   **Product Management:**
    *   Add products (name, price, optional image URL) to a wishlist.
    *   View all products within a wishlist.
    *   See who added each product (via email).
    *   Update products (name, price, image URL - only by the user who added it).
    *   Delete products (only by the user who added it).
*   **Bonus: Real-time Sync:** Product lists update in real-time for all viewers of a wishlist using Firebase Realtime Database listeners.
*   **Basic Styling:** Simple, clean UI using styled-components.

## Tech Stack

*   **Frontend:** React, React Router DOM, Firebase JS SDK (Auth, Realtime Database), Styled Components, Vite
*   **Backend:** Node.js, Express.js, CORS, Body-Parser, Firebase Admin SDK, dotenv
*   **Database:** Firebase Realtime Database
*   **Authentication:** Firebase Authentication (Email/Password)

## Setup

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url> shared-wishlist-app
    cd shared-wishlist-app
    ```
2.  **Firebase Project Setup:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   Enable **Authentication** -> **Get started** -> **Email/Password** provider.
    *   Enable **Realtime Database** -> **Create Database**. Choose a location and start in **test mode** for development.
        *   **IMPORTANT:** For production, you *must* update your RTDB Security Rules (e.g., to allow read/write only for authenticated users, or ideally, only for members of a specific wishlist). The current "test mode" rules are insecure for production.
    *   **For Frontend:** Add a **Web app** to your Firebase project. Follow the steps and copy the `firebaseConfig` object. You will need the `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId`. You will also need your `databaseURL`, which is typically `https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com`.
    *   **For Backend:** Go to **Project settings** (gear icon) -> **Service accounts**. Click **Generate new private key**. This downloads a JSON file (e.g., `your-project-id-firebase-adminsdk-xxxxx-abcdefg123.json`). **Keep this file secure and outside your Git repository.** Note down the **absolute path** to this file on your system.
3.  **Backend Configuration:**
    *   Navigate into the `backend` directory: `cd backend`
    *   Install dependencies: `npm install`
    *   Create a `.env` file in the `backend` directory and add the following, replacing the placeholders with your details:
        ```env
        # Absolute path to your Firebase Service Account Key JSON file
        GOOGLE_APPLICATION_CREDENTIALS='/absolute/path/to/your/serviceAccountKey.json'
        FIREBASE_DATABASE_URL='https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com'
        PORT=5000 # Default backend port
        FRONTEND_URL='http://localhost:5173' # Your frontend URL (Vite default)
        ```
        *Ensure the path to the JSON file is correct for your system.*
    *   Ensure the `scripts` section in `backend/package.json` includes a `start` script: `"start": "node server.js"`.
4.  **Frontend Configuration:**
    *   Navigate into the `frontend` directory: `cd ../frontend`
    *   Install dependencies: `npm install`
    *   Create a `.env` file in the `frontend` directory and add the following, replacing the placeholders with values from your Firebase Web App config:
        ```env
        VITE_FIREBASE_API_KEY='YOUR_API_KEY'
        VITE_FIREBASE_AUTH_DOMAIN='YOUR_AUTH_DOMAIN'
        VITE_FIREBASE_PROJECT_ID='YOUR_PROJECT_ID'
        VITE_FIREBASE_STORAGE_BUCKET='YOUR_STORAGE_BUCKET' # Add if present in config
        VITE_FIREBASE_MESSAGING_SENDER_ID='YOUR_MESSAGING_SENDER_ID' # Add if present in config
        VITE_FIREBASE_APP_ID='YOUR_APP_ID'
        VITE_FIREBASE_DATABASE_URL='https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com' # Use your Project ID
        ```
5.  **Install Root Dependencies:**
    *   Navigate back to the project root: `cd ..` (if you are in `frontend`)
    *   Run `npm install` if you had any root-level dependencies (not strictly needed for this structure, but good practice).

## How to Run

1.  **Start Backend:** Open a terminal, navigate to the `backend` directory, and run:
    ```bash
    npm start
    ```
2.  **Start Frontend:** Open a **separate** terminal, navigate to the `frontend` directory, and run:
    ```bash
    npm run dev
    ```
3.  Your browser should open to `http://localhost:5173` (or the address shown by Vite).

## How to Use

1.  Sign up for a new account or log in if you already have one. You will be automatically redirected to the homepage/dashboard after successful authentication.
2.  On the dashboard, you'll see your wishlists. Click "Create New Wishlist" to add a new one.
3.  Click on a wishlist card to view its details.
4.  On the wishlist details page, click "Add Product" to add an item. Fill in the name, price, and optional image URL.
5.  Products you add will show "Edit" and "Delete" buttons. Click "Edit" to open the edit modal or "Delete" to remove the item (confirmation required).
6.  From the homepage, wishlists you own will have a "Delete" button.

## Assumptions & Limitations

*   **Invitation System:** The feature to invite others to a wishlist is not implemented. Wishlists are currently only directly managed by the creator. Implementing a shared model would require adding `members` nodes to wishlists, UI for invitations (e.g., by email or shareable link), and adjusting backend access checks and RTDB security rules.
*   **Access Control:** Basic access control is implemented for updating/deleting wishlists (only owner) and products (only adder). A full multi-user shared wishlist app would need more granular permissions based on membership.
*   **Styling:** The styling is functional but basic. Further styling and responsiveness improvements would be needed for a production-ready application across all devices.
*   **Firebase Security Rules:** The Realtime Database rules are set to `test mode` (`.read`: true, `.write`: true), which is highly insecure. **You must configure proper security rules** to protect your data. Rules should at minimum enforce authentication and ideally restrict read/write access based on wishlist ownership or membership.
*   **Error Handling:** Basic error display is present in the UI (alerts, messages), but more sophisticated handling (e.g., form validation messages, dedicated error pages, user-friendly API error messages) could be added.
*   **Loading States:** Basic "Loading..." messages are used. UI improvements could include spinners, disabled buttons during requests, etc.
*   **Offline Support:** No specific offline capabilities are implemented.
*   **Data Validation:** Basic validation is done on the backend, but more robust validation and sanitization are recommended.


## Future Improvements & Scaling

*   **Implement Wishlist Sharing:** Add database structure for members, backend endpoints for inviting/managing members, and frontend UI for sending/accepting invitations. Update security rules.
*   **Roles and Permissions:** Introduce different roles (owner, editor, viewer) with varying levels of access to wishlists and products.
*   **Enhanced UI/UX:** Improve styling, responsiveness, add animations, implement a more robust modal system, add infinite scrolling for long product lists, etc.
*   **Collaboration Features:** Add comments on products, emoji reactions, an activity feed showing changes within a wishlist.
*   **Product Details:** Expand the product schema to include quantities, links to retailers, notes, status (e.g., "Pending", "Purchased", "Claimed").
*   **Notifications:** Implement notifications for wishlist updates (e.g., new product added).
*   **Search and Filtering:** Add functionality to search within wishlists or across all wishlists.
*   **State Management:** For more complex state interactions, consider libraries like Zustand, Redux, or TanStack Query (React Query) for improved data fetching, caching, and state management.
*   **Backend Deployment:** Deploy the Node.js backend to a cloud platform (Heroku, Vercel, AWS Elastic Beanstalk, etc.) and use environment variables for secure configuration.
*   **Testing:** Add unit, integration, and end-to-end tests.
*   **Alternative Database:** While RTDB is great for real-time, for very large applications or complex query patterns, consider Firestore or a relational database (like PostgreSQL) with a separate mechanism (like WebSockets) for real-time updates if needed.

---
