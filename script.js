const timeSettings = {
	Case_Building: [600], // 10 minutes in seconds
	Pembicara_Pertama: [60, 240, 300], // 1 minute, 4 minutes, 5 minutes in seconds
	Pembicara_Kedua: [60, 360, 420], // 1 minute, 6 minutes, 7 minutes in seconds
	Pembicara_Ketiga: [60, 360, 420], // 1 minute, 6 minutes, 7 minutes in seconds
	Penyimpul: [180], // 3 minutes in seconds
};

const interruptionTimeLimit = 15; // 15 seconds in seconds
const interruptionPauseLimit = 30; // 30 seconds every interruption
const phaseOrder = [
	'Case Building',
	'Pembicara Pertama Pemerintah',
	'Pembicara Pertama Oposisi',
	'Pembicara Kedua Pemerintah',
	'Pembicara Kedua Oposisi',
	'Pembicara Ketiga Pemerintah',
	'Pembicara Ketiga Oposisi',
	'Pembicara Penyimpul Oposisi',
	'Pembicara Penyimpul Pemerintah',
];

const startButton = document.querySelector('.startButton');
const pauseButton = document.querySelector('.pauseButton');
let startTime = false;
let interruptionTime = false;
let currentPhase = 'Case Building';
let time = 0;
let interruptionTimeCount = 0;
let timerinterruptionType = false;
let timeLimit = timeSettings.Case_Building[0];
let interruptionPauseCountdown = 0;

function load() {
	const timeMaxMinutes = Math.floor(timeLimit / 60);
	const timeMaxSeconds = timeLimit % 60;
	
	document.querySelector('.currentPhaseDisplay').textContent = currentPhase;
	document.querySelector('.timerMax').textContent =
		`${timeMaxMinutes.toString().padStart(2, '0')} : ${timeMaxSeconds.toString().padStart(2, '0')}`;

}

startButton.addEventListener('click', () => {
	if (startTime || interruptionTime) return;
    if (!startTime && !timerinterruptionType) { 
        startTime = true;
        setTimeout(updateTimerDisplay, 1000);
	}
	else if (!interruptionTime && timerinterruptionType) {
		interruptionTime = true;
		setTimeout(updateinterruptionTimer, 1000);
	}
});

pauseButton.addEventListener('click', () => {
	startTime = false;
	interruptionTime = false;
});

function updateTimerDisplay() {
    if (!startTime) return;
    const currentPhaseIndex = phaseOrder.indexOf(currentPhase);

    const mainTimerDisplay = document.querySelector('.mainTimerDisplay');
    time++;

    if (time >= timeLimit) { 
		mainTimerDisplay.classList.add('timerIsUp');
		if (mainTimerDisplay.classList.contains('nointerruptionTime')) {
			mainTimerDisplay.classList.remove('nointerruptionTime');
		}
    }
    else if (currentPhaseIndex >= 1 && currentPhaseIndex <= 6) {
        let yellowPhase = [];
        if (currentPhaseIndex === 1 || currentPhaseIndex === 2) {
			yellowPhase.push(timeSettings.Pembicara_Pertama[0]);
			yellowPhase.push(timeSettings.Pembicara_Pertama[1]);
		} else if (currentPhaseIndex === 3 || currentPhaseIndex === 4) {
			yellowPhase.push(timeSettings.Pembicara_Kedua[0]);
			yellowPhase.push(timeSettings.Pembicara_Kedua[1]);
		} else if (currentPhaseIndex === 5 || currentPhaseIndex === 6) {
			yellowPhase.push(timeSettings.Pembicara_Ketiga[0]);
			yellowPhase.push(timeSettings.Pembicara_Ketiga[1]);
        }

        if (time < yellowPhase[0] || time > yellowPhase[1]) {
            mainTimerDisplay.classList.add('nointerruptionTime');
		}
		else if (interruptionPauseCountdown > 0) {
            if (!mainTimerDisplay.classList.contains('nointerruptionTime')) {
				mainTimerDisplay.classList.add('nointerruptionTime');
			}
		}
        else {
            if(mainTimerDisplay.classList.contains('nointerruptionTime')){
                mainTimerDisplay.classList.remove('nointerruptionTime');
            }
        }
    }

	if (interruptionPauseCountdown > 0) {
		interruptionPauseCountdown--;
	}
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    const minuteTimer = document.querySelector('.minuteTimer');
    const secondTimer = document.querySelector('.secondTimer');
    
    minuteTimer.textContent = minutes.toString().padStart(2, '0');
    secondTimer.textContent = seconds.toString().padStart(2, '0');

    setTimeout(updateTimerDisplay, 1000);
}

