let time = 0;
let timeBreak = 0;
let timer = null;
let timerBreak = null;
let current = null;
let pomodoroTime = 25;
let breakTime = 5;

const tasks = [];
const users = [];
const taskName = document.querySelector('#time #taskName');
const btnAdd = document.querySelector('#btn-add');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const formUser = document.querySelector('#form-user');
const nameUser = document.querySelector('#userName');
const tittleNameUser = document.querySelector('#tittle-name-user');
const btnInfoNext = document.querySelector('#btn-info-next');
const btnConfig = document.querySelector('#btn-config');
const nameIndex = document.querySelector('#app-name-user');
const btnPomodoro = document.querySelector('#btn-pomodoro');
const btnBreak = document.querySelector('#btn-break');
const body = document.querySelector('body');
const modalOptions = document.querySelector('#options');
const btnClear = document.querySelector('#clear-tasks');
const timeDiv = document.querySelector('#time #value');

window.addEventListener('load', () => {
    const usersFromLS = getUsersFromLS();
    if (usersFromLS) {
        users.push(...usersFromLS);
    }
    if (tittleNameUser) {
        nameUserRender();
    }
    if (nameIndex) {
        nameUserRenderIndex();
    }
    if (form) {
        renderTasks();
    }
    if (timeDiv) {
        renderTime(time);
    }

    configPomodoroTime(25);
    configBreakTime(5);
})

if (btnClear) {
    btnClear.addEventListener('click', () => {
        tasks.forEach(task => {
            if (task.completed === true) {
                const taskCompleted = document.querySelector(`#${task.id}`);
                taskCompleted.remove();
            }
        })
    })
}

if (btnPomodoro) {
    btnPomodoro.addEventListener('click', () => {
        configTimePomodoro();
    })
}

if (btnBreak) {
    btnBreak.addEventListener('click', () => {
        configTimeBreak();
    })
}

if (btnConfig) {
    btnConfig.addEventListener('click', () => {
        modalOptions.classList.toggle('active');
    })
}

if (btnInfoNext) {
    btnInfoNext.addEventListener('click', () => {
        window.location.href = './app.html';
    });
}



function nameUserRender() {
    users.forEach(user => {
        tittleNameUser.textContent = `Hola ${user.name}`;
    })
}

if (formUser) {
    formUser.addEventListener('submit', (e) => {
        e.preventDefault();
        addUser(nameUser.value);
        setUserAccessFromLS(true);
        window.location.href = './info.html';
    })
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (itTask.value != '') {
            createTask(itTask.value);
            itTask.value = '';
            renderTasks();
        }
    })

}

function nameUserRenderIndex() {
    users.forEach(user => {
        nameIndex.textContent = `${user.name}`;
    })
}

function nextPage() {
    if (userAcces) {
        window.location.href = './info.html';
        messageError.style.opacity = '0';
    } else {
        const messageError = document.querySelector('.errorUser');
        messageError.style.opacity = '1';
    }
}

function addUser(name) {
    const newUser = {
        id: (Math.random() * 100).toString(36).slice(3),
        name: name,
    }
    users.unshift(newUser);
    setUserFromLS(users);
    formUser.reset();
}

function setUserFromLS(users) {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error(error);
    }

}

function getUsersFromLS() {
    try {
        return JSON.parse(localStorage.getItem('users'));
    } catch (error) {
        console.error(error);
    }
}

function createTask(valueTask) {
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        tittle: valueTask,
        completed: false,
    }
    tasks.unshift(newTask);
}

function renderTasks() {
    const fragmentTask = tasks.map(task => {
        return ` <div class="task" id="${task.id}">
                   <div class=""completed>${task.completed ? `<span class="done">Tarea terminada</span>` : `<button class="start-btn" data-id="${task.id}">Iniciar tarea</button>`} </div>
                    <p>${task.completed ? `${task.tittle}<img src="../images/icons8-checked-checkbox-64.png">` : `${task.tittle}`}</p >
                </div > `
    });
    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = fragmentTask.join('');

    const startButtons = document.querySelectorAll('.task .start-btn');

    startButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!timer) {
                const id = button.getAttribute('data-id');
                startButtonHandler(id)
                button.textContent = 'En progreso...';
            }
        })
    })
}

