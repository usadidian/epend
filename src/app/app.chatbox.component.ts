import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import { UsersService } from "./Services/users.service";

@Component({
    selector: "app-chat-box",
    template: `
        <p-dialog
            [header]="data.name"
            [position]="'bottom'"
            [(visible)]="usersService.chatBoxActive"
            [style]="{
                width: '20vw',
                margin: '0'
            }"
            (onHide)="chatClosed()"
        >
            <div
                class="p-grid p-ai-center p-jc-center vertical-container p-mr-4 p-ml-4"
            >
                <p-progressSpinner
                    *ngIf="isLoading"
                    [style]="{
                        width: '40px',
                        height: '40px',
                        'overflow-y': 'hidden',
                        'overflow-x': 'hidden'
                    }"
                    styleClass="custom-spinner"
                    strokeWidth="8"
                    fill="#EEEEEE"
                    animationDuration=".5s"
                ></p-progressSpinner>
            </div>
            <div
                #scrollMe
                style="overflow-y: scroll; overflow-x: hidden; max-height: 140vh;
                padding-bottom: 550px;"
                class="imessage"
                *ngIf="!isLoading && usersService.chatMessageCurrent$ | async"
            >
                <div
                    *ngFor="
                        let group of usersService.chatMessageCurrentGroup$
                            | async
                    "
                >
                    <div class="p-mt-2 p-grid p-jc-center vertical-container">
                        <div class="dategroup">
                            <p class="dategroup_p">
                                {{ group.date }}
                            </p>
                        </div>
                    </div>
                    <div *ngFor="let chat of group.data">
                        <div class="p-grid p-ai-end vertical-container">
                            <div *ngIf="chat.isMine" class="p-col p-py-0">
                                <p class="from-me">
                                    <span class="material-icons check-info">
                                        {{ chat.readAt ? "done_all" : "done" }}
                                    </span>
                                    {{ chat.description }}
                                </p>
                            </div>
                            <div
                                *ngIf="chat.isMine"
                                class="p-col-fixed p-py-0"
                                style="width: 40px"
                            >
                                <span style="width: 50px; font-size:9px">
                                    {{ chat.createdAt | date: "HH:mm" }}
                                </span>
                                <ngx-avatar
                                    src="{{ chat.avatar }}"
                                    initialsSize="2"
                                    size="24"
                                    name="{{ chat.name }}"
                                >
                                </ngx-avatar>
                            </div>

                            <!-- from them -->
                            <div
                                *ngIf="!chat.isMine"
                                class="p-col-fixed p-py-0"
                                style="width: 40px"
                            >
                                <span style="width: 50px; font-size:9px">
                                    {{ chat.createdAt | date: "HH:mm" }}
                                </span>
                                <ngx-avatar
                                    src="{{ chat.avatar }}"
                                    initialsSize="2"
                                    size="24"
                                    name="{{ chat.name }}"
                                >
                                </ngx-avatar>
                            </div>
                            <div *ngIf="!chat.isMine" class="p-col p-py-0">
                                <p class="from-them">
                                    {{ chat.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ng-template pTemplate="footer" styleClass="chatbox">
                <div
                    class="p-fluid p-grid vertical-container p-ai-center p-jc-center p-px-2 p-pt-3"
                >
                    <div class="p-col-10 p-md-10 ">
                        <textarea
                            rows="1"
                            cols="30"
                            [autofocus]="true"
                            pInputTextarea
                            autoResize="autoResize"
                            (keydown.enter)="sendMessage()"
                            [(ngModel)]="message"
                        ></textarea>
                    </div>
                    <div class="p-col-2 p-md-2">
                        <p-button
                            (click)="sendMessage()"
                            icon="fa"
                            styleClass="p-button-text p-pl-2"
                            ><span class="material-icons">
                                send
                            </span></p-button
                        >
                    </div>
                </div>
            </ng-template>
        </p-dialog>
    `,
    styleUrls: ["./app.chatbox.component.scss"],
})
export class AppChatBoxComponent implements OnInit {
    // @Input() data: any;
    @ViewChild("scrollMe", null) private myScrollContainer: ElementRef;

    isLoading: boolean = true;
    message: string;
    data: any;
    constructor(
        public app: AppMainComponent,
        public usersService: UsersService,
    ) {
        this.data = this.usersService.chatMessageCurrentUser;
    }

    ngOnInit() {
        // console.log(this.data);

        if (this.data.email) {
            this.lodConversation();
        }
    }

    lodConversation() {
        this.usersService.fetchChatMessageCurrent(this.data.email).then((x) => {
            setTimeout(() => {
                this.scrollToBottom();
                this.isLoading = false;
            }, 100);
           
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop =
                this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {}
    }

    chatClosed() {
        this.usersService.toggleChatBox();
    }

    sendMessage() {
        this.usersService.postChatMessage(this.data, this.message).then((_) => {
            this.message = "";
            setTimeout(() => {
                this.scrollToBottom();
            }, 100);
        });
    }
}
