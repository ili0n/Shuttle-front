import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export enum MessageType {
    RIDE, PANIC, SUPPORT
}

export interface Message {
    id: number,
    timeOfSending: string
    senderId: number,
    receiverId: number, // if -1, send to admins
    rideId: number,   
    message: string,
    type: MessageType,
}

interface MessageSendPayload {
    receiverId: number, // if -1, send to admins
    rideId: number,   
    message: string,
    type: MessageType,
}

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    readonly url: string = environment.serverOrigin + 'api/user'
    constructor(private httpClient: HttpClient) { }

    /**
     * Send an automated message to all admins (recieveId == -1) that the driver is not following
     * the expected route for the given ride.
     * @param rideId ID of the ride.
     * @returns The message observable.
     */
    public sendDriverInconsistencyNote(rideId: number): Observable<Message> {
        return this.send(-1, rideId, "The driver not following the expected route.", MessageType.RIDE);
    }

    public send(receiverId: number, rideId: number, message: string, type: MessageType): Observable<Message> {
        const payload: MessageSendPayload = {
            receiverId: receiverId,
            rideId: rideId,
            message: message,
            type: type
        }

        return this.httpClient.post<Message>(`${this.url}/${receiverId}/message`, payload, {
            observe: "body",
            responseType: "json",
        });
    }

}
