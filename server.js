// CeA9LqXgrzpAZybB
const mongoose = require("mongoose"); 

const app = require('./app')

const DB_HOST = "mongodb+srv://Anastasiia:CeA9LqXgrzpAZybB@cluster0.hkrn63m.mongodb.net/my_contacts?retryWrites=true&w=majority"
mongoose.connect(DB_HOST)
  .then(() => {
  app.listen(3000, () => {
  console.log("Database connection successful")
})
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
})


