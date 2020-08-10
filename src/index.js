//importando o express
const express = require('express')
const { uuid, isUuid } = require('uuidv4');

const app = express()
//fazer o express aceitar requisições em formato JSON
app.use(express.json())

//Métodos HTTP://
/*GET: Buscar informações do back-end
*POST: Criar uma informação no back-end
*PUT: Alterar uma informação no back-end
*DELETE: Deletar uma informação no Back-end
*/

//Parâmetros
/*
Tipos de parâmetros:
*Query Params: Filtros e paginação
*Route Params: Identificar recursos (Atualizar/Deletar)
*Request Body: Conteudo na hora de criar ou editar um recurso (JSON)
*/

//Middleware//
/*
*Interceptador de requisições, pode interromper ou alterar dados da requisição
*
*/


const projects = []

//mostra quais rotas estão sendo chamadas e quais methods
function logRequest(request, response, next){
    const {method, url} = request

    const logLabel =  `[${method.toUpperCase()}] ${url}`

    console.time(logLabel)

    next() //proximo middleware
      //executar um comando depois do next()
    console.timeEnd(logLabel)
}

function validateProjectId(request, response, next){
  const { id } = request.params

  if(!isUuid(id)){
    return response.status(400).json({error:'invalid project ID.'})
  }
  return next()
}

app.use(logRequest)
app.use('/projects:id', validateProjectId)

app.get('/projects',(request, response) => {
  const {title} = request.query
 
  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

  return response.json(results)
})
app.post('/projects',(request, response) => {

  const {title, owner} = request.body

  const project = {
   id:uuid(), title, owner 
  }  
  projects.push(project)

  return response.json(project)
})

app.put('/projects/:id',(request, response) => {
  const {id} = request.params;
  const {title, owner} = request.body

  const projectIndex = projects.findIndex(project=> project.id ===id )

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project not found.'})
  }
  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project

  return response.json(project)
})
app.delete('/projects/:id',(request, response) => {

  const { id } = request.params

  const projectIndex = projects.findIndex(project => project.id === id )

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project not found.'})
  }

  projects.splice(projectIndex, 1)

  return response.status(204).send()

})
//criando uma porta//
app.listen(3333, () => {
  console.log("Back-end started!")
})
