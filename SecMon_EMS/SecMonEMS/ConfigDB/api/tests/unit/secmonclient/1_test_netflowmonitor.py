from unittest import TestCase
import argparse
#import pdb
#sys.path.append(os.path.abspath('..'))
from secmonclient.v1_0.vpn import netflowmonitor

class TestNetflowmonitor(TestCase):
    def setUp(self):
#        pdb.set_trace()
        self.commands = {
            'netflowmonitor-create':
                netflowmonitor.CreateNetFlowMonitor,
            'netflowmonitor-list':
                netflowmonitor.ListNetFlowMonitor,
            'netflowmonitor-show':
                netflowmonitor.ShowNetFlowMonitor,
            'netflowmonitor-update':
                netflowmonitor.UpdateNetFlowMonitor,
            'netflowmonitor-delete':
                netflowmonitor.DeleteNetFlowMonitor
                   }
    
    def tearDown(self):
        pass

    def test_add_Argument_with_valid_parser(self):
        """test case to test add_argument with valid data
        """
#        pdb.set_trace()
        self.subcommand_class = self.commands.get('netflowmonitor-create')
        parser = argparse.ArgumentParser(description='parser for netflowmonitor arguments')
        parser = self.subcommand_class().add_known_arguments(parser)
#        args = parser.parse_known_args()
        arg1 = parser.parse_args()
        self.assertEqual(arg1.match_fields,None)
        self.assertEqual(arg1.scope_id,None)
        self.assertEqual(arg1.collect_fields,None)

    def test_add_argument_show(self):
        """test case to test add_argument in show with valid data
        """
        self.subcommand_class = self.commands.get('netflowmonitor-show')
        parser =  argparse.ArgumentParser(description='parser for arguments')
        parser = self.subcommand_class().add_known_arguments(parser)
        args = parser.parse_known_args()
        arg1 = parser.parse_args()
        self.assertEqual(arg1.id, None)

    def test_add_argument_list(self):
        """test case to test add_argument in list with valid data
        """
        self.subcommand_class = self.commands.get('netflowmonitor-list')
        parser =  argparse.ArgumentParser(description='parser for arguments')
        parser = self.subcommand_class().add_known_arguments(parser)
        args = parser.parse_known_args()
        arg1 = parser.parse_args()
        self.assertEqual(arg1.show_details,None)
        self.assertEqual(arg1.fields,None)
        self.assertEqual(arg1.sort_key,None)
        self.assertEqual(arg1.sort_direction,None)
#       self.assertEqual(arg1.format,None)

    def test_add_argument_delete(self):
        """test case to test add_argument in delete with valid data
        """
        self.subcommand_class = self.commands.get('netflowmonitor-delete')
        parser =  argparse.ArgumentParser(description='parser for arguments')
        parser = self.subcommand_class().add_known_arguments(parser)
        args = parser.parse_known_args()
        arg1 = parser.parse_args()
        self.assertEqual(arg1.id, None)

    def test_add_Argument_with_valid_parser_update(self):
        """test case to test add_argument with valid data
        """
#        pdb.set_trace()
        self.subcommand_class = self.commands.get('netflowmonitor-update')
        parser = argparse.ArgumentParser(description='parser for netflowmonitor arguments')
        parser = self.subcommand_class().add_known_arguments(parser)
#        args = parser.parse_known_args()
        arg1 = parser.parse_args()
        self.assertEqual(arg1.id,None)
        self.assertEqual(arg1.match_fields,None)
        self.assertEqual(arg1.scope_id,None)
        self.assertEqual(arg1.collect_fields,None)


