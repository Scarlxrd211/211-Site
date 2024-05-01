document.getElementById('arrow').addEventListener('click', function() {
    var targetElement = document.getElementById('end');
    var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    scrollToSmoothly(targetPosition, 2000); // Durée de l'animation : 1000ms (1 seconde)
});

function scrollToSmoothly(targetPosition, duration) {
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var timeElapsed = currentTime - startTime;
        var ease = easeOutQuart(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, ease);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeOutQuart(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    }

    requestAnimationFrame(animation);
}

var teams = ["League anti Pedophile", "Developpement Web", "Lutte contre l'islamophobie", "Lutte contre le harcèlement", "Lutte contre le viol"];

function displayTeams(index) {
    var teamsParagraph = document.getElementById("teams");
    teamsParagraph.textContent = ""; 

    writeWord(teams[index], teamsParagraph, 0, function() {
        setTimeout(function() {
            removeWord(teamsParagraph, teams[index].length, function() {
                displayTeams((index + 1) % teams.length);
            });
        }, 1000); 
    });
}

function writeWord(word, element, index, callback) {
    if (index < word.length) {
        element.textContent += word.charAt(index);
        setTimeout(function() {
            writeWord(word, element, index + 1, callback);
        }, 100); 
    } else {
        callback();
    }
}

function removeWord(element, length, callback) {
    if (length > 0) {
        element.textContent = element.textContent.slice(0, -1);
        setTimeout(function() {
            removeWord(element, length - 1, callback);
        }, 50); 
    } else {
        callback();
    }
}

displayTeams(0);

const carouselInner = document.querySelector('.carousel-inner');
const prevButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');
const fullboxContainers = [];

// Crée un tableau des éléments fullbox-container
Array.prototype.forEach.call(carouselInner.children, (child) => {
    if (child.classList.contains('fullbox-bottom')) {
        fullboxContainers.push(child);
    }
});

// Définit la fonction pour afficher la diapositive suivante
function showNextSlide() {
    const currentSlide = carouselInner.querySelector('.fullbox-bottom.active');
    const nextSlide = currentSlide.nextElementSibling;
    if (nextSlide) {
        currentSlide.classList.remove('active');
        nextSlide.classList.add('active');
    }
}

// Définit la fonction pour afficher la diapositive précédente
function showPrevSlide() {
    const currentSlide = carouselInner.querySelector('.fullbox-bottom.active');
    const prevSlide = currentSlide.previousElementSibling;
    if (prevSlide) {
        currentSlide.classList.remove('active');
        prevSlide.classList.add('active');
    }
}

// Ajoute les événements aux boutons de navigation
prevButton.addEventListener('click', showPrevSlide);
nextButton.addEventListener('click', showNextSlide);

// Affiche la première diapositive par défaut
fullboxContainers[0].classList.add('active');




