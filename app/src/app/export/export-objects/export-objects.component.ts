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
import { CmdbType} from '../../framework/models/cmdb-type';
import { UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TypeService } from '../../framework/services/type.service';
import { FileSaverService } from 'ngx-filesaver';
import { FileService } from '../export.service';
import { SupportedExporterExtension } from './model/supported-exporter-extension';
import { CollectionParameters } from '../../services/models/api-parameter';

@Component({
  selector: 'cmdb-export-objects',
  templateUrl: './export-objects.component.html',
  styleUrls: ['./export-objects.component.scss']
})
export class ExportObjectsComponent implements OnInit {

  public typeList: CmdbType[];
  public formatList: SupportedExporterExtension[] = [];
  public formExport: UntypedFormGroup;
  public isSubmitted = false;

  constructor(private exportService: FileService, private datePipe: DatePipe, private typeService: TypeService,
              private fileSaverService: FileSaverService ) {
    this.formExport = new UntypedFormGroup({
      type: new UntypedFormControl( null, Validators.required),
      format: new UntypedFormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.typeService.getTypeList().subscribe(data => {
      this.typeList = data;
    });

    this.exportService.callFileFormatRoute().subscribe( data => {
      this.formatList = data;
    });
  }

  get type() {
    return this.formExport.get('type');
  }

  get format() {
    return this.formExport.get('format');
  }

  private resetForm() {
    this.formExport.reset();
    this.formExport.markAsPristine();
    this.formExport.markAsUntouched();
    this.formExport.markAsDirty();
  }

  public exportObjectByTypeID() {
    this.isSubmitted = true;
    if (!this.formExport.valid) {
      return false;
    }

    const typeID = this.formExport.get('type').value;
    const fileExtension: any = this.formExport.get('format').value;

    // Reset FormGroup
    this.resetForm();

    if (fileExtension != null && typeID != null) {
      const filter = {type_id: typeID};
      const optional = {classname: fileExtension, zip: false};
      const exportAPI: CollectionParameters = {filter, optional, order: 1, sort: 'public_id'};
      this.exportService.callExportRoute(exportAPI)
        .subscribe(res => this.downLoadFile(res, fileExtension));
    }
  }

  public downLoadFile(data: any, exportType: any) {
    const timestamp = this.datePipe.transform(new Date(), 'MM_dd_yyyy_hh_mm_ss');
    const extension = this.formatList.find(x => x.extension === exportType);
    this.fileSaverService.save(data.body, timestamp + '.' + extension.label);
  }

}
