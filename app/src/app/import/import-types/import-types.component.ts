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

import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ImportService } from '../import.service';

@Component({
  selector: 'cmdb-import-types',
  templateUrl: './import-types.component.html',
  styleUrls: ['./import-types.component.scss']
})
export class ImportTypesComponent implements OnInit {

  public constructor(private importService: ImportService) {}

  public fileForm: UntypedFormGroup;
  public preview: any;
  public done: boolean = false;
  public errorHandling = [];

  ngOnInit() {
    this.fileForm = new UntypedFormGroup({
      format: new UntypedFormControl('json', Validators.required),
      name: new UntypedFormControl('', Validators.required),
      size: new UntypedFormControl('', Validators.required),
      file: new UntypedFormControl(null, Validators.required),
      action: new UntypedFormControl('create', Validators.required),
    });

    this.fileForm.valueChanges.subscribe(newValue => {
      this.fileForm.get('file').patchValue(newValue.file, { onlySelf: true });
    });
  }

  public importTypeFile() {
    const action = this.fileForm.get('action').value;
    const theJSON = JSON.stringify(this.fileForm.get('file').value);
    const formData = new FormData();
    formData.append('uploadFile', theJSON);

    if (action === 'update') {
      this.importService.postUpdateTypeParser(formData).subscribe(res => {
        if (Object.keys(res).length > 0) {
          this.errorHandling.push(res);
        }
        this.done = true;
      });
    } else {
      this.importService.postCreateTypeParser(formData).subscribe(res => {
        if (Object.keys(res).length > 0) {
          this.errorHandling.push(res);
        }
        this.done = true;
      });
    }
  }

}
