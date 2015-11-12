/* global Application, delay */

function run(argv) {

    if (argv.length === 0 || !(file = argv[0])) {
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

    var cmd = []
    var app = Application.currentApplication()
        app.includeStandardAdditions = true

    var fileType = app.doShellScript("file -b " + file)

    if (fileType == 'directory') {
        cmd = [
            'cd ' + file,
            "clear"
        ]
    } else {
        cmd = [
            'clear',
            file
        ]
    }

    var gotoDirectory = cmd.join(' && ');
    var currentTerminalSession = Terminal.currentTerminal().currentSession();
    currentTerminalSession.write({text: gotoDirectory});
}
