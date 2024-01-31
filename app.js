const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const userRouter = require('./Routers/userRouter');

app.use(express.json()); 
app.use(cookieParser());
app.use('/user', userRouter);

app.listen(PORT, (req, res) => {
    console.log(`Server is running at port ${PORT}`)
})