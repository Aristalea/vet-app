function getAppointment() {
  return JSON.parse(localStorage.getItem('appointmentData') || '{}');
}

function setAppointment(data) {
  localStorage.setItem('appointmentData', JSON.stringify({ ...getAppointment(), ...data }));
}

function clearAppointment() {
  localStorage.removeItem('appointmentData');
}

function getPets() {
  return JSON.parse(localStorage.getItem('pets') || '[]');
}

function setPets(pets) {
  localStorage.setItem('pets', JSON.stringify(pets));
}

function getAvailableSlots() {
  return JSON.parse(localStorage.getItem('availableSlots') || '[]');
}

function setAvailableSlots(slots) {
  localStorage.setItem('availableSlots', JSON.stringify(slots));
}

function seedAvailableSlots() {
  const existingSlots = getAvailableSlots();

  if (existingSlots.length === 0) {
    const starterSlots = [
      {
        id: 'slot-1',
        date: '2026-04-15',
        label: '9:00 AM | Dr. Smith | General Checkup'
      },
      {
        id: 'slot-2',
        date: '2026-04-15',
        label: '10:30 AM | Dr. Patel | General Checkup'
      },
      {
        id: 'slot-3',
        date: '2026-04-15',
        label: '1:00 PM | Dr. Lee | Dermatology'
      },
      {
        id: 'slot-4',
        date: '2026-04-16',
        label: '9:30 AM | Dr. Smith | General Checkup'
      },
      {
        id: 'slot-5',
        date: '2026-04-16',
        label: '11:00 AM | Dr. Patel | Surgery Consult'
      },
      {
        id: 'slot-6',
        date: '2026-04-16',
        label: '2:00 PM | Dr. Lee | Dental Exam'
      }
    ];

    setAvailableSlots(starterSlots);
  }
}

function seedPets() {
  const existingPets = getPets();
  if (existingPets.length === 0) {
    const starterPets = [
      {
        id: 'pet-1',
        petName: 'Mochi',
        lastVisit: '03/01/2026',
        petSpecies: 'Cat',
        ownerName: 'Alison Jenkins',
        petBreed: 'Domestic Shorthair',
        ownerEmail: 'alison@example.com',
        petGender: 'Female',
        ownerPhone: '555-111-2222',
        petAge: '4',
        notes: 'Annual exam scheduled',
        treatmentStatus: 'Annual exam scheduled',
        treatmentInstructions: 'Continue allergy medication once daily',
        treatmentFollowUp: 'Follow-up in 6 months'
      },
      {
        id: 'pet-2',
        petName: 'Juniper',
        lastVisit: '02/18/2026',
        petSpecies: 'Dog',
        ownerName: 'Alison Jenkins',
        petBreed: 'Mixed Breed',
        ownerEmail: 'alison@example.com',
        petGender: 'Female',
        ownerPhone: '555-111-2222',
        petAge: '6',
        notes: 'Recovering after dental cleaning',
        treatmentStatus: 'Recovering after dental cleaning',
        treatmentInstructions: 'Soft food for 3 days',
        treatmentFollowUp: 'Recheck if appetite drops'
      }
    ];
    setPets(starterPets);
  }
}

function savePetFromForm(formObject) {
  const pets = getPets();

  const existingPet = pets.find(
    (pet) =>
      pet.petName?.trim().toLowerCase() === formObject.petName?.trim().toLowerCase() &&
      pet.ownerName?.trim().toLowerCase() === formObject.ownerName?.trim().toLowerCase()
  );

  if (existingPet) {
    return existingPet.id;
  }

  const newPet = {
    id: `pet-${Date.now()}`,
    petName: formObject.petName || '',
    lastVisit: formObject.lastVisit || '',
    petSpecies: formObject.petSpecies || '',
    ownerName: formObject.ownerName || '',
    petBreed: formObject.petBreed || '',
    ownerEmail: formObject.ownerEmail || '',
    petGender: formObject.petGender || '',
    ownerPhone: formObject.ownerPhone || '',
    petAge: formObject.petAge || '',
    notes: formObject.notes || '',
    treatmentStatus: 'No treatment plan on file',
    treatmentInstructions: 'No treatment instructions available.',
    treatmentFollowUp: 'No follow-up scheduled.'
  };

  pets.push(newPet);
  setPets(pets);
  return newPet.id;
}

function populatePetDropdown(selectElement, includeAddNew = false) {
  if (!selectElement) return;

  const pets = getPets();
  selectElement.innerHTML = '';

  if (includeAddNew) {
    const addNewOption = document.createElement('option');
    addNewOption.value = 'new';
    addNewOption.textContent = '+ Add New Pet';
    addNewOption.selected = true;
    selectElement.appendChild(addNewOption);
  } else {
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Choose a pet';
    selectElement.appendChild(defaultOption);
  }

  pets.forEach((pet) => {
    const option = document.createElement('option');
    option.value = pet.id;
    option.textContent = pet.petName;
    selectElement.appendChild(option);
  });
}

