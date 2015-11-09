/* global Application, delay */

function run(argv) {

    if (argv.length === 0) {
        return;
    }

    var Terminal = Application('iTerm');
    var SystemEvents = Application('System Events');

    if(! Terminal.frontmost()) {
        Terminal.activate();
        delay(1);
    }

    SystemEvents.keystroke(
        "t",
        {using: "command down"}
    );

    //var gotoDirectory = 'cd ' + argv.join(' ');

    var cmd = []

    if (argv[1]) {
        cmd = [
            'clear',
            'exec "' + argv[0] + '"'
        ]
    } else {
        cmd = [
            'cd "' + argv.join(' ') + '"',
            "clear"
        ]
    }

    //var gotoDirectory = 'cd ' + argv.join(' ');
    var gotoDirectory = cmd.join(' && ');
    var currentTerminalSession = Terminal.currentTerminal().currentSession();
    currentTerminalSession.write({text: gotoDirectory});
    //currentTerminalSession.write({text: 'clear'});
}
