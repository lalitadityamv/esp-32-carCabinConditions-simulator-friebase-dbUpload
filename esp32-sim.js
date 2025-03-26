const admin = require("firebase-admin");
const fs = require("fs");


const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-database-url.firebaseio.com/" // Replace with your Firebase URL
});

const db = admin.database();
const ref = db.ref("car_environment_data");


function getRandomValue(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}


function getAirQualityStatus(value) {
  if (value < 50) return "Good";
  if (value < 100) return "Moderate";
  if (value < 150) return "Unhealthy for Sensitive Groups";
  if (value < 200) return "Unhealthy";
  if (value < 300) return "Very Unhealthy";
  return "Hazardous";
}


function sendSensorData() {
  const temperature = getRandomValue(20, 40); 
  const humidity = getRandomValue(30, 80); 
  const airQuality = getRandomValue(0, 300); 
  const airQualityStatus = getAirQualityStatus(airQuality); 

  const data = {
    temperature: parseFloat(temperature),
    humidity: parseFloat(humidity),
    air_quality: parseFloat(airQuality),
    status: airQualityStatus,
    timestamp: new Date().toISOString()
  };

  
  ref.set(data, (error) => {
    if (error) {
      console.error("❌ Failed to write data:", error);
    } else {
      console.log("✅ Data successfully sent to Firebase:", data);
    }
  });
}


setInterval(sendSensorData, 5000);
