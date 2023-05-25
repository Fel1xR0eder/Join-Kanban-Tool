let dataContacts = [{
    name: "Mayer",
    firstName: "Anton",
    mail: "antom@gmail.com",
    phone: "015137294741",
    color: "#0038FF"
}, {
    name: "Schulz",
    firstName: "Anja",
    mail: "schulz@hotmail.com",
    phone: "015137294742",
    color: "#E200BE"
}, {
    name: "Eisenberg",
    firstName: "David",
    mail: "davidberg@gmail.com",
    phone: "015137294743",
    color: "#FF8A01"
}, {
    name: "Ziegler",
    firstName: "Benedikt",
    mail: "benedikt@gmail.com",
    phone: "015137294744",
    color: "#29D300"
}, {
    name: "Fischer",
    firstName: "Eva",
    mail: "eva@gmail.com",
    phone: "015137294745",
    color: "#FF0100"
}, {
    name: "Mauer",
    firstName: "Emanuel",
    mail: "emmanuelMa@gmail.com",
    phone: "015137294746",
    color: "#00F2F0"
}, {
    name: "Bauer",
    firstName: "Marcel",
    mail: "bauer@gmail.com",
    phone: "015137294747",
    color: "#0038FF"
}, {
    name: "Wolf",
    firstName: "Tanja",
    mail: "wolf@gmail.com",
    phone: "015137294748",
    color: "#E200BE"
}];

let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
let createdContact = true;
let contact = true;
let newContact;
let changedContact;
let initials = [];
let editedContact = false;
let sortContacts = [];
let contacts = [];
let currentLetter = [];
let logoutButton = false;


async function onloadContacts() {
    hideLoader();
    await init();
    await filterByLetters();
}


/**
 * Init and fetch everything from backend
 */
