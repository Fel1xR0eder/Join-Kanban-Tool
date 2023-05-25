async function onloadSummary() {
    hideLoader();
    await init();
    updateDate();
    updateCountOfTasks();
    replaceUserName();
    checkTime();
}


/**
 * Change the img if mouse hovers over
 */
function changeImg(id, hoverImg, standardImg) {
    let img = document.getElementById(`${id}`);
    if (img.src = `${standardImg}`) {
        img.src = `${hoverImg}`;
    } else {
        img.src = `${standardImg}`;
    }
}


/**
 * Change the img back if mouse hovers out
 */
function changeImgBack(id, hoverImg, standardImg) {
    let img = document.getElementById(`${id}`);
    if (img.src = `${hoverImg}`) {
        img.src = `${standardImg}`;
    }
}


/**
 * Get current Date
 */
function updateDate() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date();
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    document.getElementById('dateSummary').innerHTML = `${month}  ${day}, ${year} `;
}


/**
 * Update the count of all Tasks in board
 */
function updateCountOfTasks() {
    countOfAllTasks();
    let tasksInBoard = allTasks.length; //Get the Number of all Tasks in Board
    updateCountOfSingleTask(inprogressBoxCount, 'tasks-in-progress');
    updateCountOfSingleTask(tasksInBoard, 'tasks-in-board');
    updateCountOfSingleTask(feedbackBoxCount, 'tasks-awaiting-feedback');
    updateCountOfSingleTask(todoCount, 'tasks-todo');
    updateCountOfSingleTask(doneBoxCount, 'tasks-done');
    updateCountOfSingleTask(urgentTasksCount, 'urgent-count');
}


/**
 * Update the count of a single Task
 */
function updateCountOfSingleTask(countOfTask, id) {
    if (countOfTask == 0) {
        document.getElementById(`${id}`).innerHTML = 0;
    } else {
        document.getElementById(`${id}`).innerHTML = `${countOfTask}`;
    }
}
