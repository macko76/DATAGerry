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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar.component';
import { SearchBarTagComponent } from './search-bar-tag/search-bar-tag.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBarTagIconComponent } from './search-bar-tag/search-bar-tag-icon.component';
import { SearchBarTagSettingsFormComponent } from './search-bar-tag-settings-form/search-bar-tag-settings-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [SearchBarComponent, SearchBarTagComponent, SearchBarTagIconComponent, SearchBarTagSettingsFormComponent],
  exports: [
    SearchBarComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        FontAwesomeModule
    ]
})
export class SearchBarModule { }
