document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'))
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'))
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'))
  document.querySelector('#compose').addEventListener('click', compose_email)

  // By default, load the inbox
  load_mailbox('inbox');
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


function archive_email() {
  /*
    This function sets email archive property to true or false.
    After proceeding it loads mailbox again.
  */
  event.stopImmediatePropagation()

  // Save email id from dataset attribute
  let emailId = event.target.dataset.emailId
  // Check archived status of given email
  let isArchived = event.target.dataset.isArchived

  if (isArchived == 'true') {
    console.log('LOG: email unarchived')
    fetch(`/emails/${emailId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        archived: false
      })
    })
    // Load archive
    setTimeout(load_mailbox('archive'), 500)

  } else {
    console.log('LOG: email archived')
    fetch(`/emails/${emailId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        archived: true
      })
    })
    // Load inbox
    setTimeout(load_mailbox('inbox'), 500)
  }
}


function read_email(email_id) {
  /*
    This function sets email read property to true.
    This property changes visual appearance of given email,
    when listed in mailbox.
  */
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      read: true
    })
  })

}


function load_email() {
  event.stopImmediatePropagation()
  // Delete content from single email view container
  document.querySelector('#single-email-view').innerHTML = ""

  // Show email view and hide other views
  document.querySelector('#emails-view').style.display = 'none'
  document.querySelector('#compose-view').style.display = 'none'
  document.querySelector('#single-email-view').style.display = 'block'

  // Save div where emails are going to be displayed
  const singleEmailView = document.querySelector('#single-email-view')

  // Save email id from dataset attribute
  let emailId = event.target.dataset.emailId

  // GET email from API with matching id
  fetch(`/emails/${emailId}`, {method: 'GET'})
  .then(response => response.json())
  .then(email => {

    // Set email property read to true
    read_email(emailId)

    // SENDER AND DATE CONTAINER
    // Sender container
    let singleEmailSenderAndDateContainer = document.createElement('div')
    singleEmailSenderAndDateContainer.classList.add('row', 'px-3')
    let singleEmailSenderField = document.createElement('div')
    singleEmailSenderField.classList.add('col', 'h5')
    singleEmailSenderField.append(email['sender'])
    // Date container
    let singleEmailDateField = document.createElement('div')
    singleEmailDateField.classList.add('col', 'small', 'text-right', 'text-secondary')
    singleEmailDateField.append(email['timestamp'])
    
    // Add field to subject container
    singleEmailSenderAndDateContainer.append(singleEmailSenderField)
    singleEmailSenderAndDateContainer.append(singleEmailDateField)
    
    // SUBJECT CONTAINER
    let singleEmailSubjectContainer = document.createElement('div')
    singleEmailSubjectContainer.classList.add('row', 'px-3')
    let singleEmailSubjectField = document.createElement('div')
    singleEmailSubjectField.classList.add('col')
    singleEmailSubjectField.append(email['subject'])
    // Add field to subject container
    singleEmailSubjectContainer.append(singleEmailSubjectField)

    // RECEIPIENTS CONTAINER
    let singleEmailRecipientsContainer = document.createElement('div')
    singleEmailRecipientsContainer.classList.add('row', 'px-3')
    let singleEmailRecipientsField = document.createElement('div')
    singleEmailRecipientsField.classList.add('col', 'pb-3', 'border-bottom')
    singleEmailRecipientsField.innerHTML = `To: <span class="text-secondary">${email['recipients']}</span>`
    // Add field to subject container
    singleEmailRecipientsContainer.append(singleEmailRecipientsField)

    // BODY CONTAINER
    let singleEmailBodyContainer = document.createElement('div')
    singleEmailBodyContainer.classList.add('row', 'px-3')
    let singleEmailBodyField = document.createElement('div')
    singleEmailBodyField.classList.add('col', 'py-3')
    singleEmailBodyField.append(email['body'])
    // Add field to subject container
    singleEmailBodyContainer.append(singleEmailBodyField)
    
    // Add all containers to main container
    singleEmailView.append(singleEmailSenderAndDateContainer)
    singleEmailView.append(singleEmailSubjectContainer)
    singleEmailView.append(singleEmailRecipientsContainer)
    singleEmailView.append(singleEmailBodyContainer)

  })
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
  emailsView.innerHTML = `<h3 class='pb-2 px-3'>${mailbox.charAt(0).toUpperCase() 
                          + mailbox.slice(1)}</h3>`

  // GET emails from API with matching mailbox name
  fetch(`/emails/${mailbox}`, {method: 'GET'})
  .then(response => response.json())
  .then(emails => {

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
      mailContainer.classList.add('row', 'py-3', 'border-top', 'px-3')
      let mainContainer = document.createElement('div')
      mainContainer.classList.add('col')  

      // CONTAINER FOR CONTACT AND DATE - SUBCONTAINER OF MAIN CONTAINER
      let contactAndDateContainer = document.createElement('div')
      contactAndDateContainer.classList.add('row')
      // CONTAINER FOR CONTACT - SUBCONTAINER OF CONTACT AND DATE CONTAINER
      let contactContainer = document.createElement('div')
      contactContainer.classList.add('col', 'font-weight-bold')
      if (mailbox === 'sender') {
        contactContainer.append(emails[i]['sender'])
      } else {
        var recipients = emails[i]['recipients']
        if (recipients.length > 2) {
          // If more than two recipients
          contactContainer.append(`${recipients[0]}, ${recipients[1]} and ${recipients.length - 2} more...`)
        } else if (recipients.length === 2) {
          // If two recipients
          contactContainer.append(`${recipients[0]}, ${recipients[1]}`)
        } else {
          // If one recipient
          contactContainer.append(recipients)
        }
      }
      contactAndDateContainer.append(contactContainer)
      // CONTAINER FOR DATE - SUBCONTAINER OF CONTACT AND DATE CONTAINER
      let dateContainer = document.createElement('div')
      dateContainer.classList.add('col', 'text-right', 'small')
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

      // Add Event Listener for single mail
      mailContainer.addEventListener('click', () => load_email())

      // Add dataset with email id
      contactContainer.dataset.emailId = `${emails[i]['id']}`
      dateContainer.dataset.emailId = `${emails[i]['id']}`
      mailContainer.dataset.emailId = `${emails[i]['id']}`
      subjectTextContainer.dataset.emailId = `${emails[i]['id']}`
        
      // Check conditions for archive and other mailboxes
      if ((mailbox == 'archive' && emails[i]['archived'] == true) 
        || (mailbox !== 'archive' && emails[i]['archived'] == false)){
        // Add subcontainers to main mailContainer for single mail
        mainContainer.append(contactAndDateContainer)
        mainContainer.append(subjectContainer)
        mailContainer.append(mainContainer)

        if (mailbox !== 'sent') {
          // BUTTON ARCHIVE CONTAINER
          let buttonArchiveContainer = document.createElement('div')
          buttonArchiveContainer.classList.add('col-1')
          let archiveButton = document.createElement('i')
          archiveButton.classList.add('fas', 'fa-archive', 'text-primary')
          // Add dataset with id to button
          archiveButton.dataset.emailId = `${emails[i]['id']}`
          archiveButton.dataset.isArchived = `${emails[i]['archived']}`
          // Add button to container
          buttonArchiveContainer.append(archiveButton)
          // Add dataset with email id
          buttonArchiveContainer.dataset.emailId = `${emails[i]['id']}`
          // Add Event Listener for archive button
          buttonArchiveContainer.addEventListener('click', () => archive_email())
          // Add button to main container
          mailContainer.append(buttonArchiveContainer)
        }
        
        // Add container with single mail to main emailsView container
        emailsView.append(mailContainer)
      } 
    }
  })
}


function send_email() {
  /*
    This function sets email read property to true.
    This property changes visual appearance of given email,
    when listed in mailbox.
  */
  let subjectInput = document.querySelector('#compose-subject').value
  let bodyInput = document.querySelector('#compose-body').value
  let recipientsInput = document.querySelector('#compose-recipients').value
  
  // Send new mail
  fetch('/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipients: recipientsInput,
      subject: subjectInput,
      body: bodyInput
    })
  })
  // Load sent mailbox
  setTimeout(load_mailbox('sent'), 3000)

}