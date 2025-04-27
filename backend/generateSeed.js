// generateSeed.js
const bcrypt = require("bcryptjs");

// your user rows (id, firstName, lastName, email, plainPassword, address, phone, type)
const users = [
  [1, "Alice",   "Johnson", "alice.johnson@example.com", "password123", "123 Coffee St",   "555-1001", "regular"],
  [2, "Bob",     "Smith",   "bob.smith@example.com",     "password456", "456 Brewery Ln",  "555-1002", "regular"],
  [3, "Charlie", "Brown",   "charlie.brown@example.com", "password789", "789 Roast Rd",    "555-1003", "regular"],
  [4, "Diana",   "Evans",   "diana.evans@example.com",   "password101", "101 Espresso Ave","555-1004", "regular"],
  [5, "Ethan",   "Harris",  "ethan.harris@example.com",  "password112", "112 Latte Ln",    "555-1005", "regular"],
  [6, "Fiona",   "Clark",   "fiona.clark@example.com",   "password131", "131 Cappuccino Ct","555-1006", "regular"],
  [7, "George",  "Lewis",   "george.lewis@example.com",  "password415", "415 Mocha Dr",    "555-1007", "regular"],
  [8, "Hannah",  "Walker",  "hannah.walker@example.com", "password161", "161 Arabica Ave", "555-1008", "manager"],
  [9, "Ian",     "Hall",    "ian.hall@example.com",      "password718", "718 Robusta Rd",  "555-1009", "manager"],
  [10,"Julia",   "Young",   "julia.young@example.com",   "password919", "919 Macchiato Mn","555-1010", "manager"],
];

(async () => {
  console.log("-- Seed the Customers table with bcrypt-hashed passwords\n");
  console.log("INSERT INTO Customers (customer_id, first_name, last_name, email, password, address, phone_number, type) VALUES");
  for (let i = 0; i < users.length; i++) {
    const [id, fn, ln, email, pw, addr, phone, type] = users[i];
    const hash = await bcrypt.hash(pw, 10);
    process.stdout.write(
      `  (${id}, '${fn.replace("'", "''")}', '${ln.replace("'", "''")}', '${email}', '${hash}', '${addr.replace("'", "''")}', '${phone}', '${type}')` +
      (i < users.length - 1 ? ",\n" : ";\n")
    );
  }
})();