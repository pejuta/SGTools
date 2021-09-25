for %%x in (%*) do (
echo "%%x"
call node "%~p0toBookmarklet.js" "%%x"
)
pause
