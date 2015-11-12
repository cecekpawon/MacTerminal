on run argv
    if count of argv is 1 then
        set folderName to item 1 of argv
    end if

    if folderName is missing value then
        return
    end if

    set fileType to (do shell script "file -b " & folderName)

    tell application "iTerm"
        if not frontmost then
            activate
            delay (1)
        end if

        tell application "System Events"
            keystroke "t" using command down
        end tell

        tell current session of current terminal
            if fileType is "directory" then
                set write text "cd " & folderName & " && clear"
            else
                set write text to "clear && " & folderName
            end if
        end tell
    end tell
end run