function fillPetForm(detailsForm, pet) {
  detailsForm.elements.petName.value = pet.petName || '';
  detailsForm.elements.lastVisit.value = pet.lastVisit || '';
  detailsForm.elements.petSpecies.value = pet.petSpecies || '';
  detailsForm.elements.ownerName.value = pet.ownerName || '';
  detailsForm.elements.petBreed.value = pet.petBreed || '';
  detailsForm.elements.ownerEmail.value = pet.ownerEmail || '';
  detailsForm.elements.petGender.value = pet.petGender || '';
  detailsForm.elements.ownerPhone.value = pet.ownerPhone || '';
  detailsForm.elements.petAge.value = pet.petAge || '';
  detailsForm.elements.notes.value = pet.notes || '';
}

function clearPetForm(detailsForm) {
  detailsForm.elements.petName.value = '';
  detailsForm.elements.lastVisit.value = '';
  detailsForm.elements.petSpecies.value = '';
  detailsForm.elements.ownerName.value = '';
  detailsForm.elements.petBreed.value = '';
  detailsForm.elements.ownerEmail.value = '';
  detailsForm.elements.petGender.value = '';
  detailsForm.elements.ownerPhone.value = '';
  detailsForm.elements.petAge.value = '';
  detailsForm.elements.notes.value = '';
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
    <p><strong>Owner Contact:</strong> ${data.ownerEmail || ''}${data.ownerPhone ? ' | ' + data.ownerPhone : ''}</p>
    <p><strong>Notes:</strong> ${data.notes || 'None provided'}</p>
  `;
}

function renderScheduledAppointments() {
  const target = document.getElementById('scheduledAppointmentsOutput');
  if (!target) return;

  const data = getAppointment();

  if (!data.appointmentDate && !data.appointmentTime) {
    target.innerHTML = `
      <p>No appointment is currently scheduled.</p>
      <p><a class="btn" href="schedule-date.html">Schedule an Appointment</a></p>
    `;
    return;
  }

  target.innerHTML = `
    <h2>Upcoming Appointment</h2>
    <p><strong>Date:</strong> ${data.appointmentDate || 'Not selected'}</p>
    <p><strong>Time / Doctor:</strong> ${data.appointmentTime || 'Not selected'}</p>
    <p><strong>Pet Name:</strong> ${data.petName || 'Not provided'}</p>
    <p><strong>Pet Species:</strong> ${data.petSpecies || 'Not provided'}</p>
    <p><strong>Owner Name:</strong> ${data.ownerName || 'Not provided'}</p>
    <p><strong>Owner Contact:</strong> ${data.ownerEmail || ''}${data.ownerPhone ? ' | ' + data.ownerPhone : ''}</p>
    <p><strong>Notes:</strong> ${data.notes || 'None provided'}</p>
  `;
}

function renderMyPets() {
  const target = document.getElementById('myPetsOutput');
  if (!target) return;

  const pets = getPets();

  if (pets.length === 0) {
    target.innerHTML = '<p>No pets have been added yet.</p>';
    return;
  }

  target.innerHTML = pets.map((pet) => `
    <div class="summary-card">
      <h2>${pet.petName}</h2>
      <p><strong>Species:</strong> ${pet.petSpecies || 'Not provided'}</p>
      <p><strong>Breed:</strong> ${pet.petBreed || 'Not provided'}</p>
      <p><strong>Gender:</strong> ${pet.petGender || 'Not provided'}</p>
      <p><strong>Age:</strong> ${pet.petAge || 'Not provided'}</p>
      <p><strong>Last Visit:</strong> ${pet.lastVisit || 'Not provided'}</p>
      <p><strong>Owner:</strong> ${pet.ownerName || 'Not provided'}</p>
      <p><strong>Owner Contact:</strong> ${pet.ownerEmail || ''}${pet.ownerPhone ? ' | ' + pet.ownerPhone : ''}</p>
      <p><strong>Notes:</strong> ${pet.notes || 'None provided'}</p>
    </div>
  `).join('');
}

seedPets();
seedAvailableSlots();

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
  const appointment = getAppointment();
  const selectedDateText = document.getElementById('selectedDateText');
  const timeOptions = document.getElementById('timeOptions');

  if (selectedDateText) {
    if (appointment.appointmentDate) {
      selectedDateText.textContent = `Selected date: ${appointment.appointmentDate}. Now choose an available appointment.`;
    } else {
      selectedDateText.textContent = 'No appointment date selected. Please go back and choose a date.';
    }
  }

  if (timeOptions) {
    const allSlots = getAvailableSlots();
    const matchingSlots = allSlots.filter(slot => slot.date === appointment.appointmentDate);

    if (!appointment.appointmentDate) {
      timeOptions.innerHTML = `
        <p>No appointment date was found. Please go back and choose a date first.</p>
      `;
    } else if (matchingSlots.length === 0) {
      timeOptions.innerHTML = `
        <p>No appointments are currently available for this date.</p>
      `;
    } else {
      timeOptions.innerHTML = matchingSlots.map(slot => `
        <label class="choice-card">
          <input
            type="radio"
            name="appointmentTime"
            value="${slot.label}"
            data-slot-id="${slot.id}"
            required
          />
          <span>${slot.label}</span>
        </label>
      `).join('');
    }
  }

  timeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedRadio = timeForm.querySelector('input[name="appointmentTime"]:checked');

    if (!selectedRadio) {
      alert('Please select an appointment time before continuing.');
      return;
    }

    setAppointment({
      appointmentTime: selectedRadio.value,
      appointmentSlotId: selectedRadio.dataset.slotId
    });

    window.location.href = 'schedule-details.html';
  });
}

const detailsForm = document.getElementById('detailsForm');
if (detailsForm) {
  const petSelect = document.getElementById('petSelect');
  populatePetDropdown(petSelect, true);

  const existing = getAppointment();
  Object.entries(existing).forEach(([key, value]) => {
    const field = detailsForm.elements.namedItem(key);
    if (field) field.value = value;
  });

  if (petSelect) {
    if (existing.petId) {
      petSelect.value = existing.petId;
    } else {
      petSelect.value = 'new';
    }

    petSelect.addEventListener('change', () => {
      const selectedId = petSelect.value;

      if (selectedId === 'new') {
        clearPetForm(detailsForm);
        return;
      }

      const pet = getPets().find((p) => p.id === selectedId);
      if (pet) {
        fillPetForm(detailsForm, pet);
      }
    });
  }

  detailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(detailsForm);
    const formObject = Object.fromEntries(formData.entries());

    let petId = petSelect ? petSelect.value : 'new';

    if (petId === 'new') {
      petId = savePetFromForm(formObject);
    }

    setAppointment({
      ...formObject,
      petId
    });

    window.location.href = 'schedule-confirm.html';
  });
}

renderSummary('appointmentSummary');
renderSummary('successSummary');
renderScheduledAppointments();
renderMyPets();

const confirmButton = document.getElementById('confirmButton');
if (confirmButton) {
  confirmButton.addEventListener('click', () => {
    const appointment = getAppointment();
    const slotId = appointment.appointmentSlotId;

    if (slotId) {
      const remainingSlots = getAvailableSlots().filter(
        (slot) => slot.id !== slotId
      );
      setAvailableSlots(remainingSlots);
    }

    window.location.href = 'appointment-success.html';
  });
}

const cancelAppointmentButton = document.getElementById('cancelAppointmentButton');
if (cancelAppointmentButton) {
  cancelAppointmentButton.addEventListener('click', () => {
    const appointment = getAppointment();

    if (confirm('Are you sure you want to cancel this appointment?')) {
      if (appointment.appointmentSlotId && appointment.appointmentDate && appointment.appointmentTime) {
        const slots = getAvailableSlots();

        const alreadyExists = slots.some((slot) => slot.id === appointment.appointmentSlotId);

        if (!alreadyExists) {
          slots.push({
            id: appointment.appointmentSlotId,
            date: appointment.appointmentDate,
            label: appointment.appointmentTime
          });
          setAvailableSlots(slots);
        }
      }

      clearAppointment();
      renderScheduledAppointments();
    }
  });
}

const treatmentForm = document.getElementById('treatmentForm');
if (treatmentForm) {
  const petSelect = document.getElementById('petSelect');
  populatePetDropdown(petSelect, false);

  treatmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedId = petSelect.value;
    const output = document.getElementById('treatmentOutput');

    if (!selectedId) {
      output.innerHTML = '<p>Please select a pet first.</p>';
      return;
    }

    const pet = getPets().find((p) => p.id === selectedId);

    if (!pet) {
      output.innerHTML = '<p>Pet not found.</p>';
      return;
    }

    output.innerHTML = `
      <h2>${pet.petName} Treatment Plan</h2>
      <p><strong>Current Status:</strong> ${pet.treatmentStatus || 'No treatment plan on file'}</p>
      <p><strong>Instructions:</strong> ${pet.treatmentInstructions || 'No treatment instructions available.'}</p>
      <p><strong>Follow-Up:</strong> ${pet.treatmentFollowUp || 'No follow-up scheduled.'}</p>
    `;
  });
}