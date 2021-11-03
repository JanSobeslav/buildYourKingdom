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
window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
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


