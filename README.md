# Stubsit: A Simple API Stubbing Server

Stubsit is a lightweight, easy-to-use API stubbing server built to streamline your development process. It allows you to quickly set up mock API endpoints with custom responses, powered by Supabase for data persistence. This is perfect for front-end developers who need to simulate a backend for development and testing without waiting for the actual API to be ready.

## 🧑‍💻 Author

* Muhammad **Hafidz** Hubbusysyuhada: [GitHub](https://github.com/hubbusysyuhada) | [LinkedIn](https://www.linkedin.com/in/hubbusysyuhada/)

---

## ✨ Features

* **Dynamic API Stubbing:** Create and manage custom API endpoints.

* **Supabase Integration:** All your stub data is persisted in a Supabase database, ensuring your mock data is saved between sessions.

* **Environment-based Configuration:** Simple setup using a `.env` file for all your sensitive credentials and settings.

* **CORS Support:** Easily configure allowed domains for your dashboard or client applications.

---

## 🚀 Getting Started

Follow these steps to get Stubsit up and running on your local machine. This project requires **Node.js version 22** or higher.

### 1. Create a Supabase Project

First, you'll need a new project on [Supabase](https://supabase.com). Sign up or log in, then create a new project. Remember your project URL and API keys, as you'll need them in the next step.

### 2. Configure Your Environment

Create a new file named `.env` in the root of your project. Copy the contents of the `.env.example` file and fill in the values with your own information.
```
NODE_ENV=development
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ID=<your-project-ref>
SUPABASE_TOKEN=<your-anon-or-service-key>
MASTER_SECRET=a_secure_random_string_here
DASHBOARD_DOMAIN=http://localhost:3000
PORT=3001
```

* `NODE_ENV`: Set to `development` or `production`.

* `SUPABASE_URL`: Your Supabase project URL.

* `SUPABASE_ID`: Your unique project reference from Supabase.

* `SUPABASE_TOKEN`: Use either your `anon` key or `service_role` key.

* `MASTER_SECRET`: A random, secure string used for authentication or hashing.

* `DASHBOARD_DOMAIN`: The domain of your front-end dashboard to allow CORS.

* `PORT`: The port on which your server will run.

### 3. Set Up the Database Schema

Navigate to the `SQL Editor` in your Supabase dashboard. You need to create the necessary tables and schemas for the server to function.

1. Open the file [`./supabase/supabase-dump.sql`](https://github.com/hubbusysyuhada/stubsit/blob/master/supabase/supabase-dump.sql) from this repository.

2. Copy all the SQL queries from the file.

3. Paste the queries into the Supabase SQL editor.

4. Run the queries to create your database tables.

### 4. Run the Server

Once your environment variables are set and the database is configured, you're ready to start the server.
```
Install dependencies
npm install

Start the server for development
npm run dev

Or for a production environment
npm run start-production
```

The server will now be listening on the port you specified in your `.env` file.

---

## 🤝 Usage

Once the server is running, you can start creating and interacting with your API stubs. The specifics of how to do this will depend on the API endpoints you've built into the server. Typically, you would send `POST` requests to create new stubs and `GET` requests to retrieve them.

You can see a live example of this project here: [**stubsit.vercel.app**](https://stubsit.vercel.app).

---

## 🧾 License

This project is licensed under the **MIT License**.