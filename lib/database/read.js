const fs = require("fs");

export default function readDatabase() {
  const data = fs.readFileSync("./database/db.json", "utf8", (error, data) => {
    if (error) {
      console.error(error);
    }
    return JSON.parse(data);
  });
  // console.log(data);
  return JSON.parse(data);
}
