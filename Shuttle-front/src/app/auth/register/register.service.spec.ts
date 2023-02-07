import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { PassengerDTO, RegisterService } from './register.service';

describe('RegisterService', () => {
    let service: RegisterService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(RegisterService);
        httpController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should successfully register', () => {
        const submitData: any = {
            name: "Bob",
            surname: "Jones",
            profilePicture: "fhejh3ri32==",
            telephoneNumber: "48903284",
            email: "bob@gmail.com",
            address: "street abc",
            password: "bob12433",
            confirmPassword: "bob12433",
        };
        const expectedResult: PassengerDTO = {
            id: 1,
            email: 'bob@gmail.com',
            name: 'Bob',
            surname: 'Jones',
            profilePicture: 'fhejh3ri32==',
            telephoneNumber: "48903284",
            address: "street abc",
        } as PassengerDTO;

        service.submit(submitData, {} as File).subscribe((res) => {
            expect(res).toEqual(expectedResult);
        });

        const req = httpController.expectOne({
            method: 'POST',
            url:  `${environment.serverOrigin}api/passenger`,
        });

        req.flush(expectedResult);
    });
});
