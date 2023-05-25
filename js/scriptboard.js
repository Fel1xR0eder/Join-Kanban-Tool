
let currentDragedElement;
let todoCount;
let inprogressBoxCount;
let feedbackBoxCount;
let doneBoxCount;
let includeBoard = false;
let countOfAllCheckedSubtasks = 0;
let currentTask;
let modifyTaskId;
let modifyTaskIndexOf;
let includeContacts = false;
let allModifiedSubTasks;
let splitOfTask;


async function onloadBoard() {
    await init();
    await updateHTML();
    hideLoader();
}


/**
 * Render every Task in the correct split
 */
function updateHTML() {
    let todo = allTasks.filter(t => t['split'] == 'todo-box');
    let inprogressBox = allTasks.filter(t => t['split'] == 'inprogress-box');
    let feedbackBox = allTasks.filter(t => t['split'] == 'feedback-box');
    let doneBox = allTasks.filter(t => t['split'] == 'done-box');
    updateTaskBox('todo-box', todo)
    updateTaskBox('inprogress-box', inprogressBox)
    updateTaskBox('feedback-box', feedbackBox)
    updateTaskBox('done-box', doneBox)
    countOfAllUrgentTasks();
    countOfAllTasks();
}


/**
 * Count all urgent tasks
 */
function countOfAllUrgentTasks() {
    let allUrgentTasks = allTasks.filter(t => t['priority'] == 'urgent');
    urgentTasksCount = allUrgentTasks.length;

    saveCount('urgentTasksCount', urgentTasksCount);
}


/**
 * Count all tasks
 */
async function countOfAllTasks() {
    let todo = allTasks.filter(t => t['split'] == 'todo-box');
    let inprogressBox = allTasks.filter(t => t['split'] == 'inprogress-box');
    let feedbackBox = allTasks.filter(t => t['split'] == 'feedback-box');
    let doneBox = allTasks.filter(t => t['split'] == 'done-box');

    doneBoxCount = doneBox.length;
    feedbackBoxCount = feedbackBox.length;
    inprogressBoxCount = inprogressBox.length;
    todoCount = todo.length;
    await saveCount('doneBoxCount', doneBoxCount);
    await saveCount('feedbackBoxCount', feedbackBoxCount);
    await saveCount('inprogressBoxCount', inprogressBoxCount);
    await saveCount('todoCount', todoCount);
}


/**
 * Render every SINGLE Task in his correct split
 */
function updateTaskBox(id, task) {
    document.getElementById(id).innerHTML = '';
    for (let index = 0; index < task.length; index++) {
        const currentTask = task[index];
        document.getElementById(id).innerHTML += templateGenerateHTML(currentTask);
        renderProgressbar(currentTask);
        renderAssignedTo(currentTask);
    }
}


/**
 * Save the count of all Tasks of a split in backend
 */
async function saveCount(nameOfSplit, stringName) {
    await backend.deleteItem(nameOfSplit);
    await backend.setItem(nameOfSplit, JSON.stringify(stringName));
}


/**
 * Save what task is dragged
 */
function startDragging(i) {
    currentDragedElement = allTasks.filter(t => t['id'] == i);
}


function allowDrop(ev) {
    ev.preventDefault();
}


function moveTo(split) {
    currentDragedElement[0]['split'] = split;
    saveAllTasks();
    updateHTML();
}


/**
 * Render all connected contacts of the Task
 */
function renderAssignedTo(currentTask) {
    let contact = currentTask['AssignedTo'];
    let contactHTML = document.getElementById(`assigned-to-currentTask${currentTask['id']}`);
    contactHTML.innerHTML = '';

    renderSelectedContact(contact, contactHTML);
}


/**
 * Create a Logo with the first letter of the name and firstname of the contact
 */
function renderSelectedContact(contact, contactHTML) {
    for (let j = 0; j < contact.length; j++) {
        let thisContact = contact[j];
        let firstLetter = thisContact['firstName'].charAt(0);
        let secondLetter = thisContact['name'].charAt(0);
        let contactColor = thisContact['color'];

        contactHTML.innerHTML += /*html*/`
        <div class="contact-in-task" style ="background-color: ${contactColor}">${firstLetter}${secondLetter}</div>
        `;
    }
}


/**
 * Open a window with all details of the clicked Task
 * @param {i} - Clicked Task 
 */
