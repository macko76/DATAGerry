# DATAGERRY - OpenSource Enterprise CMDB
# Copyright (C) 2019 - 2021 NETHINKS GmbH
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import logging

from datetime import datetime, timezone

from cmdb.event_management.event import Event
from cmdb.database.managers import DatabaseManagerMongo
from cmdb.framework.cmdb_base import CmdbManagerBase, ManagerGetError, ManagerInsertError, ManagerUpdateError, \
    ManagerDeleteError
from cmdb.framework.cmdb_errors import ObjectManagerGetError
from cmdb.exportd.exportd_job.exportd_job import ExportdJob
from cmdb.utils.error import CMDBError
from cmdb.user_management import UserModel

LOGGER = logging.getLogger(__name__)


class ExportdJobManagement(CmdbManagerBase):

    def __init__(self, database_manager: DatabaseManagerMongo, event_queue=None):
        self._event_queue = event_queue
        super().__init__(database_manager)

    def get_new_id(self, collection: str) -> int:
        return self.dbm.get_next_public_id(collection)

    def get_job(self, public_id: int) -> ExportdJob:
        try:
            result = self.dbm.find_one(collection=ExportdJob.COLLECTION, public_id=public_id)
        except (ExportdJobManagerGetError, Exception) as err:
            LOGGER.error(err)
            raise err
        return ExportdJob(**result)

    def get_all_jobs(self):
        job_list = []
        for founded_job in self.dbm.find_all(collection=ExportdJob.COLLECTION):
            try:
                job_list.append(ExportdJob(**founded_job))
            except CMDBError:
                continue
        return job_list

    def get_job_by_name(self, **requirements) -> ExportdJob:
        try:
            found_type_list = self._get_many(collection=ExportdJob.COLLECTION, limit=1, **requirements)
            if len(found_type_list) > 0:
                return ExportdJob(**found_type_list[0])
            else:
                raise ObjectManagerGetError(err='More than 1 type matches this requirement')
        except (CMDBError, Exception) as e:
            raise ObjectManagerGetError(err=e)

    def get_job_by_args(self, **requirements) -> ExportdJob:
        try:
            found_type_list = self._get_many(collection=ExportdJob.COLLECTION, limit=1, **requirements)
            if len(found_type_list) > 0:
                return ExportdJob(**found_type_list[0])
            else:
                raise ObjectManagerGetError(err='More than 1 type matches this requirement')
        except (CMDBError, Exception) as e:
            raise ObjectManagerGetError(err=e)

    def get_job_by_event_based(self, state):
        formatted_filter = {'scheduling.event.active': state}
        job_list = []
        for founded_job in self.dbm.find_all(collection=ExportdJob.COLLECTION, filter=formatted_filter):
            try:
                job_list.append(ExportdJob(**founded_job))
            except CMDBError:
                continue
        return job_list

    def insert_job(self, data: (ExportdJob, dict)) -> int:
        """
        Insert new ExportdJob Object
        Args:
            data: init data
        Returns:
            Public ID of the new ExportdJob in database
        """
        if isinstance(data, dict):
            try:
                new_object = ExportdJob(**data)
            except CMDBError as e:
                raise ExportdJobManagerInsertError(e)
        elif isinstance(data, ExportdJob):
            new_object = data
        try:
            ack = self.dbm.insert(
                collection=ExportdJob.COLLECTION,
                data=new_object.to_database()
            )
            if self._event_queue:
                state = new_object.scheduling["event"]["active"] and new_object.get_active()
                event = Event("cmdb.exportd.added", {"id": new_object.get_public_id(),
                                                     "active": state,
                                                     "user_id": new_object.get_author_id(),
                                                     "event": 'automatic'})
                self._event_queue.put(event)
        except CMDBError as e:
            raise ExportdJobManagerInsertError(e)
        return ack

    def update_job(self, data: (dict, ExportdJob), request_user: UserModel, event_start=True) -> str:
        """
        Update new ExportdJob Object
        Args:
            data: init data
            request_user: current user, to detect who triggered event
            event_start: Controls whether an event should be started
        Returns:
            Public ID of the ExportdJob in database
        """
        if isinstance(data, dict):
            update_object = ExportdJob(**data)
        elif isinstance(data, ExportdJob):
            update_object = data
        else:
            raise ExportdJobManagerUpdateError(f'Could not update job with ID: {data.get_public_id()}')
        update_object.last_execute_date = datetime.now(timezone.utc)
        ack = self._update(
            collection=ExportdJob.COLLECTION,
            public_id=update_object.get_public_id(),
            data=update_object.to_database()
        )
        if self._event_queue and event_start:
            state = update_object.scheduling["event"]["active"] and update_object.get_active()
            event = Event("cmdb.exportd.updated", {"id": update_object.get_public_id(),
                                                   "active": state,
                                                   "user_id": request_user.get_public_id(),
                                                   "event": 'automatic'})
            self._event_queue.put(event)
        return ack.acknowledged

    def delete_job(self, public_id: int, request_user: UserModel) -> bool:
        try:
            ack = self._delete(collection=ExportdJob.COLLECTION, public_id=public_id)
            if self._event_queue:
                event = Event("cmdb.exportd.deleted", {"id": public_id, "active": False,
                                                       "user_id": request_user.get_public_id(),
                                                       "event": 'automatic'})
                self._event_queue.put(event)
            return ack
        except Exception:
            raise ExportdJobManagerDeleteError(f'Could not delete job with ID: {public_id}')

    def run_job_manual(self, public_id: int, request_user: UserModel) -> bool:
        if self._event_queue:
            event = Event("cmdb.exportd.run_manual", {"id": public_id,
                                                      "user_id": request_user.get_public_id(),
                                                      "event": 'manual'})
            self._event_queue.put(event)
        return True


class ExportdJobManagerGetError(ManagerGetError):

    def __init__(self, err):
        super(ExportdJobManagerGetError, self).__init__(err)


class ExportdJobManagerInsertError(ManagerInsertError):

    def __init__(self, err):
        super(ExportdJobManagerInsertError, self).__init__(err)


class ExportdJobManagerUpdateError(ManagerUpdateError):

    def __init__(self, err):
        super(ExportdJobManagerUpdateError, self).__init__(err)


class ExportdJobManagerDeleteError(ManagerDeleteError):

    def __init__(self, err):
        super(ExportdJobManagerDeleteError, self).__init__(err)
