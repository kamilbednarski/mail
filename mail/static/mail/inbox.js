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
  document.querySelector('#compose-view').style.display = 'block'

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = ''
  document.querySelector('#compose-subject').value = ''
  document.querySelector('#compose-body').value = ''
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block'
  document.querySelector('#compose-view').style.display = 'none'

  // Save div where emails are going to be displayed
  const emailsView = document.querySelector('#emails-view')

  // Show the mailbox name
  emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3><hr>`

  // Show headers for this mailbox
  let headerContainer = document.createElement('div')
  headerContainer.classList.add('row')

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

  // Create separator after headerContainer and add to emailsView
  let hrLineSeparator = document.createElement('hr')

  // Add headers to emailsView
  emailsView.append(headerContainer)
  emailsView.append(hrLineSeparator)

  // GET emails from API with matching mailbox name
  fetch(`/emails/${mailbox}`, {method: 'GET'})
  .then(response => response.json())
  .then(emails => {

    var i
    for (i = 0; i < emails.length; i++) {

      // Create main container for each mail as a single row
      let mailContainer = document.createElement('div')
      mailContainer.classList.add('row')
      
      if (mailbox === 'sent') {
        // If mailbox equals to sent, then create recipient(s) field
        // Create column with recipient(s)
        let mailRecipientsContainer = document.createElement('div')
        mailRecipientsContainer.classList.add('col')

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
        mailSenderContainer.append(`${emails[i]['sender']}`)
        // Add column to main mailContainer
        mailContainer.append(mailSenderContainer)
      }
      
      // Create column with subject
      let mailSubjectContainer = document.createElement('div')
      mailSubjectContainer.classList.add('col')
      mailSubjectContainer.append(`${emails[i]['subject']}`)
      // Add column to main mailContainer
      mailContainer.append(mailSubjectContainer)
      
      // Create column with date
      let mailDateContainer = document.createElement('div')
      mailDateContainer.classList.add('col')
      mailDateContainer.append(`${emails[i]['timestamp']}`)
      // Add column to main mailContainer
      mailContainer.append(mailDateContainer)

      // Add container with single mail to main emailsView container
      emailsView.append(mailContainer)

      // Create separator and add to emailsView after each e-mail
      let hrLineSeparator = document.createElement('hr')
      emailsView.append(hrLineSeparator)

    }


    console.log(emails)
    console.log(emails.length)
  })

}