function openShowTask(currentTask) {
    document.body.classList.add('overflow-hidden');
    modifyTaskId = allTasks.filter(t => t['id'] == currentTask);
    let title = modifyTaskId[0]['title'];
    let description = modifyTaskId[0]['description'];
    let date = modifyTaskId[0]['date'];
    let priority = modifyTaskId[0]['priority'];
    let category = modifyTaskId[0]['category'];
    let categoryColor = modifyTaskId[0]['categoryColor'];
    let assignedTo = modifyTaskId[0]['AssignedTo'];
    let subTask = modifyTaskId[0]['subTasks'];
    splitOfTask = modifyTaskId[0]['split'];
    let firstChar = priority.charAt(0);
    let capitalizedPriority = priority.replace(firstChar, firstChar.toUpperCase());

    choosePriorityImg(priority);
    document.getElementById('show-Task-Background').classList = 'show-Task-Background';
    document.getElementById('showTask').innerHTML = templateOpenShowTask(title, description, date, priority, category, categoryColor, capitalizedPriority);
    renderAssignedBox(assignedTo);
    renderSubTaskBox(subTask);
    document.getElementById('showTask').classList.add('show');
}


/**
 * Pick the priority and order the correct img
 * @param {priority} - Priority of the current Task
 */
function choosePriorityImg(priority) {
    if (priority == "urgent") {
        priorityImg = 'arrows-up';
    }

    if (priority == "medium") {
        priorityImg = 'equal-white';
    }

    if (priority == "low") {
        priorityImg = 'arrow-down-white';
    }
}


/**
 * Render all Subtasks 
 * @param {subTask} - All Subtasks of the clicked Task 
 */
function renderSubTaskBox(subTask) {
    subTaskBox = document.getElementById('subTask-box');
    subTaskBox.innerHTML = '';

    for (let i = 0; i < subTask.length; i++) {
        currentSubTask = subTask[i]['text'];
        subTaskBox.innerHTML += templateSubtask(i, currentSubTask);
        proofCheckState(i);
    }
}


/**
 * Cross checkbox or cross not  
 */
function proofCheckState(idOfCurrentSubtask) {
    let subTaskCheckbox = document.getElementById(`subTaskCheck${idOfCurrentSubtask}`);
    let checkState = modifyTaskId[0]['subTasks'][idOfCurrentSubtask]['check'];
    let subTaskTitle = document.getElementById(`subTask${idOfCurrentSubtask}`);

    if (checkState) {
        subTaskTitle.classList.add('line-throug');
        subTaskCheckbox.setAttribute('checked', true);
    } else {
        subTaskTitle.classList.remove('line-throug');
        subTaskCheckbox.removeAttribute('checked');
    };
}


/**
 * Save if the checkbox is checked or not
 */
async function saveCheck(currentSubTask) {
    let subTaskCheckbox = document.getElementById(`subTaskCheck${currentSubTask}`);

    if (subTaskCheckbox.checked) {
        saveTrue(currentSubTask);
    } else {
        saveFalse(currentSubTask)
    };
}


/**
 * Save if checkstate is true
 */
async function saveTrue(currentSubTask) {
    modifyTaskId[0]['subTasks'][currentSubTask]['check'] = true;
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    proofCheckState(currentSubTask);
}


/**
 * Save if checkstate is false
 */
async function saveFalse(currentSubTask) {
    modifyTaskId[0]['subTasks'][currentSubTask]['check'] = false;
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    proofCheckState(currentSubTask);
}


function renderProgressbar(currentTask) {
    if (currentTask['subTasks'].length > 0) {
        let countOfallSubTasks = currentTask['subTasks'].length;

        toCountAllCheckedSubTasks(currentTask);

        let subWidth = (100 / countOfallSubTasks) * countOfAllCheckedSubtasks;
        let progress = document.getElementById(`progress${currentTask['id']}`);
        progress.classList.remove('d-none')
        progress.innerHTML = templateRenderProgressbar(countOfallSubTasks, subWidth);
        countOfAllCheckedSubtasks = 0;
    }
}


/**
 * Update how many subtasks are checked
 */
function updateProgressbar() {
    let element = modifyTaskId[0];
    if (element['subTasks'].length > 0) {
        let subLength = element['subTasks'].length;

        toCountAllCheckedSubTasks(element);

        let subWidth = (100 / subLength) * countOfAllCheckedSubtasks;
        document.getElementById(`progress${element['id']}`).classList.remove('d-none')
        document.getElementById(`progress${element['id']}`).innerHTML = templateRenderProgressbar(subLength, subWidth);
        countOfAllCheckedSubtasks = 0;
    }
}


/**
 * Count how many subtasks are checked
 */
function toCountAllCheckedSubTasks(element) {
    for (let i = 0; i < element['subTasks'].length; i++) {
        const subTask = element['subTasks'][i];
        if (subTask['check']) {
            countOfAllCheckedSubtasks++;
        }
    }
}