document.querySelector('.interruptionButton').addEventListener('click', () => {
	if (!startTime && !timerinterruptionType) return;
	const mainTimerDisplay = document.querySelector('.mainTimerDisplay');
	if (mainTimerDisplay.classList.contains('nointerruptionTime') || mainTimerDisplay.classList.contains('timerIsUp')) {
		if (!timerinterruptionType) {
			return;
		}
	}

	if (timerinterruptionType) {
		timerinterruptionType = false;
		interruptionTime = false;
		interruptionTimeCount = 0;
		startTime = true;
		mainTimerDisplay.classList.remove('timerIsUp'); 
		time--;

		const timeMaxMinutes = Math.floor(timeLimit / 60);
		const timeMaxSeconds = timeLimit % 60;
		document.querySelector('.timerMax').textContent =
			`${timeMaxMinutes.toString().padStart(2, '0')} : ${timeMaxSeconds.toString().padStart(2, '0')}`;


		document.querySelector('.currentPhaseDisplay').textContent = currentPhase;
		updateTimerDisplay();
		return;
	}

    const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
	if (currentPhaseIndex >= 1 && currentPhaseIndex <= 6 && interruptionPauseCountdown === 0) {
		timerinterruptionType = true;
		startTime = false;
		interruptionTime = true;
		const minuteTimer = document.querySelector('.minuteTimer');
		const secondTimer = document.querySelector('.secondTimer');
		interruptionTimeCount = 0;
		document.querySelector('.currentPhaseDisplay').textContent = 'Interupsi';
		const minutesinterruption = Math.floor(interruptionTimeLimit / 60);
		const secondsinterruption = interruptionTimeLimit % 60;
		document.querySelector('.timerMax').textContent =
			`${minutesinterruption.toString().padStart(2, '0')} : ${secondsinterruption.toString().padStart(2, '0')}`;

		minuteTimer.textContent = '00';
		secondTimer.textContent = '00';
		interruptionPauseCountdown = interruptionPauseLimit + 1;

		setTimeout(updateinterruptionTimer, 1000);
	}
});

function updateinterruptionTimer() {
	if (!interruptionTime) return;

	interruptionTimeCount++;
	if (interruptionTimeCount >= interruptionTimeLimit) {
		const mainTimerDisplay = document.querySelector('.mainTimerDisplay');
		mainTimerDisplay.classList.add('timerIsUp'); 
	}

	const minuteTimer = document.querySelector('.minuteTimer');
	const secondTimer = document.querySelector('.secondTimer');
	const minutes = Math.floor(interruptionTimeCount / 60);
	const seconds = interruptionTimeCount % 60;
	minuteTimer.textContent = minutes.toString().padStart(2, '0');
	secondTimer.textContent = seconds.toString().padStart(2, '0');

	setTimeout(updateinterruptionTimer, 1000);
}

