const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Connect to SQLite database
const db = new sqlite3.Database("./users.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

// Create users table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        dob TEXT NOT NULL,
        gender TEXT NOT NULL,
        blood_group TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error("Table creation failed:", err.message);
    } else {
        console.log("Users table is ready");
    }
});


// Save user details
app.post("/api/users", (req, res) => {

    const {
        fullName,
        email,
        phone,
        dob,
        gender,
        bloodGroup,
        address,
        city,
        state,
        pincode
    } = req.body;


    // Required field validation
    if (
        !fullName ||
        !email ||
        !phone ||
        !dob ||
        !gender ||
        !bloodGroup ||
        !address ||
        !city ||
        !state ||
        !pincode
    ) {
        return res.status(400).json({
            message: "Please fill all the required fields."
        });
    }


    // Name - letters and spaces only
    if (!/^[A-Za-z ]+$/.test(fullName)) {
        return res.status(400).json({
            message: "Name field only allows letters."
        });
    }


    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address."
        });
    }


    // Phone - numbers only
    if (!/^[0-9]+$/.test(phone)) {
        return res.status(400).json({
            message: "Phone number field only allows numbers."
        });
    }


    // Phone - exactly 10 digits
    if (phone.length !== 10) {
        return res.status(400).json({
            message: "Phone number must contain exactly 10 digits."
        });
    }


    // Gender - only allowed values
    const allowedGenders = ["Male", "Female", "Other"];

    if (!allowedGenders.includes(gender)) {
        return res.status(400).json({
            message: "Please select a valid gender."
        });
    }


    // Blood group validation
    const allowedBloodGroups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
    ];

    if (!allowedBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({
            message: "Please select a valid blood group."
        });
    }


    // City - letters and spaces only
    if (!/^[A-Za-z ]+$/.test(city)) {
        return res.status(400).json({
            message: "City field only allows letters."
        });
    }


    // State - letters and spaces only
    if (!/^[A-Za-z ]+$/.test(state)) {
        return res.status(400).json({
            message: "State field only allows letters."
        });
    }


    // Pincode - numbers only
    if (!/^[0-9]+$/.test(pincode)) {
        return res.status(400).json({
            message: "Pincode field only allows numbers."
        });
    }


    // Pincode - exactly 6 digits
    if (pincode.length !== 6) {
        return res.status(400).json({
            message: "Pincode must contain exactly 6 digits."
        });
    }


    // Insert into database
    const sql = `
        INSERT INTO users (
            full_name,
            email,
            phone,
            dob,
            gender,
            blood_group,
            address,
            city,
            state,
            pincode
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            fullName,
            email,
            phone,
            dob,
            gender,
            bloodGroup,
            address,
            city,
            state,
            pincode
        ],
        function (err) {

            if (err) {
                console.error("Database insert failed:", err.message);

                return res.status(500).json({
                    message: "Failed to save user details."
                });
            }

            console.log(`User saved with ID: ${this.lastID}`);

            res.status(201).json({
                message: "User details saved successfully!",
                userId: this.lastID
            });
        }
    );
});
// Get all users
app.get("/api/users", (req, res) => {

    const sql = `
        SELECT
            id,
            full_name,
            email,
            phone,
            dob,
            gender,
            blood_group,
            address,
            city,
            state,
            pincode
        FROM users
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            console.error("Failed to fetch users:", err.message);

            return res.status(500).json({
                message: "Failed to fetch users."
            });
        }

        res.json(rows);
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});