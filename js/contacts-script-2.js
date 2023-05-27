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
    createContactTimeout(inputFirstName, inputColor);
}

function createContactTimeout(inputFirstName, inputColor) {
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