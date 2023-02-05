import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserRole} from "../../../passenger/passenger.service";
import {MatPaginator} from "@angular/material/paginator";
import {ListUserDTO} from "../../../user/user.service";
import {AdminService, ListNote, Note} from "../../admin.service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
    selector: 'app-admin-note',
    templateUrl: './admin-note.component.html',
    styleUrls: ['./admin-note.component.css']
})
export class AdminNoteComponent {
    noteForm = this.formBuilder.group({
        note: ["", [Validators.required]],
    }, []);

    protected noteDataSource: MatTableDataSource<Note> = new MatTableDataSource();
    protected noteDisplayColumns = ["id", "message", "date"];
    protected noteTotal: number = 123;
    protected page: number = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    @Input() public selectedUser: UserRole | undefined = undefined;

    constructor(private adminService: AdminService, private formBuilder: FormBuilder,) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedUser']) {
            this.setNotes()
        }

    }
    ngOnInit(): void {
        this.setNotes();
    }

    private setNotes() {
        if (this.selectedUser)
            this.adminService.getNotes(this.selectedUser.id).subscribe({
                next: res => {
                    this.onFetchNotes(res);
                    this.noteTotal = res.totalCount;
                    console.log(res);
                },
                error: err => console.error(err),
            })
    }

    private onFetchNotes(notes: ListNote): void {
        this.noteDataSource = new MatTableDataSource(notes.results);
        this.noteDataSource.paginator = this.paginator;
    }


    onNoteSubmit() {
        if (this.selectedUser) {
            if (this.noteForm.valid) {
                this.adminService.postNote(this.selectedUser.id, this.noteForm.get("note")?.value).subscribe(value => {
                    this.page = 0;
                    this.setNotes();
                })
            }
        }
    }
}
