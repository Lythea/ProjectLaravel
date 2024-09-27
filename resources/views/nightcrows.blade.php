<div>
    <!-- The biggest battle is the war against ignorance. - Mustafa Kemal Atatürk -->
</div>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="{{ url('css/nightcrow.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>

<h2>Set Emergency Countdown Time</h2>
<div class="table1">
<table>
    <tr>
        <td>    
        <label for="cave-select">Select Cave:</label>
        <select id="cave-select">
            <option value="">Select Cave</option>
            <option value="1">Cave 1 - Tigdal</option>
            <option value="2">Cave 2 - Gatphillian</option>
            <option value="3">Cave 3 - Modi</option>
            <option value="4">Cave 3 - Hotura</option>
            <option value="5">Cave 4 - Panderre</option>
            <option value="6">Cave 4 - Stormid</option>
            <option value="7">Cave 5 - Maltanis</option>
            <option value="8">Cave 6 - Dardaloca</option>
            <option value="9">Battlefront - KoD</option>
            <option value="10">Special Battlefront - RK</option>
        </select>
        </td>
        <td>  
            <label for="emergency-hours">Emergency Hours:</label>
            <input type="number" id="emergency-hours" placeholder="0" min="0">
        </td>
        <td>
            <label for="emergency-minutes">Emergency Minutes:</label>
            <input type="number" id="emergency-minutes" placeholder="0" min="0" max="59"><br>
            <div class="radio-container">
                <label class="remote-radio">
                    <input type="radio" name="options" value="5" id="option1"> -5 min
                    <span id="click-count-option1"></span>x
                </label>
                <label class="remote-radio">
                    <input type="radio" name="options" value="10" id="option2"> -10 min
                    <span id="click-count-option2"></span>x
                </label>
            </div>
        </td>
        <td><button onclick="setEmergencyCountdownFromDropdown()">Set Emergency Countdown</button></td>
        <td><button onclick="storeCountdown()">Store Countdown</button></td>

</tr>
</table>
<div class="loading" >


        <button class="verifyButton"id="verifyButton" onclick="verify()">Verify</button>
                    <div id="loadingContainer" style="">
                        <div id="loadingBar" style=""></div>
                    </div>
                  
        </div>
        </div>
    <div id="countdown-display"></div>
    <div class="table2">
    <table>
        <thead>
            <tr>
                <th>Cave</th>
                <th>Location</th>
                <th>Countdown</th>
                <th>Set Countdown</th>
            </tr>
        </thead>
        <tbody id="caves-body">
            <!-- Buttons will be added here dynamically -->
        </tbody>
    </table>
    </div>
    <audio id="alarm-sound" src="assets/alarm.wav" preload="auto"></audio>
 <!-- Modal for Alarm Notification -->
<div id="alarm-modal" class="modal">
    <div class="modal-content cute-modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <h1>🔔 Alarm Alert!</h1>
        <p id="cave-notification"></p> <!-- Placeholder for cave notification -->
        <button class="cute-button" onclick="closeModal()">OK</button>
    </div>
</div>
    <script src="{{ url('js/nightcrow.js') }}"></script>
</body>
</html>
