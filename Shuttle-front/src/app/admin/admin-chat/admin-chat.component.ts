import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Message, MessageService, MessageType} from "../../message/message.service";
import {AuthService} from "../../auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'app-admin-chat',
    templateUrl: './admin-chat.component.html',
    styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent implements OnInit, AfterViewInit {
    allMessages: Map<number, Array<Message>> = new Map<number, Array<Message>>();
    currentChat: Array<Message> = new Array<Message>();
    fistMessages: Array<Message> = new Array<Message>();

    noteForm = this.formBuilder.group({
        note: ["", [Validators.required]],
    }, []);

    constructor(private messageService: MessageService, private authService: AuthService, private formBuilder:FormBuilder) {
    }

    ngOnInit(): void {

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
                this.fistMessages.push(value.sort(this.compareMessages)[0]);
            })
        });

    }

    compareMessages(a: Message, b: Message): number {
        if (a.timeOfSending < b.timeOfSending) {
            return 1;
        }
        if (a.timeOfSending > b.timeOfSending) {
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
            this.currentChat = this.allMessages.get(id)!;
    }


    sendMessage() {
        if (this.noteForm.valid) {
            let id = this.currentChat[0].receiverId;
            if (id === this.authService.getUserId())
                id = this.currentChat[0].senderId;
            this.messageService.send(id,this.currentChat[0].rideId,this.noteForm.get("note")?.value,MessageType.SUPPORT).subscribe({
                next: (message) => { this.currentChat.push(message) },
                error: (err) => { console.log(err); },
            });
        }
    }
}
