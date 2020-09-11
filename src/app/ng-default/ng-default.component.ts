import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ng-default',
  templateUrl: './ng-default.component.html',
  styleUrls: ['./ng-default.component.scss']
})
export class NgDefaultComponent implements OnInit {

  title = 'frontend-app';
  constructor() { }

  ngOnInit(): void {
  }

}
