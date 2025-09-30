// Películas disponibles
const allMovies = [
  { es: "Alicia en el País de las Maravillas", poster: "images/Alice_in_Wonderland.jpg" },
  { es: "Carrie", poster: "images/Carrie.jpg" },
  { es: "Gasparín", poster: "images/Casper.jpg" },
  { es: "Clown - El Payaso del Mal", poster: "images/Clown.jpg" },
  { es: "Coraline y la Puerta Secreta", poster: "images/Coraline.jpg" },
  { es: "El Cadáver de la Novia", poster: "images/Corpse_Bride.jpg" },
  { es: "La Maldición de Chucky", poster: "images/Curse_of_Chucky.jpg" },
  { es: "El Joven Manos de Tijera", poster: "images/Edward_Scissorhands.jpg" },
  { es: "La Calle del Terror (1994)", poster: "images/Fear_Street_1994.jpg" },
  { es: "Frankenweenie", poster: "images/Frankenweenie.jpg" },
  { es: "Cazafantasmas", poster: "images/Ghostbusters.jpg" },
  { es: "Halloween", poster: "images/Halloween.jpg" },
  { es: "La Casa del Terror", poster: "images/Haunt.jpg" },
  { es: "Abracadabra (Hocus Pocus)", poster: "images/Hocus_Pocus.jpg" },
  { es: "¡Feliz Halloween!", poster: "images/Hubie_Halloween.jpg" },
  { es: "Eso (IT)", poster: "images/It.jpg" },
  { es: "Es la Gran Calabaza, Charlie Brown", poster: "images/Its_the_Great_Pumpkin,_Charlie_Brown.jpg" },
  { es: "El Cuerpo de Jennifer", poster: "images/Jennifers_Body.jpg" },
  { es: "La Casa de los Villanos de Mickey", poster: "images/Mickeys_House_of_Villains.jpg" },
  { es: "Monster House - La Casa de los Sustos", poster: "images/Monster_House.jpg" },
  { es: "Mi Niñera es un Vampiro", poster: "images/My_Babysitters_a_Vampire_The_Movie.jpg" },
  { es: "Actividad Paranormal", poster: "images/Paranormal_Activity.jpg" },
  { es: "ParaNorman", poster: "images/ParaNorman.jpg" },
  { es: "Scream - Grita antes de morir", poster: "images/Scream.jpg" },
  { es: "Terrifier", poster: "images/Terrifier.jpg" },
  { es: "Los Locos Addams", poster: "images/The_Addams_Family.jpg" },
  { es: "El Extraño Mundo de Jack", poster: "images/The_Nightmare_Before_Christmas.jpg" },
  { es: "La Purga", poster: "images/The_Purge.jpg" },
  { es: "Los Extraños", poster: "images/The_Strangers.jpg" },
  { es: "Toy Story de Terror", poster: "images/Toy_Story_of_Terror.jpg" },
  { es: "Dulce o Truco (Trick 'r Treat)", poster: "images/Trick_‘r_Treat.jpg" }
];

// Variables globales
let movies = [...allMovies];
let watchedMovies = [];
let currentMovie = null;
let countdownInterval = null;
let cooldownEnd = null;

// Elementos DOM
const canvas = document.getElementById('roulette');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');
const historyBtn = document.getElementById('history-btn');
const historyModal = document.getElementById('history-modal');
const historyClose = document.getElementById('history-close');
const cooldownMsg = document.getElementById('cooldown-message');

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  loadData();
  drawRoulette();
  
  // Event listeners
  spinBtn.addEventListener('click', spin);
  modalClose.addEventListener('click', closeModal);
  confirmBtn.addEventListener('click', confirmMovie);
  cancelBtn.addEventListener('click', cancelMovie);
  historyBtn.addEventListener('click', showHistory);
  historyClose.addEventListener('click', closeHistoryModal);
  
  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  
  historyModal.addEventListener('click', function(e) {
    if (e.target === historyModal) closeHistoryModal();
  });
});

// Cargar datos del localStorage
function loadData() {
  const saved = JSON.parse(localStorage.getItem('halloweenRoulette') || '{}');
  watchedMovies = saved.watchedMovies || [];
  cooldownEnd = saved.cooldownEnd || null;
  
  movies = allMovies.filter(m => !watchedMovies.some(w => w.es === m.es));
  
  checkCooldown();
}

// Guardar datos en localStorage
function saveData() {
  localStorage.setItem('halloweenRoulette', JSON.stringify({
    watchedMovies,
    cooldownEnd
  }));
}

