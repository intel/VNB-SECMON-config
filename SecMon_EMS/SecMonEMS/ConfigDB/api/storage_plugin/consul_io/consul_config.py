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

# Consul Connection options
""" Consul Connection options
"""
CONSUL_HOST = '127.0.0.1'
CONSUL_PORT = 8500
CONSUL_CONSISTENCY = 'consistent'

# Relations with Primary Index and list of Secondary Index(es)

# Each relation is represented by a python dictionary with keys as PRIMARY &
# SECONDARY AND DEPENDENCY.
#
# PRIMARY value is the name of primary index
# SECONDARY value is a python list which contain names of secondary index(es)
# DEPENDENCY value is a python list which contains names of dependent tables

RELATION_NETFLOWASSOCIATION = {
    'PRIMARY': 'id',
    'SECONDARY': ['scope_id', 'collector_id', 'policy_id'],
    'DEPENDENCY': [],
}

RELATION_RAWFORWARDASSOCIATION = {
    'PRIMARY': 'id',
    'SECONDARY': ['scope_id', 'collector_id', 'policy_id'],
    'DEPENDENCY': [],
}

RELATION_SFLOWASSOCIATION = {
    'PRIMARY': 'id',
    'SECONDARY': ['scope_id', 'collector_id', 'policy_id'],
    'DEPENDENCY': [],
}

RELATION_NETFLOWMONITOR = {
    'PRIMARY': 'id',
    'SECONDARY': ['scope_id'],
    'DEPENDENCY': [],
}

RELATION_NETFLOWCONFIG = {
    'PRIMARY': 'id',
    'SECONDARY': ['scope_id'],
    'DEPENDENCY': [],
}

RELATION_COLLECTOR = {
    'PRIMARY': 'id',
    'SECONDARY': ['col_type'],
    'DEPENDENCY': ['sflowassociation', 'netflowassociation',
                   'rawforwardassociation'],
}

RELATION_COLLECTORSET = {
    'PRIMARY': 'id',
    'SECONDARY': ['col_type'],
    'DEPENDENCY': [],
}

RELATION_POLICY = {
    'PRIMARY': 'id',
    'SECONDARY': ['ruleobject_id'],
    'DEPENDENCY': [],
}

RELATION_SFLOWCONFIG = {
    'PRIMARY': 'id',
    'SECONDARY': ['scope_id'],
    'DEPENDENCY': [],
}

RELATION_SECMONDETAILS = {
    'PRIMARY': 'id',
    'SECONDARY': ['scope_name'],
    'DEPENDENCY': [],
}

RELATION_SCOPE = {
    'PRIMARY': 'id',
    'SECONDARY': ['name'],
    'DEPENDENCY': [],
}

RELATION_CLASSIFICATIONOBJECT = {
    'PRIMARY': 'id',
    'SECONDARY': ['name'],
    'DEPENDENCY': [],
}

RELATION_RULEOBJECT = {
    'PRIMARY': 'id',
    'SECONDARY': ['classificationobject_id'],
    'DEPENDENCY': [],
}

RELATION_NOTIFICATION = {
    'PRIMARY': 'id',
    'SECONDARY': ['row_id'],
    'DEPENDENCY': [],
}

# TEST Relation
RELATION_TEST = {
    'PRIMARY': 'id',
    'SECONDARY': ['name', 'email'],
    'DEPENDENCY': ['test1'],
}

# TEST Relation
RELATION_TEST1 = {
    'PRIMARY': 'id',
    'SECONDARY': ['test_id'],
    'DEPENDENCY': [],
}
