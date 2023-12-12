const express = require("express");
const mongoose = require('mongoose');
const clinicas = require("./modelos");
const {swaggerDocs} = require('./swagger');
const app = express();
const port = 3000;
app.use(express.json())

/**
 * @swagger
 * tags:
 *   name: Conección
 *   description: Operaciones relacionadas con la conexión a la base de datos.
 */
async function coneccion (){await mongoose.connect('mongodb+srv://CristianCamargo:Cristian227700@cluster0.ssvjvjq.mongodb.net/tablas?retryWrites=true&w=majority');console.log("esta conectado")}
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 * 
 * security:
 *   - ApiKeyAuth: []
 */
require('dotenv').config()

// const API_KEY = process.env.API_KEY
// const apiKeyValidation = (req,res,next) =>{
//     const userApiKey=req.get('x-api-key');
//     if (userApiKey && userApiKey === API_KEY){
//         next();
//     } 
//     else{
//         res.status(401).send('Invalid Api Key')
//     }
    
// };

// app.use(apiKeyValidation)

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Obtiene información de un paciente por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del paciente.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del paciente obtenida con éxito.
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4e8bb97e3e414772e30106"
 *               name: "Nombre del Paciente"
 *               // Otros campos del paciente
 *       404:
 *         description: No se encontró ningún paciente con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */

app.get("/patients/:id",async (req, res)=>{ 
  
  coneccion()
  const usuario = await clinicas.findById({ _id: req.params.id });
  console.log(usuario)
  res.status(200).send(usuario)
  return JSON.parse(JSON.stringify(usuario))
  
});

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Obtiene la lista de todos los pacientes.
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida con éxito.
 *         content:
 *           application/json:
 *             example:
 *               - _id: "5f4e8bb97e3e414772e30106"
 *                 name: "Nombre del Paciente 1"
 *                 // Otros campos del paciente 1
 *               - _id: "5f4e8bb97e3e414772e30107"
 *                 name: "Nombre del Paciente 2"
 *                 // Otros campos del paciente 2
 *               // Otros pacientes en la lista
 *       500:
 *         description: Error interno del servidor.
 */
app.get("/patients",async (req, res)=>{ 
  
        coneccion()
        const registros = await clinicas.find({});
        console.log(registros)
        res.status(200).send(registros)
        return JSON.parse(JSON.stringify(registros))
       
});

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Agrega un nuevo paciente a la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             - name: "Nuevo Paciente"
 *               // Otros campos del nuevo paciente
 *     responses:
 *       201:
 *         description: Paciente agregado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4e8bb97e3e414772e30108"
 *               name: "Nuevo Paciente"
 *               // Otros campos del nuevo paciente
 *       500:
 *         description: Error interno del servidor.
 */

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

/**
 * @swagger
 * /patients/put/{id}:
 *   put:
 *     summary: Actualiza la información de un paciente por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del paciente a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Nuevo Nombre"
 *             motivo: "Nuevo Motivo"
 *             doctor: "Nuevo Doctor"
 *             notas: "Nuevas Notas"
 *             foto: "Nueva Foto"
 *     responses:
 *       200:
 *         description: Información del paciente actualizada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               _id: "5f4e8bb97e3e414772e30108"
 *               nombre: "Nuevo Nombre"
 *               motivo: "Nuevo Motivo"
 *               doctor: "Nuevo Doctor"
 *               notas: "Nuevas Notas"
 *               foto: "Nueva Foto"
 *       404:
 *         description: No se encontró ningún paciente con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */
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
/**
 * @swagger
 * /patients/delete/{id}:
 *   delete:
 *     summary: Elimina un paciente por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del paciente a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente eliminado exitosamente.
 *       404:
 *         description: No se encontró ningún paciente con el ID proporcionado.
 *       500:
 *         description: Error interno del servidor al intentar eliminar el paciente.
 */
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
  
})









app.listen(port, ()=> {
    console.log("the app is running");
    swaggerDocs(app, port);
})


module.exports=app;