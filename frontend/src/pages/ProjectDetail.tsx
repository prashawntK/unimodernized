import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from 'axios'
import { io } from 'socket.io-client'

const API = 'http://localhost:3000'
const socket = io(API)


function ProjectDetail() {

    const { id } = useParams();
    const [events, setEvents] = useState<string[]>([]);
    const [project, setProject] = useState<any>(null);

    useEffect(()=>{
        socket.emit('join-project', id);
        socket.on('crawl:page-complete', (data)=>{
            setEvents(prev =>[...prev, `${data.timeStamp} - ${data.pageUrl}`])
        })
        axios.get(`${API}/projects/${id}`).then(result => setProject(result.data));

        return () =>{
            socket.off('crawl:page-complete')
        }
    },[])

    async function startCrawling(){
        await axios.post(`${API}/crawl`, {projectId: id})
    }

    function renderButton(){
        if(project?.status === 'CREATED')
            return <button onClick = {startCrawling}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium mb-8">
                Start Crawl
            </button>
        if(project?.status === 'CRAWLING')
            return <button disabled
                className="bg-gray-700 px-5 py-2 rounded-lg text-sm font-medium mb-8 cursor-not-allowed opacity-60">
                Crawling...
            </button>
        if(project?.status === 'FAILED')
            return <button 
                onClick = {startCrawling}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium mb-8">
                Retry
            </button>
        return null
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Project {project?.name}</h1>
        <div>
            {renderButton()}
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Live Events</h2>
            {events.map((e, i) => (
            <p key={i} className="text-sm text-gray-300 py-1 border-b border-gray-800">{e}</p>
            ))}
        </div>
        </div>
    )
}

export default ProjectDetail
