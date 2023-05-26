let allTasks = [];
let selectionPrio;
let allCategories = [];
let allContacts = [];
let color;
let currentCategory;
let currentContact;
let category;
let priority;
let selectedContacts = [];
let allSubTasks = [];
let urgentTasksCount;
let currentContactStat;
let currentCategoryStat;
let currentPrioStat;
let selectedSplit;



async function onload() {
    await init();
    await deleteSelectedAllContacts();
    selectedContacts = 0;
    allSubTasks = [];
    renderCategoryBox();
    renderContactBox();
    renderPrios();
    renderSubTask();
    date();
    hideLoader();
}

/**
 * Clear the page
 */
async function clearAllFields() {
    await deleteSelectedAllContacts();
    selectedContacts = 0;
    allSubTasks = [];
    resetHTML();
    renderCategoryBox();
    renderContactBox();
    renderPrios();
    renderSubTask();
}


/**
 * Clear all input fields
 */
function resetHTML() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('input-SubTask').value = '';
    document.getElementById('contact-icons').innerHTML = '';
}


/**
 * Get the current date
 */
function date() {
    var date = new Date();
    currentDate = date.toISOString().slice(0, 10);
    document.getElementById('date').value = currentDate;
}


/**
 * Create a new Task
 */
async function addTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let date = document.getElementById('date');
    let randomNumber = 1 + Math.random() * 10000;

    let task = {
        'id': randomNumber,
        'title': title.value,
        'description': description.value,
        'date': date.value,
        'category': category,
        'categoryColor': color,
        'priority': priority,
        'AssignedTo': selectedContacts,
        'subTasks': allSubTasks,
        'split': selectedSplit,
    };

    await saveTask(task);
    await countOfAllUrgentTasks();
    await clearAllFields();
}


/**
 * Checks form validation and create the task
 */
async function checkFormValidation() {
    let subTaskIsFocused = document.activeElement;
    let inputSubTask = document.getElementById('input-SubTask');
    let date = document.getElementById('date').value;
    if (subTaskIsFocused == inputSubTask) {
        pushNewSubTask();
    } else {
        sendForm(date);
    }
}


async function sendForm(date) {
    if (!currentCategoryStat) {
        showSuccessPopUp('Choose a category!');
    } else if (date == 0) {
        showSuccessPopUp('Choose a date!');
    } else if (!currentPrioStat) {
        showSuccessPopUp('Choose a priority!');
    } else if (currentPrioStat) {
        await addTask();
        showSuccessPopUp('Task added to board!');
        setTimeout(() => {
            closeIncludeAddTask();
        }, 2000);
    }
}


/**
 * Add a Task via Add-Task page
 */
function addTaskMain() {
    selectedSplit = 'todo-box';
    setTimeout(() => {
        leadToBoard();
    }, 1500);
    checkFormValidation();
}


/**
 * Show a popup
 */
function showSuccessPopUp(content) {
    document.getElementById('popup-addTask').classList.add('show');
    document.getElementById('popup-content').innerHTML += /*html*/ `
    <div class="show-message-popup">
        <h3>${content}</h3>
    </div>
    `
}


/**
 * Close a popup
 */
function closeSuccessPopUp() {
    document.getElementById('popup-addTask').classList.add('d-none');
}


/**
 * Render the box with all category options
 */
function renderCategories() {
    currentCategoryStat = false;
    color = false;
    category = false;
    let categorySection = document.getElementById('category');

    categorySection.innerHTML = renderCategoriesTemplate();
    renderEveryCategory();
}


/**
 * Render a single category option
 */
function renderEveryCategory() {
    for (let i = 0; i < allCategories.length; i++) {
        currentCategory = allCategories[i];
        let category = currentCategory['categoryName'];
        color = currentCategory['categoryColor']
        let categoryBox = document.getElementById('category-box');

        categoryBox.innerHTML += /*html*/ `
            <div onclick="acceptCategory(${i})" class="selection-category">
                <div id="category${i}" class="addTask-Subheaders" >${category}</div>
                <img class="colors" src="./assets/img/${color}.png" alt="">
            </div>
        `
    }
}


/**
 * Accept and render the choosen category
 */
function acceptCategory(i) {
    currentCategory = allCategories[i];
    currentCategoryStat = true;
    category = currentCategory['categoryName'];
    color = currentCategory['categoryColor'];
    let newCategory = document.getElementById('category');

    newCategory.innerHTML = templateAcceptCategory();
}


/**
 * Accept and render the new created category
 */
function acceptNewCategory() {
    currentCategoryStat = true;
    let newCategory = document.getElementById('category');
    newCategory.innerHTML = templateAcceptCategory();
}


/**
 * Render a inputfield to create a new category
 */
