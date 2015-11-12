# -*- coding: utf-8 -*-
'''
Sublime text plugin that opens terminal.
'''

import os
import pipes
import sublime
import platform
import subprocess
import sublime_plugin
from pprint import pprint
from decimal import Decimal

class OpenMacTerminal(sublime_plugin.TextCommand):
    '''
    Class is opening new terminal window with the path of current file
    '''

    def __init__(self, *args, **kwargs):
        sublime_plugin.TextCommand.__init__(self, *args, **kwargs)

        self.settings = sublime.load_settings('MacTerminal.sublime-settings')
        self.paths = ''
        self.debug_info = {}

    #def is_visible(self, paths =[]):
    #    return self.settings.get('contextmenu_document', False)

    #def is_enabled(self, paths = []):
    #    return self.settings.get('contextmenu_document', False)

    def run(self, *dummy, **kwargs):
        '''
        This method is invoked by sublime
        '''

        selected_paths = kwargs.get('paths', '')
        mode = kwargs.get('mode', '')
        clipboard_mode = kwargs.get('clipboard_mode', '')

        # temporary hack for old configurations
        if not clipboard_mode and mode not in ('file', 'directory', 'project'):
            mode = 'file'

        self.paths = ''
        folders = []

        if selected_paths:
            file = selected_paths[0]
            if os.path.isdir(file) and mode == 'directory':
                mode = 'file'
        else:
            file = self.view.file_name()

        folders = self.view.window().folders()

        if mode == 'file':
            self.paths = file
        elif mode == 'directory' or clipboard_mode:
            self.paths = os.path.dirname(file)
        elif folders:
            for folder in folders:
                if folder in file:
                    self.paths = folder

        if not self.paths:
            #sublime.error_message(self.paths)
            return

        if clipboard_mode:
            clipboard_path = file

            if clipboard_mode == 'quote':
                clipboard_path = '"' + file + '"'
            elif clipboard_mode == 'backslash':
                clipboard_path = file.replace(' ', '\ ')

            sublime.set_clipboard(clipboard_path)

        self.open_terminal_command(self.paths)

        self.debug_info['paths'] = self.paths
        self.debug_info['mode'] = mode

        debug(self.debug_info, self.settings.get('debug', False))

    def open_terminal_command(self, path):
        '''
        Open terminal with javascript/applescript
        '''

        quoted_path = pipes.quote(path)
        command = []

        # get osascript from settings or just use default value
        command.append(self.settings.get('osascript', '/usr/bin/osascript'))

        if Decimal(".".join(platform.mac_ver()[0].split(".")[:2])) >= Decimal('10.10'):
            ext_language = 'js'
        else:
            ext_language = 'scpt'

        # set path and terminal
        applescript_path = '{packages_dir}/MacTerminal/macterminal_{terminal_name}.{ext}'.format(
            packages_dir=sublime.packages_path(),
            terminal_name=self.settings.get('terminal', 'terminal'),
            ext=ext_language
        )

        command.append(applescript_path)
        command.append(quoted_path)

        #open terminal
        proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, startupinfo=None)
        (out, err) = proc.communicate()

        self.debug_info['ext_language'] = ext_language
        self.debug_info['cmd'] = ' '.join(command)
        self.debug_info['process_out'] = out
        self.debug_info['process_err'] = err

def debug(debug_info, debug_mode):
    '''
    show some debug stuff when needed
    '''
    if not debug_mode:
        return False

    pprint("---MacTerminal DEBUG START---")
    pprint(debug_info)
    pprint("---MacTerminal DEBUG END---")
