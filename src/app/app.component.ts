import { Component } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { User } from './shared/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'njp-project';
  whoAmISub?: Subscription;

  constructor(private modalService: NgbModal, private authService: AuthService, private router: Router) {};

  ngOnInit() {
    this.whoAmISub = this.authService.whoAmI().subscribe((res: {status: string, user?: User}) => {
      if (res.status == "NOT OK") {
        this.router.navigate(['login']);
      }
    });
  }

  ngOnDestroy() {
    this.whoAmISub?.unsubscribe();
  };

  public open(modal: any): void {
    this.modalService.open(modal);
  }
}
