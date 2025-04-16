// Pre-declared user info
const userData = {
  name: "Deepika",
  age: "20",
  phone: "7795198655",
  family: "6363272297"
};

const keywords = ["help", "emergency"];
const statusEl = document.getElementById("status");

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();
  statusEl.innerText = "🎧 Listening for emergency keywords...";

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    statusEl.innerText = `You said: "${transcript}"`;

    if (keywords.some(word => transcript.includes(word))) {
      statusEl.innerText = "🚨 Emergency detected! Sending alert...";
      sendAlertWithLocation();
    } else {
      statusEl.innerText = "✅ No emergency keyword detected.";
    }
  };

  recognition.onerror = function(event) {
    statusEl.innerText = `❌ Error: ${event.error}`;
  };
}

function sendAlertWithLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

      const message = `🚨 Emergency Alert!\n\n` +
                      `Name: ${userData.name}\n` +
                      `Age: ${userData.age}\n` +
                      `Phone: ${userData.phone}\n` +
                      `Family Contact: ${userData.family}\n` +
                      `Location: ${mapsLink}\n` +
                      `Immediate help needed!`;

      // Send via WhatsApp
      window.open(`https://wa.me/917349169426?text=${encodeURIComponent(message)}`);
    }, error => {
      statusEl.innerText = "⚠️ Unable to get location.";
    });
  } else {
    statusEl.innerText = "⚠️ Geolocation not supported.";
  }
}
