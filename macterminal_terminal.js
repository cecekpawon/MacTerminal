/* global Application, delay */

function run(argv) {
    if (argv.length === 0 || !(file = argv[0])) {
        return;
    }

    var Terminal = Application('Terminal');
    var SystemEvents = Application('System Events');

    var frontmostTerminalWindow = Terminal.frontmost();

    if(!frontmostTerminalWindow) {
        Terminal.activate();
        delay(1);
    }

    SystemEvents.keystroke(
        "t",
        {using: "command down"}
    );

    var currentlyUsedWindow = Terminal.windows.whose({frontmost : {'=' : true}});
    var currrentTabs = currentlyUsedWindow[0].tabs.whose(
        {selected : {'=' : true}}
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

    Terminal.doScript(
        gotoDirectory,
        {
            in: currrentTabs[0]
        }
    );
}