function openInput() {
    currentCategoryStat = true;
    color = false;
    category = false;
    let categorySection = document.getElementById('category');
    categorySection.innerHTML = '';
    categorySection.innerHTML = templateOpenInput();
}


/**
 * Give the choosen color a shadow effect
 */
function chooseColor(colorOfCategory) {
    allColors();
    color = colorOfCategory;
    let id = colorOfCategory;
    document.getElementById(id).classList.add('color-box-hover');
}


/**
 * Remove all shadow effects from the color list
 */
function allColors() {
    document.getElementById('turquoise').classList.remove('color-box-hover');
    document.getElementById('red').classList.remove('color-box-hover');
    document.getElementById('green').classList.remove('color-box-hover');
    document.getElementById('orange').classList.remove('color-box-hover');
    document.getElementById('purple').classList.remove('color-box-hover');
    document.getElementById('blue').classList.remove('color-box-hover');
}


/**
 * Check form validation and create new Category
 */
function createNewCategory() {
    category = document.getElementById('input-category').value;
    currentCategoryStat = true;

    if (!category) {
        showSuccessPopUp('Wähle eine Kategory!');
    } else if (!color) {
        showSuccessPopUp('Wähle eine Farbe!');
    } else if (color) {
        newCategory();
    }
}


/**
 * Push a new Category and save in backend
 */
function newCategory() {
    let newCategory = {
        'categoryName': category,
        'categoryColor': color,
    };
    saveCategory(newCategory);
    acceptNewCategory();
    ;
}


/**
 * Render the section to choose or create a category
 */
function renderCategoryBox() {
    currentCategoryStat = false;
    color = false;
    category = false;
    let categorySection = document.getElementById('category');
    categorySection.innerHTML = '';
    categorySection.innerHTML = templateRenderCategoryBox();
}


/**
 * Render the section to choose or create a contact
 */
function renderContacts() {
    let assignedTo = document.getElementById('assignedTo');
    assignedTo.innerHTML = templateRenderContacts();

    for (let i = 0; i < allContacts.length; i++) {
        actualyContact = allContacts[i];
        let contactFirstname = actualyContact['firstName'];
        let contactLastName = actualyContact['name'];
        let newContact = document.getElementById('contact-box');
        newContact.innerHTML += templateNewContact(contactFirstname, contactLastName, i);
    }

    selectedContacts = [];
}


/**
 * Accept the choosen contact and render a contact-icon under the container
 */
function acceptContact(i) {
    currentContactStat = true;
    currentContact = allContacts[i];
    let contactFirstname = currentContact['firstName'];
    let contactLastName = currentContact['name'];

    document.getElementById(`selection-contacts${i}`).innerHTML = /*html*/ `
    <div id="contact${i}" onclick="acceptNotContact(${i})" class="addTask-Subheaders">${contactFirstname}  ${contactLastName}</div>
    <img id="checkbox${i}" onclick="acceptNotContact(${i})" class="checkbox" src="./assets/img/checkbox-contact-full.png" alt="">
    `
    saveSelectedContact(currentContact);
    renderContactIcon();
}


/**
 * Create the contact-icon from the selected contact
 */
function renderContactIcon() {
    let contactIcons = document.getElementById('contact-icons');
    contactIcons.innerHTML = '';

    for (let i = 0; i < selectedContacts.length; i++) {
        selectedContact = selectedContacts[i];
        let firstLetter = selectedContact['firstName'].charAt(0);
        let secondLetter = selectedContact['name'].charAt(0);
        let contactColor = selectedContact['color'];

        contactIcons.innerHTML += /*html*/ `
            <div id="contact-icon${i}" class="contact-icon" style ="background-color: ${contactColor}">${firstLetter}${secondLetter}</div>
        `
    }
}


/**
 * Reset the selected contacts
 */
async function acceptNotContact() {
    currentContactStat = false;
    selectedContacts = 0;
    await backend.setItem('selectedContacts', JSON.stringify(''));
    renderContacts();
}


/**
 * Render an inputfield to search a contact from all saved contacts
 */
function openInputContact() {
    let assignedTo = document.getElementById('assignedTo');
    assignedTo.innerHTML = '';
    assignedTo.innerHTML = templateOpenInputContact();
    document.getElementById('searched-emails').classList.add('d-none');
}


/**
 * Push a new contact into the list
 */
function pushNewContact() {
    let checkdoubleContact = allContacts.filter(t => t['mail'] == currentContact['mail']);

    if (checkdoubleContact.length < 1) {
        saveContact(currentContact);
        document.getElementById('input-contact').value = '';
        renderContacts();
    }
}


/**
 * Render the complete "assigned to" section 
 */
function renderContactBox() {
    let assignedTo = document.getElementById('assignedTo');
    assignedTo.innerHTML = '';
    assignedTo.innerHTML = templateRenderContactBox();

    if (selectedContacts.length > 0) {
        renderContactIcon();
    }
}