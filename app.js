function getAppointment() {
  return JSON.parse(localStorage.getItem('appointmentData') || '{}');
}

function setAppointment(data) {
  localStorage.setItem('appointmentData', JSON.stringify({ ...getAppointment(), ...data }));
}

function getPets() {
  return JSON.parse(localStorage.getItem('pets') || '[]');
}

function setPets(pets) {
  localStorage.setItem('pets', JSON.stringify(pets));
}

function seedPets() {
  const existingPets = getPets();
  if (existingPets.length === 0) {
    const samplePets = [
      {
        id: '1',
        petName: 'Bella',
        lastVisit: '03/12/2026',
        petSpecies: 'Dog',
        ownerName: 'Sarah Johnson',
        petBreed: 'Golden Retriever',
        ownerEmail: 'sarah@example.com',
        petGender: 'Female',
        ownerPhone: '555-123-4567',
        petAge: '5',
        notes: 'Annual checkup'
      },
      {
        id: '2',
        petName: 'Milo',
        lastVisit: '01/20/2026',
        petSpecies: 'Cat',
        ownerName: 'Sarah Johnson',
        petBreed: 'Tabby',
        ownerEmail: 'sarah@example.com',
        petGender: 'Male',
        ownerPhone: '555-123-4567',
        petAge: '3',
        notes: 'Sensitive stomach'
      }
    ];
    setPets(samplePets);
  }
}

seedPets();

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
  const petSelect = document.getElementById('petSelect');

  function populatePetDropdown() {
    if (!petSelect) return;

    const pets = getPets();
    petSelect.innerHTML = `
      <option value="">-- Select a Pet --</option>
      <option value="new">+ Add New Pet</option>
    `;

    pets.forEach((pet) => {
      const option = document.createElement('option');
      option.value = pet.id;
      option.textContent = pet.petName;
      petSelect.appendChild(option);
    });
  }

  function fillPetForm(pet) {
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

  function clearPetForm() {
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

  populatePetDropdown();

  const existing = getAppointment();
  Object.entries(existing).forEach(([key, value]) => {
    const field = detailsForm.elements.namedItem(key);
    if (field) field.value = value;
  });

  if (petSelect) {
    petSelect.addEventListener('change', () => {
      const selectedValue = petSelect.value;

      if (selectedValue === '' || selectedValue === 'new') {
        clearPetForm();
        return;
      }

      const pets = getPets();
      const selectedPet = pets.find((pet) => pet.id === selectedValue);
      if (selectedPet) {
        fillPetForm(selectedPet);
      }
    });
  }

  detailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(detailsForm);
    const formObject = Object.fromEntries(formData.entries());

    if (petSelect && (petSelect.value === 'new' || petSelect.value === '')) {
      const pets = getPets();
      const newPet = {
        id: Date.now().toString(),
        ...formObject
      };
      pets.push(newPet);
      setPets(pets);
    }

    setAppointment(formObject);
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
    <p><strong>Owner Contact:</strong> ${data.ownerEmail || ''}${data.ownerPhone ? ' | ' + data.ownerPhone : ''}</p>
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
  const petSelect = document.getElementById('petSelect');

  if (petSelect) {
    const pets = getPets();
    petSelect.innerHTML = '<option value="">-- Select a Pet --</option>';

    pets.forEach((pet) => {
      const option = document.createElement('option');
      option.value = pet.id;
      option.textContent = pet.petName;
      petSelect.appendChild(option);
    });
  }

  treatmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedId = document.getElementById('petSelect').value;
    const output = document.getElementById('treatmentOutput');

    if (!selectedId) {
      output.innerHTML = '<p>Please select a pet first.</p>';
      return;
    }

    const pets = getPets();
    const pet = pets.find((p) => p.id === selectedId);

    if (!pet) {
      output.innerHTML = '<p>Pet not found.</p>';
      return;
    }

    output.innerHTML = `
      <h2>${pet.petName} Treatment Plan</h2>
      <p><strong>Current Status:</strong> Recovering well</p>
      <p><strong>Instructions:</strong> Continue prescribed medication and monitor appetite.</p>
      <p><strong>Follow-Up:</strong> Return in 2 weeks for re-evaluation.</p>
    `;
  });
}