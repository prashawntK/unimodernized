import { use, useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000'

function App() {

  const [projects, setProjects] = useState([]);

  useEffect(()=>{
    axios.get(`${API}/projects`).then(res => setProjects(res.data))
  }, [])

  return (
    <div>
      <h1>UniModernize v1 v2</h1>
      <ul>
        {projects.map((p:any)=>(
          <li key = {p.id}> 
          {p.name} - {p.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
