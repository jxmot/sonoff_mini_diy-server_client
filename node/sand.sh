#!/bin/sh
# NOTE: On the AS1002T NAS Busybox is used, so things
# are a little diffenent from regular bash.
# https://www.busybox.net/
#
# We will grep the output of the ps command and look
# for strings that match the node instance we want.
# In this case it is the one running server.js
line=$(ps -ef | grep "[0-9] node ./minidiy-server.js")
# here's the output from the command
echo "$line"
# Busybox - Breaks the string down into $1 $2 $3 etc
set -- $line
# like this...
#echo $1
#echo $2
#echo $3
#echo $4
#echo $5
#
# Does the same thing, but will iterate through to the end
#while [ -n "$1" ]; do
#    echo $1
#    shift
#done
#
# The real work of this script... Kill it!
kill -9 "$1"
# This will echo a blank line because we killed the process
echo "$(ps -ef | grep "[0-9] node ./minidiy-server.js")"
exit 0
