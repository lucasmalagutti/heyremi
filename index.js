import "dotenv/config";
import app from "./server.js";
import mongodb from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";
import AuthDAO from "./dao/authDAO.js";

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env["MONGO_USERNAME"];
const mongo_password = process.env["MONGO_PASSWORD"];
const url = `mongodb+srv://${mongo_username}:${mongo_password}@moviereview.6mzxy2j.mongodb.net/?appName=MovieReview`;
const port = 8000;

MongoClient.connect(url, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ReviewsDAO.injectDB(client);
    await AuthDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on http://localhost:${port}/`);
    });
  });
