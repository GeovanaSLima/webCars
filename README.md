# Web Cars System

</br>

<a href="https://web-cars-ge.netlify.app/">
  <img src="https://img.shields.io/badge/-Access%20Website-%23e11138?style=for-the-badge" alt="Demo">
</a>

</br>
</br>

![webCars homepage](https://github.com/user-attachments/assets/8ca86e9b-3952-4dc1-8cfb-cecb7756ae80)


## Project Description

WebCars is a web platform where users can explore and post used cars for sale. The system is designed to simplify the process of buying and selling vehicles by providing an intuitive interface, robust features, and seamless communication tools.

</br>

## 🚀 Features

* Authentication System: Secure user authentication for posting and managing ads.

* Post Cars for Sale: Easily list used cars with details like price, model, year, and images.

* Search Dashboard: Search for cars using various filters like price range, make, model, and more.

* Contact Dealers: Directly connect with sellers via WhatsApp through integrated API support.

* Responsive Design: Optimized for desktop and mobile users.


</br>

## 💻 Tech Stack

* Frontend: ReactJS (with Vite for development)

* Backend: Firebase (Authentication, Firestore Database)

* Styling: CSS Modules / TailwindCSS

* APIs: WhatsApp API for dealer communication

## 🔨 Installation and Setup

1. Clone the repository:

```bash
$ git clone https://github.com/your-username/webCars.git
```

2. Navigate to the project directory:

```bash
cd webCars
```

3. Install the dependencies:

```bash
$ npm install
```

4. Create a .env file in the root directory and add your Firebase configuration:

```.env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_WHATSAPP_API_URL=your_whatsapp_api_url
```

5. Start the development server:

```bash
$ npm run dev
```

6. Open your browser and visit `http://localhost:3000`.


</br>

## 💻 Usage

1. Sign Up / Log In: Register or log in to access the full features of the platform.

2. Add a Car: Navigate to the dashboard and click on "Add Car" to post your vehicle for sale.

3. Search Cars: Use the search dashboard to find cars that meet your requirements.

4. Contact Dealers: Click the "Contact Seller" button to initiate a conversation via WhatsApp.
