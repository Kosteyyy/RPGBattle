const readlineSync = require('readline-sync');
const { monster, magician } = require('./data.js');


class Character {
	constructor(data) {
		this.name = data.name;
		this.moves = data.moves;
		this.maxHealth = data.maxHealth;
		this.health = this.maxHealth;
		this.currentMoveIndex = 0;
	}
	sayCurrentMove() {
		let move = this.moves[this.currentMoveIndex];
		console.log(`${move.name}: ФизУрон: ${move.physicalDmg}, МагУрон: ${move.magicDmg}, ФизБроня: ${move.physicArmorPercents}%, МагБроня: ${move.magicArmorPercents}%`);
	}

	sayAllMoves() {		
		console.log(`\nХоды ${this.name}:`)
		this.moves.forEach((move, i) => {
			console.log(`${i} - ${move.name} ${move.cooldownRounds > 0 ? "- до конца кулдауна " + move.cooldownRounds : ''}`);
		});
	}

	attackedBy(caracter) {
		let move = caracter.moves[caracter.currentMoveIndex];
		let damage = Math.round((move.physicalDmg * (100 - this.moves[this.currentMoveIndex].physicArmorPercents) / 100 +
			move.magicDmg * (100 - this.moves[this.currentMoveIndex].magicArmorPercents) /100) *10) / 10;
		this.health = Math.round((this.health - damage) * 10)/10;
		console.log(`${this.name} получает от ${caracter.name} ${damage} урона. Остаток здоровья - ${this.health}`);
	}

	endRound() {
		this.moves[this.currentMoveIndex].cooldownRounds = this.moves[this.currentMoveIndex].cooldown + 1;
		this.moves.forEach(move => {
			if(move.cooldownRounds > 0) move.cooldownRounds--;
		})
	}

	getCurrentMoveIndex() {
			do {
			console.log(`Выберите ход для ${this.name} (0)` );
			let move = readlineSync.question('') || 0; //читаем число, при пустом вводе - по умолчанию 0
			//валидируем ввод. если ввод состоит из цифр и допустим, возвращаем его.
			if (/^\d+$/.test(move) && move < this.moves.length) {
				if (this.moves[move].cooldownRounds > 0) {
					console.log("Ход на кулдауне. Выберите другой");
				} else {
					this.currentMoveIndex = move;
					return;
				}
			} else {
				console.log(`Неправильный ввод. Нужно ввести число от 0 до ${this.moves.length - 1}`);
			}
		}
		while (true);
		}

		setRandomMove() {
			do {
				let moveIndex = Math.floor(Math.random() * this.moves.length);
				if (!(this.moves[moveIndex].cooldownRounds > 0)) {
					this.currentMoveIndex = moveIndex;
					break;
				}
			}
			while (true);
		}
}

function playRPGBattle() {
	greetings();
	do {
		playGame();
	}
	while(wantToPlay());
	console.log("Спасибо за игру. До свидания!")
}

function greetings() {
	console.log("Приветствую Вас! \nЭто игра 'RPG Battle'. \nВы - маг Евстафий и Вам нужно победить монстра Лютого");
}

function playGame() {
	let luty = new Character(monster);
	let evstafi = new Character(magician);
	evstafi.maxHealth = getHealth();
	evstafi.health = evstafi.maxHealth;
	do {
		luty.setRandomMove();
		console.log("\nЛютый применит:");
		luty.sayCurrentMove();
		evstafi.sayAllMoves();
		evstafi.getCurrentMoveIndex();
		
		console.log("Евстафий применит: ");
		evstafi.sayCurrentMove();
		evstafi.attackedBy(luty);
		luty.attackedBy(evstafi);
		evstafi.endRound();
		luty.endRound();
		if (luty.health <= 0 && evstafi.health <= 0 ) {
			console.log("Ничья. Лютый и Евстафий погибли.");
			break;
		} else if (luty.health <= 0) {
			console.log("Евстафий победил!");
			break;
		} else if (evstafi.health <= 0) {
			console.log("Лютый победил");
			break;
		}
	}
	while(true);
}

function getHealth() {
	do {
			console.log("Введите уровень здоровья Евстафия (по умолчанию - 10)");
			let health = readlineSync.question('') || 10; //читаем число, при пустом вводе - по умолчанию 5
			//валидируем ввод. если ввод состоит из цифр, возвращаем его.
			if (/^\d+$/.test(health)) {
				return Number(health);
			} else {console.log("Неправильный ввод. Нужно ввести число")}
	}
	while (true);
}

function wantToPlay() {
	do {
			console.log("\nХотите сыграть ещё? (y/n)");
			let answer = readlineSync.question(''); //читаем число, при пустом вводе - по умолчанию 5
			//валидируем ввод. если ввод состоит из одной цифры и она от 3 до 6 возвращаем результат. Иначе ошибка.
			if (answer === 'y') {
				return true;
			} else if (answer === 'n') {
				return false;
			}
			else {console.log("Неправильный ввод.")}
	}
	while (true);
}

playRPGBattle();

