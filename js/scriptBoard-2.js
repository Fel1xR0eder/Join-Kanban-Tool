
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
        elseSMT();
    }
}

function elseSMT() {
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
    setTimeout(() => renderModifiedTask(task, allModifiedSubTasks), 1500);
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