async function init() {
    await downloadFromServer();
    loginUsersBackend = JSON.parse(backend.getItem('loginUsersBackend')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    activeUser = JSON.parse(backend.getItem('activeUser')) || [];
    allTasks = JSON.parse(backend.getItem('allTasks')) || [];
    allCategories = JSON.parse(backend.getItem('allCategories')) || [];
    allContacts = JSON.parse(backend.getItem('allContacts')) || [];
    selectedContacts = JSON.parse(backend.getItem('selectedContacts')) || [];
    allSubTasks = JSON.parse(backend.getItem('allSubTasks')) || [];
    todoCount = JSON.parse(backend.getItem('todoCount')) || [];
    inprogressBoxCount = JSON.parse(backend.getItem('inprogressBoxCount')) || [];
    feedbackBoxCount = JSON.parse(backend.getItem('feedbackBoxCount')) || [];
    doneBoxCount = JSON.parse(backend.getItem('doneBoxCount')) || [];
    urgentTasksCount = JSON.parse(backend.getItem('urgentTasksCount')) || [];
    currentUser = JSON.parse(backend.getItem('currentUser')) || [];
}

/**
 * Showing logout button on hover
 */
function showLogout() {
    document.getElementById('header-logout').setAttribute('style', 'display: flex !important');
}


/**
 * Hiding logout button
 */
function hideLogout() {
    setTimeout(() => {
        document.getElementById('header-logout').setAttribute('style', 'display: none !important');
    }, 1000);
}


/**
 * Logout and href back to index.html
 */
async function logout() {
    await resetCurrentUser();
    window.location.href = 'index.html';
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}


/**
 * href to board.html
 */
async function leadToBoard() {
    window.location.href = 'board.html';
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

/**
 * hiding the loading sequence
 */
function hideLoader() {
    let loader = document.getElementById('loader').classList;
    loader.add("d-none");
}

/**
 * Popup of an html file
 */
async function includeHTMLaddContact() {
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
}

/**
 * Pushing all contacts to backend 
 */
async function pushAllContactsInBackEnd() {
    await backend.setItem('contacts', JSON.stringify(''));
    contacts = JSON.parse(backend.getItem('contacts')) || [];

    if (contacts.length == 0) {
        for (let i = 0; i < dataContacts.length; i++) {
            const thisContact = dataContacts[i];
            contacts.push(thisContact);
        }
        await backend.setItem('contacts', JSON.stringify(contacts));
    }
}

/**
 * get variables for a shorter function
 * 
 * @param {first name of the contact} firstName 
 * @param {color of the contact image} color 
 */
function showContactVariables(firstName, color) {
    currentcontact = contacts.filter(t => t['firstName'] == firstName);
    let i = contacts.findIndex(x => x['firstName'] === firstName);
    let firstChar = currentcontact['0']['firstName'].charAt(0).toUpperCase();
    let secondChar = currentcontact['0']['name'].charAt(0).toUpperCase();
    let firstname = currentcontact['0']['firstName'];
    let fullFirstname = firstname.charAt(0).toUpperCase() + firstName.slice(1);
    let name = currentcontact['0']['name'];
    let fullName = name.charAt(0).toUpperCase() + name.slice(1);
    let mail = currentcontact['0']['mail'];
    let phone = currentcontact['0']['phone'];

    showContact(color, i, firstChar, secondChar, color, fullFirstname, fullName, mail, phone);
}

/**
 * 
 * Displaying the chosen contact
 */
function showContact(color, i, firstChar, secondChar, color, fullFirstname, fullName, mail, phone) {
    let contactfield = document.getElementById('show-contact');
    contactfield.style.display = "flex";
    contactfield.innerHTML = generateContactfield(i, firstChar, secondChar, color, fullFirstname, fullName, mail, phone);
    document.getElementById('contact-headline').style.display = 'none';
    editedContact = i;
}


/**
 * Pop-up window to create a new contact
 * 
 */
function addNewContact() {
    document.getElementById('show-Contacts-Background').classList = 'show-Contact-Background';
    document.getElementsByTagName('body')[0].classList.add("overflow-hidden");
    document.getElementById('show-contact').style.display = "";
    document.getElementById('add-new-contact-btn').style.display = "none";
    document.getElementById('contact-headline').style.display = "none";
    if (createdContact) {
        document.getElementById('show-Contacts-Background').innerHTML = `
        <div class="w3-add" w3-include-html="add-contact.html"></div>`;
    }
    includeHTMLaddContact();
    createdContact = false;
}

/**
 * Close popup
 */
function closePopup() {
    document.getElementById('show-Contacts-Background').innerHTML = '';
    document.getElementById('show-Contacts-Background').classList = 'show-Contact-Background d-none';
    document.getElementById('add-new-contact-btn').style.display = "flex";
    renderRigthSide()
    createdContact = true;
}


/**
 * Pop-up window to edit a contact
 * 
 * @param {index of the edited contact} i 
 * @param {color pof the edited contact} color 
 */
async function editContact(i, color) {
    document.getElementById('show-Contacts-Background').classList = 'show-Contact-Background';
    document.getElementsByTagName('body')[0].classList.add("overflow-hidden");
    document.getElementById('show-contact').style.display = "";
    if (createdContact) {
        document.getElementById('show-Contacts-Background').innerHTML = `
                <div class="w3-edit" w3-include-html="edit-contact.html"></div>`;
        await includeHTMLaddContact();
        document.getElementById('close-mobile-popup').style.display = "none";
        document.getElementById('add-new-contact-btn').style.display = 'none';
    }
    editContactValues(i, color);
    createdContact = false;
}


/**
 * Get all values of the contact which will be edited
 * 
 * @param {index of edited contact} i 
 * @param {color of edited contact} color 
 */
function editContactValues(i, color) {
    let editLastname = document.getElementById(`edit-input-lastname`);
    let editFirstname = document.getElementById(`edit-input-firstname`);
    let editMail = document.getElementById(`edit-input-mail`);
    let editPhone = document.getElementById(`edit-input-phone`);
    let editImage = document.getElementById(`edit-img`);
    let firstChar = contacts[i]['firstName'].charAt(0);
    let secondChar = contacts[i]['name'].charAt(0);

    editLastname.value = contacts[i]['name'];
    editFirstname.value = contacts[i]['firstName'];
    editMail.value = contacts[i]['mail'];
    editPhone.value = contacts[i]['phone'];
    editImage.innerHTML += `${firstChar} ${secondChar}`;
    editImage.style = `background-color:${color};`;
    document.getElementById('add-new-contact-btn').style.display = "none";
}


function editBtn() {
    showSuccessPopUp('Contact saved!');
    setTimeout(() => {
        editContactVariables();
    }, 2000);
}


function editContactVariables() {
    let editLastname = document.getElementById(`edit-input-lastname`);
    let editFirstname = document.getElementById(`edit-input-firstname`);
    let editMail = document.getElementById(`edit-input-mail`);
    let editPhone = document.getElementById(`edit-input-phone`);
    let newColor = contacts[editedContact]['color'];
    let changedContact = {
        name: editLastname.value,
        firstName: editFirstname.value,
        mail: editMail.value,
        phone: editPhone.value,
        color: newColor
    }
    saveEditContact(changedContact);
    renderRigthSide();
}

function renderRigthSide() {
    document.getElementById('contact-main').innerHTML = templateRightSide();
}


/**
 * Saving the edited contact and push to backend
 */
async function saveEditContact(changedContact) {
    createdContact = true;
    contacts.push(changedContact);
    contacts.splice(editedContact, 1);
    await backend.setItem('contacts', JSON.stringify(contacts));
    filterByLetters();
    closePopup();
    document.getElementById('add-new-contact-btn').style.display = "";
    editedContact = false;
}


/**
 * Create a new Contact
 */
function createContact() {
    let inputName = document.getElementById('input-name');
    let inputFirstName = document.getElementById('input-first-name');
    let inputMail = document.getElementById('input-email');
    let inputPhone = document.getElementById('input-phone');
    let inputColor = document.getElementById('colors');

    newContact = {
        name: inputName.value,
        firstName: inputFirstName.value,
        mail: inputMail.value,
        phone: inputPhone.value,
        color: inputColor.value
    }
    showSuccessPopUpContacts('Contact successfully created!');
    setTimeout(() => {
        pushCreatedContact();
        closePopup();
        filterByLetters();
        showContactVariables(inputFirstName.value, inputColor.value);
    }, 2000);
}


/**
 * push the new contact 
 * 
 */
async function pushCreatedContact() {
    createdContact = true;
    contacts.push(newContact);
    await backend.setItem('contacts', JSON.stringify(contacts));
    filterByLetters();
}

/**
 * Delete User
 */
async function deleteUser() {
    contacts.splice(editedContact, 1);
    await backend.setItem('contacts', JSON.stringify(contacts));
    document.getElementById('add-new-contact-btn').style.display = "flex";

    closePopup();
    filterByLetters();
    document.getElementById('add-new-contact-btn').style.display = "";
    editedContact = false;
    saveBtn = false;
    deleteBtn = true;
}


/**
 * Sorting Contacts section by their first character
 * 
 */
function filterByLetters() {
    let contactSection = document.getElementById('contact-list');
    contactSection.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        filterLetter(letter);
    }
}


/**
 * Push filtered contacts with same first characters in one section
 * 
 * @param {'First character of name'} letter 
 */
function filterLetter(letter) {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let bigLetter = contact['firstName'].charAt(0).toUpperCase();
        if (bigLetter == letter) {
            currentLetter.push(contact);
        }
    }
    if (currentLetter.length > 0) {
        renderLetterBox(currentLetter, letter);
        currentLetter = [];
    }
    logoutButton = false;
}


