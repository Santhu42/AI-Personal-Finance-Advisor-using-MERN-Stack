# 💰 AI Personal Finance Advisor (MERN Stack)

A full-stack web application built using the **MERN stack** that helps users understand and manage their personal finances.

Users can upload bank statements or manually add transactions, visualize spending patterns, and receive **AI-powered financial insights** such as category breakdowns, budget suggestions, and saving tips.

---

## 🚀 Live Demo

- **Frontend (Netlify)**  
  👉 https://vermillion-monstera-be6f4a.netlify.app

- **Backend API (Render)**  
  👉 https://ai-personal-finance-advisor-using-mern-usuh.onrender.com

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- Chart.js
- HTML5, CSS3
- Responsive UI

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (CSV File Uploads)
- OpenAI API (AI Insights)

### Deployment
- **Frontend:** Netlify  
- **Backend:** Render  
- **Database:** MongoDB Atlas  

---

## ✨ Features

- 🔐 Secure user authentication using JWT
- 📁 Upload CSV bank statements
- ✍️ Manual transaction entry
- 📊 Interactive charts for spending analysis
- 🧠 AI-powered financial insights
- 💡 Budget recommendations and saving tips
- 📱 Fully responsive design

---

## 📂 Project Structure
AI-Personal-Finance-Advisor/
├── client/ # React frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
├── server/ # Node + Express backend
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── index.js
│ └── package.json
---

## 🔑 Environment Variables

Create a `.env` file inside the **server** folder and add:

``env
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key


▶️ How to Run Locally
Backend
cd server
npm install
node index.js


Backend runs on:

http://localhost:5000

Frontend
cd client
npm install
npm start


Frontend runs on:

http://localhost:3000

🧪 API Endpoints
Authentication

POST /auth/register – Register user

POST /auth/login – Login user

Transactions

POST /transactions – Add transaction

GET /transactions – Fetch user transactions

AI Insights

GET /ai – Get AI-generated financial insights

📈 Sample AI Insights

Monthly spending summary

Category-wise expense analysis

Personalized saving recommendations

Budget optimization tips

📝 Sample CSV Format
date,description,amount,category
2024-01-05,Groceries,-1200,Food
2024-01-10,Salary,45000,Income
2024-01-15,Electricity Bill,-1800,Utilities

🔒 Security

Passwords hashed using bcrypt

JWT-based authentication

Protected API routes

Environment variables secured

🎯 Use Cases

Personal finance tracking

Expense analysis

Budget planning

AI-assisted financial decision making

📌 Future Enhancements

Expense prediction using ML

Multi-currency support

Export reports as PDF

Email alerts for overspending

Mobile app version

👨‍💻 Author

Santhiya Govindaraj
Aspiring Full Stack Developer | MERN Stack | Java | SQL

⭐ Acknowledgements

OpenAI API

MongoDB Atlas

Render & Netlify

Chart.js

