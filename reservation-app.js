// reservation-app.js

const roomRates = {
  Single: 2000,
  Double: 3000,
  Suite: 5000,
  Deluxe: 7000,
};

const packageRates = {
  "None": 0,
  "Breakfast": 500,
  "Airport Pickup": 1000,
  "Spa Access": 1500,
};

function updateTotalCost() {
  const checkin = new Date(document.getElementById('checkin').value);
  const checkout = new Date(document.getElementById('checkout').value);
  const room = document.getElementById('roomType').value;
  const pkg = document.getElementById('package').value;

  if (!checkin || !checkout || isNaN(checkout - checkin)) {
    document.getElementById('totalCost').innerText = 'Total Cost: Rs 0';
    return;
  }

  const nights = Math.max(1, (checkout - checkin) / (1000 * 60 * 60 * 24));
  const total = (roomRates[room] || 0) * nights + (packageRates[pkg] || 0);
  document.getElementById('totalCost').innerText = `Total Cost: Rs ${total}`;
}

document.getElementById('reservationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const room = document.getElementById('roomType').value;
  const pkg = document.getElementById('package').value;

  const nights = Math.max(1, (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
  const total = (roomRates[room] || 0) * nights + (packageRates[pkg] || 0);

  try {
    await db.collection("reservations").add({
      name,
      checkin,
      checkout,
      room,
      package: pkg,
      total
    });

    document.getElementById('registerMsg').innerText = "Reservation added successfully!";
    document.getElementById('reservationForm').reset();
    updateTotalCost();
    loadReservations();
  } catch (error) {
    console.error("Error adding reservation:", error);
    alert("Error saving reservation. Check console.");
  }
});

async function loadReservations() {
  const snapshot = await db.collection("reservations").get();
  const viewBody = document.getElementById('reservationsTableBody');
  const deleteBody = document.getElementById('deleteTableBody');
  viewBody.innerHTML = '';
  deleteBody.innerHTML = '';

  snapshot.forEach(doc => {
    const data = doc.data();
    const row = `<tr>
      <td>${data.name}</td>
      <td>${data.checkin}</td>
      <td>${data.checkout}</td>
      <td>${data.room}</td>
      <td>${data.package}</td>
      <td>${data.total}</td>
    </tr>`;
    viewBody.innerHTML += row;

    const deleteRow = `<tr>
      <td>${data.name}</td>
      <td>${data.checkin}</td>
      <td>${data.checkout}</td>
      <td>${data.room}</td>
      <td>${data.package}</td>
      <td>${data.total}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteReservation('${doc.id}')">Delete</button></td>
    </tr>`;
    deleteBody.innerHTML += deleteRow;
  });
}

async function deleteReservation(id) {
  if (confirm("Are you sure you want to delete this reservation?")) {
    try {
      await db.collection("reservations").doc(id).delete();
      loadReservations();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting reservation.");
    }
  }
}

window.onload = loadReservations;
