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
      const message = `🚨 Emergency Alert!\nLocation: ${mapsLink}\nImmediate help needed!`;

      // Option: WhatsApp
      window.open(`https://wa.me/917349169426?text=${encodeURIComponent(message)}`);

      // Option: Email fallback
      // window.location.href = `mailto:emergency@hospital.com?subject=Emergency Alert&body=${encodeURIComponent(message)}`;
    }, error => {
      statusEl.innerText = "⚠️ Unable to get location.";
      // fallback message
      const message = "🚨 Emergency! Location access denied. Please check manually.";
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    });
  } else {
    statusEl.innerText = "⚠️ Geolocation not supported.";
    const message = "🚨 Emergency! Location not available.";
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  }
}
