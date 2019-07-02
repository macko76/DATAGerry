 /*
* dataGerry - OpenSource Enterprise CMDB
* Copyright (C) 2019 NETHINKS GmbH
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'cmdb-newest-view',
  templateUrl: './newest-view.component.html',
  styleUrls: ['./newest-view.component.scss']
})

export class NewestViewComponent implements OnInit {

  public newest: [];

  readonly url = 'object/newest/';

  constructor(private api: ApiCallService) { }

  ngOnInit() {
    this.callObjects();
  }

  private callObjects() {
    this.api.callGetRoute(this.url).subscribe( data => {
      this.newest = data as [];
    });
  }

  public delObject(id: number) {
    this.api.callDeleteRoute('object/' + id).subscribe(data => {
      this.callObjects();
    });
  }

}
