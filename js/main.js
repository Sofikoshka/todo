const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}



checkEmptyList();

//add task
form.addEventListener('submit', addTask);

//delete task
tasksList.addEventListener('click', deleteTask)

//task done

tasksList.addEventListener('click', doneTask);

function addTask (event) {
    // отмена отправки формы
    event.preventDefault();
    //достаем текст из поля ввода
   const taskText = taskInput.value;

    const newTask = {
        id:Date.now(),
        text: taskText,
        done:false
    };

    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);
    //очищаем поле ввода и возвращаем фокус
    taskInput.value = "";
    taskInput.focus();
    checkEmptyList()

    
}

function deleteTask(event) {
    
    // Проверяем если клик был НЕ по кнопке "удалить задачу"
	if (event.target.dataset.action !== 'delete') return;

	const parenNode = event.target.closest('.list-group-item');

	// Определяем ID задачи
	const id = Number(parenNode.id);

	// Удаляем задча через фильтрацию массива
	tasks = tasks.filter((task) => task.id !== id);

	// Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();

	// Удаляем задачу из разметки
	parenNode.remove();

	checkEmptyList();
    
   
	
}

function doneTask(event) {
    if (event.target.dataset.action !== "done") return;

        const parenNode = event.target.closest('.list-group-item');

        const id = Number(parenNode.id);
        const task = tasks.find(function (task) {
            if(task.id === id) {
                return true;
            }
        })
        task.done = !task.done;

        saveToLocalStorage();

        const taskTitle = parenNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
    
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } 
    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title";
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
 </li>`;
     //добавить разметку на страницу
     tasksList.insertAdjacentHTML('beforeend', taskHTML);

}



