// ===== Responzivní navigace =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const closeIcon = document.querySelector('.close-icon');
    const menu = document.querySelector('.menu');

    hamburgerIcon.addEventListener('click', function() {
        menu.classList.add('active');
        hamburgerIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    });

    closeIcon.addEventListener('click', function() {
        menu.classList.remove('active');
        closeIcon.style.display = 'none';
        hamburgerIcon.style.display = 'block';
    });

    // Zavření menu při kliknutí na položku (pouze na menších obrazovkách)
    document.querySelectorAll('.menu li a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 769) {
                menu.classList.remove('active');
                closeIcon.style.display = 'none';
                hamburgerIcon.style.display = 'block';
            }
        });
    });

    // Při načtení stránky zajistíme, že je křížek skrytý
    closeIcon.style.display = 'none';
});

// ===== Rezervační formulář a kalkulace ceny =====
function showReservationForm(movieName, movieTime) {
    const form = document.getElementById('reservation-form');
    const selectedMovie = document.getElementById('selected-movie');
    const selectedTime = document.getElementById('selected-time');
    // Nepřímo získáváme filmovou kartu z event.target
    const movieCard = event.target.closest('.film-card');

    selectedMovie.textContent = `Film: ${movieName}`;
    selectedTime.textContent = `Čas projekce: ${movieTime}`;

    // Nastavení ceny filmu z data atributu
    const moviePriceElement = movieCard.querySelector('.film-price[data-price]');
    const moviePriceValue = moviePriceElement ? moviePriceElement.dataset.price : 0;
    document.getElementById("film-price").textContent = `Cena filmu: ${moviePriceValue} Kč`;
    document.getElementById("film-price").dataset.price = moviePriceValue;

    form.classList.remove('hidden');
    document.getElementById("ticket-count").value = 1;
    updateTotalPrice();
}

function updateTotalPrice() {
    const moviePrice = parseFloat(document.getElementById("film-price").dataset.price);
    const ticketCount = document.getElementById("ticket-count").value;
    const totalPrice = moviePrice * ticketCount;
    document.getElementById("total-price").value = `Celková cena: ${totalPrice.toFixed(2)} Kč`;
}

document.getElementById("ticket-count").addEventListener("input", updateTotalPrice);

// ===== Inicializace rezervační logiky a validací =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.reserve-btn').forEach(button => {
        button.addEventListener('click', function() {
            const movieName = button.getAttribute('data-movie');
            const movieTime = button.getAttribute('data-time');
            showReservationForm(movieName, movieTime);
        });
    });

    // Přiřazení funkcí pro tlačítka ve formuláři
    const buttons = document.querySelectorAll('.button-container button');
    buttons[0].addEventListener('click', submitForm);
    buttons[1].addEventListener('click', hideReservationForm);

    // Nastavení validace pro emaily a hesla
    const email = document.querySelector('input[placeholder="Email"]');
    const confirmEmail = document.querySelector('input[placeholder="Potvrďte e-mail"]');
    email.addEventListener('input', validateEmails);
    confirmEmail.addEventListener('input', validateEmails);

    const password = document.querySelector('input[placeholder="Heslo"]');
    const confirmPassword = document.querySelector('input[placeholder="Potvrďte heslo"]');
    password.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', checkPasswordsMatch);
});

// Skrytí rezervačního formuláře při načtení stránky
window.onload = () => {
    hideReservationForm();
};

// ===== Validace formuláře =====
function validateEmails() {
    const email = document.querySelector('input[placeholder="Email"]');
    const confirmEmail = document.querySelector('input[placeholder="Potvrďte e-mail"]');
    const errorMessage = document.getElementById('confirm-email-error');
    errorMessage.textContent = email.value !== confirmEmail.value ? 'E-maily se neshodují!' : '';
}

function hideReservationForm() {
    document.getElementById('reservation-form').classList.add('hidden');
}

function submitForm(event) {
    event.preventDefault();
    let isValid = validateInputs();
    if (isValid) {
        alert('Rezervace byla úspěšně odeslána!');
        hideReservationForm();
    }
}

function validateInputs() {
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    isValid = validateField('Jméno', 'name-error') && isValid;
    isValid = validateField('Příjmení', 'surname-error') && isValid;
    isValid = validateEmail() && isValid;
    isValid = checkEmailsMatch() && isValid;
    isValid = validatePassword() && isValid;
    isValid = checkPasswordsMatch() && isValid;
    isValid = validateTicketCount() && isValid;
    return isValid;
}

