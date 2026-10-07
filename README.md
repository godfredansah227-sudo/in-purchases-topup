# IN-PURCHASES TOP-UP

> **IN-PURCHASES TOP-UP** is an advanced, high-performance in-game item purchasing platform for mobile games. Built for manual payment verification via **Telecel Mobile Money**, with **Neon PostgreSQL** database storage, **Node.js/Express** & **PHP** backend logic, and deployment configurations for **Render** and **GitHub**.

---

## 🎮 Supported Mobile Games & In-Game Items

| Game Title | Available Top-Up Items |
| :--- | :--- |
| **FC Mobile** | FC Points (40 - 12,000 FC Points) & FC Silver Packs *(Cleaned: Daily deals, supply cards, event passes, numero event & players removed as requested)* |
| **Modern Warships: Naval Battle** | Gold (500 - 7,500), Dollars ($1M), VIP Battle Pass, Platinum Supply Crate |
| **Delta Force** | Delta Coins (60 - 980), Warfare Supply Crate, Tactical Battle Pass |
| **Garena Delta Force** | Garena Shells (100 - 1,000), Tactical Points Pack |
| **War Planet Online** | Medals (500 - 2,000), Global Energy Pack, Commander VIP Pass |
| **Blood Strike** | Gold Coins (100 - 1,000), Strike Pass, Blood Gems Crate |
| **Arena Breakout Garena** | Bonds (60 - 1,000), Tactical Extraction Crate, Elite Battle Pass |
| **Garena Undawn** | RC Credits (100 - 1,000), Survivor Growth Fund |

---

## 📱 Telecel Mobile Money Payment Specifications

- **Provider**: Telecel Mobile Money
- **Target Number**: `0205438685`
- **Recipient Name**: `Godfred Ansah` (*Strictly restricted to display ONLY on the Transaction Payment page step*)
- **Flow**: Customer selects game package &rarr; enters Player ID & contact details &rarr; receives Telecel payment instructions & recipient name &rarr; transfers exact amount to `0205438685` &rarr; copies Transaction Reference Number &rarr; submits order &rarr; saved in Neon PostgreSQL &rarr; Administrator manually verifies payment & credits Player ID.

---

## 🚀 Step-by-Step GitHub, Neon & Render Setup Guide

### 1️⃣ Step 1: Set Up Neon PostgreSQL Database

1. Go to [neon.tech](https://neon.tech) and create a free account.
2. Click **Create Project** and name it `in-purchases-topup`.
3. Select your preferred region (e.g. AWS US East or Europe).
4. In the Neon dashboard, navigate to **Connection Details**.
5. Copy your PostgreSQL connection string:
   ```text
   postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
6. *(Optional)* Go to the Neon **SQL Editor** tab, paste the contents of `database.sql` from this repository, and click **Run** to pre-create the tables. (Note: The server will also auto-create tables on startup if they don't exist).

---

### 2️⃣ Step 2: Push Repository to GitHub

1. Open your terminal or PowerShell inside this directory:
   ```bash
   cd "c:\Users\DELL\OneDrive\Desktop\FC SITE"
   ```
2. Initialize Git and commit all project files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of IN-PURCHASES TOP-UP multi-game topup store"
   ```
3. Create a new repository on [GitHub](https://github.com/new) named `in-purchases-topup`.
4. Link your local project to GitHub and push:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/in-purchases-topup.git
   git branch -M main
   git push -u origin main
   ```

---

### 3️⃣ Step 3: Deploy Live Website on Render

1. Log in to [render.com](https://render.com).
2. Click **New +** &rarr; **Web Service**.
3. Connect your GitHub account and select your repository (`in-purchases-topup`).
4. Configure the service settings:
   - **Name**: `in-purchases-topup`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL` = *(Your Neon PostgreSQL connection string from Step 1)*
   - `ADMIN_PASSWORD` = `admin123` *(or your custom admin passcode)*
   - `PORT` = `10000`
6. Click **Create Web Service**.
7. Render will build and deploy your application. You will get a live HTTPS URL (e.g., `https://in-purchases-topup.onrender.com`).

---

## 🛠 Local Development Instructions

To test locally on your computer:

1. Install Node.js (v18 or newer recommended).
2. Open terminal in project folder:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm start
   ```
4. Open browser and visit: `http://localhost:3000`
5. Access Admin panel at: `http://localhost:3000/admin.html` (Passcode: `admin123`).

---

## 🔒 Security & Verification Features

- **Input Sanitization**: Server-side validation rejecting empty Player IDs or invalid Telecel transaction references.
- **Privacy Enforcement**: Recipient name `Godfred Ansah` is shielded from public website headers/footers and only displayed on the checkout transaction page.
- **Neon Cloud Security**: Environment variable isolation prevents credentials from leaking into Git.
- **Admin Authentication**: Passcode-protected administration dashboard for manual order verification and status management.
