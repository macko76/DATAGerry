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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../auth/auth.module';
import { DocapiRoutingModule } from './docapi-routing.module';
import { DocapiListComponent } from './docapi-list/docapi-list.component';
import { DocapiAddComponent } from './docapi-add/docapi-add.component';
import { DocapiBuilderContentStepComponent } from './docapi-builder/docapi-builder-content-step/docapi-builder-content-step.component';
import { DocapiBuilderComponent } from './docapi-builder/docapi-builder.component';
import { DocapiBuilderTypeStepObjectComponent } from './docapi-builder/docapi-builder-type-step/docapi-builder-type-step-object/docapi-builder-type-step-object.component';
import { DocapiBuilderTypeStepComponent } from './docapi-builder/docapi-builder-type-step/docapi-builder-type-step.component';
import { DocapiBuilderTypeStepObjectlistComponent } from './docapi-builder/docapi-builder-type-step-objectlist/docapi-builder-type-step-objectlist.component';
import { DocapiBuilderSettingsStepComponent } from './docapi-builder/docapi-builder-settings-step/docapi-builder-settings-step.component';
import { DocapiEditComponent } from './docapi-edit/docapi-edit.component';
import { DocapiBuilderTypeStepBaseComponent } from './docapi-builder/docapi-builder-type-step/docapi-builder-type-step-base/docapi-builder-type-step-base.component';
import { DocapiBuilderStyleStepComponent } from './docapi-builder/docapi-builder-style-step/docapi-builder-style-step.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
import { LayoutModule } from '../layout/layout.module';
import { TableModule } from '../layout/table/table.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    DocapiListComponent,
    DocapiBuilderComponent,
    DocapiAddComponent,
    DocapiBuilderSettingsStepComponent,
    DocapiBuilderContentStepComponent,
    DocapiEditComponent,
    DocapiBuilderTypeStepComponent,
    DocapiBuilderTypeStepObjectComponent,
    DocapiBuilderTypeStepObjectlistComponent,
    DocapiBuilderTypeStepBaseComponent,
    DocapiBuilderStyleStepComponent],
  imports: [
    CommonModule,
    AuthModule,
    DocapiRoutingModule,
    ReactiveFormsModule,
    EditorModule,
    NgSelectModule,
    ArchwizardModule,
    LayoutModule,
    TableModule,
    FontAwesomeModule
  ]
})
export class DocapiModule {
}
