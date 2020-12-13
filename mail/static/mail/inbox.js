document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'))
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'))
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'))
  document.querySelector('#compose').addEventListener('click', compose_email)

  // By default, load the inbox
  load_mailbox('sent');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none'
  document.querySelector('#single-email-view').style.display = 'none'
  document.querySelector('#compose-view').style.display = 'block'

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = ''
  document.querySelector('#compose-subject').value = ''
  document.querySelector('#compose-body').value = ''
}


function load_email() {
  event.stopImmediatePropagation()

  // Show email view and hide other views
  document.querySelector('#emails-view').style.display = 'none'
  document.querySelector('#compose-view').style.display = 'none'
  document.querySelector('#single-email-view').style.display = 'block'

  // Save div where emails are going to be displayed
  const emailsView = document.querySelector('#single-email-view')

  // Save email id from dataset attribute
  let emailId = event.target.dataset.emailId

  // GET emails from API with matching mailbox name
  fetch(`/emails/${emailId}`, {method: 'GET'})
  .then(response => response.json())
  .then(email => {})
  // TODO - print content of email

  // Log into console: email id from dataset
  console.log(emailId)
}


function load_mailbox(mailbox) {
  /*
    This function loads selected mailbox.
    Other views display property changes to 'none'.
    
    If there's no positions in selected mailbox,
    function renders message saying so.

    If there are positions in selected mailbox,
    each of them gets wrapped in container with border.
    
    Each position has either gray background-color if status 'read' is true,
    or white background-color if status 'read' is false.
  */

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block'
  document.querySelector('#single-email-view').style.display = 'none'
  document.querySelector('#compose-view').style.display = 'none'

  // Save div where emails are going to be displayed
  const emailsView = document.querySelector('#emails-view')

  // Show the mailbox name
  emailsView.innerHTML = `<h3 class='pb-2'>${mailbox.charAt(0).toUpperCase() 
                          + mailbox.slice(1)}</h3>`

  // GET emails from API with matching mailbox name
  fetch(`/emails/${mailbox}`, {method: 'GET'})
  .then(response => response.json())
  .then(emails => {

    console.log(emails)
    // If no emails in mailbox, display message.
    if (emails.length === 0) {
      let messageContainer = document.createElement('div')
      messageContainer.append('This mailbox is empty.')
      messageContainer.classList.add('text-center', 'py-5')
      emailsView.append(messageContainer)
    }

    var i
    for (i = 0; i < emails.length; i++) {

      /*
        MAIN CONTAINER
        constructed from mailContainer, which is a row
        (class row), containing subcontainer mainContainer,
        which is a column (class col).
      */
      let mailContainer = document.createElement('div')
      mailContainer.classList.add('row', 'py-3', 'border-top')
      let mainContainer = document.createElement('div')
      mainContainer.classList.add('col')

      // CONTAINER FOR CONTACT AND DATE - SUBCONTAINER OF MAIN CONTAINER
      let contactAndDateContainer = document.createElement('div')
      contactAndDateContainer.classList.add('row')
      // CONTAINER FOR CONTACT - SUBCONTAINER OF CONTACT AND DATE CONTAINER
      let contactContainer = document.createElement('div')
      contactContainer.classList.add('col')
      if (mailbox === 'sender') {
        contactContainer.append(emails[i]['sender'])
      } else {
        contactContainer.append(emails[i]['recipients'])
      }
      contactAndDateContainer.append(contactContainer)
      // CONTAINER FOR DATE - SUBCONTAINER OF CONTACT AND DATE CONTAINER
      let dateContainer = document.createElement('div')
      dateContainer.classList.add('col')
      dateContainer.append(emails[i]['timestamp'])
      contactAndDateContainer.append(dateContainer)

      // CONTAINER FOR SUBJECT - SUBCONTAINER OF MAIN CONTAINER
      let subjectContainer = document.createElement('div')
      subjectContainer.classList.add('row')
      let subjectTextContainer = document.createElement('div')
      subjectTextContainer.classList.add('col')
      subjectTextContainer.append(emails[i]['subject'])
      subjectContainer.append(subjectTextContainer)

      /*
        EMAIL DISPLAY SETTINGS DEPENDING ON READ STATUS
        If mail has read status, change background-color
      */
      if (emails[i]['read'] === true) {
        mailContainer.classList.add('text-secondary', 'font-weight-light', 'bg-light')
      }

      // Add subcontainers to main mailContainer for single mail
      mainContainer.append(contactAndDateContainer)
      mainContainer.append(subjectContainer)
      mailContainer.append(mainContainer)
      // Add container with single mail to main emailsView container
      emailsView.append(mailContainer)
    }
  })
}