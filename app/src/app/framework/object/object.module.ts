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

import { ObjectRoutingModule } from './object-routing.module';
import { ObjectViewComponent } from './object-view/object-view.component';
import { LayoutModule } from '../../layout/layout.module';
import { ObjectHeaderComponent } from './components/object-header/object-header.component';
import { ObjectQrComponent } from './components/object-qr/object-qr.component';
import { ObjectSummaryComponent } from './components/object-summary/object-summary.component';
import { ObjectExternalsComponent } from './components/object-externals/object-externals.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RenderModule } from '../render/render.module';
import { ObjectAddComponent } from './object-add/object-add.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ObjectFooterComponent } from './object-view/object-footer/object-footer.component';
import { ObjectActionsComponent } from './components/object-actions/object-actions.component';
import { ObjectViewMetaComponent } from './components/object-view-meta/object-view-meta.component';
import { ObjectEditComponent } from './object-edit/object-edit.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ObjectViewRenderComponent } from './components/object-view-render/object-view-render.component';
import { ObjectCopyComponent } from './object-copy/object-copy.component';
import { ObjectTypeLabelComponent } from './components/object-type-label/object-type-label.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ObjectLogListComponent } from './components/object-log-list/object-log-list.component';
import { ObjectLogComponent } from './object-log/object-log.component';
import { ObjectLogChangeViewComponent } from './components/object-log-list/object-log-change-view/object-log-change-view.component';
import { ObjectLogUserComponent } from './components/object-log-list/object-log-user/object-log-user.component';
import { ObjectLinkAddModalComponent } from './modals/object-link-add-modal/object-link-add-modal.component';
import { ObjectLinkDeleteModalComponent } from './modals/object-link-delete-modal/object-link-delete-modal.component';
import { AuthModule } from '../../auth/auth.module';
import { ObjectBulkChangeComponent } from './object-bulk-change/object-bulk-change.component';
import { ObjectBulkChangeEditorComponent } from './object-bulk-change/object-bulk-change-editor/object-bulk-change-editor.component';
import { ObjectBulkChangePreviewComponent } from './object-bulk-change/object-bulk-change-preview/object-bulk-change-preview.component';
import { ArchwizardModule } from 'angular-archwizard';
import { ObjectDocsComponent } from './components/object-docs/object-docs.component';
import { ObjectAttachmentsComponent } from './components/object-attachments/object-attachments.component';
import { UsersModule } from '../../management/users/users.module';
import { ObjectsByTypeComponent } from './objects-by-type/objects-by-type.component';
import { TableModule } from '../../layout/table/table.module';
import { ObjectTableActionsComponent } from './components/object-table-actions/object-table-actions.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ObjectDeleteModalComponent } from './modals/object-delete-modal/object-delete-modal.component';
import { ObjectsDeleteModalComponent } from './modals/objects-delete-modal/objects-delete-modal.component';
import { ObjectTableHeadComponent } from './components/object-table-head/object-table-head.component';
import { ObjectReferencesTableComponent } from './components/object-references/object-references-table/object-references-table.component';
import { ObjectLinksTableComponent } from './components/object-links-table/object-links-table.component';
// tslint:disable-next-line:max-line-length
import { ObjectLinksTablePartnerCellComponent } from './components/object-links-table/object-links-table-partner-cell/object-links-table-partner-cell.component';
// tslint:disable-next-line:max-line-length
import { ObjectLinksTableActionCellComponent } from './components/object-links-table/object-links-table-action-cell/object-links-table-action-cell.component';
import { ObjectReferencesComponent } from './components/object-references/object-references.component';
import { ObjectReferencesByTypeComponent } from './components/object-references/object-references-by-type/object-references-by-type.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ObjectComponent } from './object.component';
import { ObjectReferencesTypeColumnComponent } from './components/object-references/object-references-type-column/object-references-type-column.component';
import { ObjectBulkChangeFailedComponent } from './object-bulk-change/object-bulk-change-complete/object-bulk-change-failed/object-bulk-change-failed.component';
import { ObjectBulkChangeCompleteComponent } from './object-bulk-change/object-bulk-change-complete/object-bulk-change-complete.component';

@NgModule({
  declarations: [
    ObjectViewComponent,
    ObjectHeaderComponent,
    ObjectQrComponent,
    ObjectSummaryComponent,
    ObjectExternalsComponent,
    ObjectAddComponent,
    ObjectFooterComponent,
    ObjectActionsComponent,
    ObjectViewRenderComponent,
    ObjectViewMetaComponent,
    ObjectEditComponent,
    ObjectCopyComponent,
    ObjectTypeLabelComponent,
    ObjectLogListComponent,
    ObjectLogComponent,
    ObjectLogChangeViewComponent,
    ObjectLogUserComponent,
    ObjectLinkAddModalComponent,
    ObjectLinkDeleteModalComponent,
    ObjectBulkChangeComponent,
    ObjectBulkChangePreviewComponent,
    ObjectBulkChangeEditorComponent,
    ObjectBulkChangePreviewComponent,
    ObjectDocsComponent,
    ObjectAttachmentsComponent,
    ObjectsByTypeComponent,
    ObjectTableActionsComponent,
    ObjectDeleteModalComponent,
    ObjectsDeleteModalComponent,
    ObjectTableHeadComponent,
    ObjectLinksTableComponent,
    ObjectLinksTablePartnerCellComponent,
    ObjectLinksTableActionCellComponent,
    ObjectReferencesTableComponent,
    ObjectReferencesComponent,
    ObjectReferencesByTypeComponent,
    ObjectComponent,
    ObjectReferencesTypeColumnComponent,
    ObjectBulkChangeFailedComponent,
    ObjectBulkChangeCompleteComponent
  ],
  imports: [
    CommonModule,
    ObjectRoutingModule,
    AuthModule,
    LayoutModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbTooltipModule,
    FontAwesomeModule,
    ArchwizardModule,
    RenderModule,
    UsersModule,
    TableModule,
    JwPaginationModule
  ],
  exports: [
    ObjectViewRenderComponent,
    ObjectTableActionsComponent,
    ObjectLogChangeViewComponent,
    ObjectLogUserComponent
  ]
})
export class ObjectModule {
}
