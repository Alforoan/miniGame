const navbarBtn = document.querySelector('.navbar-btn');
const navbar = document.querySelector('.navbar');

navbarBtn.addEventListener('click', function () {
  navbar.classList.toggle('navbar-show');
});

console.log("this is laoded");