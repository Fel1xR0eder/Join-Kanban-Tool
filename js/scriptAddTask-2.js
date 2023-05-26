

/**
 * Filter all saved email adresses
 */
function filterContacts() {
    let searchedEmails = document.getElementById('searched-emails');
    searchedEmails.classList.remove('d-none');
    let search = document.getElementById('input-contact').value;
    search = search.toLowerCase();

    searchedEmails.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        currentContact = contacts[i];
        mailAdress = currentContact['mail'];
        if (mailAdress.toLowerCase().includes(search)) {
            renderSearchedContacts(i, mailAdress);
        }
    }
}


/**
 * Render searched email adresses
 */
function renderSearchedContacts(i, currentContactMail) {
    document.getElementById('searched-emails').innerHTML += /*html*/ `
    <div onclick="takeEmail(${i})" class="selection-contacts">
        <div id="contact${i}" class="addTask-Subheaders">${currentContactMail}</div>
    </div>
`
}


/**
 * Get selected email and put into input box
 */
function takeEmail(i) {
    let takenEmail = document.getElementById(`contact${i}`).innerHTML;
    currentContact = contacts[i];
    document.getElementById('input-contact').value = takenEmail;
    document.getElementById('searched-emails').classList.add('d-none');
}


/**
 * Render all options to prioritize the Task
 */
function renderPrios() {
    currentPrioStat = false;
    document.getElementById('prio').innerHTML = templateRenderPrios();
}


/**
 * Accept the selected priority
 */
function choosePrio(prio, img) {
    renderPrios();
    currentPrioStat = true;
    let prioId = document.getElementById(`prio-${prio}`);
    let icon = document.getElementById(`icon-${prio}`);
    prioId.classList.add(`${prio}`);
    icon.src = `./assets/img/${img}.png`;
    priority = prio;
}


/**
 * Render the section to create a subtask
 */
function renderSubTask() {
    let subtask = document.getElementById('subtask');
    subtask.innerHTML = '';
    subtask.innerHTML = templateRenderSubTask();
}


/**
 * Clear input field of subtask section
 */
function clearInputField() {
    document.getElementById('input-SubTask').value = '';
}


/**
 * Push a a new subtask and render it
 */
function pushNewSubTask() {
    let text = document.getElementById('input-SubTask').value;

    if (text) {
        let currentSubTask = {
            'text': text,
            'check': false,
        };

        saveSubTasks(currentSubTask);
        document.getElementById('input-SubTask').value = '';
        renderAllSubTasks();
    }

}


/**
 * Render all subtasks under the inputfield
 */
function renderAllSubTasks() {
    let allSubtasks = document.getElementById('allSubtasks');
    allSubtasks.innerHTML = '';

    for (let i = 0; i < allSubTasks.length; i++) {
        currentSubTask = allSubTasks[i];
        let toDo = allSubTasks[i]['text'];

        allSubtasks.innerHTML += templateToDo(i, toDo);
    }
}



//Save, delete and load from backend functions
async function saveTask(task) {
    allTasks.push(task);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
}

async function saveAllTasks() {
    await backend.setItem('allTasks', JSON.stringify(allTasks));
}

async function saveCategory(newCategory) {
    allCategories.push(newCategory);
    await backend.setItem('allCategories', JSON.stringify(allCategories));
}

async function saveContact(currentContact) {
    allContacts.push(currentContact);
    await backend.setItem('allContacts', JSON.stringify(allContacts));
}

async function saveSelectedContact(currentContact) {
    selectedContacts.push(currentContact);
    await backend.setItem('selectedContacts', JSON.stringify(selectedContacts));
}

async function saveSubTasks(currentSubTask) {
    allSubTasks.push(currentSubTask);
    await backend.setItem('allSubTasks', JSON.stringify(allSubTasks));
}

function loadAllTasks() {
    let allTasksAsString = localStorage.getItem('allTasks');
    if (allTasksAsString) {
        allTasks = JSON.parse(allTasksAsString);
    }
}

async function deleteAllTasks() {
    await backend.deleteItem('allTasks');
}

async function deleteSelectedAllContacts() {
    await backend.deleteItem('selectedContacts');
}

async function deleteAllContacts() {
    await backend.deleteItem('allContacts');
}