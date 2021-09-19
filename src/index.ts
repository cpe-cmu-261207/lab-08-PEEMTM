import express, { Request } from 'express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

type Task = {
  id: number;
  name: string;
  complete: boolean;
}

const tasks: Task[] = []

app.get('/me', (req, res) => {
  return res.json({
      name: 'Atthapong Auewongchai', 
      code: 630610770})
})

let currentId: number = 1

app.post('/todo', (req, res) => {

  // try to call /todo?q1=data1&q2data2
  // you can read query parameters with "req.query"
  const newTask: Task = {
    id: currentId,
    name: req.body.name,
    complete: req.body.complete
  }
  if (typeof (newTask.name) !== "string" || newTask.name === "" || typeof (newTask.complete) !== "boolean") {
    return res.status(400).json({ status: "failed", message: "Invalid input data" })
  }
  else {
    currentId += 1
    tasks.push(newTask)
    return res.json({ status: 'success', tasks })
  }
})

app.get('/todo', (req, res) => {
  if (req.query.order == "asc") {
    tasks.sort((a, b) => {
      var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    })
  }
  else if (req.query.order == "desc") {
    tasks.sort((a, b) => {
      var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
      if (nameA > nameB) //sort string ascending
        return -1;
      if (nameA < nameB)
        return 1;
      return 0; //default return value (no sorting)
    })
  }
  return res.json({ status: 'success', tasks })
})

app.put('/todo/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const foundId = tasks.find(x => x.id === id)
    if(foundId){
        foundId.complete = !foundId.complete
        return res.json({status: 'success', tasks})
    }else{
        return res.status(404).json({
            status: 'failed', 
            message: 'Id is not found'})
    }
})

app.delete('/todo/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const foundIndex = tasks.findIndex(x => x.id === id)
  if(foundIndex > -1){
      tasks.splice(foundIndex, 1)
      return res.json({status: 'success', tasks})
  }else{
      return res.status(404).json({
          status: 'failed',
          message: 'Id is not found'})
  }
})

//Heroku will set process.env.PORT to server port
//But if this code run locally, port will be 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Server is running at port' + port)
})