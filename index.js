const express = require("express");
const mongoose = require('mongoose');
const clinicas = require("./modelos")

const app = express();
const port = 3000;
app.use(express.json())

async function coneccion (){await mongoose.connect('mongodb+srv://CristianCamargo:Cristian227700@cluster0.ssvjvjq.mongodb.net/tablas?retryWrites=true&w=majority');console.log("esta conectado")}

require('dotenv').config()

const API_KEY = process.env.API_KEY
const apiKeyValidation = (req,res,next) =>{
    const userApiKey=req.get('x-api-key');
    if (userApiKey && userApiKey === API_KEY){
        next();
    } 
    else{
        res.status(401).send('Invalid Api Key')
    }
    
};

app.use(apiKeyValidation)

app.get("/patients",async (req, res)=>{ 
  
        coneccion()
        const registros = await clinicas.find({});
        console.log(registros)
        res.status(200).send(registros)
        return JSON.parse(JSON.stringify(registros))
        //res.json(registros);
});



app.post('/patients', async (req, res) => {
  coneccion()
  try {
    const nuevoRegistro = await clinicas.insertMany(req.body);
    console.log(nuevoRegistro);
    res.status(201).send(nuevoRegistro)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/patients/put/:id', async (req, res) => {

  const { id } = req.params;
  const { nombre, motivo, doctor, notas, foto } = req.body;
  coneccion()
  try {
    const registroActualizado = await clinicas.findOneAndUpdate(
      { _id: id },
      { $set: { nombre, motivo, doctor, notas, foto } },
      { new: true }
    );

    if (!registroActualizado) {
      return res.status(404).json({ mensaje: 'Documento no encontrado' });
    }

    console.log(registroActualizado);
    res.status(200).send(registroActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/patients/delete/:id",async(req,res)=>{
  coneccion()
  
  
  try {
    const pacienteId = req.params.id;
      const deletePaciente = await clinicas.findByIdAndDelete(pacienteId);
  
      if (deletePaciente) {
        res.status(200).send("mensaje: Paciente eliminado exitosamente");
        res.send(findPacientes)
      } else {
        res.status(404).json("Paciente no encontrado");
      }
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al intentar eliminar el paciente', error });
    }
  
  
  return JSON.parse(JSON.stringify(findPacientes))
  //res.status(200).json({success: true, data : findPacientes})
})









app.listen(port, ()=> {
    console.log("the app is running");
})


module.exports=app;