function startButtonHandler(id) {
    time = time * 60;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].tittle;
    timer = setInterval(() => {
        timeHandler(id);
    }, 1000)
}

function timeHandler(id) {
    time--;
    renderTime(time);

    if (time === 0) {
        clearInterval(timer);
        taskCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
        configPomodoroTime(pomodoroTime)
    }
}

function renderTime(time) {
    const min = parseInt(time / 60);
    const seg = parseInt(time % 60);

    timeDiv.textContent = `${min < 10 ? 0 : ''}${min}:${seg < 10 ? 0 : ''}${seg} `;
}

function taskCompleted(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = true;
}

function startBreak() {
    timeBreak = timeBreak * 60;
    taskName.textContent = 'Descanso';
    timerBreak = setInterval(() => {
        timeHandlerBreak();
    }, 1000)
}

function timeHandlerBreak() {
    timeBreak--;
    renderTime(timeBreak);

    if (timeBreak === 0) {
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent = '';
        renderTasks();
        configBreakTime(breakTime);
    }
}

function configTimeBreak() {
    const overlay = document.createElement('div');
    overlay.classList.add('config-time');
    const modalBreak = document.createElement('div');
    modalOptions.classList.remove('active');
    modalBreak.innerHTML = `
    <div class="modal-pomodoro">
        <div>
            <h2>Configurar tiempo de Break</h2>
        </div>
        <form id="form-pomodoro-break">
            <input id="break-time" type="number" placeholder="ingresa los minutos">
            <input id="btn-break-time" type="submit" value="cambiar">
            <p class="error-config-break">Ingresa un valor</p>
        </form>
        <div>
            <button id="close-modal-break">Cerrar</button>
        </div>
    </div>`;
    overlay.appendChild(modalBreak);
    body.appendChild(overlay);
    const btnCloseModalBreak = document.querySelector('#close-modal-break');
    const errorConfigBreak = document.querySelector('.error-config-break');
    const formPomodoroBreak = document.querySelector('#form-pomodoro-break');
    btnCloseModalBreak.addEventListener('click', () => {
        overlay.remove();
    })
    const valueBreakTime = document.querySelector('#break-time');
    formPomodoroBreak.addEventListener('submit', (e) => {
        e.preventDefault();
        if (valueBreakTime.value !== '') {
            breakTime = valueBreakTime.value;
            configBreakTime(breakTime);
            overlay.remove();
        } else {
            errorConfigBreak.classList.add('active');
        }

    })
}

function configTimePomodoro() {
    const overlay = document.createElement('div');
    overlay.classList.add('config-time');
    const modalPomodoro = document.createElement('div');
    modalOptions.classList.remove('active');
    modalPomodoro.innerHTML = `
    <div class="modal-pomodoro">
        <div>
            <h2>Configurar tiempo de Pomodoro</h2>
        </div>
        <form id="form-pomodoro-time">
            <input id="pomodoro-time" type="number" placeholder="ingresa los minutos">
            <input id="btn-pomodoro-time" type="submit" value="cambiar">
            <p class="error-config-pomodoro">Ingresa un valor</p>
        </form>
        <div>
            <button id="close-modal">Cerrar</button>
        </div>
    </div>`;
    overlay.appendChild(modalPomodoro);
    body.appendChild(overlay);
    const btnCloseModal = document.querySelector('#close-modal');
    const errorConfigPomodoro = document.querySelector('.error-config-pomodoro');
    btnCloseModal.addEventListener('click', () => {
        overlay.remove();
    })
    const valuePomodoroTime = document.querySelector('#pomodoro-time');
    const formPomodoroTime = document.querySelector('#form-pomodoro-time');
    formPomodoroTime.addEventListener('submit', (e) => {
        e.preventDefault();
        if (valuePomodoroTime.value !== '') {
            pomodoroTime = valuePomodoroTime.value;
            configPomodoroTime(pomodoroTime);
            overlay.remove();
        } else {
            errorConfigPomodoro.classList.add('active');
        }

    })

}

function configPomodoroTime(value) {
    time = value;
}

function configBreakTime(value) {
    timeBreak = value;
}