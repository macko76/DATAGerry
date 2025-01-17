/*
* DATAGERRY - OpenSource Enterprise CMDB
* Copyright (C) 2023 becon GmbH
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
* along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocTemplate } from '../models/cmdb-doctemplate';
import { CmdbMode } from '../../framework/modes.enum';
import { DocapiService } from '../docapi.service';

@Component({
  selector: 'cmdb-docapi-settings-edit',
  templateUrl: './docapi-edit.component.html',
  styleUrls: ['./docapi-edit.component.scss']
})
export class DocapiEditComponent implements OnInit {

  public docId: number;
  public docInstance: DocTemplate;
  public mode: number = CmdbMode.Edit;

  constructor(private docapiService: DocapiService, private route: ActivatedRoute) {
    this.route.params.subscribe((id) => this.docId = id.publicId);
  }

  public ngOnInit(): void {
    this.docapiService.getDocTemplate(this.docId).subscribe((docInstance: DocTemplate) => this.docInstance = docInstance);
  }

}
