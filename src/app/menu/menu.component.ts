import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";

import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  menu: String;
  section: String;
  subsection: String;
  @ViewChild("sidenav") sideNav : MatSidenav;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  setMenu(e, buttonId) {
    if(buttonId === 'dashboard' || buttonId === 'users') {
      this.sideNav.close();
    } else {
      this.sideNav.open();
    }

    if(buttonId === 'dashboard') {
      this.router.navigate(["/dashboard"]);
    } else if(buttonId === 'users') {
      this.router.navigate(["/users"]);
    } else if(buttonId === 'v&v'){
      this.router.navigate(["/validation"]);
    } else if(buttonId === 'sp'){
      this.section = 'policies';
      this.router.navigate(["/servicePlatform"]);
    } else if(buttonId === 'bss') {
      this.section = 'availableNS';
      this.router.navigate(["/serviceManagement"]);
    }
    this.menu = buttonId;
  }

  setSection(e, buttonId) {
    if(buttonId === 'sla') {
      this.subsection = 'slaAgreements';
    } else if(buttonId === 'store') {
      this.subsection = 'serviceLicences';
    }
    this.section = buttonId;
  }

  setSubsection(e, buttonId) {
    this.subsection = buttonId;
  }
}
