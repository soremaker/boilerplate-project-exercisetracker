const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const users = [];
const allusers = [];
id = 0
app.post('/api/users',function(req,res){
  //console.log(req);
  const newUser = req.body.username;
  id = id + 1;
  users.push({username: newUser, _id: id.toString()});
  allusers.push({
    username: newUser,
    _id: id.toString()
  })
  res.send({'username':`${newUser}`,'_id':`${id}`});
});
app.get('/api/users',function(req,res){
  res.send(users);
});

app.post('/api/users/:_id/exercises',function(req,res){
  console.log(req.params._id);
  const userid = req.params._id;
  const {description,duration,date} = req.body;
  const date_correct = date ? new Date(date).toDateString() : new Date().toDateString();
  const duration_correct = parseInt(duration);
  //console.log(duration);
  const exercise = {
    description,
    duration: duration_correct,
    date: date_correct
  }
  const user = allusers.find(user => user._id === userid);
  
  console.log(exercise);
  if(user){
    if(!user.exercises){
      user.exercises = [];
    }
    user.exercises.push(exercise);
    username = user.username;
    _id = user._id;
    //console.log(user);
    user_ex = {username,_id,description,duration:duration_correct,date:date_correct}
    res.send(user_ex);
  }
  else{
    res.send({error: 'user not found'});
  }
});

app.get('/api/users/:_id/logs',function(req,res){
  const userid = req.params._id;
  const {from,to,limit} = req.query;
  const user = allusers.find(user => user._id === userid);
  if(user){
    let log = user.exercises;
    //console.log(log);
    if(from){
      const fromDate = new Date(from).getTime();
      log = log.filter(exercise => new Date(exercise.date).getTime() >= fromDate);
    }
    if(to){
      const toDate = new Date(to).getTime();
      log = log.filter(exercise => new Date(exercise.date).getTime() <= toDate);
    }
    if(limit){
      log = log.slice(0,limit);
    }
    //console.log(log.length);
    res.send({
      username: user.username,
      count: log.length,
      _id: user._id,
      log
    });
  }
  else{
    res.send({error: 'user not found'});
  }
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
