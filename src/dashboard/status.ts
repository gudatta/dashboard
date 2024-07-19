import { Components } from "gd-sprest-bs";
import { DataSource, IListItem } from "../ds";

/**
 * Status Bar
 */
export class StatusBar {
    private _el: HTMLElement = null;
    private _item: IListItem = null;

    // Constructor
    constructor(el: HTMLElement, item: IListItem) {
        this._el = el;
        this._item = item;

        // Render the status bar
        this.render();
    }

    // Renders the status bar
    private render() {
        let currentStatus = this._item.Status;

        // Parse the status filters
        for (let i = 0; i < DataSource.StatusFilters.length; i++) {
            let filter = DataSource.StatusFilters[i];

            // See if this is not the first item
            if (i > 0) {
                // Render a line
                let line = document.createElement("div");
                line.classList.add("line");
                this._el.appendChild(line);
            }

            // Render the badge
            Components.Badge({
                el: this._el,
                isPill: true,
                content: filter.label,
                type: currentStatus == filter.label ? Components.BadgeTypes.Primary : Components.BadgeTypes.Secondary
            });
        }
    }
}