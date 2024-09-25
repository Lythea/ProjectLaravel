const caves = [
    { name: "Cave 1", location: "Tigdal", respawnTimeHours: 6, respawnTimeMinutes: 0 },
    { name: "Cave 2", location: "Gatphillian", respawnTimeHours: 5, respawnTimeMinutes: 30 },
    { name: "Cave 3", location: "Modi", respawnTimeHours: 4, respawnTimeMinutes: 15 },
    { name: "Cave 4", location: "Hotura", respawnTimeHours: 7, respawnTimeMinutes: 45 },
    { name: "Cave 5", location: "Panderre", respawnTimeHours: 3, respawnTimeMinutes: 0 },
    { name: "Cave 6", location: "Stormid", respawnTimeHours: 6, respawnTimeMinutes: 20 },
    { name: "Cave 7", location: "Tigdal", respawnTimeHours: 5, respawnTimeMinutes: 10 },
    { name: "Cave 8", location: "Gatphillian", respawnTimeHours: 4, respawnTimeMinutes: 0 },
    { name: "Battlefront", location: "KoD", respawnTimeHours: 8, respawnTimeMinutes: 30 },
    { name: "Special Battlefront", location: "RK", respawnTimeHours: 2, respawnTimeMinutes: 0 }
];

const tbody = document.getElementById('caves-body');
const emergencyCountdownDisplay = document.getElementById('countdown-display');

// Create rows and columns
caves.forEach(cave => {
    const row = document.createElement('tr');

    const caveCell = document.createElement('td');
    caveCell.textContent = cave.name;
    row.appendChild(caveCell);

    const locationCell = document.createElement('td');
    locationCell.textContent = cave.location;
    row.appendChild(locationCell);

    const countdownCell = document.createElement('td');
    countdownCell.textContent = "Not Set"; // Initial text
    countdownCell.setAttribute('id', `${cave.name.replace(/\s/g, '_')}_countdown`); // Set ID for countdown
    row.appendChild(countdownCell);

    const buttonCell = document.createElement('td');
    buttonCell.innerHTML = `
        <button onclick="setCountdown('${cave.name} - ${cave.location}', ${cave.respawnTimeHours}, ${cave.respawnTimeMinutes}, '${cave.name.replace(/\s/g, '_')}')">Set ${cave.respawnTimeHours}h ${cave.respawnTimeMinutes}m Countdown</button>
        <button onclick="setEmergencyCountdown('${cave.name}', '${cave.name.replace(/\s/g, '_')}')">Set Emergency Countdown</button>
    `;
    row.appendChild(buttonCell);

    tbody.appendChild(row);
});

let countdownInterval; // Variable to hold the countdown interval
let emergencyCountdownIntervals = {}; // Object to track active emergency countdowns

function setCountdown(location, hours, minutes, caveName) {
    const currentTime = new Date();
    const countdownEndTime = new Date(currentTime.getTime() + ((hours * 60 + minutes) * 60 * 1000)); // Current time + countdown time

    alert(`Countdown set for ${location} at ${countdownEndTime.toLocaleTimeString()}`);
    startCountdown(countdownEndTime, caveName);
}

function startCountdown(endTime, caveName) {
    if (countdownInterval) {
        clearInterval(countdownInterval); // Clear any existing countdown interval
    }

    const countdownCell = document.getElementById(`${caveName}_countdown`);

    countdownInterval = setInterval(() => {
        const now = new Date();
        const remainingTime = endTime - now;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownCell.textContent = ''; // Clear countdown display
            playAlarm(); // Play the alarm sound
            return;
        }

        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        countdownCell.textContent = `${hours}h ${minutes}m ${seconds}s`; // Update the countdown display
    }, 1000);
}

// Function to play the alarm sound
function playAlarm() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.loop = true; // Loop the sound until stopped
    alarmSound.currentTime = 0; // Rewind to start
    alarmSound.play(); // Play the sound

    // Use alert to hold the execution until user clicks OK
    alert('Time is up! Click OK to stop the alarm.');

    // Stop the alarm after the alert is dismissed
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset the sound to the beginning
}

// Set the emergency countdown time based on user input
function setEmergencyCountdown(caveName, caveId) {
    const hours = parseInt(document.getElementById('emergency-hours').value) || 0;
    const minutes = parseInt(document.getElementById('emergency-minutes').value) || 0;
    const totalEmergencyTime = (hours * 60 + minutes) * 60 * 1000; // Convert to milliseconds
    const emergencyEndTime = new Date(Date.now() + totalEmergencyTime);

    alert(`Emergency Countdown set for ${hours}h ${minutes}m.`);
    startEmergencyCountdown(emergencyEndTime, caveId); // Start the emergency countdown
}

// Separate function for emergency countdown
function startEmergencyCountdown(endTime, caveId) {
    const countdownCell = document.getElementById(`${caveId}_countdown`);
    
    // Clear any existing emergency countdown for this cave
    if (emergencyCountdownIntervals[caveId]) {
        clearInterval(emergencyCountdownIntervals[caveId]);
        countdownCell.textContent = "Not Set"; // Reset the previous countdown display
    }

    emergencyCountdownIntervals[caveId] = setInterval(() => {
        const now = new Date();
        const remainingTime = endTime - now;

        if (remainingTime <= 0) {
            clearInterval(emergencyCountdownIntervals[caveId]);
            delete emergencyCountdownIntervals[caveId]; // Remove the reference from the object
            countdownCell.textContent = ''; // Clear countdown display
            playAlarm(); // Play the alarm sound
            return;
        }

        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        countdownCell.textContent = `${hours}h ${minutes}m ${seconds}s`; // Update the countdown display
    }, 1000);
}
function playAlarm() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.loop = true; // Set the sound to loop
    alarmSound.currentTime = 0; // Rewind to the start

    // Play the alarm sound
    const playPromise = alarmSound.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Sound is playing
            console.log('Alarm sound is playing.');
        }).catch(error => {
            console.log('Audio playback failed:', error);
            // Fallback to notification if sound doesn't play
            sendNotification('Time is up!', 'The countdown has ended. Click to return.');
        });
    }

    // Send notification
    sendNotification('Time is up!', 'The countdown has ended. Click to return.', alarmSound);
}

function sendNotification(title, body, alarmSound) {
    if (Notification.permission === "granted") {
        const notification = new Notification(title, {
            body: body,
            icon: 'path/to/icon.png' // Optional icon
        });

        // Stop the alarm sound when notification is clicked
        notification.onclick = () => {
            alarmSound.pause(); // Stop the sound
            alarmSound.currentTime = 0; // Reset the sound to the beginning
            notification.close(); // Close the notification
        };
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                const notification = new Notification(title, {
                    body: body,
                    icon: 'path/to/icon.png' // Optional icon
                });

                // Stop the alarm sound when notification is clicked
                notification.onclick = () => {
                    alarmSound.pause(); // Stop the sound
                    alarmSound.currentTime = 0; // Reset the sound to the beginning
                    notification.close(); // Close the notification
                };
            }
        });
    }
}