function renderAssignedBox(assignedTo) {
    document.getElementById('assigned-box').innerHTML = '';
    for (let i = 0; i < assignedTo.length; i++) {
        currentPerson = assignedTo[i];
        let firstLetter = currentPerson['firstName'].charAt(0);
        let secondLetter = currentPerson['name'].charAt(0);
        let firstName = currentPerson['firstName'];
        let lastName = currentPerson['name'];
        let assignedToBox = document.getElementById('assigned-box');
        let contactColor = currentPerson['color'];

        assignedToBox.innerHTML += templateAssignedToBox(i, contactColor, firstLetter, secondLetter, firstName, lastName);
    }
}


/**
 * Search function
 */
function updateSearchedHTML() {
    let todo = allTasks.filter(t => t['split'] == 'todo-box');
    let inprogressBox = allTasks.filter(t => t['split'] == 'inprogress-box');
    let feedbackBox = allTasks.filter(t => t['split'] == 'feedback-box');
    let doneBox = allTasks.filter(t => t['split'] == 'done-box');
    loadAllTasks();
    updateSearchedTask('todo-box', todo);
    updateSearchedTask('inprogress-box', inprogressBox);
    updateSearchedTask('feedback-box', feedbackBox);
    updateSearchedTask('done-box', doneBox);
}


/**
 * Render all founded Tasks in a Split 
 */
function updateSearchedTask(id, task) {
    let search = document.getElementById('search-task').value;
    search = search.toLowerCase();
    document.getElementById(id).innerHTML = '';
    for (let index = 0; index < task.length; index++) {
        const currentTask = task[index];
        let currentTitle = currentTask['title'];
        if (currentTitle.toLowerCase().includes(search)) {
            document.getElementById(id).innerHTML += templateGenerateHTML(currentTask);
            renderProgressbar(currentTask);
            renderAssignedTo(currentTask);
        }
    }
}


/**
 * Close the window to create a new task
 */
function closeIncludeAddTask() {
    document.getElementById('show-addTaskInclude').innerHTML = '';
    if (includeBoard) {
        onloadBoard();
        includeBoard = false;
        document.body.classList.remove('overflow-hidden');
        document.getElementById('show-AddTask-Background').classList = 'show-Task-Background d-none';
    }

    if (includeContacts) {
        includeContacts = false;
        document.body.classList.remove('overflow-hidden');
        document.getElementById('show-Contacts-Background').classList = 'show-Contact-Background d-none';
    }
}


/**
 * Close the window with task details
 */
async function closeShowTask() {
    document.body.classList.remove('overflow-hidden')
    document.getElementById('show-Task-Background').classList = 'show-Task-Background d-none';
    updateProgressbar();
    updateHTML();
}


/**
 * Include a window like the "Add Task" page
 */
async function includeHTMLaddTask() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    onload();
}


/**
 * Include a window like the "Add Task" page
 */
function addNewTask() {
    document.body.classList.add('overflow-hidden');
    document.getElementById('show-addTaskInclude').innerHTML = /*html*/ `
        <div w3-include-html="add-TaskInclude.html" ></div>`;
    includeHTMLaddTask();
}


/**
 * Include a window like the "Board" page
 */
function addNewTaskBoard(addSplit) {
    document.getElementById('show-AddTask-Background').classList = 'show-Task-Background';
    includeBoard = true;
    selectedSplit = addSplit;
    addNewTask();
}


/**
 * Include a window like the "Modify" a task
 */
function modifyTask() {
    document.body.classList.add('overflow-hidden');
    document.getElementById('show-AddTask-Background').classList = 'show-Task-Background';
    document.getElementById('show-addTaskInclude').innerHTML = /*html*/ `
        <div w3-include-html="modify-TaskInclude.html" ></div>`;
    includeHTMLaddTask();
}


async function modifyTaskOnBoard() {
    includeBoard = true;
    await closeShowTask();
    modifyTask();
    setTimeout(() => {
        renderTaskDetails();
    }, 1500);
}


/**
 * Render the details of the task in the included window to modify
 */
function renderTaskDetails() {
    document.getElementById('title').value = modifyTaskId[0]['title'];
    document.getElementById('description').value = modifyTaskId[0]['description'];
    acceptModifyCategory();
    renderContacts();
    renderPrios();
    acceptModifyPrio();
    renderSubTask();
    document.getElementById('date').value = modifyTaskId[0]['date'];
    renderAllSubTasksModify();
}


/**
 * Take over the Prio of the selected Task
 */
function acceptModifyPrio() {
    let modifyPrio = modifyTaskId[0]['priority'];

    if (modifyPrio == "low") {
        document.getElementById('prio-low').click();
    }

    if (modifyPrio == "medium") {
        document.getElementById('prio-medium').click();
    }

    if (modifyPrio == "urgent") {
        document.getElementById('prio-urgent').click();
    }
}


/**
 * This function delete the selected Task
 */
async function deleteThisTask() {
    for (let i = 0; i < allTasks.length; i++) {
        const element = allTasks[i];
        if (element['title'] == modifyTaskId[0]['title']) {
            modifyTaskIndexOf = i;
        }
    }

    allTasks.splice(modifyTaskIndexOf, 1);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    closeIncludeAddTask();
}


