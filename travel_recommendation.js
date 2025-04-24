
let travelData = null; // Store fetched data globally

document.addEventListener("DOMContentLoaded", () => {
  fetch("./travel_recommendation_api.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to load JSON");
      return response.json();
    })
    .then(data => {
      travelData = data;
      console.log("Fetched data:", travelData); // 👀 Check the output here
      const allPlaces = [
        ...data.countries.flatMap(country => country.cities),
        ...data.temples,
        ...data.beaches
      ];
      showRecommendations(allPlaces); // 👈 this is what was missing
      
      
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });

  document.getElementById("btnSearch").addEventListener("click", () => {
    const keyword = document.getElementById("input").value.trim().toLowerCase();
    if (!keyword) return;

    const results = getMatchingRecommendations(keyword);
    showRecommendations(results);
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    document.getElementById("input").value = "";
    removeOldRecommendations();
  });
});

function getMatchingRecommendations(keyword) {
  if (!travelData) return [];

  const allPlaces = [
    ...travelData.countries.flatMap(country => country.cities),
    ...travelData.temples,
    ...travelData.beaches
  ];

  // Check for keyword matches
  return allPlaces.filter(place => {
    const name = place.name.toLowerCase();
    const desc = place.description.toLowerCase();

    return (
      name.includes(keyword) ||
      desc.includes(keyword) ||
      (keyword === "temple" || keyword === "temples") && desc.includes("temple") ||
      (keyword === "beach" || keyword === "beaches") && desc.includes("beach") ||
      travelData.countries.some(c => c.name.toLowerCase() === keyword && c.cities.some(city => city.name === place.name))
    );
  });
}

function showRecommendations(places) {
  const container = document.getElementById("recommendation-container");
  container.innerHTML = ""; // Clear previous

  if (places.length === 0) {
    container.innerHTML = "<p>No results found for your search.</p>";
    return;
  }

  places.slice(0, 6).forEach(place => {
    const card = document.createElement("div");
    card.className = "recommendation-card";
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(place.name + ' travel guide')}`;

    card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      <a href="${googleSearchUrl}" target="_blank" id="btnV">View Details</a>
    `;
    container.appendChild(card);
  });
}
document.getElementById("btnSearch").addEventListener("click", () => {
  const query = document.getElementById("input").value.trim().toLowerCase();
  const filtered = destinations.filter(place =>
    place.name.toLowerCase().includes(query) ||
    place.description.toLowerCase().includes(query)
  );
  showRecommendations(filtered);
});


view

// Function to remove old recommendations
function removeOldRecommendations() {
  const oldSection = document.querySelector(".travel-recommendations");
  if (oldSection) oldSection.remove();
}
 //reset function
 function resetForm(){
  document.getElementById("input").value = ""; // Clear the input field
  removeOldRecommendations(); // Remove old recommendations
  document.getElementById("recommendation-container").innerHTML = ""; // Clear the recommendation container
  document.getElementById("recommendation-container").style.display = "none"; // Hide the recommendation container
 }
