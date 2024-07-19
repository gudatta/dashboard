import { DataSource, IListItem } from "./ds";


/**
 * Forms
 */
export class Forms {
    // Edit Form
    static Edit(itemId: number, onUpdated: () => void) {
        // Show the edit form
        DataSource.List.editForm({
            itemId: itemId,
            useModal: false,
            onGetListInfo: info => {
                info.loadAttachments = true;
                return info;
            },
            onUpdate: () => {
                // Refresh the data source
                DataSource.refresh(itemId).then(() => {
                    // Call the event
                    onUpdated();
                });
            }
        });
    }

    // New Form
    static New(onCreated: () => void) {
        // Show the new form
        DataSource.List.newForm({
            useModal: false,
            onUpdate: (item: IListItem) => {
                // Refresh the data source
                DataSource.refresh(item.Id).then(() => {
                    // Call the event
                    onCreated();
                });
            }
        });
    }

    // View Form
    static View(itemId: number) {
        // Show the display form
        DataSource.List.viewForm({
            itemId: itemId,
            useModal: false
        });
    }
}