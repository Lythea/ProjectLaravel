const caves = [
    { id: 1, name: "Cave 1", location: "Tigdal", respawnTimeHours: 0, respawnTimeMinutes: 2 },
    { id: 2, name: "Cave 2", location: "Gatphillian", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 3, name: "Cave 3", location: "Modi", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 4, name: "Cave 3", location: "Hotura", respawnTimeHours: 11, respawnTimeMinutes: 50 },
    { id: 5, name: "Cave 4", location: "Panderre", respawnTimeHours: 15, respawnTimeMinutes: 50 },
    { id: 6, name: "Cave 4", location: "Stormid", respawnTimeHours: 15, respawnTimeMinutes: 50 },
    { id: 7, name: "Cave 5", location: "Maltanis", respawnTimeHours: 15, respawnTimeMinutes: 50 },
    { id: 8, name: "Cave 6", location: "Dardaloca", respawnTimeHours: 15, respawnTimeMinutes: 50 },
    { id: 9, name: "Battlefront", location: "KoD", respawnTimeHours: 23, respawnTimeMinutes: 50 },
    { id: 10, name: "Special Battlefront", location: "RK", respawnTimeHours: 23, respawnTimeMinutes: 50 }
];

const tbody = document.getElementById('caves-body');
const emergencyCountdownDisplay = document.getElementById('countdown-display');
let countdownIntervals = {}; // Store countdown intervals for each cave
const alarmIntervals = {};
const earlySignalIntervals = {}; // To store early signal intervals for each cave
let clickCount = {
    option1: 0,
    option2: 0,
};


