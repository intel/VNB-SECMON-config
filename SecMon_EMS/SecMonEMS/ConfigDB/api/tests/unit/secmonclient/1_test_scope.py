from unittest import TestCase
import argparse
import pdb
# sys.path.append(os.path.abspath('..'))
from secmonclient.v1_0.vpn import scope


class TestScope(TestCase):
  def setUp(self):
#      pdb.set_trace()
      self.commands = {
         'scope-create':
              scope.CreateScope,
         'scope-show':
              scope.ShowScope,
         'scope-list':
              scope.ListScope,
         'scope-update':
              scope.UpdateScope,
         'scope-delete':
              scope.DeleteScope
               }

      self.invalid_data = {'name': 'scope1',
                   'sflowstatus': 'enable',
                   'netflowstatus': 'disconnect',          # invalid netflowstatus
                   'rawforwardstatus': 'disable'}

      self.valid_data = {'name': 'scope1',
                   'sflowstatus': 'enable',
                   'netflowstatus': 'disable',          # valid netflowstatus
                   'rawforwardstatus': 'disable'}


  def tearDown(self):
     pass

  def test_verify_scope_create_with_invalid_data(self):
    """test case to verify scope create with invalid data
    """
    self.subcommand_class=self.commands.get('scope-create')
    with self.assertRaises(argparse.ArgumentTypeError):
        self.subcommand_class().verify_arguments(self.invalid_data)

  def test_verify_scope_update_with_invalid_data(self):
    """test case to verify scope update with invalid data
    """
    self.subcommand_class=self.commands.get('scope-update')
    with self.assertRaises(argparse.ArgumentTypeError):
        self.subcommand_class().verify_arguments(self.invalid_data)

  def test_verify_scope_create_with_valid_data(self):
    """test case to verify scope update with valid data
    """
    self.subcommand_class=self.commands.get('scope-create')
    result=self.subcommand_class().verify_arguments(self.valid_data)
    self.assertEqual(None, result)

  def test_verify_scope_update_with_valid_data(self):
    """test case to verify scope update with valid data
    """
    self.subcommand_class=self.commands.get('scope-update')
    result= self.subcommand_class().verify_arguments(self.valid_data)
    self.assertEqual(None, result)

  def test_add_Argument_with_valid_parser(self):
    """test case to test add_argument with valid data
    """
#        pdb.set_trace()
    self.subcommand_class = self.commands.get('scope-create')
    parser = argparse.ArgumentParser(description='parser for scope arguments')
    parser = self.subcommand_class().add_known_arguments(parser)
    args = parser.parse_known_args()
    arg1 = parser.parse_args()
    self.assertEqual(arg1.name,'test')
    self.assertEqual(arg1.sflowstatus,None)
    self.assertEqual(arg1.netflowstatus,None)
    self.assertEqual(arg1.rawforwardstatus,None)
'''
  def test_add_argument_show(self):
        """test case to test add_argument in show with valid data
        """
        self.subcommand_class = self.commands.get('scope-show')
        parser =  argparse.ArgumentParser(description='parser for arguments')
        parser = self.subcommand_class().add_known_arguments(parser)
        args = parser.parse_known_args()
        arg1 = parser.parse_args()
        self.assertEqual(arg1.id, None)

  def test_add_argument_list(self):
        """test case to test add_argument in list with valid data
        """
        self.subcommand_class = self.commands.get('scope-list')
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
        self.subcommand_class = self.commands.get('scope-delete')
        parser =  argparse.ArgumentParser(description='parser for arguments')
        parser = self.subcommand_class().add_known_arguments(parser)
        args = parser.parse_known_args()
        arg1 = parser.parse_args()
        self.assertEqual(arg1.id, None)

  def test_add_Argument_with_valid_parser_update(self):
    """test case to test add_argument with valid data
    """
#        pdb.set_trace()
    self.subcommand_class = self.commands.get('scope-create')
    parser = argparse.ArgumentParser(description='parser for scope arguments')
    parser = self.subcommand_class().add_known_arguments(parser)
    args = parser.parse_known_args()
    arg1 = parser.parse_args()
    self.assertEqual(arg1.name,'test')
    self.assertEqual(arg1.id,None)
    self.assertEqual(arg1.sflowstatus,None)
    self.assertEqual(arg1.netflowstatus,None)
    self.assertEqual(arg1.rawforwardstatus,None)
'''
