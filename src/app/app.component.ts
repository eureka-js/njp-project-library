import { Component } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { User } from './shared/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'njp-project';

  constructor(private modalService: NgbModal, private auth: AuthService, private router: Router) {};

  ngOnInit() {
    this.auth.whoAmI().subscribe((res: {status: string, user?: User}) => {
      if (res.status == "NOT OK") {
        this.router.navigate(['login']);
      }
    });
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }
}
