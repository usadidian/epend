import { Component, OnInit } from '@angular/core';
import { ApiService } from './../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent implements OnInit {
  user: any = {};

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  login() {
    this.api.login(this.user.username, this.user.password).subscribe(res => {
      localStorage.setItem('userInfo', JSON.stringify(res));
      this.router.navigate(['/admin']);
    }, err => {
      alert('login gagal');
    });
  }

}
