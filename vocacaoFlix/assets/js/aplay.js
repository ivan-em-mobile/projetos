const nav = document.getElementById('nav')

window.addEventListener('scroll', () => {
    if (window.scrollY >= 90) {
        nav.classList.add('nav__black');
    } else {
        nav.classList.remove('nav__black')
    }
})