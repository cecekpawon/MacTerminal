/* global Application, delay */

function run(argv) {

    if (argv.length === 0) {
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

    if (argv[1]) {
        cmd = [
            'clear',
            'exec "' + argv[0] + '"'
        ]
    } else {
        cmd = [
            'cd "' + argv[0] + '"',
            "clear"
        ]
    }

    var gotoDirectory = cmd.join(' && ');
    //var gotoDirectory = 'cd ' + argv[0];

    Terminal.doScript(
        gotoDirectory,
        {
            in: currrentTabs[0]
        }
    );
/*
    Terminal.doScript(
        'clear',
        {
            in: currrentTabs[0]
        }
    );
*/
}
