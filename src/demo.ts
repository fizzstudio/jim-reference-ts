
/*
  This file is the entry point for the page demonstrating the library code.
  It is referenced in a `script` tag in the body of index.html.
*/

import { MenuMaker } from '../lib/main';


window.addEventListener('load', () => {
  new MenuMaker('content_container', './data/menu.json');
});


