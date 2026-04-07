function getAppointment() {
  return JSON.parse(localStorage.getItem('appointmentData') || '{}');
}

function setAppointment(data) {
  localStorage.setItem('appointmentData', JSON.stringify({ ...getAppointment(), ...data }));
}

const dateForm = document.getElementById('dateForm');
if (dateForm) {
  dateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(dateForm);
    setAppointment({ appointmentDate: formData.get('appointmentDate') });
    window.location.href = 'schedule-time.html';
  });
}

const timeForm = document.getElementById('timeForm');
if (timeForm) {
  const data = getAppointment();
  const selectedDateText = document.getElementById('selectedDateText');
  if (data.appointmentDate && selectedDateText) {
    selectedDateText.textContent = `Selected date: ${data.appointmentDate}. Now choose an available appointment.`;
  }
  timeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(timeForm);
    setAppointment({ appointmentTime: formData.get('appointmentTime') });
    window.location.href = 'schedule-details.html';
  });
}

const detailsForm = document.getElementById('detailsForm');
if (detailsForm) {
  const existing = getAppointment();
  Object.entries(existing).forEach(([key, value]) => {
    const field = detailsForm.elements.namedItem(key);
    if (field) field.value = value;
  });
  detailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(detailsForm);
    setAppointment(Object.fromEntries(formData.entries()));
    window.location.href = 'schedule-confirm.html';
  });
}

function renderSummary(targetId) {
  const data = getAppointment();
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <h2>Your Appointment Details</h2>
    <p><strong>Date:</strong> ${data.appointmentDate || 'Not selected'}</p>
    <p><strong>Time / Doctor:</strong> ${data.appointmentTime || 'Not selected'}</p>
    <p><strong>Pet Name:</strong> ${data.petName || ''}</p>
    <p><strong>Pet Species:</strong> ${data.petSpecies || ''}</p>
    <p><strong>Pet Breed:</strong> ${data.petBreed || ''}</p>
    <p><strong>Owner Name:</strong> ${data.ownerName || ''}</p>
    <p><strong>Owner Contact:</strong> ${data.ownerEmail || ''} ${data.ownerPhone ? ' | ' + data.ownerPhone : ''}</p>
    <p><strong>Notes:</strong> ${data.notes || 'None provided'}</p>
  `;
}

renderSummary('appointmentSummary');
renderSummary('successSummary');

const confirmButton = document.getElementById('confirmButton');
if (confirmButton) {
  confirmButton.addEventListener('click', () => {
    window.location.href = 'appointment-success.html';
  });
}

const treatmentForm = document.getElementById('treatmentForm');
if (treatmentForm) {
  treatmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = document.getElementById('petSelect').value;
    const output = document.getElementById('treatmentOutput');
    if (!value) {
      output.innerHTML = '<p>Please select a pet first.</p>';
      return;
    }
    const [pet, status, meds, followup] = value.split('|');
    output.innerHTML = `
      <h2>${pet} Treatment Plan</h2>
      <p><strong>Current Status:</strong> ${status}</p>
      <p><strong>Instructions:</strong> ${meds}</p>
      <p><strong>Follow-Up:</strong> ${followup}</p>
    `;
  });
}