const nextPhaseButton = document.querySelector('.nextPhaseButton');
nextPhaseButton.addEventListener('click', () => {
	if (startTime) return;
	if (interruptionTime) return;
    const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
    const selectedPhaseText = document.querySelector('.selectedPhase').textContent;

    const minuteTimer = document.querySelector('.minuteTimer');
    const secondTimer = document.querySelector('.secondTimer');
    const timerMax = document.querySelector('.timerMax');
    
    if (selectedPhaseText && selectedPhaseText !== currentPhase) {
        Swal.fire({
			title: 'Change Next Phase',
			text: `Are you sure you want to move to ${selectedPhaseText}?`,
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Sure',
			cancelButtonText: 'No',
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				currentPhase = selectedPhaseText;
				const newPhaseIndex = phaseOrder.indexOf(currentPhase);
				time = 0; // Reset time for the new phase
				const currentPhaseDisplay = document.querySelector('.currentPhaseDisplay');
				currentPhaseDisplay.textContent = currentPhase;
				const mainTimerDisplay = document.querySelector('.mainTimerDisplay');
				mainTimerDisplay.classList.remove('timerIsUp'); // Remove the timerIsUp class when moving to the next phase
				mainTimerDisplay.classList.remove('nointerruptionTime');
				minuteTimer.textContent = '00';
				secondTimer.textContent = '00';
            
				if (newPhaseIndex === 1 || newPhaseIndex === 2) {
					timeLimit = timeSettings.Pembicara_Pertama[timeSettings.Pembicara_Pertama.length - 1];
				} else if (newPhaseIndex === 3 || newPhaseIndex === 4) {
					timeLimit = timeSettings.Pembicara_Kedua[timeSettings.Pembicara_Kedua.length - 1];
				} else if (newPhaseIndex === 5 || newPhaseIndex === 6) {
					timeLimit = timeSettings.Pembicara_Ketiga[timeSettings.Pembicara_Ketiga.length - 1];
				} else if (newPhaseIndex === 7 || newPhaseIndex === 8) {
					timeLimit = timeSettings.Penyimpul[timeSettings.Penyimpul.length - 1];
				} else {
					timeLimit = timeSettings.Case_Building[0];
				}

				timerinterruptionType = false;
				interruptionTime = false;
				interruptionTimeCount = 0;
				interruptionPauseCountdown = 0;
				const timeMaxMinutes = Math.floor(timeLimit / 60);
				const timeMaxSeconds = timeLimit % 60;
				timerMax.textContent = `${timeMaxMinutes.toString().padStart(2, '0')} : ${timeMaxSeconds.toString().padStart(2, '0')}`;
			}
		});
	}
    else if (currentPhaseIndex < phaseOrder.length - 1) {
        Swal.fire({
			title: 'Next Phase',
			text: `Are you sure you want to move to ${phaseOrder[currentPhaseIndex + 1]}?`,
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Sure',
			cancelButtonText: 'No',
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
                currentPhase = phaseOrder[currentPhaseIndex + 1];
                const newPhaseIndex = phaseOrder.indexOf(currentPhase);
				time = 0; // Reset time for the new phase
				const currentPhaseDisplay = document.querySelector('.currentPhaseDisplay');
				currentPhaseDisplay.textContent = currentPhase;
				const mainTimerDisplay = document.querySelector('.mainTimerDisplay');
                mainTimerDisplay.classList.remove('timerIsUp'); // Remove the timerIsUp class when moving to the next phase
                mainTimerDisplay.classList.remove('nointerruptionTime');
                document.querySelector('.selectedPhase').textContent = currentPhase; // Update the selected phase in the dropdown
                minuteTimer.textContent = '00';
                secondTimer.textContent = '00';
                
                if (newPhaseIndex === 1 || newPhaseIndex === 2) {
					timeLimit = timeSettings.Pembicara_Pertama[timeSettings.Pembicara_Pertama.length - 1];
				} else if (newPhaseIndex === 3 || newPhaseIndex === 4) {
					timeLimit = timeSettings.Pembicara_Kedua[timeSettings.Pembicara_Kedua.length - 1];
				} else if (newPhaseIndex === 5 || newPhaseIndex === 6) {
					timeLimit = timeSettings.Pembicara_Ketiga[timeSettings.Pembicara_Ketiga.length - 1];
				} else if (newPhaseIndex === 7 || newPhaseIndex === 8) {
					timeLimit = timeSettings.Penyimpul[timeSettings.Penyimpul.length - 1];
				} else {
					timeLimit = timeSettings.Case_Building[0];
				}

				timerinterruptionType = false;
				interruptionTime = false;
				interruptionTimeCount = 0;
				interruptionPauseCountdown = 0;
				const timeMaxMinutes = Math.floor(timeLimit / 60);
				const timeMaxSeconds = timeLimit % 60;
				timerMax.textContent = `${timeMaxMinutes.toString().padStart(2, '0')} : ${timeMaxSeconds.toString().padStart(2, '0')}`;
			}
		});
    } 
});


const dropdown = document.querySelector('.dropdown');
const dropdownButton = document.querySelector('.dropdownButton');
const selectedPhase = document.querySelector('.selectedPhase');
const dropdownOptions = document.querySelectorAll('.dropdownOption');

dropdownButton.addEventListener('click', function (event) {
	event.stopPropagation();

	dropdown.classList.toggle('open');
});

dropdownOptions.forEach(function (option) {
	option.addEventListener('click', function () {
		selectedPhase.textContent = option.textContent;

		dropdown.classList.remove('open');
	});
});

document.addEventListener('click', function () {
	dropdown.classList.remove('open');
});

load();