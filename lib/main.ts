
// @ts-ignore
import * as domutil from '@fizz/dom-utils';

/*
  During development, Vite automatically inserts the contents of this
  stylesheet into the main document. When the package is built, 
  it gets included in the `dist` directory, and can be imported by
  Vite-using client packages via `import '@fizz/package-name/stylesheet'`.
*/
import './main.css';

interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
}

interface MenuItem {
  name: string;
  desc: string;
  price: string;
}

/**
 * Given a container and the URL to a menu in an array of objects, 
 * creates a dropdown for each category of food, and a list of twisties of each dish.
 * @public
 */
export class MenuMaker {
  private menu?: MenuSection[];
  private detailsContainer?: HTMLDivElement;

  /**
   * @param containerId - ID of an element that content will be inserted into.
   * @param menuFileName - URL and filename of the menu JSON file.
   */
  constructor(containerId: string, menuFileName: string) {
    this.init(containerId, menuFileName);
  }

  /**
   * @param containerId - ID of an element that content will be inserted into.
   * @param menuFileName - URL and filename of the menu file with an array of objects. 
   */
  private async init(containerId: string, menuFileName: string) {
    // get/make container elements
    const containerEl = document.getElementById(containerId)!;
    this.detailsContainer = document.createElement('div');

    this.menu = await this.loadMenuByFilename(menuFileName);
    this.makeDropdown(containerEl);
    // append details container after dropdown
    containerEl.append(this.detailsContainer);
  }

  /**
   * Find and load menu based on file name.
   * @param menuFileName - URL and filename of the menu JSON file.
   * @returns The menu data. 
   */
  private async loadMenuByFilename(menuFileName: string): Promise<MenuSection[]> {
    const response = await fetch(menuFileName);
    const menu = await response.json();
    return menu;
  }

  /**
   * Populate a set of options for a dropdown (`select`) element.
   * @param containerEl - Element to hold the dropdown.
   */
  private makeDropdown(containerEl: HTMLElement) {
    domutil.populateDropdown(containerEl, this.menu, 'id', 'label',
      this.showMenuItems.bind(this), 'select-dish-type', 'Select dish type:', 'Select one');
  }

  /**
   * Create details element with optional event listener.
   * @param event - Change event from a `select` element.
   */
  private showMenuItems(event: Event) {
    const dishId = (event.target as HTMLSelectElement).value;
    const dish = this.menu!.find(obj => {
      return obj.id === dishId;
    });

    if (dish?.items) {
      // clean container for each dish type, but not for each item
      let isAppend = false;
      dish.items.forEach(item => {
        const id = item.name.replace(/\W+/g, '_').toLowerCase();
        // create 2 elements
        const summary = document.createElement('summary');
        const name = this.makeSummaryItem(item.name, 'name');
        const price = this.makeSummaryItem(item.price, 'price');
        domutil.insertContentIntoContainer(summary, [name, price]);
        domutil.createDetails(id, item.desc, summary, this.detailsContainer, isAppend);
        isAppend = true;
      });
    } else {
      // clean container for each dish type, but not for each item
      while (this.detailsContainer!.lastChild) {
        this.detailsContainer!.lastChild.remove();
      }
    }

  }

  /**
   * Create a span element, insert content into it, and add an optional classname.
   * @param content - String or element to insert into the `span` element.
   * @param classname - Name of the CSS class to add, if any.
   * @returns `span` element with the content and classname.
   */
  private makeSummaryItem(content: string | HTMLElement, classname: string): HTMLSpanElement {
    const span = domutil.createElementContent('span', content);
    span.classList.add(classname);
    return span;
  }
}
