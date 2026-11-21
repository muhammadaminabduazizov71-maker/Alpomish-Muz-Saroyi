// 1. Dark Mode va White Mode almashtirish
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');

    icon.style.transform = 'rotate(360deg) scale(0.8)';
    setTimeout(() => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            icon.textContent = '🌙';
        } else {
            html.classList.add('dark');
            icon.textContent = '☀️';
        }
        icon.style.transform = 'rotate(0deg) scale(1)';
    }, 150);
}

// 2. Yeguliklar Modalini ochish / yopish
function toggleFoodModal() {
    const modal = document.getElementById('food-modal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// 3. Chipta hisob-kitobi
const prices = {
    child: 60000,
    adult: 90000,
    vip: 150000
};

const quantities = {
    child: 0,
    adult: 1,
    vip: 0
};

const dateInput = document.getElementById('visit-date');
if (dateInput) {
    dateInput.valueAsDate = new Date();
}

function updateTicket(type, change) {
    if (quantities[type] + change >= 0) {
        quantities[type] += change;
        const qtyEl = document.getElementById(`qty-${type}`);
        qtyEl.textContent = quantities[type];

        // Raqam o'zgarganda qisqa scale animatsiya
        qtyEl.style.transform = 'scale(1.3)';
        setTimeout(() => {
            qtyEl.style.transform = 'scale(1)';
        }, 140);

        calculateTotal();
    }
}

function calculateTotal() {
    const totalCount = quantities.child + quantities.adult + quantities.vip;
    const totalPrice =
        (quantities.child * prices.child) +
        (quantities.adult * prices.adult) +
        (quantities.vip * prices.vip);

    document.getElementById('total-count').textContent = `${totalCount} dona`;
    document.getElementById('total-price').textContent = `${totalPrice.toLocaleString('ru-RU')} so'm`;
}

function buyTickets() {
    const totalCount = quantities.child + quantities.adult + quantities.vip;
    if (totalCount === 0) {
        alert("Iltimos, kamida 1 ta chipta tanlang!");
        return;
    }

    document.getElementById('modal-date').textContent = document.getElementById('visit-date').value;
    document.getElementById('modal-time').textContent = document.getElementById('visit-time').value;
    document.getElementById('modal-qty').textContent = `${totalCount} dona`;
    document.getElementById('modal-sum').textContent = document.getElementById('total-price').textContent;

    const modal = document.getElementById('ticket-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeTicketModal() {
    const modal = document.getElementById('ticket-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// 4. Qoidalar hujjatini tasdiqlash
function submitRulesDocument(event) {
    event.preventDefault();

    const name = document.getElementById('visitor-name').value.trim();
    const size = document.getElementById('skate-size').value;
    const sign = document.getElementById('visitor-sign').value.trim();

    document.getElementById('doc-status').innerHTML =
        "✅ Holat: <span class='text-emerald-500'>Tasdiqlangan</span>";
    document.getElementById('stamp-details').textContent =
        `Tashrifchi: ${name} | Razmer: ${size} | Imzo: ${sign}`;

    const stampBox = document.getElementById('official-stamp');
    stampBox.classList.remove('hidden');
}

// 5. Sahifada pastga tushganda elementlarni chiroyli chiqarish (IntersectionObserver)
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// 6. Qor yog'ish animatsiyasi (Canvas)
const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const snowflakes = Array.from({ length: 75 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 3.2 + 1,
    d: Math.random() * 1.1 + 0.5,
    drift: Math.random() * 1.5
}));

function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(56, 189, 248, 0.55)';
    ctx.beginPath();

    for (const flake of snowflakes) {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    }

    ctx.fill();
    moveSnow();
    requestAnimationFrame(drawSnow);
}

function moveSnow() {
    for (const flake of snowflakes) {
        flake.y += flake.d;
        flake.x += Math.sin(flake.y * 0.012 + flake.drift) * 0.65;

        if (flake.y > height) {
            flake.y = -6;
            flake.x = Math.random() * width;
        }
    }
}

drawSnow();