import { Component, OnInit } from '@angular/core';

import { AuthService } from '../core/services/auth.service';

interface INavbarLink {
  title: string;
  routerLink: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private _logged: INavbarLink[] = [
    {
      title: 'Pronostiques',
      routerLink: 'bets',
    },
    {
      title: 'Classement',
      routerLink: 'ranking',
    },
    {
      title: 'Bonus',
      routerLink: 'bonus',
    },
  ];

  public links!: INavbarLink[];

  constructor(private readonly _authService: AuthService) {}

  public ngOnInit() {
    if (this._authService.isAuthenticated()) {
      this.links = this._logged;
    } else {
      this.links = [];
    }
  }
}
