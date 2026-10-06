
const genshinCharacters = [
  { name: 'Raiden Shogun', img: 'Raiden_Shogun_Card.webp' },
  { name: 'Zhongli', img: 'Zhongli_Card.webp' },
  { name: 'Columbina', img: 'Columbina_Card.webp' },
  { name: 'Nahida', img: 'Nahida_Card.webp' },
  { name: 'Furina', img: 'Furina_Card.webp' },
  { name: 'vesna', img: 'Vesna_Card.webp' },
  { name: 'Vodyanitsa', img: 'Vodyanitsa_Card.webp' },
  { name: 'Odette', img: 'Odette_Card.webp' }
];

let cardsData = [];
let flippedCards = [];
let moves = 0;
let matchedPairs = 0;
let lockBoard = false;
let selectedIndex = 0;

let board, movesDisplay, matchesDisplay, winModal, finalMoves;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initGame() {
  board = document.getElementById('board');
  movesDisplay = document.getElementById('moves');
  matchesDisplay = document.getElementById('matches');
  winModal = document.getElementById('winModal');
  finalMoves = document.getElementById('finalMoves');

  board.innerHTML = '';
  flippedCards = [];
  moves = 0;
  matchedPairs = 0;
  lockBoard = false;
  selectedIndex = 0;

  movesDisplay.innerText = moves;
  matchesDisplay.innerText = matchedPairs;
  winModal.style.display = 'none';

  cardsData = shuffle([...genshinCharacters, ...genshinCharacters]);

  cardsData.forEach((char, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = char.name;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-face card-front">
        <div class="card-logo">✨<br>Genshin</div>
      </div>
      <div class="card-face card-back">
        <img src="${char.img}" alt="${char.name}">
      </div>
    `;

    card.addEventListener('click', () => {
      selectedIndex = index;
      updateSelection();
      flipCard(card);
    });

    board.appendChild(card);
  });

  updateSelection();
}

function updateSelection() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, idx) => {
    if (idx === selectedIndex) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.innerText = moves;
    checkMatch();
  }
}

function moveSelection(direction) {
  const cols = 4;
  const total = 16;

  if (direction === 'W' && selectedIndex - cols >= 0) {
    selectedIndex -= cols;
  } else if (direction === 'S' && selectedIndex + cols < total) {
    selectedIndex += cols;
  } else if (direction === 'A' && selectedIndex % cols !== 0) {
    selectedIndex -= 1;
  } else if (direction === 'D' && (selectedIndex + 1) % cols !== 0) {
    selectedIndex += 1;
  }

  updateSelection();
}

function selectCurrentCard() {
  const cards = document.querySelectorAll('.card');
  if (cards[selectedIndex]) {
    flipCard(cards[selectedIndex]);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.name === card2.dataset.name;

  if (isMatch) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    matchesDisplay.innerText = matchedPairs;
    flippedCards = [];

    if (matchedPairs === genshinCharacters.length) {
      setTimeout(() => {
        finalMoves.innerText = moves;
        winModal.style.display = 'flex';
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function restartGame() {
  initGame();
}

document.addEventListener('keydown', (e) => {
  const code = e.code;

  if (code === 'KeyW' || code === 'ArrowUp') moveSelection('W');
  if (code === 'KeyS' || code === 'ArrowDown') moveSelection('S');
  if (code === 'KeyA' || code === 'ArrowLeft') moveSelection('A');
  if (code === 'KeyD' || code === 'ArrowRight') moveSelection('D');

  if (code === 'Enter' || code === 'NumpadEnter' || code === 'Space') {
    e.preventDefault();
    selectCurrentCard();
  }
});

window.onload = () => {
  initGame();

  const btnW = document.getElementById('btn-w');
  const btnA = document.getElementById('btn-a');
  const btnS = document.getElementById('btn-s');
  const btnD = document.getElementById('btn-d');
  const btnSelect = document.getElementById('btn-select');

  if (btnW) btnW.addEventListener('click', () => moveSelection('W'));
  if (btnA) btnA.addEventListener('click', () => moveSelection('A'));
  if (btnS) btnS.addEventListener('click', () => moveSelection('S'));
  if (btnD) btnD.addEventListener('click', () => moveSelection('D'));
  if (btnSelect) btnSelect.addEventListener('click', () => selectCurrentCard());
};