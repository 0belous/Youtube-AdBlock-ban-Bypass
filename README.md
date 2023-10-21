# this repository is an in development version expect bugs
# for the full release get the script from your greasy fork

# Youtube AdBlocker ban bypasser V1.1

### Thank you to [Master Racer](https://greasyfork.org/en/users/1200679-master-racer) for fixing some bugs

## ✅ Not patched (19/10/23)

<hr>

## ✅ Fixes this

Block page shown inside the video player

![image](https://i.ibb.co/LnSTPyq/Screenshot2023-10-15232226.png)
<hr>

## ❌ Doesnt fix this

Block page shown in a pop up

To fix this use [Another script](https://greasyfork.org/en/scripts/477390-remove-youtube-adblock-warnings)

![image](https://i.ibb.co/J3vZJnV/tgiol3rpl7tb1.webp)
<hr>

### Details:

YouTube recently made some changes to their ad policies, if you have an ad blocker installed you will receive a popup telling you ad blockers are not allowed but you can initially close it, the next stage is you have to wait 5 seconds to close the anti-adblocker popup, then finally you will be told you have 3 videos left before your access is blocked, once this is over there are no pop ups to close and you access to youtube is blocked.

The bypass:<br>
by creating an iframe in place of the youtube video player that has its source set to the video as an embed you can bypass the restriction and watch the video as normal.

### Issues:

If your internet connection is slow this script may not work consistently for you as it directly relies on the youtube video player being loaded before the script (I have tried to find ways around this but the only solution is to wait 500ms) so you may have to manually change this in the source code, look for the comment // RUN DELAY and change 500 to 1000, etc until it works for you.

### Contribute:

If you would like to fix a bug, fork [this projects github](https://github.com/0belous/Youtube-AdBlock-ban-Bypass) then create a pull request with your changes. 

**All feedback should still go to the feedback tab on greasy fork**