/**
 * Take over the category of the selected Task
 */
function acceptModifyCategory() {
    category = modifyTaskId[0]['category'];
    color = modifyTaskId[0]['categoryColor'];
    let newCategory = document.getElementById('category');

    newCategory.innerHTML = templateAcceptCategory();
}


/**
 * Take over all subtasks of the selected Task
 */
function renderAllSubTasksModify() {
    let allSubtasks = document.getElementById('allSubtasks');
    allSubtasks.innerHTML = '';

    for (let i = 0; i < modifyTaskId[0]['subTasks'].length; i++) {
        currentSubTask = modifyTaskId[0]['subTasks'][i];
        let toDo = currentSubTask['text'];

        allSubtasks.innerHTML += templateToDoModify(i, toDo);
    }
}


function deleteThisSubtask(i) {
    modifyTaskId[0]['subTasks'].splice(i, 1);
    renderAllSubTasksModify();
}


/**
 * Take over the Index of the selected Task
 */
function findIndexOfModfiedTask() {
    for (let i = 0; i < allTasks.length; i++) {
        const element = allTasks[i];
        if (element['id'] == modifyTaskId[0]['id']) {
            modifyTaskIndexOf = i;
        }
    }
}


function checkAnySubtasks(modifiedTask) {
    if (allSubTasks.length < 1) {
        allModifiedSubTasks = modifiedTask['subTasks'];
    } else {
        allModifiedSubTasks = allSubTasks;
    }
}


/**
 * Save all changes of the modified task
 */
async function saveModifiedTask() {
    let subTaskIsFocused = document.activeElement;
    let inputSubTask = document.getElementById('input-SubTask');
    let modifiedTask = modifyTaskId[0];
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let date = document.getElementById('date');
    allModifiedSubTasks;

    findIndexOfModfiedTask();
    if (subTaskIsFocused == inputSubTask) {
        pushNewSubTask();
    } else {
        checkAnySubtasks(modifiedTask);
        showSuccessPopUp('Task added to board!');

        let task = {
            'id': modifiedTask['id'],
            'title': title.value,
            'description': description.value,
            'date': date.value,
            'category': category,
            'categoryColor': color,
            'priority': priority,
            'AssignedTo': selectedContacts,
            'subTasks': allModifiedSubTasks,
            'split': modifiedTask['split'],
        };
        setTimeout(() => {
            renderModifiedTask(task, allModifiedSubTasks);
        }, 1500);
    }
}


/**
 * Render the modified Task
 */
async function renderModifiedTask(task) {

    allTasks.push(task);
    allTasks.splice(modifyTaskIndexOf, 1);
    allSubTasks = [];
    allModifiedSubTasks = [];
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    closeIncludeAddTask();
    await countOfAllUrgentTasks();
    updateHTML();
}


/**
 * Move a task in Mobile mode
 */
function renderMoveBox() {
    document.getElementById('modify-task').style.top = "-220px";
    document.getElementById('modify-task').innerHTML = /*html*/ `
    <div id="move-box" class="move-box">
        <button id='move-todo' onclick="moveToSplit('todo-box')" class="moveTask" >To do</button>
        <button id='move-inprogress' onclick="moveToSplit('inprogress-box')" class="moveTask" >In Progress</button>
        <button id='move-awaitfeedback' onclick="moveToSplit('feedback-box')" class="moveTask" >Awaiting Feedback</button>
        <button id='move-done' onclick="moveToSplit('done-box')" class="moveTask" >Done</button>
    </div>
    `
    markCurrentSplit();
}

function markCurrentSplit() {
    if (splitOfTask == 'todo-box') {
        document.getElementById('move-todo').classList.add('marked-btn');
    }

    if (splitOfTask == 'inprogress-box') {
        document.getElementById('move-inprogress').classList.add('marked-btn');
    }

    if (splitOfTask == 'feedback-box') {
        document.getElementById('move-awaitfeedback').classList.add('marked-btn');
    }

    if (splitOfTask == 'done-box') {
        document.getElementById('move-done').classList.add('marked-btn');
    }
}


async function moveToSplit(split) {
    modifyTaskId[0]['split'] = split;
    await saveAllTasks();
    splitOfTask = split;
    closeMoveBox();
}


function closeMoveBox() {
    if (document.body.offsetWidth < 420) {
        document.getElementById('modify-task').style.top = "-20px";
    } else {
        document.getElementById('modify-task').style.top = "-20px";
    }

    document.getElementById('modify-task').innerHTML = /*html*/`
        <button onclick="renderMoveBox()" class="moveTaskBtn" >Move</button>
        <img src="./assets/img/edit-button.png" alt="">
    `;
}