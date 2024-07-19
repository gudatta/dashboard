import { LoadingDialog } from "dattatable";
import { Components } from "gd-sprest-bs";
import { DataSource, IListItem } from "../ds";

/**
 * Navigation
 */
export class Navigation {
    private _el: HTMLElement = null;
    private _item: IListItem = null;
    private _onUpdate: () => void = null;

    // Constructor
    constructor(el: HTMLElement, item: IListItem, onUpdate: () => void) {
        this._el = el;
        this._item = item;
        this._onUpdate = onUpdate;

        // Render the status bar
        this.render();
    }

    // Moves to the next step
    private moveToNextStep() {
        // Parse the filters
        for (let i = 0; i < DataSource.StatusFilters.length; i++) {
            let filter = DataSource.StatusFilters[i];

            // See if this is the current step
            if (filter.label == this._item.Status) {
                // Show a loading dialog
                LoadingDialog.setHeader("Updating Status");
                LoadingDialog.setBody("This will close after the status is updated...");
                LoadingDialog.show();

                // Update the status
                this._item.update({
                    Status: DataSource.StatusFilters[i + 1].label
                }).execute(() => {
                    // Call the event
                    this._onUpdate();

                    // Hide the loading dialog
                    LoadingDialog.hide();
                })
            }
        }
    }

    // Moves to the previous step
    private moveToPrevStep() {
        // Parse the filters
        for (let i = 0; i < DataSource.StatusFilters.length; i++) {
            let filter = DataSource.StatusFilters[i];

            // See if this is the current step
            if (filter.label == this._item.Status) {
                // Show a loading dialog
                LoadingDialog.setHeader("Updating Status");
                LoadingDialog.setBody("This will close after the status is updated...");
                LoadingDialog.show();

                // Update the status
                this._item.update({
                    Status: DataSource.StatusFilters[i - 1].label
                }).execute(() => {
                    // Call the event
                    this._onUpdate();

                    // Hide the loading dialog
                    LoadingDialog.hide();
                })
            }
        }
    }

    // Renders the navigation
    private render() {
        let items: Components.INavbarItem[] = [];
        let itemsEnd: Components.INavbarItem[] = [];

        // See if we are not at the start
        if (DataSource.StatusFilters[0].label != this._item.Status) {
            // Move to the previous step
            items.push({
                className: "btn-outline-light me-1",
                isButton: true,
                text: "Move to Previous Step",
                onClick: () => {
                    // Move to the previous step
                    this.moveToPrevStep();
                }
            });
        }

        // See if we haven't completed the steps
        if (DataSource.StatusFilters[DataSource.StatusFilters.length - 1].label != this._item.Status) {
            // Move to the next step
            items.push({
                className: "btn-outline-light",
                isButton: true,
                text: "Move to Next Step",
                onClick: () => {
                    // Move to the next step
                    this.moveToNextStep();
                }
            });

            // Add the edit button
            itemsEnd.push({
                className: "btn-outline-light",
                isButton: true,
                text: "Edit",
                onClick: () => {
                    // Show the edit form
                    DataSource.List.editForm({
                        itemId: this._item.Id,
                        useModal: false,
                        onUpdate: () => {
                            // Call the update event
                            this._onUpdate();
                        }
                    });
                }
            });
        }

        // Render the navigation
        Components.Navbar({
            el: this._el,
            type: Components.NavbarTypes.Primary,
            brand: "Item Dashboard",
            items,
            itemsEnd
        });
    }
}