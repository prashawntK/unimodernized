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
    const [pages, setPages] = useState<any>([]);
    const [selectedPageId, setSelectedPageId] = useState<string | null> (null)

    useEffect(()=>{
        socket.emit('join-project', id);
        socket.on('crawl:page-complete', (data)=>{
            setEvents(prev =>[...prev, `${data.timeStamp} - ${data.pageUrl}`])
        })
        axios.get(`${API}/projects/${id}`).then(result => setProject(result.data));
        axios.get(`${API}/projects/${id}/pages`).then(r => setPages(r.data));

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
            <div className="bg-gray-900 rounded-xl p-6 mt-8">
                <h2 className="text-lg font-semibold mb-4">Pages</h2>
                <div className="flex flex-col gap-2">
                    {pages.map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-lg">
                            <div>
                                <p className="text-sm font-medium">{p.title}</p>
                                <p className="text-xs text-gray-400">{p.url}</p>
                            </div>
                            {p.redesign ? (
                                <button onClick={() => setSelectedPageId(p.id)}
                                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs">
                                    View Preview
                                </button>
                            ) : (
                                <span className="text-xs text-gray-500">Pending</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {selectedPageId && (
                <div 
                    onClick={() => setSelectedPageId(null)}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 rounded-xl w-full max-w-7xl h-[90vh] flex flex-col"
                    >
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                            <h2 className="text-lg font-semibold">Before / After</h2>
                            <button onClick={() => setSelectedPageId(null)} className="text-gray-400 hover:text-white text-xl">×</button>
                        </div>
                        
                        <div className="flex-1 flex gap-2 p-4">
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Original</p>
                                    <a 
                                        href={pages.find(p => p.id === selectedPageId)?.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-400 hover:underline"
                                    >
                                        Open in new tab ↗
                                    </a>
                                </div>
                                <iframe 
                                    src={pages.find(p => p.id === selectedPageId)?.url}
                                    className="flex-1 bg-white rounded-lg"
                                />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Modernized</p>
                                <iframe 
                                    src={`${API}/preview/${id}/${selectedPageId}`}
                                    className="flex-1 bg-white rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectDetail
