const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((err) => console.log(err.message));

  mongoose.connection.on('connected', ()=>{
    console.log('mongoose connected to database');
  });

mongoose.connection.on('error', (err)=>{
  console.log(err.message);
});

mongoose.connection.on('disconnected', ()=>{
    console.log('mongoose connection is disconnected');
});

process.on('SIGINT', async() =>{
    await mongoose.connection.close();
    process.exit(0);
})
