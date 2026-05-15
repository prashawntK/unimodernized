import {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';


function Dashboard() {

  const navigate = useNavigate();
  const { logout } = useAuth();

  const [name, setName] = useState('');
  const [projects, setProjects] = useState([]);
  const [sourceUrl, setSourceUrl] = useState<any>('');


  useEffect(()=>{
    api.get(`/projects`).then(res => setProjects(res.data));
  }, [])

  async function createProject(e:React.FormEvent){
    e.preventDefault();
    await api.post(`/projects`, {name, sourceUrl})

    const res = await api.get(`/projects`)
    setProjects(res.data)
    setName('')
    setSourceUrl('')
  }

  function handleLogout(){
    logout();
    navigate('/login');
  }

return (
    
  <div className="min-h-screen bg-gray-950 text-white">
    {/* Header */}
    {/* Header */}
  <div className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold">UniModernize</h1>
    <button
      onClick={handleLogout}
      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
    >
      Log out
    </button>
  </div>


    <div className="max-w-4xl mx-auto px-8 py-10">

      {/* Create project form */}
      <div className="bg-gray-900 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">New Project</h2>
        <form onSubmit={createProject} className="flex gap-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Project name"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex-1 text-sm"
          />
          <input
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            placeholder="https://university.edu"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex-1 text-sm"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium">
            Create
          </button>
        </form>
      </div>

      {/* Projects list */}
      <h2 className="text-lg font-semibold mb-4">Projects</h2>
      <div className="flex flex-col gap-3">
        {projects.map((p: any) => (
          <div key={p.id} onClick={()=>navigate(`projects/${p.id}`)} className="bg-gray-900 rounded-xl px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-800">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-gray-400 text-sm">{p.sourceUrl}</p>
            </div>
            <span className="text-xs bg-gray-800 px-3 py-1 rounded-full">{p.status}</span>
          </div>
        ))}
      </div>

    </div>
  </div>
)

}

export default Dashboard
