<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="{{ url('css/nightcrow.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">

</head>
<body>


<h2>Set Countdown Time</h2>
<label for="cave-select">Select Cave:</label>
<select id="cave-select">
    <option value="Cave 1 - Tigdal">Cave 1 - Tigdal</option>
    <option value="Cave 2 - Gatphillian">Cave 2 - Gatphillian</option>
    <option value="Cave 3 - Modi">Cave 3 - Modi</option>
    <option value="Cave 4 - Hotura">Cave 4 - Hotura</option>
    <option value="Cave 5 - Panderre">Cave 5 - Panderre</option>
    <option value="Cave 6 - Stormid">Cave 6 - Stormid</option>
    <option value="Cave 7 - Tigdal">Cave 7 - Tigdal</option>
    <option value="Cave 8 - Gatphillian">Cave 8 - Gatphillian</option>
    <option value="Battlefront - KoD">Battlefront - KoD</option>
    <option value="Special Battlefront - RK">Special Battlefront - RK</option>
</select>

<label for="emergency-hours">Emergency Hours:</label>
<input type="number" id="emergency-hours" placeholder="0" min="0">
<label for="emergency-minutes">Emergency Minutes:</label>
<input type="number" id="emergency-minutes" placeholder="0" min="0" max="59">

<div id="countdown-display"></div>

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
<audio id="alarm-sound" src="assets/alarm.wav" preload="auto"></audio>
    <script src="{{ url('js/nightcrow.js') }}"></script>
</body>
</html>
