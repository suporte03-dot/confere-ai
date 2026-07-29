Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = "c:\Users\Suporte03\confere-ai"
shell.Run "cmd /c run-build.cmd", 0, True