/**
 * 
 * @param {'All contacts of the same character'} currentLetter 
 * @param {'First character of name'} letter 
 * 
 */
function renderLetterBox(currentLetter, letter) {
    let firstChar = letter;
    document.getElementById('contact-list').innerHTML += `
        <div id="char-section${letter}" class="first-char">${firstChar}</div>
        <div class="same-letters" id='theSameLetters${letter}'></div>
    `
    for (let i = 0; i < currentLetter.length; i++) {
        currentcontact = currentLetter[i];
        let color = currentcontact['color'];
        let firstChar = currentcontact['firstName'].charAt(0).toUpperCase();
        let firstName = currentcontact['firstName'];
        let fullFirstname = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        let name = currentcontact['name'];
        let fullName = name.charAt(0).toUpperCase() + name.slice(1);
        let secondChar = currentcontact['name'].charAt(0).toUpperCase();
        let charSection = document.getElementById(`char-section${i}`);
        let contactLetter = document.getElementById(`theSameLetters${firstChar}`);

        contactLetter.innerHTML += generateAllContacts1(currentcontact, firstChar, secondChar, i, color, firstName, fullFirstname, fullName);

        if (!initials.includes(charSection)) {
            initials.push(charSection);
        }
    }
}


/** 
 *  Include Window to create a new Task
 */
function addNewTaskContacts() {
    document.body.classList.add('overflow-hidden');
    document.getElementById('show-Contacts-Background').innerHTML = /*html*/ `
        <div w3-include-html="add-TaskInclude.html" ></div>`;
    includeHTMLaddTask();
}


function addNewTaskBoardContacts(addSplit) {
    document.getElementById('show-Contacts-Background').classList = 'show-Contact-Background';
    includeContacts = true;
    selectedSplit = addSplit;
    addNewTaskContacts();
}


function showSuccessPopUpContacts(content) {
    document.getElementById('popup-addTask').classList.add('show');
    document.getElementById('popup-content').innerHTML += /*html*/ `
    <div class="show-message-popup">
        <h3>${content}</h3>
    </div>
    `
    setTimeout(() => {
        document.getElementById('popup-addTask').classList.remove('show');
    }, 2000);
}


/** 
 *  Close the window who shows contact details
 */
function closeShowContact() {
    let contactfield = document.getElementById('show-contact');
    contactfield.style.display = "none";
}