// Verificar cooldown de 10 horas
function checkCooldown() {
  if (cooldownEnd && Date.now() < cooldownEnd) {
    const remaining = cooldownEnd - Date.now();
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    cooldownMsg.textContent = `⏰ Espera ${hours}h ${minutes}m para girar de nuevo`;
    cooldownMsg.style.display = 'block';
    spinBtn.disabled = true;
    setTimeout(checkCooldown, 60000);
  } else {
    cooldownMsg.style.display = 'none';
    spinBtn.disabled = false;
    cooldownEnd = null;
    saveData();
  }
}

// Dibujar la ruleta
function drawRoulette() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 275;
  const numSegments = movies.length;
  
  if (numSegments === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡Todas las películas vistas!', centerX, centerY);
    return;
  }
  
  const arcSize = (2 * Math.PI) / numSegments;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSegments; i++) {
    const angle = i * arcSize;
    const colors = ['#5f0f40', '#9a031e', '#fb8b24', '#e36414', '#0f4c5c'];
    ctx.fillStyle = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px "Nosifer", cursive';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 3;

    let text = movies[i].es;
    if (text.length > 25) text = text.substring(0, 22) + '...';
    ctx.fillText(text, radius - 10, 5);
    ctx.restore();
  }

  
}

// Girar la ruleta
function spin() {
 

  if (spinBtn.disabled || movies.length === 0) return;
  
  spinBtn.disabled = true;
  let rotation = 0;
  const finalRotation = Math.random() * 360 + 1800;
  const duration = 4000;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    
    rotation = finalRotation * eased;
    canvas.style.transform = `rotate(${rotation}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      selectMovie(rotation);
    }
  }
  animate();
}

  audio.volume = 0.1; // 0% del volumen máximo

// Seleccionar película
function selectMovie(rotation) {
  const normalizedRotation = (360 - (rotation % 360)) % 360;
  const arcSize = 360 / movies.length;
  const selectedIndex = Math.floor(normalizedRotation / arcSize) % movies.length;
  
  currentMovie = movies[selectedIndex];
  showModal(currentMovie);
}

// Mostrar modal
function showModal(movie) {
  document.getElementById('modal-poster').src = movie.poster;
  document.getElementById('modal-title').textContent = movie.es;
  document.getElementById('modal-question').textContent = '¿Veremos esta película?';
  document.getElementById('countdown-timer').style.display = 'block';
  document.querySelector('.modal-buttons').style.display = 'flex';
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  startCountdown();
}

// Cerrar modal
function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  canvas.style.transform = 'rotate(0deg)';
  spinBtn.disabled = false;
}

// Cuenta regresiva de 5 minutos
function startCountdown() {
  let timeLeft = 300;
  const timerEl = document.getElementById('countdown-timer');
  
  function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      cancelMovie();
    }
    timeLeft--;
  }
  
  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
}

// Confirmar película
function confirmMovie() {
  if (!currentMovie) return;
  
  watchedMovies.push(currentMovie);
  movies = movies.filter(m => m.es !== currentMovie.es);
  
  cooldownEnd = Date.now() + (10 * 60 * 60 * 1000);
  
  saveData();
  closeModal();
  drawRoulette();
  checkCooldown();
  
  if (movies.length === 0) {
    alert('🎉 ¡Hemos visto todas las películas! 🎉');
  }
}

// Cancelar película
function cancelMovie() {
  closeModal();
}

// Mostrar historial
function showHistory() {
  const grid = document.getElementById('history-grid');
  grid.innerHTML = '';
  
  if (watchedMovies.length === 0) {
    grid.innerHTML = '<p style="color: #ff6600; grid-column: 1/-1; font-size: 1.2rem;">No hemos visto ninguna película aún 🎃</p>';
  } else {
    watchedMovies.forEach(movie => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
        <img src="${movie.poster}" alt="${movie.es}">
        <div class="history-item-name">${movie.es}</div>
      `;
      item.onclick = () => showMovieDetail(movie);
      grid.appendChild(item);
    });
  }
  
  historyModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Cerrar historial
function closeHistoryModal() {
  historyModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Mostrar detalle de película del historial
function showMovieDetail(movie) {
  closeHistoryModal();
  
  document.getElementById('modal-poster').src = movie.poster;
  document.getElementById('modal-title').textContent = movie.es;
  document.getElementById('modal-question').textContent = '¡Película vista! 🎃';
  document.getElementById('countdown-timer').style.display = 'none';
  document.querySelector('.modal-buttons').style.display = 'none';
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
