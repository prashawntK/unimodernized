import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({cors: {origin: '*'}})
export class EventsGateway{
    @WebSocketServer()
    server!: Server;

    emitCrawlPageComplete(projectId:string, pageUrl: string){
        this.server.to(`project:${projectId}`).emit('crawl:page-complete',{
            projectId,
            pageUrl,
            timeStamp: new Date().toISOString(),
        });
    }

    emitAnalysisComplete(projectId:string, pageUrl: string){
        this.server.to(`project:${projectId}`).emit('analysis:page-complete',{
            projectId,
            pageUrl,
            timeStamp: new Date().toISOString(),
        });
    }

    emitRedesignComplete(projectId:string, pageUrl:string){
        this.server.to(`project:${projectId}`).emit('redesign:page-complete',{
            projectId,
            pageUrl,
            timeStamp: new Date().toISOString(),
        });
    }


    @SubscribeMessage('join-project')
    handleJoinProject(
        @MessageBody() projectId : string,
        @ConnectedSocket() client: Socket,
    ){
        client.join(`project:${projectId}`);
    }


}
