import { Documents, Modal } from "dattatable";
import { Components } from "gd-sprest-bs";
import { DataSource, IListItem } from "../ds";
import { Navigation } from "./nav";
import { StatusBar } from "./status";

/**
 * Item Dashboard
 */
export class ItemDashboard {
    private _item: IListItem = null;
    private _onUpdate: () => void = null;

    // Constructor
    constructor(item: IListItem, onUpdate: () => void) {
        // Set the properties
        this._item = item;
        this._onUpdate = onUpdate;

        // Reder the dashboard
        this.render();
    }

    // Renders the dashboard
    private render() {
        // Clear the modal and set the properties
        Modal.clear();
        Modal.setType(Components.ModalTypes.Full);

        // Set the header
        Modal.setHeader(this._item.Title);

        // Set the body
        Modal.BodyElement.innerHTML = `
            <div class="row row-cols-1 mb-2">
                <div id="status" class="col d-flex justify-content-center align-items-center"></div>
                <div id="nav" class="col mt-3"></div>
            </div>
            <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                <div id="form"></div>
                <div id="docs"></div>
                <div id="comments"></div>
            </div>
        `;

        // Set the footer
        Components.Tooltip({
            el: Modal.FooterElement,
            content: "Closes the dashboard and goes back to the main view.",
            btnProps: {
                text: "Close",
                type: Components.ButtonTypes.OutlinePrimary,
                onClick: () => {
                    // Close the modal
                    Modal.hide();
                }
            }
        });

        // Render the dashboard
        this.renderComments(Modal.BodyElement.querySelector("#comments"));
        this.renderDocuments(Modal.BodyElement.querySelector("#docs"));
        this.renderForm(Modal.BodyElement.querySelector("#form"));
        this.renderNavigation(Modal.BodyElement.querySelector("#nav"));
        this.renderStatus(Modal.BodyElement.querySelector("#status"));

        // Show the modal
        Modal.show();
    }

    // Renders the comments
    private renderComments(el: HTMLElement) {
        // Render an alert
        Components.Alert({
            el,
            header: "Comments",
            type: Components.AlertTypes.Primary
        });
    }

    // Renders the documents
    private renderDocuments(el: HTMLElement) {
        // Render the attachments
        new Documents({
            el,
            listName: DataSource.List.ListName,
            itemId: this._item.Id,
            enableSearch: false
        });
    }

    // Renders the form
    private renderForm(el: HTMLElement) {
        // Render an alert
        Components.Alert({
            el,
            header: "Information",
            type: Components.AlertTypes.Primary
        });

        // Render the view form
        DataSource.List.viewForm({
            elForm: el,
            itemId: this._item.Id
        });
    }

    // Renders the navigation
    private renderNavigation(el: HTMLElement) {
        // Render the navigation
        new Navigation(el, this._item, () => {
            // Refresh the item
            DataSource.refresh(this._item.Id).then((item: IListItem) => {
                // Update the item
                this._item = item;

                // Refresh the dashboard
                this.render();

                // Call the event
                this._onUpdate();
            });
        });
    }

    // Renders the status
    private renderStatus(el: HTMLElement) {
        // Render the status bar
        new StatusBar(el, this._item);
    }
}