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
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


import {Component, Input, OnInit} from '@angular/core';
import { CmdbMode } from '../../framework/modes.enum';
import { CmdbType } from '../../framework/models/cmdb-type';
import { TypeService } from '../../framework/services/type.service';
import { ActivatedRoute } from '@angular/router';
import { ExportdJob } from '../../settings/models/exportd-job';
import { ExportdJobService } from '../exportd-job.service';

@Component({
  selector: 'cmdb-task-settings-edit',
  templateUrl: './exportd-job-settings-edit.component.html',
  styleUrls: ['./exportd-job-settings-edit.component.scss']
})
export class ExportdJobSettingsEditComponent implements OnInit {

  public taskID: number;
  public typeInstance: CmdbType;
  public taskInstance: ExportdJob;
  public mode: number = CmdbMode.Edit;

  constructor(private typeService: TypeService, private taskService: ExportdJobService, private route: ActivatedRoute) {
    this.route.params.subscribe((id) => this.taskID = id.publicID);
  }

  public ngOnInit(): void {
    this.taskService.getTask(this.taskID).subscribe((taskInstance: ExportdJob) => this.taskInstance = taskInstance);
  }

}
