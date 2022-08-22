const fs = require("fs");

export default function buildDatabase(data) {
  fs.writeFileSync("api/database/db.json", JSON.stringify(data), (error) => {
    if (error) {
      console.error(error);
    }
  });
  console.info("Database has been built");
}
