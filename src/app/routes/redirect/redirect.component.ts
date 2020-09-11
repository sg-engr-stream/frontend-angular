import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(private routes: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.routes.params.subscribe(params => {console.log(params); });
  }

}
