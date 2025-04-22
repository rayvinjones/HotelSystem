function escapeStr(str) {
  if (str == null) return "";
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function setupLogin() {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) return;

  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    fetch("login.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
      .then(res => res.text())
      .then(data => {
        if (data.trim().toLowerCase() === "success") {
          alert("Login successful!");
          window.location.href = "hotelbooking.html";
        } else {
          alert("Invalid username or password.");
        }
      })
      .catch(error => {
        console.error("Login error:", error);
        alert("Something went wrong. Try again later.");
      });
  });
}

function setupSignup() {
  const signupBtn = document.getElementById("signupBtn");
  if (!signupBtn) return;

  signupBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    fetch("php/signup.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
      .then(res => res.text())
      .then(data => {
        if (data.trim() === "success") {
          alert("Signup successful! Redirecting to login page...");
          window.location.href = "index.html";
        } else {
          alert("Signup failed. Please try again.");
        }
      })
      .catch(error => {
        console.error("Signup error:", error);
        alert("An error occurred. Please try again.");
      });
  });
}

function loadRooms() {
  fetch('get_rooms.php')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#roomTable tbody');
      if (!tableBody) return;
      tableBody.innerHTML = "";

      data.forEach((room, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${room.room_number}</td>
            <td>${room.room_location}</td>
            <td>${room.room_type}</td>
            <td>${room.room_price}</td>
            <td id="status_${room.room_number}">${room.status}</td>
            <td><button id="btn_${room.room_number}" onclick="bookRoom('${room.room_number}')" ${room.status === 'Booked' ? 'disabled' : ''}>Book</button></td>
          </tr>`;
        tableBody.innerHTML += row;
      });
    })
    .catch(err => console.error("Load rooms error:", err));
}

function switchTab(tabId) {
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach(tab => tab.style.display = "none");

  // Skip switching to the "availabilityTab"
  if (tabId === "availabilityTab") {
    return;  // Prevent switching to the availability tab
  }

  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.style.display = "block";

    if (tabId === "calendarTab") {
      updateCalendar();
    }
  }
}

function updateCalendar() {
  const calendarTab = document.getElementById("calendarTab");
  if (!calendarTab) return;

  calendarTab.innerHTML = "<h3 class='text-lg font-semibold mb-4'>Booking Calendar</h3>";

  if (!window.bookings || window.bookings.length === 0) {
    calendarTab.innerHTML += "<p>No bookings yet.</p>";
    return;
  }

  window.bookings.forEach(booking => {
    const div = document.createElement("div");
    div.className = "p-4 border-b";
    div.innerHTML = `
      <strong>Room ${booking.roomNumber}</strong><br>
      Guest: ${booking.guestName}<br>
      Check-in: ${booking.checkinDate}<br>
      Check-out: ${booking.checkoutDate}
    `;
    calendarTab.appendChild(div);
  });
}

function bookRoom(roomNumber) {
  const roomStatus = document.getElementById(`status_${roomNumber}`)?.textContent;
  if (roomStatus === 'Booked') {
    alert("Sorry, this room is already booked.");
    return;
  }

  const formContainer = document.createElement('div');
  formContainer.id = 'bookingFormContainer';
  formContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Book Room ${roomNumber}</h3>
        <form id="bookRoomForm">
          <label for="guestName">Guest Name:</label>
          <input type="text" id="guestName" name="guestName" required class="w-full p-2 border mb-2"><br>

          <label for="checkinDate">Check-in Date:</label>
          <input type="date" id="checkinDate" name="checkinDate" required class="w-full p-2 border mb-2"><br>

          <label for="checkoutDate">Check-out Date:</label>
          <input type="date" id="checkoutDate" name="checkoutDate" required class="w-full p-2 border mb-2"><br>

          <div class="flex justify-between mt-4">
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Confirm Booking</button>
            <button type="button" onclick="document.getElementById('bookingFormContainer').remove()" class="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(formContainer);

  document.getElementById("bookRoomForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const guestName = document.getElementById("guestName").value.trim();
    const checkinDate = document.getElementById("checkinDate").value;
    const checkoutDate = document.getElementById("checkoutDate").value;

    if (!guestName || !checkinDate || !checkoutDate) {
      alert("Please fill in all fields.");
      return;
    }

    if (!window.bookings) window.bookings = [];
    window.bookings.push({
      roomNumber,
      guestName,
      checkinDate,
      checkoutDate
    });

    alert(`Room ${roomNumber} booked successfully!`);
    document.getElementById(`status_${roomNumber}`).textContent = 'Booked';
    document.getElementById(`btn_${roomNumber}`).disabled = true;
    formContainer.remove();

    updateCalendar();
  });
}

function updatePricingTabLabel(total) {
  const totalCost = calculateTotalCost(); 
  document.getElementById("roomPrice").value = totalCost;  // Example: update with totalCost
}

function setupPricingTab() {
  const pricingForm = document.getElementById("pricingForm");
  if (!pricingForm) return;

  pricingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const roomPrice = parseFloat(document.getElementById("roomPrice").value);
    const numNights = parseInt(document.getElementById("numNights").value);
    const extraCharges = parseFloat(document.getElementById("extraCharges").value || 0);
    const discount = parseFloat(document.getElementById("discount").value || 0);

    if (isNaN(roomPrice) || isNaN(numNights)) {
      alert("Please enter valid numbers for room price and number of nights.");
      return;
    }

    const originalTotal = roomPrice * numNights + extraCharges;
    const priceInfo = calculateDiscountedPrice(originalTotal, discount);

    document.getElementById("totalCost").innerHTML = `
      <div>
        <p>Original: <s>$${priceInfo.originalPrice}</s></p>
        <p>Discount: ${priceInfo.discountPercent}% (-$${priceInfo.discountAmount})</p>
        <p><strong>Total: $${priceInfo.discountedPrice}</strong></p>
      </div>
    `;
    updatePricingTabLabel(priceInfo.discountedPrice);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Remove the "Availability" button
  const availabilityButton = document.getElementById("availabilityTabButton");
  if (availabilityButton) {
    availabilityButton.remove();  // This removes the button from the DOM
  }

  setupLogin();
  setupSignup();
  if (document.querySelector('#userTable')) loadUsers();
  if (document.querySelector('#roomTable')) loadRooms();
  setupPricingTab();
  switchTab("listTab");  // Default tab
});
