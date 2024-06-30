const gridContainer = document.querySelector(".grid-container")
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let tries = 0;

document.querySelector(".score").textContent = score;

fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });

function shuffleCards() {
    let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for(let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name",card.name);
        cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click",flipCard);
    }
}

function flipCard() {
    if (lockBoard)  return;
    if (this === firstCard) return;
    
    this.classList.add("flipped");
    this.classList.add("selected")

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    // score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch? disableCards() : unflipCards();
}
// const removeBorder = setTimeout(() => {
//     firstCard.classList.add("unselected");
//     secondCard.classList.add("unselected");
// }, 200);

function disableCards() {
    firstCard.removeEventListener("click",flipCard);
    secondCard.removeEventListener("click",flipCard);
    firstCard.classList.add("unselected");
    secondCard.classList.add("unselected");
    score++;
    document.querySelector(".score").textContent = score;
    if (score === 9){
        alert("You have finally won! Press Restart to reset the Board")
    }
    resetBoard();
}

function unflipCards() {
    setTimeout(()=> {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard.classList.remove("selected");
        secondCard.classList.remove("selected");
        tries++;
        document.querySelector(".tries").textContent = tries;
        resetBoard();
    },1000);
}
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    // removeBorder();
}
function restart() {
    resetBoard();
    shuffleCards();
    score = 0,tries = 0;
    document.querySelector(".score").textContent = score;
    document.querySelector(".tries").textContent = tries;
    gridContainer.innerHTML = "";
    generateCards();
}