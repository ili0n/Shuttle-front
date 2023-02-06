import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/auth/register/register.service';
import { ListUserDTO, UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-admin-history-user-table',
  templateUrl: './admin-history-user-table.component.html',
  styleUrls: ['./admin-history-user-table.component.css']
})
export class AdminHistoryUserTableComponent implements OnInit {
    protected userDataSource: MatTableDataSource<User> = new MatTableDataSource();
    protected userDisplayedColumns = ["id", "name", "role"];
    protected usersTotal: number = 123;
    @Output() protected selectedUserEvent: EventEmitter<User> = new EventEmitter();
    private selectedUser: User | null = null;
    protected page: number = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    protected onUserSelected(user: User): void {
        this.selectedUserEvent.emit(user);
        this.selectedUser = user;
    }

    protected isUserSelected(user: User): boolean {
        return this.selectedUser == user;
    }

    constructor(private userService: UserService) {

    }

    ngOnInit(): void {
        this.userService.get().subscribe({
            next: res => {
                this.onFetchUsers(res);
                this.usersTotal = res.totalCount;
            },
            error: err => console.error(err),
        })
    }

    private onFetchUsers(users: ListUserDTO): void {
        this.userDataSource = new MatTableDataSource(users.results);
        this.userDataSource.paginator = this.paginator;
    }
}
