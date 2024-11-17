const API_URL = "https://api.coingecko.com/api/v3/simple/price";
let intervalId; 
let isPaused = false;


const ctx = document.getElementById("liveChart").getContext("2d");
const liveChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], 
    datasets: [
      {
        label: "Price (USD)",
        data: [], 
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
        beginAtZero: false,
      },
    },
  },
});


const fetchCryptoPrice = async (crypto) => {
  try {
    const response = await fetch(`${API_URL}?ids=${crypto}&vs_currencies=usd`);
    const data = await response.json();
    const price = data[crypto].usd;
    const time = new Date().toLocaleTimeString();

   
    if (!isPaused) updateChart(time, price);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


const updateChart = (time, price) => {
  
  liveChart.data.labels.push(time);
  liveChart.data.datasets[0].data.push(price);

  
  if (liveChart.data.labels.length > 10) {
    liveChart.data.labels.shift();
    liveChart.data.datasets[0].data.shift();
  }

 
  liveChart.update();

  
  anime({
    targets: liveChart.data.datasets[0].data,
    easing: "easeInOutQuad",
    duration: 500,
  });
};


const startLiveUpdates = (crypto) => {
  clearInterval(intervalId);
  intervalId = setInterval(() => fetchCryptoPrice(crypto), 5000);
};


document.getElementById("cryptoSelector").addEventListener("change", (event) => {
  const selectedCrypto = event.target.value;
  startLiveUpdates(selectedCrypto);
});

document.getElementById("pauseButton").addEventListener("click", () => {
  isPaused = !isPaused;
  document.getElementById("pauseButton").textContent = isPaused ? "Resume" : "Pause";
});


startLiveUpdates("bitcoin");
