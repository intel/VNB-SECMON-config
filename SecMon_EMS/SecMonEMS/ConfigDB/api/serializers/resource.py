#    Copyright (c) 2016 Intel Corporation.
#    All Rights Reserved.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

"""Resource class method calls consul method in response of
   diffrent calls from views and serializer files.
"""

import abc
import logging
from uuid import UUID
import pdb
from ConfigDB.api import storage
from ConfigDB.api.exceptions import IDUpdateNotPermitted
from ConfigDB.api.exceptions import ResourceNotFound, ResourceExist
from ConfigDB.api.utils import str_to_dict
import configfile
import inspect
# LOG = configfile.configlogging()
relation_list = ['sflowassociation', 'netflowassociation', 'rawforwardassociation', 'netflowconfig', 'netflowmonitor', 'sflowconfig', 'secmondetails']
association_relation_list = ['sflowassociation', 'netflowassociation', 'rawforwardassociation']
class Resource:
    __metaclass__ = abc.ABCMeta

    id = None
    relation_name = 'resource'
    resource_name = 'Resource'

    def __init__(self):
        pass

    def save(self):
        """Write the record in the storage backend"""
        if type(self.id) == UUID:
            self.id = str(self.id)
        try:
            storage.plugin.put_record(self.relation_name, self)
            return self
        except TypeError:
            configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + ' Error in storing data for '+ self.resource_name + ' with id ' + self.id)
            raise

    def update(self):
        """Write the updated resource to backend"""
        self.save()
        configfile.logging_obj.info(__file__ + ' ' + str(inspect.stack()[0][2]) + ' ' + self.resource_name + ' with id ' + self.id + ' updated')

    def delete(self):
        """Delete the record from the storage backend"""
        try:
            storage.plugin.delete_record(self.relation_name, self)
            configfile.logging_obj.info(__file__ + ' ' + str(inspect.stack()[0][2]) + ' ' + self.resource_name + ' with id ' + self.id + ' deleted')
        except TypeError:
            configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + ' Error in deleting data for ' + self.resource_name + ' with id ' + self.id)
            raise ResourceNotFound
        except RuntimeError: 
            raise

    @classmethod
    def get(cls, id_value):
        """Retrieve the record with pk as 'id_value' from storage backend

        Args:
            id_value (str): Primary Key

        Returns:
            None or a Resource

        Raises:
            ResourceNotFound: When no record exists
        """
        try:
            record = storage.plugin.get_record(cls.relation_name, id_value)
            if record is None:
                configfile.logging_obj.info(__file__ + ' ' + str(inspect.stack()[0][2]) + ' No ' + cls.resource_name + 'with id ' + id_value)
                raise ResourceNotFound
        except (TypeError):
            raise ResourceNotFound

        # Convert the record string to record instance
        return cls(**str_to_dict(record))

    @classmethod
    def get_all(cls):
        """Retrieve all the records from storage backend

        Returns:
            None or list of resources

        Raises:
            ResourceNotFound: When no resource exists
        """
        # Retrieve list of the records in str format
        records = storage.plugin.get_records(cls.relation_name)
        if records is None:
            raise ResourceNotFound

        # Transform the list of record string to list of record instance
        instance_list = [cls(**str_to_dict(record)) for record in
                         records]

        return instance_list

    @classmethod
    def get_all_records_by_secondary_index(cls, sk, id_value):
        """Retrieve records from storage backend based on secondary key value

        Args:
            cls (str): class object
            sk (str): secondary key
            id_value (str): secondary key value

        Returns:
            list of resources

        Raises:
            ResourceNotFound: When no resource exists
        """
        records = storage.plugin.get_records_by_secondary_index(
                                 cls.relation_name, sk, id_value)
        if records is None:
            configfile.logging_obj.info(__file__ + ' ' + str(inspect.stack()[0][2]) + ' No ' + cls.resource_name + 'with id ' + id_value)
            raise ResourceNotFound
        instance_list = [cls(**str_to_dict(record)) for record in
                         records]
        return instance_list

    @classmethod
    def serializer_create(cls, validated_data):
        """saves the record in storage backend

        Args:
            cls (str): class object
            validated_data (str): data to be saved
        Returns:
            resource
        """
        try:
            resource = cls(**validated_data)
            validated_data_id = validated_data.pop('id')
            records = storage.plugin.get_records(cls.relation_name)
            if records is not None:
                for record in records:
                    record_dict = str_to_dict(record)
                    record_dict.pop('id')
                    if (cmp(cls.relation_name, "notification") == 0):
                        pass
                    elif (cmp(validated_data, record_dict) == 0):
                        configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + 'similar record')
                        raise ResourceExist
                    elif (cls.relation_name not in relation_list and cmp(validated_data['name'], record_dict['name']) == 0):
                        configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + 'records have similar name')
                        raise ResourceExist
                    elif (cls.relation_name in association_relation_list and cmp(validated_data['scope_id'], record_dict['scope_id']) == 0 and cmp(validated_data['collector_id'], record_dict['collector_id']) == 0):
                        configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + 'record with same scope and collector already exist in association')
                        raise ResourceExist
            validated_data['id'] = validated_data_id
            resource.save()
            return resource
        except TypeError:
            raise

    @classmethod
    def serializer_update(cls, serializer, resource, validated_data):
        """Updates a record based on resource id

        Args:
            cls (str): class object
            serializer (str): serializer object
            resource (str): resource to be updated
            validated_data (str): data to be saved

        Returns:
            resource

        Raises:
            IDUpdateNotPermitted: When id provided is diffrent from existing id
        """
        if validated_data is None:
            raise TypeError
        id_returned = validated_data.pop('id', resource.id)
        # 'id' field update should not be permitted
        # Check if existing 'id' value equals 'pk'.If not, 'id' is being
        # updated
        if (resource.id != id_returned or
                resource.id != serializer.context['pk']):
            configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + ' "id" attribute is not updated for  with id ' + resource.id)
            raise IDUpdateNotPermitted
        records = storage.plugin.get_records(cls.relation_name)
        if records is not None:
            for record in records:
                record_dict = str_to_dict(record)
                if (cmp(id_returned, record_dict.pop('id')) == 0 or cmp(cls.relation_name, "notification") == 0):
                    pass
                elif (cmp(validated_data, record_dict) == 0):
                    configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + 'similar record exist')
                    raise ResourceExist
                elif (cls.relation_name not in relation_list and cmp(validated_data['name'], record_dict['name']) == 0):
                    configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + 'similar record name exist')
                    raise ResourceExist
                elif (cls.relation_name in association_relation_list and cmp(validated_data['scope_id'], record_dict['scope_id']) == 0 and cmp(validated_data['collector_id'], record_dict['collector_id']) == 0):
                    configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + 'record with same scope and collector already exist in association')
                    raise ResourceExist                    
        resource.id = id_returned
        for key in validated_data:
            value = validated_data.get(key, getattr(resource, key))
            setattr(resource, key, value)
        resource.update()
        return resource

    @classmethod
    def serializer_valid(cls, serializer, pk):
        """checks if a serializer is valid or not

        Args:
            cls (str): class object
            serializer (str): serializer object
            pk (str): primary key value

        Returns:
            (bool)
        """
        if serializer.is_valid():
            return True
        else:
            if pk is 'None':
                configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + ' Unable to create ' + cls.resource_name)
                return False
            else:
                configfile.logging_obj.error(__file__ + ' ' + str(inspect.stack()[0][2]) + ' Unable to update ' + cls.resource_name + 'with id ' + pk)
                return False
