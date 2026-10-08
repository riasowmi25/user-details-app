const form = document.getElementById("userForm");

const successModal = document.getElementById("successModal");
const successOkButton = document.getElementById("successOkButton");


// -----------------------------
// Helper function for errors
// -----------------------------

function showError(fieldId, message) {
    document.getElementById(fieldId).textContent = message;
}


// -----------------------------
// Clear all error messages
// -----------------------------

function clearErrors() {
    const errors = document.querySelectorAll(".error");

    errors.forEach((error) => {
        error.textContent = "";
    });
}


// -----------------------------
// Form submit
// -----------------------------

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;


    // Get values
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const bloodGroup = document.getElementById("bloodGroup").value;
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();


    // -----------------------------
    // Required field validation
    // -----------------------------

    if (!fullName) {
        showError("nameError", "Please enter your name.");
        isValid = false;
    }

    if (!email) {
        showError("emailError", "Please enter your email.");
        isValid = false;
    }

    if (!phone) {
        showError("phoneError", "Please enter your phone number.");
        isValid = false;
    }

    if (!dob) {
        showError("dobError", "Please select your date of birth.");
        isValid = false;
    }

    if (!gender) {
        showError("genderError", "Please select your gender.");
        isValid = false;
    }

    if (!bloodGroup) {
        showError("bloodGroupError", "Please select your blood group.");
        isValid = false;
    }

    if (!address) {
        showError("addressError", "Please enter your address.");
        isValid = false;
    }

    if (!city) {
        showError("cityError", "Please enter your city.");
        isValid = false;
    }

    if (!state) {
        showError("stateError", "Please enter your state.");
        isValid = false;
    }

    if (!pincode) {
        showError("pincodeError", "Please enter your pincode.");
        isValid = false;
    }


    // -----------------------------
    // Name validation
    // -----------------------------

    if (fullName && !/^[A-Za-z ]+$/.test(fullName)) {
        showError(
            "nameError",
            "Name field only allows letters."
        );

        isValid = false;
    }


    // -----------------------------
    // Email validation
    // -----------------------------

    if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        showError(
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;
    }


    // -----------------------------
    // Phone validation
    // -----------------------------

    if (phone && !/^[0-9]+$/.test(phone)) {

        showError(
            "phoneError",
            "Phone number field only allows numbers."
        );

        isValid = false;

    } else if (phone && phone.length !== 10) {

        showError(
            "phoneError",
            "Phone number must contain exactly 10 digits."
        );

        isValid = false;
    }


    // -----------------------------
    // City validation
    // -----------------------------

    if (city && !/^[A-Za-z ]+$/.test(city)) {

        showError(
            "cityError",
            "City field only allows letters."
        );

        isValid = false;
    }


    // -----------------------------
    // State validation
    // -----------------------------

    if (state && !/^[A-Za-z ]+$/.test(state)) {

        showError(
            "stateError",
            "State field only allows letters."
        );

        isValid = false;
    }


    // -----------------------------
    // Pincode validation
    // -----------------------------

    if (pincode && !/^[0-9]+$/.test(pincode)) {

        showError(
            "pincodeError",
            "Pincode field only allows numbers."
        );

        isValid = false;

    } else if (pincode && pincode.length !== 6) {

        showError(
            "pincodeError",
            "Pincode must contain exactly 6 digits."
        );

        isValid = false;
    }


    // -----------------------------
    // Stop if validation failed
    // -----------------------------

    if (!isValid) {
        return;
    }


    // -----------------------------
    // Create user object
    // -----------------------------

    const userData = {
        fullName: fullName,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        bloodGroup: bloodGroup,
        address: address,
        city: city,
        state: state,
        pincode: pincode
    };


    try {

        // Send data to backend
        const response = await fetch("/api/users", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)

        });


        const result = await response.json();


        // -----------------------------
        // Backend error
        // -----------------------------

        if (!response.ok) {

            alert(result.message);

            return;
        }


        // -----------------------------
        // Success
        // -----------------------------

        console.log(
            "User saved successfully:",
            result
        );

        // Show success popup
        successModal.style.display = "flex";


    } catch (error) {

        console.error(
            "Error saving user:",
            error
        );

        alert(
            "Unable to connect to the server. Please try again."
        );
    }

});


// -----------------------------
// Success popup OK button
// -----------------------------

successOkButton.addEventListener("click", function () {

    // Close popup
    successModal.style.display = "none";

    // Reset form
    form.reset();

    // Clear any errors
    clearErrors();

    // Return to the User Personal Details page
    window.location.href = "/";

    // View saved users
document.getElementById("viewUsersButton").addEventListener("click", () => {
    window.location.href = "/users.html";
});
});