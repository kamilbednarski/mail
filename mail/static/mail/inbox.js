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

  // Create headers for this mailbox
  let headerContainer = document.createElement('div')
  headerContainer.classList.add('row', 'border-bottom', 'border-top', 
                                'py-2', 'small', 'font-weight-bold')

  // Sender/Receipient(s) header
  if (mailbox === 'sent') {
    // Create container for this header
    let receipientsHeaderContainer = document.createElement('div')
    receipientsHeaderContainer.classList.add('col')
    // Add content to container
    var receipientsHeader = 'RECEIPIENTS'
    receipientsHeaderContainer.append(receipientsHeader)
    // Add to headerContainer
    headerContainer.append(receipientsHeaderContainer)

  } else {
    // Create container for this header
    let senderHeaderContainer = document.createElement('div')
    senderHeaderContainer.classList.add('col')
    
    // Add content to container
    var senderHeader = 'SENDER'
    senderHeaderContainer.append(senderHeader)
    // Add to headerContainer
    headerContainer.append(senderHeaderContainer)
  }

  // Subject header
  let subjectHeaderContainer = document.createElement('div')
  subjectHeaderContainer.classList.add('col')
  subjectHeaderContainer.append('SUBJECT')
  headerContainer.append(subjectHeaderContainer)

  // Date header
  let dateHeaderContainer = document.createElement('div')
  dateHeaderContainer.classList.add('col')
  dateHeaderContainer.append('DATE')
  headerContainer.append(dateHeaderContainer)

  // Add headers to emailsView
  emailsView.append(headerContainer)

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

      // Create main container for each mail as a single row
      let mailContainer = document.createElement('div')
      mailContainer.classList.add('row', 'py-3', 'border-bottom')

      // AddEventListener to load single email
      mailContainer.addEventListener('click', () => load_email())

      // Set container id
      mailContainer.setAttribute('id', 'single-mail')
      mailContainer.dataset.emailId = `${emails[i]['id']}`
      
      if (mailbox === 'sent') {
        // If mailbox equals to sent, then create recipient(s) field
        // Create column with recipient(s)
        let mailRecipientsContainer = document.createElement('div')
        mailRecipientsContainer.classList.add('col')
        // Add dataset emailId for this element (unique id of each email)
        mailRecipientsContainer.dataset.emailId = `${emails[i]['id']}`

        // Get recipient(s) from emails Object
        let recipients = emails[i]['recipients']
        if (recipients.length > 1) {
          // If there is more than one recipient
          var recipientsField = `${recipients[0]}, ...`

        } else {
          // If there is only one recipient
          var recipientsField = `${recipients[0]}`
        }

        // Add recipient(s) string representation to container
        mailRecipientsContainer.append(recipientsField)
        // Add column to main mailContainer
        mailContainer.append(mailRecipientsContainer)

      } else {
        // If mailbox isn't sent, then create sender field
        // Create column with sender
        let mailSenderContainer = document.createElement('div')
        mailSenderContainer.classList.add('col')
        // Add dataset emailId for this element (unique id of each email)
        mailSenderContainer.dataset.emailId = `${emails[i]['id']}`
        mailSenderContainer.append(`${emails[i]['sender']}`)
        
        // Add column to main mailContainer
        mailContainer.append(mailSenderContainer)
      }
      
      // Create column with subject
      let mailSubjectContainer = document.createElement('div')
      mailSubjectContainer.classList.add('col')
      // Add dataset emailId for this element (unique id of each email)
      mailSubjectContainer.dataset.emailId = `${emails[i]['id']}`
      mailSubjectContainer.append(`${emails[i]['subject']}`)
      // Add column to main mailContainer
      mailContainer.append(mailSubjectContainer)
      
      // Create column with date
      let mailDateContainer = document.createElement('div')
      mailDateContainer.classList.add('col')
      // Add dataset emailId for this element (unique id of each email)
      mailDateContainer.dataset.emailId = `${emails[i]['id']}`
      mailDateContainer.append(`${emails[i]['timestamp']}`)
      // Add column to main mailContainer
      mailContainer.append(mailDateContainer)

      // If mail has read status, change background-color
      if (emails[i]['read'] === true) {
        mailContainer.classList.add('text-secondary', 'font-weight-light', 'bg-light')
      }

      // Add container with single mail to main emailsView container
      emailsView.append(mailContainer)
    }
  })
}