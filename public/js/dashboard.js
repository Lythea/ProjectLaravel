function scrollToCategory(category) {
    // Get the content section ID
    const contentId = `${category}-content`;
    const contentSection = document.getElementById(contentId);
    
    if (contentSection) {
        // Scroll to the content section
        contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add click event listeners to all categories
document.querySelectorAll('.category').forEach(item => {
    item.addEventListener('click', event => {
        scrollToCategory(event.target.id);
    });
});
const games = [
    { name: "NightCrows", imgSrc: "assets/NC.webp", url: "http://127.0.0.1:8000/nightcrows" },
    { name: "Valorant", imgSrc: "assets/Valorant.webp", url: "https://example.com/valorant" },
    { name: "Dota 2", imgSrc: "assets/Dota2.jpg", url: "https://example.com/dota2" },
    { name: "League of Legends", imgSrc:"assets/LoL.png", url: "https://example.com/leagueoflegends" },
    { name: "Toram Online", imgSrc:"assets/Toram.png", url: "https://example.com/toram" },
    { name: "Genshin Impact", imgSrc:"assets/genshin.jpg", url: "https://example.com/genshin" },

    // Add more games as needed
];

function displayGames() {
    const gamesContainer = document.getElementById("games-container");
    gamesContainer.innerHTML = ''; // Clear existing content

    games.forEach(game => {
        gamesContainer.innerHTML += `
            <div class="game-box">
                <a href="${game.url}" target="_blank" rel="noopener noreferrer">
                    <img src="${game.imgSrc}" alt="${game.name}">
                    <p>${game.name}</p>
                </a>
            </div>
        `;
    });
}

// Call the function to display games when needed
displayGames();
