/*!
    * Start Bootstrap - SB Admin v7.0.3 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2021 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
// 
// Scripts
// 
function loadFile(name, el) {
  let xhr = new XMLHttpRequest(); 
  xhr.open("GET", (name + ".html"), true); 
  xhr.send(); 
  xhr.onreadystatechange = function(){ 
    if(xhr.readyState == 4 && xhr.status == 200){ 
      document.getElementById(el).innerHTML = xhr.responseText;
      history.pushState({}, '', name);
      //refresh page actions https://stackoverflow.com/questions/5004978/check-if-page-gets-reloaded-or-refreshed-in-javascript
    } 
  } 
}

function loadNav() {
  let nav = document.getElementById("loadNav");
  let isActive;
  nav.innerHTML = "";
  for (const i in data) {
    if (data[i].link === settings.activeLink) {
      isActive = "active";
    } else {
      isActive = "";
    }
    nav.innerHTML += '<a class="nav-link ' + isActive + '" onclick="loadFile(\'' + data[i].link + '\', \'content\'); settings.activeLink = \'' + data[i].link + '\'; loadNav();"><div class="sb-nav-link-icon"><i class="' + data[i].icon + '"></i></div>' + data[i].name + '</a>'
  }
}

function serverTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = formatTime(m);
  s = formatTime(s);
  document.getElementById('serverTime').innerHTML =  h + ":" + m + ":" + s;
  setTimeout(serverTime, 100);
}

function formatTime(t) {
  if (t < 10) {
    t = "0" + t;
  }
  return t;
}
window.addEventListener('DOMContentLoaded', event => {

    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });

    var myModal = document.getElementById('myModal')
    var myInput = document.getElementById('myInput')

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus()
    });
});


