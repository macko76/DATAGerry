/*
* DATAGERRY - OpenSource Enterprise CMDB
* Copyright (C) 2019 - 2021 NETHINKS GmbH
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

import { Component, Input, OnInit } from '@angular/core';
import { ConfigEditBaseComponent } from '../config.edit';
import { ReplaySubject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cmdb-textarea-edit',
  templateUrl: './textarea-edit.component.html',
  styleUrls: ['./textarea-edit.component.scss']
})
export class TextareaEditComponent extends ConfigEditBaseComponent {

  /**
   * Component un-subscriber.
   * @protected
   */
  protected subscriber: ReplaySubject<void> = new ReplaySubject<void>();

  nameControl: FormControl;

  public constructor() {
    super();
  }



}
