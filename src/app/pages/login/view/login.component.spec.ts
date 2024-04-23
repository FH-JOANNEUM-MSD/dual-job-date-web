import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {By} from "@angular/platform-browser";
import {AppModule} from "../../../app.module";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [AppModule, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have input fields for email and password', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should login successfully', fakeAsync(() => {
    const email = 'admin@fh-joanneum.at';
    const password = 'Administrator!1';
    const loginButton = fixture.debugElement.query(By.css('button[type="submit"]'));

    // Fülle die E-Mail- und Passwortfelder aus
    component.loginForm.patchValue({email: email, password: password});
    fixture.detectChanges();

    // Klicke auf den Login-Button
    loginButton.nativeElement.click();
    fixture.detectChanges();
    tick();

    // Überprüfe, ob der API-Aufruf mit den erwarteten Parametern erfolgt ist
    const req = httpTestingController.expectOne('https://dual-dating-backend.msd-moss-test.fh-joanneum.at/User/Login');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({email, password});

    //expect(router.url).toEqual('/home');
  }));
});

