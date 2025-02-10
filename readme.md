# Movie Ticket Booking System -- Project for beginners 

A simple web application for booking movie tickets. This application provides a frontend interface for users to browse movies, view showtimes, book seats, and check booking details. The backend is built with Node.js and Express, using SQLite for data storage.

![Booking Interface Screenshot](images/main.png)

## Instructions to Run the Application

Before you begin, ensure you have **Node.js and npm (Node Package Manager)** installed on your system. You can download them from [https://nodejs.org/](https://nodejs.org/).

**Steps to Run:**

1.  **Navigate to the Project Directory:**
    Open your terminal or command prompt and navigate to the root directory of your project where `server.js`, `package.json`, and `index.html` are located.

    ```bash
    cd path/to/your/project/directory
    ```
    *(Replace `path/to/your/project/directory` with the actual path to your project folder.)*

2.  **Install Server-Side Dependencies:**
    Run the following command in your terminal to install the Node.js dependencies listed in `package.json`:

    ```bash
    npm install
    ```
    This command will create a `node_modules` folder in your project directory and download all the necessary packages (like `express`, `sqlite3`).

3.  **Run the Server:**
    Start the Node.js server by running:

    ```bash
    node server.js
    ```
    You should see a message in your terminal indicating that the server is running, for example: `App is running successfully at port 3000`.

4.  **Access the Frontend in Your Browser:**
    Open your web browser (like Chrome, Firefox, Safari) and go to the following URL:

    ```
    http://localhost:3000
    ```
    This will open the frontend of your Movie Ticket Booking System.

**Using the Application:**

*   **Movie Management:** (If implemented in your frontend) You can add, view, and remove movies.
*   **Show Management:** (If implemented) You can manage movie showtimes and theater assignments.
*   **Ticket Booking:** Browse available shows, select seats, and book tickets.
*   **Check Booking:** Use your booking ID to view your booking details.

**Database:**

The application uses an SQLite database file named `MovieSystem.db` located in the root of the project directory.

**Note:**

*   Ensure that Node.js server is running while you are using the web application.
*   If you make changes to the server-side code (`server.js` or other Node.js files), you will need to restart the server for the changes to take effect (usually by stopping the server with `Ctrl+C` in the terminal and then running `node server.js` again).

---

**Remember to:**

*   Create these two files (`.gitignore` and `README.md`) in the root directory of your project.
*   Adjust the `README.md` content further if you want to add more details about your project, features, or contribution guidelines.

These files will help you manage your project with Git and provide clear instructions for anyone who wants to run your application.