import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Message, MessageService, MessageType} from "../../message/message.service";
import {AuthService} from "../../auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import * as SockJS from "sockjs-client";
import {environment} from "../../../environments/environment";
import * as Stomp from "stompjs";
import {VehicleLocationDTO} from "../admin.service";

@Component({
    selector: 'app-admin-chat',
    templateUrl: './admin-chat.component.html',
    styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent implements OnInit, AfterViewInit {
    allMessages: Map<number, Array<Message>> = new Map<number, Array<Message>>();
    currentChat: Array<Message> = new Array<Message>();
    fistMessages: Array<Message> = new Array<Message>();
    stompClient: Stomp.Client | undefined;
    isLoaded: boolean = false;

    protected myId = -1;

    currentChatMock: Array<Message> = new Array<Message>();

    noteForm = this.formBuilder.group({
        note: ["", [Validators.required]],
    }, []);

    constructor(private messageService: MessageService, private authService: AuthService, private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
//<<<<<<< Updated upstream
        let socket = new SockJS(environment.serverOrigin + "socket");
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, () => {
            this.isLoaded = true;
            this.openSocket();
        })

//=======
        this.myId = Number(this.authService.getId());


        this.currentChatMock = [
            {senderId: 1, receiverId: this.myId, message: "Hello", timeOfSending: "6/15/15, 9:03 AM"} as Message,
            {senderId: 1, receiverId: this.myId, message: "hi", timeOfSending: "6/15/15, 9:23 AM"} as Message,
            {senderId: this.myId, receiverId: 1, message: "yooooooo", timeOfSending: "6/15/15, 9:43 AM"} as Message,
            {senderId: 1, receiverId: this.myId, message: "uhhh", timeOfSending: "6/15/15, 9:44 AM"} as Message,
        ]
//>>>>>>> Stashed changes

        this.messageService.getMessages(this.authService.getUserId()).forEach(value => {
            // console.log(value);
            value.results.forEach(value1 => {
                // console.log(value1);
                let id = value1.senderId;
                if (id === this.authService.getUserId())
                    id = value1.receiverId;

                if (this.allMessages.get(id)) {
                    this.allMessages.get(id)!.push(value1);
                } else {
                    let arr = new Array<Message>();
                    arr.push(value1);
                    this.allMessages.set(id, arr);
                }
            })

        }).then(() => {
            this.allMessages.forEach(value => {
                this.fistMessages.push(value.sort(this.compareMessagesInverse)[0]);
            })
        });

    }


    handleMessage(message: { body: string }) {
        let receivedMessage: Message = JSON.parse(message.body);
        console.log(receivedMessage);
        let id = receivedMessage.senderId;

        if (id === this.authService.getUserId())
            id = receivedMessage.receiverId;

        if (this.allMessages.get(id)) {
            this.allMessages.get(id)!.push(receivedMessage);
        } else {
            let arr = new Array<Message>();
            arr.push(receivedMessage);
            this.allMessages.set(id, arr);
        }
        this.fistMessages = [];
        this.allMessages.forEach(value => {
            this.fistMessages.push(value.sort(this.compareMessagesInverse)[0]);
        })
    }

    openSocket() {
        if (this.isLoaded) {
            if (this.stompClient)
                this.stompClient.subscribe('/message/' + this.authService.getUserId(), (message: { body: string }) => {
                    this.handleMessage(message);
                });
        }
    }

    compareMessagesInverse(a: Message, b: Message): number {
        if (a.timeOfSending < b.timeOfSending) {
            return 1;
        }
        if (a.timeOfSending > b.timeOfSending) {
            return -1;
        }
        return 0;
    }
    compareMessages(a: Message, b: Message): number {
        if (a.timeOfSending > b.timeOfSending) {
            return 1;
        }
        if (a.timeOfSending < b.timeOfSending) {
            return -1;
        }
        return 0;
    }


    ngAfterViewInit() {
        let arr = this.fistMessages;
        this.fistMessages = [];
        this.fistMessages = arr;
        console.log(arr);
    }

    displayChat(i: number) {
        let message = this.fistMessages[i];
        let id = message.senderId;
        if (id === this.authService.getUserId())
            id = message.receiverId;
        if (this.allMessages.get(id))
            this.currentChat = this.allMessages.get(id)!.sort(this.compareMessages);
    }


    sendMessage() {
        if (this.noteForm.valid) {
            this.currentChatMock.push({message: this.noteForm.get("note")?.value, senderId: this.myId, receiverId: 1, timeOfSending: new Date().toISOString()} as Message);
            let id = this.currentChat[0].receiverId;
            if (id === this.authService.getUserId())
                id = this.currentChat[0].senderId;
            this.messageService.send(id, this.currentChat[0].rideId, this.noteForm.get("note")?.value, MessageType.SUPPORT).subscribe({
                next: (message) => {
                    this.currentChat.push(message)
                },
                error: (err) => {
                    console.log(err);
                },
            });
        }
    }
}
