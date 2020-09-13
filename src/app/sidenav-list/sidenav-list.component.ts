import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from '../services/common/common.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() public sidenavClose = new EventEmitter();
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
  constructor(public common: CommonService) { }

  ngOnInit(): void {
  }

}
