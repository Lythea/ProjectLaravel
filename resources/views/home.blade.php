<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="{{ url('css/home.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">

    <script src="https://accounts.google.com/gsi/client" async defer></script>

</head>
<body>

    
<div class="container">
        <header>
            <h1>&nbsp;</h1>
        </header>
        <main>
        <div class="body"">
        <table>
        <tr>
            <td>
            <h1 class="title1">AdSpace</h1>
            <img class="logo" src="assets/img1.jpg">
            </td>
            <td>
            <div class="introduction">
                <br><h1>Welcome to AdSpace!</h1>
                <div class="container1">
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;At AdSpace, your go-to platform for creating impactful and visually stunning advertisements tailored to meet your business needs. At AdSpace, we believe in the power of strategic advertising, offering you the tools to effortlessly design, manage, and showcase your ads across various channels. Whether you're a small business owner, an entrepreneur launching a new product, or a service provider looking to expand your reach, we have the solutions you need to make a lasting impression.</p>
                    <br>
                    <p>From banner ads to interactive content, we’ve got you covered.<br> Let AdSpace elevate your advertising game...</p>
                    <br><br>
                    <p style="text-align:center;">Don't have an account yet? <span id="popupTrigger1">SignUp/Login Here!</span></p>
                    
                </div>
            </div>
            </td>
        </tr>
        </table>
        </div>
        </main>
        <div class="form">
  <div class="popup1" id="popupContainer1" style="display: none;">
    <div class="popup-content1">
      <span class="close1" onclick="document.getElementById('popupContainer1').style.display='none'">&times;</span>
      
      <form id="userForm" method="POST" action="/profile" onsubmit="return onSubmit()">
        @csrf
        <fieldset>


          
          <label for="contact">Email/Phone Number:</label><br>
          <div class="input-container">
            <input type="text" id="contact" onblur="validateContact()" required />
            <div class="validation-popup1" id="contactValidation" style="display: none;"></div>
          
            <label for="password">Password:</label><br>
          <div class="input-container">
            <input type="password" id="password" onblur="validatePassword()" required /><br>
            <div class="validation-popup2" id="passwordValidation" style="display: none;"></div>
          </div>

          
          <div class="formbutton">
          <button type="button" class="button2" id="register" onclick="registerFunction(event)" disabled>REGISTER</button>

          <button type="button" class="button3" id="login" onclick="loginFunction(event)" disabled>LOGIN</button>
      
          </div>
       
          <div class="separator">
            <span>or</span>
          </div>
      
          <!-- Google Sign-In button   -->
          <div id="g_id_onload"
            data-client_id="788567745600-1hv1jnm2qa7hk9s4i40v7cegt33pqejq.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-callback="http://localhost:8000"
            data-itp_support="true">
        </div>

        <div class="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left">
        </div>
        </fieldset>
      </form>
      
    </div>
  </div>
</div>

        <footer>
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </footer>
    </div>
    <script src="{{ url('js/home.js') }}"></script>
</body>
</html>
