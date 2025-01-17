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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CmdbType, CmdbTypeSection } from '../../models/cmdb-type';
import { TypeService } from '../../services/type.service';
import { UserService } from '../../../management/services/user.service';
import { CmdbMode } from '../../modes.enum';
import { Router } from '@angular/router';
import { ToastService } from '../../../layout/toast/toast.service';
import { Group } from '../../../management/models/group';
import { ReplaySubject } from 'rxjs';
import { User } from '../../../management/models/user';
import { GroupService } from '../../../management/services/group.service';
import { CollectionParameters } from '../../../services/models/api-parameter';
import { takeUntil } from 'rxjs/operators';
import { APIGetMultiResponse } from '../../../services/models/api-response';
import { AccessControlList } from '../../../acl/acl.types';
import { SidebarService } from '../../../layout/services/sidebar.service';

@Component({
  selector: 'cmdb-type-builder',
  templateUrl: './type-builder.component.html',
  styleUrls: ['./type-builder.component.scss']
})
export class TypeBuilderComponent implements OnInit, OnDestroy {

  /**
   * Component un-subscriber emitter.
   * @private
   */
  private subscriber: ReplaySubject<void> = new ReplaySubject<void>();

  /**
   * Possible render modes.
   */
  public modes = CmdbMode;

  /**
   * Selected render mode.
   */
  @Input() public mode: CmdbMode = CmdbMode.Create;

  /**
   * Type instance
   */
  @Input() public typeInstance: CmdbType;

  /**
   * Index of start step
   */
  @Input() public stepIndex: number = 0;

  /**
   * List of possible groups.
   */
  public groups: Array<Group> = [];

  /**
   * List of possible users.
   */
  public users: Array<User> = [];

  /**
   * List of possible types.
   */
  public types: Array<CmdbType> = [];

  /**
   * Basic step valid
   */
  public basicValid: boolean = true;

  /**
   * Content step valid
   */
  public contentValid: boolean = true;

  /**
   * Meta step valid
   */
  public metaValid: boolean = true;

  /**
   * ACL step valid
   */
  public accessValid: boolean = true;

  public constructor(private router: Router, private typeService: TypeService, private toast: ToastService,
                     private userService: UserService, private groupService: GroupService,
                     private sidebarService: SidebarService) {
  }

  /**
   * Component lifecycle start
   */
  public ngOnInit(): void {
    if (this.mode === CmdbMode.Create) {
      this.typeInstance = new CmdbType();
      this.typeInstance.active = true;
      this.typeInstance.version = '1.0.0';
      this.typeInstance.author_id = this.userService.getCurrentUser().public_id;
      this.typeInstance.render_meta = {
        icon: undefined,
        sections: [],
        externals: [],
        summary: {
          fields: undefined
        }
      };
      this.typeInstance.acl = new AccessControlList(false);
    }
    const groupsCallParameters: CollectionParameters = {
      filter: undefined,
      limit: 0,
      sort: 'public_id',
      order: 1,
      page: 1
    };
    this.groupService.getGroups(groupsCallParameters).pipe(takeUntil(this.subscriber))
      .subscribe((response: APIGetMultiResponse) => {
        this.groups = [...response.results as Array<Group>];
      }, () => {}
      , () => {
          this.checkAclGroupExist();
        });

    const typesCallParameters: CollectionParameters = {
      filter: undefined,
      limit: 0,
      sort: 'public_id',
      order: 1,
      page: 1,
      projection: { public_id: 1, name: 1, label: 1, render_meta: 1 }
    };
    this.typeService.getTypes(typesCallParameters).pipe(takeUntil(this.subscriber))
      .subscribe((response: APIGetMultiResponse) => {
        this.types = response.results as Array<CmdbType>;
      });
  }

  /**
   * Check ACL group assignment.
   * Check if assigned groups still exist. Error message if group cannot be found.
   * @private
   */
  private checkAclGroupExist(): void {
    if (this.typeInstance.acl && this.typeInstance.acl.groups && this.typeInstance.acl.groups.includes && this.groups) {
      Object.keys(this.typeInstance.acl.groups.includes).forEach((key) => {
        const found = this.groups.find(g => g.public_id === Number(key));
        if (!found) {
          this.toast.error(`The group for the ACL setting does not exist: GroupID: ${ key }`);
        }
      });
    }
  }

  /**
   * Component lifecycle destroyer.
   * Auto unsubscribes the http calls and subscriptions.
   */
  public ngOnDestroy(): void {
    this.subscriber.next();
    this.subscriber.complete();
  }

  public saveType() {
    const saveTypeInstance: CmdbType = Object.assign({}, this.typeInstance) as CmdbType;

    const sections: Array<CmdbTypeSection> = [];
    for (const section of saveTypeInstance.render_meta.sections) {
      const fields = [];
      for (const field of section.fields) {
        if (typeof field === 'object' && field !== null) {
          fields.push(field.name);
        } else {
          fields.push(field);
        }
      }
      section.fields = fields;
      sections.push(section);
    }
    saveTypeInstance.render_meta.sections = sections;

    if (this.mode === CmdbMode.Create) {
      let newTypeID = null;
      saveTypeInstance.editor_id = undefined;
      this.typeService.postType(saveTypeInstance).subscribe((typeIDResp: CmdbType) => {
          newTypeID = +typeIDResp.public_id;
          this.router.navigate(['/framework/type/'], { queryParams: { typeAddSuccess: newTypeID } });
          this.toast.success(`Type was successfully created: TypeID: ${ newTypeID }`);
        },
        (error) => {
          this.toast.error(`${ error }`);
        });
    } else if (this.mode === CmdbMode.Edit) {
      saveTypeInstance.editor_id = this.userService.getCurrentUser().public_id;
      this.typeService.putType(saveTypeInstance).subscribe((updateResp: CmdbType) => {
          this.toast.success(`Type was successfully edited: TypeID: ${ updateResp.public_id }`);
          this.router.navigate(['/framework/type/'], { queryParams: { typeEditSuccess: updateResp.public_id } });
        },
        (error) => {
          this.toast.error(`${ error }`);
        });
    }
    this.sidebarService.loadCategoryTree();
  }


}
