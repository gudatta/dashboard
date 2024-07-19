import { Dashboard } from "dattatable";
import { Components } from "gd-sprest-bs";
import * as jQuery from "jquery";
import { ItemDashboard } from "./dashboard";
import { DataSource, IListItem } from "./ds";
import { Forms } from "./forms";
import { InstallationModal } from "./install";
import Strings from "./strings";
import { Security } from "./security";

/**
 * Main Application
 */
export class App {
    private _dashboard: Dashboard = null;

    // Constructor
    constructor(el: HTMLElement) {
        // Render the dashboard
        this.render(el);
    }

    // Refreshes the dashboard
    private refresh() {
        // Refresh the table
        this._dashboard.refresh(DataSource.ListItems);
    }

    // Renders the dashboard
    private render(el: HTMLElement) {
        // Create the dashboard
        this._dashboard = new Dashboard({
            el,
            hideHeader: true,
            useModal: true,
            filters: {
                items: [{
                    header: "By Status",
                    items: DataSource.StatusFilters,
                    onFilter: (value: string) => {
                        // Filter the table
                        this._dashboard.filter(2, value);
                    }
                }]
            },
            navigation: {
                title: Strings.ProjectName,
                items: [
                    {
                        className: "btn-outline-light",
                        text: "Create Item",
                        isButton: true,
                        onClick: () => {
                            // Show the new form
                            Forms.New(() => {
                                // Refresh the dashboard
                                this.refresh();
                            });
                        }
                    }
                ],
                itemsEnd: Security.IsAdmin ? [
                    {
                        className: "btn-outline-light me-2",
                        text: "Settings",
                        isButton: true,
                        onClick: () => {
                            // Show the install dialog
                            InstallationModal.show(true);
                        }
                    }
                ] : null
            },
            footer: {
                itemsEnd: [
                    {
                        text: "v" + Strings.Version
                    }
                ]
            },
            table: {
                rows: DataSource.ListItems,
                dtProps: {
                    dom: 'rt<"row"<"col-sm-4"l><"col-sm-4"i><"col-sm-4"p>>',
                    columnDefs: [
                        {
                            "targets": 0,
                            "orderable": false,
                            "searchable": false
                        }
                    ],
                    createdRow: function (row, data, index) {
                        jQuery('td', row).addClass('align-middle');
                    },
                    drawCallback: function (settings) {
                        let api = new jQuery.fn.dataTable.Api(settings) as any;
                        jQuery(api.context[0].nTable).removeClass('no-footer');
                        jQuery(api.context[0].nTable).addClass('tbl-footer');
                        jQuery(api.context[0].nTable).addClass('table-striped');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_info').addClass('text-center');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_length').addClass('pt-2');
                        jQuery(api.context[0].nTableWrapper).find('.dataTables_paginate').addClass('pt-03');
                    },
                    headerCallback: function (thead, data, start, end, display) {
                        jQuery('th', thead).addClass('align-middle');
                    },
                    // Order by the 1st column by default; ascending
                    order: [[1, "asc"]]
                },
                columns: [
                    {
                        name: "Title",
                        title: "Title"
                    },
                    {
                        name: "",
                        title: "Owners",
                        onRenderCell: (el, column, item: IListItem) => {
                            let owners = [];

                            // Parse the users
                            let users = item.Owners?.results || [];
                            for (let i = 0; i < users.length; i++) {
                                // Append the name
                                owners.push(users[i].Title);
                            }

                            // Render the owners
                            el.innerHTML = owners.join(', ');
                        }
                    },
                    {
                        name: "Status",
                        title: "Status"
                    },
                    {
                        name: "",
                        title: "Actions",
                        onRenderCell: (el, column, item: IListItem) => {
                            // Render a tooltips
                            Components.TooltipGroup({
                                el,
                                tooltips: [
                                    {
                                        content: "Click to view the item data.",
                                        btnProps: {
                                            text: "View",
                                            type: Components.ButtonTypes.OutlinePrimary,
                                            onClick: () => {
                                                // Show the display form
                                                DataSource.List.viewForm({
                                                    itemId: item.Id,
                                                    useModal: false
                                                });
                                            }
                                        }
                                    },
                                    {
                                        content: "Click to edit the item data.",
                                        btnProps: {
                                            text: "Edit",
                                            type: Components.ButtonTypes.OutlinePrimary,
                                            onClick: () => {
                                                // Show the edit form
                                                Forms.Edit(item.Id, () => {
                                                    // Refresh the dashboard
                                                    this.refresh();
                                                });
                                            }
                                        }
                                    },
                                    {
                                        content: "Click to view the dashboard for this item.",
                                        btnProps: {
                                            text: "Details",
                                            type: Components.ButtonTypes.OutlinePrimary,
                                            onClick: () => {
                                                // Show the item dashboard
                                                new ItemDashboard(item, () => {
                                                    // Refresh the dashboard
                                                    this.refresh();
                                                });
                                            }
                                        }
                                    }
                                ]
                            });
                        }
                    }
                ]
            }
        });
    }
}