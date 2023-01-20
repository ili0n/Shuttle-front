import { BehaviorSubject, Observable } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

export class SocketService {
    private stompClient: Stomp.Client | undefined = undefined;
    private connectedToSocketSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private connectedToSocketObs = this.connectedToSocketSubject.asObservable();

    public onConnectedToSocket(): Observable<boolean> {
        return this.connectedToSocketObs;
    }

    protected connectToSocket(stompEndpoint: string) {
        let ws = new SockJS(environment.serverOrigin + stompEndpoint);
        this.stompClient = Stomp.over(ws);
        this.stompClient.debug = () => {};
        let self = this;
        this.stompClient.connect({}, () => {
            self.connectedToSocketSubject.next(true);
        });
    }

    protected subscribeToWebSocketTopic(topicName: string, callback: (msg: Stomp.Message) => any): Stomp.Subscription | null {
        if (this.stompClient != undefined) {
            return this.stompClient.subscribe('/' + topicName, callback);
        } else {
            console.error("Cannot subscribe to topic" + topicName + ". Not connected to a websocket!");
            return null;
        }
    }

    protected sendMessageToSocket(message: string, socketEndpoint: string) {
        if (this.stompClient != undefined) {
            this.stompClient.send("/shuttle/" + socketEndpoint, {}, message);
        } else {
            console.error("Cannot send message" + message + " to endpoint " + socketEndpoint + ". Not connected to a websocket!");
        }
    }
}
