// generateSeed.js
const bcrypt = require("bcryptjs");

// your user rows (id, firstName, lastName, email, plainPassword, address, phone, type)
const users = [
  [1, "Jane",   "Doe", "neda.mohamed@sabanciuniv.edu", "123456", "123 Coffee St",   "555-1001", "regular"],
  [2, "Sales",   "Manager", "sales@fincan.com", "123456", "fincan inc",   "555-1001", "sales"],
  [3, "Product",   "Manager", "products@fincan.com", "123456", "123 Coffee St",   "555-1001", "regular"],

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