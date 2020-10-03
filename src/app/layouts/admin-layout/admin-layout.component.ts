import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as $ from "jquery";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  constructor( private location:Location) { }

  ngOnInit(): void {
  }

  isMaps(path) {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (path == titlee) {
        return false;
    }
    else {
        return true;
    }
}

}
