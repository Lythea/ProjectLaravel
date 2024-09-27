const caves = [
    { id: 1, name: "Cave 1", location: "Tigdal", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 2, name: "Cave 2", location: "Gatphillian", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 3, name: "Cave 3", location: "Modi", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 4, name: "Cave 3", location: "Hotura", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 5, name: "Cave 4", location: "Panderre", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 6, name: "Cave 4", location: "Stormid", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 7, name: "Cave 5", location: "Maltanis", respawnTimeHours: 15, respawnTimeMinutes: 50 },
    { id: 8, name: "Cave 6", location: "Dardaloca", respawnTimeHours: 15, respawnTimeMinutes: 50 },
    { id: 9, name: "Battlefront", location: "KoD", respawnTimeHours: 23, respawnTimeMinutes: 50 },
    { id: 10, name: "Special Battlefront", location: "RK", respawnTimeHours: 23, respawnTimeMinutes: 50 }
];

const tbody = document.getElementById('caves-body');
const emergencyCountdownDisplay = document.getElementById('countdown-display');
let countdownIntervals = {}; // Store countdown intervals for each cave
let isAlarmActive = false; // Global variable to track alarm status

// Initialize caves table
caves.forEach(cave => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${cave.name}</td>
        <td>${cave.location}</td>
        <td id="countdown_${cave.id}">Not Set</td>
        <td>
            <button onclick="setCountdown(${cave.id}, '${cave.name}', '${cave.location}', ${cave.respawnTimeHours}, ${cave.respawnTimeMinutes})">
                Set ${cave.respawnTimeHours}h ${cave.respawnTimeMinutes}m Countdown
            </button>
        </td>
    `;
    tbody.appendChild(row);
});

// Function to set the countdown based on the respawn time
function setCountdown(caveId, caveName, caveLocation, respawnTimeHours, respawnTimeMinutes) {
    // Clear existing countdown interval if it exists
    clearInterval(countdownIntervals[caveId]);

    // Get the countdown element for the specific cave
    const countdownElement = document.getElementById(`countdown_${caveId}`);
    countdownElement.innerText = "Not Set"; // Reset display

    // Calculate total respawn time in seconds
    let totalRespawnTime = (respawnTimeHours * 3600) + (respawnTimeMinutes * 60);

    // Start the countdown
    updateCountdownDisplay(caveId, totalRespawnTime);
    
    // Set a new interval for the countdown
    countdownIntervals[caveId] = setInterval(() => {
        totalRespawnTime--;

        // Update the countdown display
        updateCountdownDisplay(caveId, totalRespawnTime);

        // If countdown reaches zero, stop the countdown and play alarm sound
        if (totalRespawnTime <= 0) {
            clearInterval(countdownIntervals[caveId]);
            countdownElement.innerText = "Countdown Finished!";
            playAlarm(caveName, caveLocation); // Pass cave name and location
        }
    }, 1000);
}
function setEmergencyCountdownFromDropdown() {
    const caveSelect = document.getElementById('cave-select');
    const selectedCaveId = caveSelect.value;
    const emergencyHours = parseInt(document.getElementById('emergency-hours').value) || 0;
    const emergencyMinutesInput = document.getElementById('emergency-minutes');
    let emergencyMinutes = parseInt(emergencyMinutesInput.value) || 0;

    // Validate if a cave is selected
    if (!selectedCaveId) {
        alert("Please select a cave.");
        return;
    }

    // Reset the countdown for the selected cave
    clearInterval(countdownIntervals[selectedCaveId]);
    const countdownElement = document.getElementById(`countdown_${selectedCaveId}`);
    countdownElement.innerText = "Not Set"; // Reset display

    // Get the cave details
    const selectedCave = caves.find(cave => cave.id == selectedCaveId);
    const caveName = selectedCave.name; // Get the name of the cave
    const caveLocation = selectedCave.location; // Get the location of the cave

    // Get selected radio button value
    const options = document.getElementsByName("options");
    let deduction = 0;

    for (const option of options) {
        if (option.checked) {
            deduction = parseInt(option.value); // -5 or -10
            break; // Exit the loop once the checked option is found
        }
    }

    // Deduct the selected radio button value from the total emergency minutes
    const totalEmergencyTimeInMinutes = emergencyHours * 60 + emergencyMinutes; // Convert total time to minutes
    const finalEmergencyTimeInMinutes = totalEmergencyTimeInMinutes - deduction;

    // Ensure the result is not negative
    const adjustedEmergencyMinutes = finalEmergencyTimeInMinutes < 0 ? 0 : finalEmergencyTimeInMinutes;

    // Convert adjusted emergency time to seconds for countdown
    let totalEmergencyTime = adjustedEmergencyMinutes * 60;

    // Start the emergency countdown
    updateCountdownDisplay(selectedCaveId, totalEmergencyTime);
    
    // Set a new interval for emergency countdown
    countdownIntervals[selectedCaveId] = setInterval(() => {
        totalEmergencyTime--;

        // Update the countdown display
        updateCountdownDisplay(selectedCaveId, totalEmergencyTime);

        // If countdown reaches zero, stop the countdown and play alarm sound
        if (totalEmergencyTime <= 0) {
            clearInterval(countdownIntervals[selectedCaveId]);
            countdownElement.innerText = "Emergency Countdown Finished!";
            playAlarm(caveName, caveLocation); // Pass the cave name and location
        }
    }, 1000);
}

function fetchCountdowns() {
    fetch('/api/retrieve-countdown') // Change this to your actual endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch countdowns.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && Array.isArray(data.data)) {
                data.data.forEach(countdown => {
                    const caveId = countdown.id; // Use the unique ID
                    const remainingSeconds = calculateRemainingTime(countdown.start_time, countdown.end_time);
                    
                    // Format start and end time for display
                    const formattedStartTime = (countdown.start_time);
                    const formattedEndTime = (countdown.end_time);
        
                    // Update display with formatted dates
                    const countdownElement = document.getElementById(`countdown_${caveId}`);
                    if (countdownElement) { // Ensure the element exists
                        countdownElement.innerHTML = `Cave: ${countdown.cave_name} <br> 
                                                       Location: ${countdown.location} <br> 
                                                       Starts at: ${formattedStartTime} <br> 
                                                       Ends at: ${formattedEndTime}`;
        
                        if (remainingSeconds > 0) {
                            // Format the countdown display
                            const formattedTime = formatCountdownTime(remainingSeconds);
                            countdownElement.innerHTML += `<br> Time Remaining: ${formattedTime}`;
                            startCountdown(caveId, remainingSeconds, countdown.cave_name, countdown.location);
                        } else {
                            // If the countdown is finished
                            countdownElement.innerHTML += "<br> Countdown Finished!";
                        }
                    } else {
                        console.error(`Element for cave ${caveId} not found.`);
                    }
                });
            } else {
                console.error('Invalid data format received from the server.');
            }
        })
        .catch(error => {
            console.error('Error fetching countdowns:', error);
        });
        
        
        // Function to calculate remaining time in seconds
    }
// Function to calculate remaining time in seconds
function calculateRemainingTime(startTime, endTime) {
    const startDate = new Date(startTime); // ISO format works directly
    const endDate = new Date(endTime); // ISO format works directly
    return Math.max(Math.floor((endDate - Date.now()) / 1000), 0); // Return remaining seconds as whole numbers
}

    
    // Function to format the remaining time
    function formatCountdownTime(remainingSeconds) {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = Math.floor(remainingSeconds % 60); // Get only the whole seconds
    
        return `${hours}h ${minutes}m ${seconds}s`; // Construct the formatted string with 's' for seconds
    }
function startCountdown(caveId, totalTime, caveName, caveLocation) {
    // Clear existing countdown interval if it exists
    clearInterval(countdownIntervals[caveId]);

    // Start the countdown
    updateCountdownDisplay(caveId, totalTime);
    
    // Set a new interval for the countdown
    countdownIntervals[caveId] = setInterval(() => {
        totalTime--;

        // Update the countdown display
        updateCountdownDisplay(caveId, totalTime);

        // If countdown reaches zero, stop the countdown and play alarm sound
        if (totalTime <= 0) {
            clearInterval(countdownIntervals[caveId]);
            const countdownElement = document.getElementById(`countdown_${caveId}`);
            countdownElement.innerText = "Countdown Finished!";
            playAlarm(caveName, caveLocation); // Pass cave name and location
        }
    }, 1000);
}

window.onload = function() {
    fetchCountdowns(); // Fetch countdowns from the backend on page load
};
function formatDateToPH(date) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore', // Ensure the time is in PH time (SG time)
    };

    return new Date(date).toLocaleString('en-SG', options).replace(',', '');
}
function storeCountdown() {
    const countdownData = [];

    // Loop through each cave to get its countdown data
    caves.forEach(cave => {
        const countdownElement = document.getElementById(`countdown_${cave.id}`);
        const remainingTime = countdownElement.innerText;

        // Check if the countdown is set
        if (remainingTime !== "Not Set" && !remainingTime.includes("Finished")) {
            const totalTimeParts = remainingTime.split(' ');
            const hours = parseInt(totalTimeParts[0]) || 0;
            const minutes = parseInt(totalTimeParts[2]) || 0;
            const seconds = parseInt(totalTimeParts[4]) || 0;

            // Calculate total remaining seconds
            const totalRemainingSeconds = (hours * 3600) + (minutes * 60) + seconds;

            // Get the current time in Philippine time
            const startTime = formatDateToPH(new Date()); // Get the current time formatted to PH time
            
            // Calculate end time based on remaining seconds
            const endTimeUTC = new Date(new Date().getTime() + (totalRemainingSeconds * 1000)); // Add remaining seconds to current time
            const endTime = formatDateToPH(endTimeUTC); // Format end time to PH time

            // Prepare data to send
            countdownData.push({
                cave: cave.name,
                location: cave.location,
                start_time: startTime, // Use formatted PH time
                end_time: endTime // Use formatted end time in PH time
            });

            console.log('Start Time (PH):', startTime); // Log the start time in PH
            console.log('End Time (PH):', endTime); // Log the end time in PH
        }
    });
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Send the countdown data to the backend
    fetch('/api/store-countdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-TOKEN': csrfToken // Uncomment if CSRF token is needed
        },
        body: JSON.stringify(countdownData),
    })
    .then(response => {
        // Check if response is OK (status 200-299)
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error('Error: ' + text); // Log HTML response
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Countdowns stored successfully!');
        } else {
            alert('Failed to store countdowns: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error storing countdowns:', error);
        alert('An error occurred while storing countdowns: ' + error.message);
    });
}
// Function to update the countdown display
function updateCountdownDisplay(caveId, totalTime) {
    const countdownElement = document.getElementById(`countdown_${caveId}`);
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    const seconds = totalTime % 60;

    countdownElement.innerText = `${hours}h ${minutes}m ${seconds}s`;
}

// Function to play the alarm sound and show modal notification
function playAlarm(caveName, caveLocation) {
    const alarmSound = document.getElementById('alarm-sound'); // Get the audio element
    if (alarmSound) {
        if (!isAlarmActive) { // Only play if not already active
            alarmSound.loop = true; // Loop the sound
            alarmSound.currentTime = 0; // Reset sound to start
            alarmSound.play(); // Play the alarm sound
            isAlarmActive = true; // Set alarm active
            
            // Update modal with cave details
            const caveNotification = document.getElementById('cave-notification');
            caveNotification.textContent = `${caveName} - ${caveLocation} is respawning!`;
            
            openModal(); // Show the modal
        }
    } else {
        console.error('Alarm sound element not found');
    }
}

// Modal functions
function openModal() {
    const modal = document.getElementById('alarm-modal');
    modal.style.display = "block"; // Show the modal
}

function closeModal() {
    const modal = document.getElementById('alarm-modal');
    modal.style.display = "none"; // Hide the modal
    isAlarmActive = false; // Reset alarm active status
    const alarmSound = document.getElementById('alarm-sound'); // Get the audio element
    alarmSound.pause(); // Pause the sound
    alarmSound.currentTime = 0; // Reset sound to start
}
const radios = document.getElementsByName('options');

// Add event listener to each radio button
radios.forEach(radio => {
    radio.addEventListener('change', function() {
        const selectedOption = this.value; // Get the selected radio button value
      
    });
});