let isAlarmActive = false; // Global variable to track alarm status
const countdownData = [];
// Initialize caves table
caves.forEach(cave => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${cave.name}</td>
        <td>${cave.location}</td>
        <td id="countdown_${cave.id}">Not Set<br>${cave.endTime}</td>
        <td>
            <button onclick="setCountdown(${cave.id}, '${cave.name}', '${cave.location}', ${cave.respawnTimeHours}, ${cave.respawnTimeMinutes})">
                Set ${cave.respawnTimeHours}h ${cave.respawnTimeMinutes}m Countdown
            </button>
        </td>
    `;
    tbody.appendChild(row);
});
// Function to handle radio button click
function handleRadioClick(radio) {
    const id = radio.id;
    
    // Increment click count for the selected radio
    clickCount[id]++;
    
    // Update display for the number of clicks
    const clickDisplay = document.getElementById(`click-count-${id}`);
    clickDisplay.innerText = `${clickCount[id]}`;
}
function setEmergencyCountdownFromDropdown() {
    const emergencyHours = parseInt(document.getElementById('emergency-hours').value) || 0;
    const emergencyMinutes = parseInt(document.getElementById('emergency-minutes').value) || 0;

    // Calculate total emergency time in seconds
    let totalEmergencyTime = (emergencyHours * 3600) + (emergencyMinutes * 60);

    // Get selected cave from the dropdown
    const caveSelect = document.getElementById('cave-select');
    const selectedCaveId = parseInt(caveSelect.value);
    
    const selectedCave = caves.find(cave => cave.id === selectedCaveId);
    
    if (!selectedCave) {
        console.error("No cave selected or invalid cave ID.");
        return;
    }

    // Clear existing intervals if they exist
    clearInterval(countdownIntervals[selectedCave.id]);

    const countdownElement = document.getElementById(`countdown_${selectedCave.id}`);
    countdownElement.innerText = "Not Set";

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + totalEmergencyTime * 1000);

    // Adjust end time based on total click counts
    const totalDeductionMinutes = (clickCount.option1 * 5) + (clickCount.option2 * 10);
    endTime.setMinutes(endTime.getMinutes() - totalDeductionMinutes);

    const formattedStartTime = formatDateToPH(startTime);
    const formattedEndTime = formatDateToPH(endTime);

    const countdownEntry = {
        caveId: selectedCave.id,
        caveName: selectedCave.name,
        caveLocation: selectedCave.location,
        totalRespawnTime: totalEmergencyTime,
        startTime: formattedStartTime,
        endTime: formattedEndTime
    };

    const existingIndex = countdownData.findIndex(data => data.caveId === selectedCave.id);

    if (existingIndex !== -1) {
        countdownData[existingIndex] = countdownEntry;
    } else {
        countdownData.push(countdownEntry);
    }

    console.log(countdownData);

    countdownElement.innerHTML = `${formatCountdownTime(totalEmergencyTime)}`;
    
    countdownIntervals[selectedCave.id] = setInterval(() => {
        const currentTime = new Date();
        let remainingTime = Math.floor((endTime - currentTime) / 1000);
        countdownElement.innerHTML = `${formatCountdownTime(remainingTime)}`;

        if (currentTime >= endTime) {
            clearInterval(countdownIntervals[selectedCave.id]);
            countdownElement.innerHTML = "Countdown Finished";
            playAlarm(selectedCave.name, selectedCave.location);
        } else if (remainingTime <= 180 && remainingTime > 0) {
            if (remainingTime % 60 === 0) {
                playShortAlarm(selectedCave.name, selectedCave.location);
            }
        }
    }, 1000);
}



function setCountdown(caveId, caveName, caveLocation, respawnTimeHours, respawnTimeMinutes) {
    // Clear existing countdown intervals if they exist
    clearInterval(countdownIntervals[caveId]);

    // Get the countdown element for the specific cave
    const countdownElement = document.getElementById(`countdown_${caveId}`);
    countdownElement.innerText = "Not Set"; // Reset display

    // Calculate total respawn time in seconds
    let totalRespawnTime = (respawnTimeHours * 3600) + (respawnTimeMinutes * 60);
    
    // Get current time for startTime
    const startTime = new Date();
    
    // Calculate endTime by adding total respawn time
    const endTime = new Date(startTime.getTime() + totalRespawnTime * 1000);

    // Format the start and end time using the specified function
    const formattedStartTime = formatDateToPH(startTime);
    const formattedEndTime = formatDateToPH(endTime);

    // Log the countdown data
    const countdownEntry = {
        caveId: caveId,
        caveName: caveName,
        caveLocation: caveLocation,
        totalRespawnTime: totalRespawnTime,
        startTime: formattedStartTime,
        endTime: formattedEndTime
    };

    // Find the index of the existing entry
    const existingIndex = countdownData.findIndex(data => data.caveId === caveId);
    
    if (existingIndex !== -1) {
        // Update existing entry if found
        countdownData[existingIndex] = countdownEntry; // Replace existing entry
    } else {
        // Add new entry if it doesn't exist
        countdownData.push(countdownEntry);
    }

    // Log the updated countdown data array
    console.log(countdownData);

    // Initialize countdown display
    countdownElement.innerHTML = `${formatCountdownTime(totalRespawnTime)}`;

    // Set an interval for the countdown display
    countdownIntervals[caveId] = setInterval(() => {
        const currentTime = new Date(); // Get current time every second
        let remainingTime = Math.floor((endTime - currentTime) / 1000); // Update remaining time

        // Update the countdown display with remaining time
        countdownElement.innerHTML = `${formatCountdownTime(remainingTime)}`;

        // If remaining time reaches zero, stop the countdown and upd   ate display text
        if (currentTime >= endTime) {
            clearInterval(countdownIntervals[caveId]); // Stop the countdown display interval
            countdownElement.innerHTML = `${formatCountdownTime(0)}<br> End Time: ${formattedEndTime}<br>Countdown Finished!`;

            playAlarm(caveName, caveLocation); // Pass cave name and location based on endTime
        } else if (remainingTime <= 180 && remainingTime > 0) {
            if (remainingTime % 60 === 0) {
                playShortAlarm(caveName, caveLocation);
            }
        }
    }, 1000);
}
// Fetch countdowns when the document is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    fetchCountdowns(); // Fetch the countdowns from the backend
});

// Existing fetchCountdowns function remains unchanged
function fetchCountdowns() {
    fetch('/api/retrieve-countdown')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch countdowns.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && Array.isArray(data.data)) {
                data.data.forEach(countdown => {
                    setupCountdown(countdown); // Setup countdown for each
                });
            } else {
                console.error('Invalid data format received from the server.');
            }
        })
        .catch(error => {
            console.error('Error fetching countdowns:', error);
        });
}

// Setup countdown for the specific cave
function setupCountdown(countdown) {
    const caveId = countdown.id; // Use the unique ID
    const caveName = countdown.cave_name;
    const caveLocation = countdown.location;

    const endTime = new Date(countdown.end_time);
    const currentTime = new Date();

    // Calculate the remaining time
    let remainingTime = Math.floor((endTime - currentTime) / 1000);
    const formattedEndTime = formatDateToPH(endTime);

    const countdownElement = document.getElementById(`countdown_${caveId}`);
    clearInterval(countdownIntervals[caveId]); // Clear existing intervals

    // Initialize countdown display for active countdown
    countdownElement.innerHTML = `${formatCountdownTime(remainingTime)}`;

    countdownIntervals[caveId] = setInterval(() => {
        const currentTime = new Date();
        remainingTime = Math.floor((endTime - currentTime) / 1000);
        
        // Update the countdown display with remaining time
        countdownElement.innerHTML = `${formatCountdownTime(remainingTime)}`;

        // Check for negative remaining time
        if (currentTime >= endTime) {
            clearInterval(countdownIntervals[caveId]); // Stop the countdown display interval
            countdownElement.innerHTML = `${formatCountdownTime(0)}<br> End Time: ${formattedEndTime}<br>Countdown Finished!`;
            playAlarm(caveName, caveLocation); // Pass cave name and location based on endTime
        } else if (remainingTime <= 180 && remainingTime > 0) {
            if (remainingTime % 60 === 0) {
                playShortAlarm(caveName, caveLocation);
            }
        }   
    }, 1000);
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


window.onload = function() {
    fetchCountdowns(); // Fetch countdowns from the backend on page load
};
function formatTime(remainingTime, endTime) {
    // Calculate the current date
    const currentDate = new Date();

    // Calculate the end date
    const endDate = new Date(endTime);

    // Check if the end date is the next day
    const isNextDay = endDate.getDate() !== currentDate.getDate();

    if (isNextDay) {
        // Format to AM/PM if the end time is on the next day
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Asia/Singapore', // Ensure the time is in PH time (SG time)
        };

        // Format the end time with AM/PM
        return endDate.toLocaleString('en-SG', options).replace(',', '');
    } else {
        // Format the time to include the date if it's the same day
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

        // Format the date and time
        return new Date(endTime).toLocaleString('en-SG', options).replace(',', '');
    }
}

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
    // Prepare to collect the countdown data from the existing array
    const countdownDataToStore = countdownData.filter(data => {
        // Check if the countdown is set and not finished
        const countdownElement = document.getElementById(`countdown_${data.caveId}`);
        const remainingTime = countdownElement.innerText;

        return remainingTime !== "Not Set" && !remainingTime.includes("Finished");
    }).map(data => {
        // Get the current time in Philippine time
        const startTime = formatDateToPH(new Date()); // Get the current time formatted to PH time
        
        // Calculate the end time based on the total respawn time
        const totalRemainingSeconds = data.totalRespawnTime; // Use existing totalRespawnTime
        const endTimeUTC = new Date(new Date().getTime() + (totalRemainingSeconds * 1000)); // Add remaining seconds to current time
        const endTime = formatDateToPH(endTimeUTC); // Format end time to PH time

        return {
            cave: data.caveName,
            location: data.caveLocation,
            start_time: startTime, // Use formatted PH time
            end_time: endTime // Use formatted end time in PH time
        };
    });

    if (countdownDataToStore.length === 0) {
        alert('No active countdowns to store.');
        return;
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Send the countdown data to the backend
    fetch('/api/store-countdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-TOKEN': csrfToken // Uncomment if CSRF token is needed
        },
        body: JSON.stringify(countdownDataToStore),
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
function playShortAlarm(caveName, caveLocation) {
    const alarmSound = document.getElementById('alarm-sound'); // Get the audio element
    if (alarmSound) {
        if (!isAlarmActive) { // Only play if not already active
            alarmSound.loop = false; // Play only once
            alarmSound.currentTime = 0; // Reset sound to start
            alarmSound.play(); // Play the short alarm sound for a few seconds
            isAlarmActive = true; // Set alarm active for a short period

            setTimeout(() => {
                alarmSound.pause(); // Stop the short signal after a few seconds
                isAlarmActive = false; // Reset alarm active status
            }, 3000); // Play alarm for 3 seconds
        }
    } else {
        console.error('Alarm sound element not found');
    }
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
const radios = document.querySelectorAll('input[name="options"]');
radios.forEach(radio => {
    radio.addEventListener('click', () => handleRadioClick(radio));
});
function verify() {
    const loadingContainer = document.getElementById('loadingContainer');
    const loadingBar = document.getElementById('loadingBar');
    const verificationMessage = document.getElementById('verificationMessage');
    const verifyButton = document.getElementById('verifyButton');

    // Show loading container
    loadingContainer.style.display = 'block';

    // Reset loading bar width
    loadingBar.style.width = '0';

    // Disable the button during the loading process
    verifyButton.disabled = true;
    verifyButton.innerText = 'Verifying...'; // Change button text during verification

    // Start loading animation
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width++;
            loadingBar.style.width = width + '%';
        }
    }, 10); // Adjust this value for the speed of the loading

    // After 1 second, show the complete message and reset the UI
    setTimeout(() => {
        clearInterval(interval);
        loadingBar.style.width = '100%'; // Ensure it's filled at the end

        // Update button text to "Verifying complete"
        verifyButton.innerText = 'Verifying complete';
        
        // Hide the loading container
        loadingContainer.style.display = 'none';

        // Display the verification message
        verificationMessage.innerText = 'Verification complete';

        // Re-enable the button and allow further action if needed
        verifyButton.disabled = false;

    }, 1000); // Adjust this value based on your actual loading time
}
