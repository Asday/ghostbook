v1
* More config
  * CAPTCHA
  * Pagination
  * Nicer date display
  * Comment box placeholder text (mention markdown)
  * Loading spinner colours
* Disable comment box while submitting
* Remove comment box when submitted
* Fail submitting comments
  * Show user error on length exceedment
  * Bring comment back to box
* Disallow blank comments
* Styling pass
* Fix optimistic update to include real ID instead of guessing it - in progress
* Render something when there aren't any comments
* Only load when scrolled into view?
* Oh you know what there's a race condition - two comments being written at once
  * Make a global json overlord goroutine
* Deal with no connection (or no server running)
* Whoa hey why aren't comments their own component?

v2
* Consider multi-site

Will need to re-look into how CAPTCHA works, perhaps CAPTCHA per site would be best path.