function validateField(placeholder, errorId) {
    const input = document.querySelector(`input[placeholder="${placeholder}"]`);
    const error = document.getElementById(errorId);
    input.addEventListener('input', () => {
        error.textContent = '';
    });
    if (!input.value.trim()) {
        error.textContent = `Zadejte ${placeholder.toLowerCase()}!`;
        return false;
    }
    return true;
}

function validateEmail() {
    const email = document.querySelector('input[placeholder="Email"]');
    const error = document.getElementById('email-error');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        error.textContent = 'Zadejte platný email!';
        return false;
    }
    return true;
}

function checkEmailsMatch() {
    const email = document.querySelector('input[placeholder="Email"]');
    const confirmEmail = document.querySelector('input[placeholder="Potvrďte e-mail"]');
    const errorMessage = document.getElementById('confirm-email-error');
    if (email.value !== confirmEmail.value) {
        errorMessage.textContent = 'E-maily se neshodují!';
        return false;
    }
    errorMessage.textContent = '';
    return true;
}

function validatePassword() {
    const password = document.querySelector('input[placeholder="Heslo"]');
    const error = document.getElementById('password-error');
    if (!password.value) {
        error.textContent = 'Zadejte heslo!';
        return false;
    }
    if (password.value.length < 8) {
        error.textContent = 'Heslo musí mít alespoň 8 znaků!';
        return false;
    }
    if (!/[A-Z]/.test(password.value)) {
        error.textContent = 'Heslo musí obsahovat alespoň jedno velké písmeno!';
        return false;
    }
    if (!/[0-9]/.test(password.value)) {
        error.textContent = 'Heslo musí obsahovat alespoň jednu číslici!';
        return false;
    }
    if (!/[!@#$%^&*]/.test(password.value)) {
        error.textContent = 'Heslo musí obsahovat alespoň jeden speciální znak (!@#$%^&*)!';
        return false;
    }
    error.textContent = '';
    return true;
}

function checkPasswordsMatch() {
    const password = document.querySelector('input[placeholder="Heslo"]');
    const confirmPassword = document.querySelector('input[placeholder="Potvrďte heslo"]');
    const error = document.getElementById('confirm-password-error');
    if (!confirmPassword.value) {
        error.textContent = 'Potvrďte heslo!';
        return false;
    }
    if (password.value !== confirmPassword.value) {
        error.textContent = 'Hesla se neshodují!';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateTicketCount() {
    const ticketCount = document.getElementById('ticket-count');
    const error = document.getElementById('ticket-error');
    if (ticketCount.value < 1) {
        error.textContent = 'Počet vstupenek musí být alespoň 1!';
        return false;
    }
    return true;
}

// Odstranění chybových hlášek při zadávání do libovolného inputu
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        const errorElement = document.getElementById(`${input.placeholder.toLowerCase()}-error`);
        if (errorElement) errorElement.textContent = '';
    });
});

// ===== Přepínání tématu a inicializace mapy =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const lightLogo = document.querySelector('.light-logo');
const darkLogo = document.querySelector('.dark-logo');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        lightLogo.style.display = 'block';
        darkLogo.style.display = 'none';
        themeToggle.textContent = '🌙';
    } else {
        lightLogo.style.display = 'none';
        darkLogo.style.display = 'block';
        themeToggle.textContent = '🌞';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Inicializace mapy pomocí Leaflet
    const map = L.map('map').setView([50.0755, 14.4378], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([50.0755, 14.4378]).addTo(map)
        .bindPopup("Kino Lumina<br>Náměstí filmových hvězd 12, Praha")
        .openPopup();
});

// ===== Tlačítko "Scroll to Top" =====
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Posun a návrat formuláře na menších obrazovkách =====
document.addEventListener("DOMContentLoaded", function() {
    const reserveBtns = document.querySelectorAll('.reserve-btn');
    const reservationForm = document.getElementById('reservation-form');
    const closeBtn = reservationForm.querySelector('button[type="button"]:last-of-type');
    const reservationSection = document.getElementById('reservation-section');
    let scrollPosition = 0;

    reserveBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            if (window.innerWidth < 769) {
                e.preventDefault();
                scrollPosition = window.scrollY;
                if (reservationForm.classList.contains('hidden')) {
                    reservationForm.classList.remove('hidden');
                }
                reservationSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            reservationForm.classList.add('hidden');
            if (window.innerWidth < 769) {
                setTimeout(function() {
                    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
                }, 300); 
            }
        });
    }
});