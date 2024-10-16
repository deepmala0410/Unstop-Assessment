// If we do not use any database, we can run this file for seat reservation functionality

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Initialize the train coach seating as a 2D array with 11 rows of 7 seats and 1 last row with 3 seats
let TraincoachSeats = [
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0] // Last row with only 3 seats
];

// Map to track available seats in each row
let seatMap = new Map();
seatMapping();  // Function to map row numbers to available seat numbers
initializeSeats();  // Function to reserve random initial seats
askQuestion();  // Start asking the user for seat reservations

// Function to prompt the user to input the number of seats they want to book
function askQuestion() {
    rl.question("Please enter the number of seats you want to book between 1 to 7 (or type 'exit' to stop): ", (answer) => {
        if (answer.toLowerCase() === 'exit') {
            console.log(TraincoachSeats);  // Display the final seat arrangement
            console.log("Exiting...");
            rl.close();  // Close the interface
        } else {
            let result = reserveSeats(parseInt(answer));  // Try to reserve the seats
            console.log(result);
            askQuestion();  // Continue asking for reservations
        }
    });
}

// Function to initialize random seat reservations at the start
function initializeSeats() {
    let randomValue = Math.floor(Math.random() * 7) + 1;  // Randomly reserve between 1 to 7 seats
    console.log(randomValue);
    reserveSeats(randomValue);
}

// Function to map row numbers to available seats
function seatMapping() {
    for (let i = 0; i < TraincoachSeats.length; i++) {
        i != 11 ? seatMap.set(i, [0, 1, 2, 3, 4, 5, 6]) : seatMap.set(i, [0, 1, 2]);  // Map rows 0-10 with 7 seats, row 11 with 3 seats
    }
}

// Function to reserve seats for a given number of seats
function reserveSeats(requiredSeats) {
    if (requiredSeats < 1 || requiredSeats > 7) {
        return { message: "Invalid number of seats. You can only book between 1 and 7 seats.", value: [] };
    }

    let seatsToBook = findContinuousSeats(requiredSeats);  // Try to find continuous seats in the same row

    if (!seatsToBook) {
        seatsToBook = findNearbySeats(requiredSeats);  // If no continuous seats, find nearby seats
    }

    if (seatsToBook) {
        return { message: "Booking Successful", value: seatsToBook };
    } else {
        return { message: "Booking is full or Not enough seats available.", value: [] };
    }
}

// Function to find continuous available seats in the same row
function findContinuousSeats(requiredSeats) {
    let availableSeats = [];
    for (let [row, seats] of seatMap) {
        for (let j = 0; j < seats.length; j++) {
            if (seats.length >= requiredSeats) {
                let index = (row * 7) + seats[j];  // Calculate seat index
                availableSeats.push(index);
                TraincoachSeats[row][seats[j]] = 1;  // Mark seat as booked
                if (availableSeats.length === requiredSeats) {
                    seats.splice(0, requiredSeats);  // Remove booked seats from the map
                    if (seats.length === 0) {
                        seatMap.delete(row);  // If no more seats left in the row, remove the row from the map
                    }
                    return availableSeats;
                }    
            }
        }
    }
    return null;  // Return null if no continuous seats are found
}

// Function to find nearby available seats when continuous seats are not available
function findNearbySeats(requiredSeats) {
    let availableSeats = [];
    for (let i = 0; i < TraincoachSeats.length; i++) {
        for (let j = 0; j < TraincoachSeats[i].length; j++) {
            if (TraincoachSeats[i][j] == 0) {
                TraincoachSeats[i][j] = 1;  // Mark seat as booked
                let index = (i * 7) + j;  // Calculate seat index
                availableSeats.push(index);
            }
            if (availableSeats.length == requiredSeats) {
                return availableSeats.length === requiredSeats ? availableSeats : null;  // Return seats if the required number is met
            }
        }
    }
    return null;  // Return null if not enough nearby seats are available
}
