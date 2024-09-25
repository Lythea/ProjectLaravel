<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">

    <link rel="stylesheet" href="{{ url('css/dashboard.css') }}">   
</head>
<body>
    <header>
        <h1></h1>
    </header>

    <main>
    <table>
            <tr>
            <td class="fixed-column">
                    <div class="settings">Sort by:</div>
                    <div id="apps" class="category">Apps</div>
                    <div id="games" class="category">Games</div>
                    <div id="books" class="category">Books</div>
                    <div id="courses" class="category">Courses</div>
                    <div id="music" class="category">Music</div>
                    <div id="health" class="category">Health & Fitness</div>
                    <div id="arts" class="category">Arts and Photography</div>
                </td>
            
                <td class="content-area" id="content-area">
                <div class="scrollablecontent">
    <div class="container">
        <div id="apps-content" class="content-section">
            <h2>Apps Section</h2>
            <p>Explore the latest apps here.</p>
            <div class="app-box">App 1</div>
            <div class="app-box">App 2</div>
            <div class="app-box">App 3</div>
        </div>
        <div id="games-content" class="content-section">
            <h2>Games Section</h2>
            <p style="border-bottom: 2px solid black;">Discover the latest games here.</p>
            <div id="games-container"></div>
        </div>
        <div id="books-content" class="content-section">
            <h2>Books Section</h2>
            <p>Dive into our collection of books.</p>
        </div>
        <div id="courses-content" class="content-section">
            <h2>Courses Section</h2>
            <p>Explore a variety of online courses.</p>
        </div>
        <div id="music-content" class="content-section">
            <h2>Music Section</h2>
            <p>Discover the latest music trends.</p>
        </div>
        <div id="health-content" class="content-section">
            <h2>Health & Fitness Section</h2>
            <p>Find tips for a healthier lifestyle.</p>
        </div>
        <div id="arts-content" class="content-section">
            <h2>Arts and Photography Section</h2>
            <p>Explore creative works and photography.</p>
        </div>
    </div>
</div>

                </td>
             
            </tr>
        </table>
    </main>


    <!-- Link to JavaScript file (optional) -->
    <script src="{{ url('js/dashboard.js') }}"></script>
</body>
</html>
