// ==============================
// === Inicializace po načtení DOM ===
// ==============================
/**
 * Inicializuje všechny funkcionality po načtení DOM.
 */
window.addEventListener('DOMContentLoaded', function () {
    // ==============================
    // === Responzivní navigace ===
    // ==============================

    /**
     * Vybere elementy pro navigaci a nastaví event listenery.
     * Po kliknutí na hamburger ikonu se zobrazí menu, po kliknutí na křížek se menu skryje.
     */
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const closeIcon = document.querySelector('.close-icon');
    const menu = document.querySelector('.menu');

    hamburgerIcon.addEventListener('click', function () {
        menu.classList.add('active');
        hamburgerIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    });

    closeIcon.addEventListener('click', function () {
        menu.classList.remove('active');
        closeIcon.style.display = 'none';
        hamburgerIcon.style.display = 'block';
    });

    /**
     * Zavře menu při kliknutí na odkaz (na mobilních zařízeních).
     */
    document.querySelectorAll('.menu li a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 769) {
                menu.classList.remove('active');
                closeIcon.style.display = 'none';
                hamburgerIcon.style.display = 'block';
            }
        });
    });

    // Zajištění, že křížek je při načtení stránky skrytý.
    closeIcon.style.display = 'none';

    // =====================================================
    // === Rezervační formulář – validace a logika ===
    // =====================================================

    // ======= Získání všech důležitých prvků z DOM =======
    const elements = {
        filmSelect: document.getElementById("film-select"),
        filmCards: document.querySelectorAll(".film-card"),
        selectedTime: document.getElementById("selected-time"),
        filmPriceDisplay: document.getElementById("film-price"),
        ticketCount: document.getElementById("ticket-count"),
        totalPrice: document.getElementById("total-price"),
        formInputs: document.querySelectorAll("input"),
        submitBtn: document.getElementById("submit-btn"),
        cancelBtn: document.getElementById("cancel-btn"),
        passwordField: document.getElementById("password"),
    };
    // ==============================
    // === Pomocné funkce ===
    // ==============================
    /**
     * Vrací element podle ID.
     * @param {string} id - ID elementu.
     * @returns {HTMLElement} Element s daným ID.
     */
    const getElement = id => document.getElementById(id);

    /**
     * Vymaže všechny chybové zprávy.
     */
    const clearErrors = () =>
        document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    // ==============================
    // === Aktualizace UI ===
    // ==============================
    /**
     * Aktualizuje zobrazené informace o vybraném filmu.
     * Získá data z vybrané možnosti v selectu a aktualizuje cenu a čas projekce.
     */
    function updateFilmInfo() {
        const selectedOption = elements.filmSelect.options[elements.filmSelect.selectedIndex];
        const price = selectedOption.dataset.price || "0";
        const time = selectedOption.dataset.time || "";

        elements.filmPriceDisplay.textContent = `Cena filmu: ${price} Kč`;
        elements.filmPriceDisplay.dataset.price = price;
        elements.selectedTime.textContent = `Čas projekce: ${time}`;
    }

    /**
     * Přepočítá a aktualizuje celkovou cenu na základě počtu vstupenek a ceny filmu.
     */
    function updateTotalPrice() {
        const ticketCount = parseInt(elements.ticketCount.value) || 0;
        const filmPrice = parseFloat(elements.filmPriceDisplay.dataset.price) || 0;
        const total = ticketCount * filmPrice;

        elements.totalPrice.value = `Celková cena: ${total.toFixed(2)} Kč`;
    }

    /**
     * Resetuje formulář a obnoví výchozí hodnoty.
     */
    function resetForm() {
        elements.filmSelect.selectedIndex = 0;
        elements.selectedTime.textContent = "Čas projekce:";
        elements.filmPriceDisplay.textContent = "Cena filmu: 0 Kč";
        elements.filmPriceDisplay.dataset.price = "0";

        ["name", "surname", "email", "confirm-email", "password", "confirm-password"].forEach(id => {
            getElement(id).value = "";
        });

        elements.ticketCount.value = 1;
        elements.totalPrice.value = "Celková cena: 0 Kč";

        clearErrors();
        updateTotalPrice();
    }
    // ==============================
    // === Validace ===
    // ==============================
    /**
     * Ověří, zda je dané pole vyplněno.
     * Pokud není, přiřadí chybovou zprávu (třetí parametr lze využít pro vlastní zprávu).
     * @param {string} id - ID ověřovaného pole.
     * @param {string} errorId - ID elementu, kam se vypíše chybová zpráva.
     * @param {string} [message] - (Nepovinný) Text chybové zprávy.
     * @returns {boolean} true, pokud pole není prázdné; jinak false.
     */
    function validateField(id, errorId, message) {
        const value = getElement(id).value.trim();
        if (!value) {
            // Pokud není předána vlastní zpráva, vytvoří se defaultní chybová zpráva.
            const fieldLabel = id === "name" ? "jméno" : id === "surname" ? "příjmení" : id.toLowerCase();
            getElement(errorId).textContent = message || `Zadejte ${fieldLabel}!`;
            return false;
        }
        return true;
    }

    /**
     * Ověří formát emailu pomocí regulárního výrazu.
     * @returns {boolean} true, pokud je email ve správném formátu; jinak false.
     */
    function validateEmailFormat() {
        const email = getElement("email").value;
        const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        const error = getElement("email-error");

        if (!regex.test(email)) {
            error.textContent = "Zadejte platný email!";
            return false;
        }
        return true;
    }

    /**
     * Porovná hodnoty dvou polí a ověří, zda se shodují.
     * Používá se například pro ověření shody emailů nebo hesel.
     * @param {string} field1Id - ID prvního pole.
     * @param {string} field2Id - ID druhého pole.
     * @param {string} errorId - ID elementu pro chybovou zprávu.
     * @param {string} message - Chybová zpráva, pokud se hodnoty neshodují.
     * @returns {boolean} true, pokud se hodnoty shodují; jinak false.
     */
    function validateMatch(field1Id, field2Id, errorId, message) {
        const val1 = getElement(field1Id).value;
        const val2 = getElement(field2Id).value;
        if (val1 !== val2) {
            getElement(errorId).textContent = message;
            return false;
        }
        return true;
    }

    /**
     * Validuje heslo podle zadaných kritérií:
     * - Minimálně 8 znaků
     * - Obsahuje alespoň jedno velké písmeno
     * - Obsahuje alespoň jednu číslici
     * - Obsahuje alespoň jeden speciální znak (!@#$%^&*)
     * @returns {boolean} true, pokud heslo splňuje kritéria; jinak false.
     */
    function validatePassword() {
        const password = getElement("password").value;
        const error = getElement("password-error");

        // Podmínky pro validaci hesla
        const isValid = password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*]/.test(password);

        if (!isValid) {
            error.textContent = "Heslo musí mít alespoň 8 znaků, obsahovat velké písmeno, číslici a speciální znak (!@#$%^&*)!";
            return false;
        }
        return true;
    }

    /**
     * Ověří, zda je počet vstupenek alespoň 1.
     * @returns {boolean} true, pokud je počet vstupenek validní; jinak false.
     */
    function validateTicketCount() {
        const count = parseInt(elements.ticketCount.value);
        if (count < 1) {
            getElement("ticket-error").textContent = "Počet vstupenek musí být alespoň 1!";
            return false;
        }
        return true;
    }

    /**
     * Spustí všechny validační funkce a vrátí celkový výsledek validace.
     * Kombinuje kontrolu vyplnění polí, validaci emailu, shodu emailů, validaci hesla a shodu hesel.
     * @returns {boolean} true, pokud všechny kontroly projdou; jinak false.
     */
    function validateAll() {
        clearErrors();
        let valid = true;

        valid = validateField("name", "name-error") && valid;
        valid = validateField("surname", "surname-error") && valid;
        valid = validateEmailFormat() && valid;
        valid = validateMatch("email", "confirm-email", "confirm-email-error", "E-maily se neshodují!") && valid;
        valid = validatePassword() && valid;
        valid = validateMatch("password", "confirm-password", "confirm-password-error", "Hesla se neshodují!") && valid;
        valid = validateTicketCount() && valid;

        return valid;
    }
    // ==============================
    // === Event Handlers ===
    // ==============================
    elements.submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (validateAll()) {
            alert("Rezervace byla úspěšně odeslána!");
        }
    });

    elements.cancelBtn.addEventListener("click", resetForm);

    elements.filmSelect.addEventListener("change", () => {
        updateFilmInfo();
        updateTotalPrice();
    });

    elements.ticketCount.addEventListener("input", updateTotalPrice);

    elements.formInputs.forEach(input => {
        input.addEventListener("input", () => {
            const errorEl = getElement(`${input.id}-error`);
            if (errorEl) errorEl.textContent = "";
        });
    });
    // ==============================
    // ===Tooltip pro heslo ===
    // ==============================
    /**
     * Přidá tooltip (nápovědu) pod pole hesla, který se zobrazí při focusu a skryje při blur.
     */
    if (elements.passwordField) {
        const hint = document.createElement("div");
        hint.id = "password-hint";
        hint.textContent = "Heslo musí mít alespoň 8 znaků, obsahovat velké písmeno, číslici a speciální znak (!@#$%^&*).";
        Object.assign(hint.style, {
            display: "none",
            fontSize: "0.9em",
            color: "#666"
        });
        elements.passwordField.insertAdjacentElement("afterend", hint);

        elements.passwordField.addEventListener("focus", () => {
            hint.style.display = "block";
        });
        elements.passwordField.addEventListener("blur", () => {
            hint.style.display = "none";
        });
    }
    // ==============================
    // === Inicializace ===   
    // ==============================
    /**
     * Generuje položky do selectu na základě filmových karet.
     * Iteruje přes všechny filmové karty, získává jejich název, cenu a čas projekce
     * a vytváří nové možnosti, které se přidají do selectu.
     */
    elements.filmCards.forEach(card => {
        const title = card.querySelector("h3").textContent.trim();
        const price = card.querySelector(".film-price").dataset.price;
        const time = card.querySelector(".film-time").textContent.replace("Datum a čas projekce: ", "").trim();

        const option = document.createElement("option");
        option.value = title;
        option.dataset.price = price;
        option.dataset.time = time;
        option.textContent = title;

        elements.filmSelect.appendChild(option);
    });

    updateFilmInfo();
    updateTotalPrice();

    // ==============================
    // ===== Mapa =====
    // ==============================

    /**
     * Inicializuje mapu pomocí Leaflet.js, nastavuje počáteční pozici,
     * přidává dlaždice a umisťuje marker s pop-upem.
     */
    const map = L.map('map').setView([50.0755, 14.4378], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([50.0755, 14.4378]).addTo(map)
        .bindPopup("Kino Lumina<br>Náměstí filmových hvězd 12, Praha")
        .openPopup();
});

// ==============================
// ===== Tlačítko "Scroll to Top" =====
// ==============================

/**
 * Zobrazuje tlačítko "Scroll to Top" po odscrollování a nastavuje jeho funkčnost.
 */
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
    scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==============================
// ===== Dark Mode Toggle =====
// ==============================

/**
 * Přepíná web mezi tmavým a světlým režimem.
 * Tato funkce přidává nebo odstraňuje třídu 'dark-mode' na elementu <body>,
 * mění viditelnost log a ukládá vybraný režim do localStorage.
 */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const lightLogo = document.querySelector('.light-logo');
const darkLogo = document.querySelector('.dark-logo');

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        lightLogo.style.display = 'block';
        darkLogo.style.display = 'none';
        themeToggle.textContent = '🌙';
    } else {
        body.classList.remove('dark-mode');
        lightLogo.style.display = 'none';
        darkLogo.style.display = 'block';
        themeToggle.textContent = '🌞';
    }
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
});