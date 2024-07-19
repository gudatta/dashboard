import { Helper, SPTypes } from "gd-sprest-bs";
import Strings from "./strings";

/**
 * SharePoint Assets
 */
export const Configuration = Helper.SPConfig({
    ListCfg: [
        {
            ListInformation: {
                Title: Strings.Lists.Main,
                BaseTemplate: SPTypes.ListTemplateType.GenericList
            },
            ContentTypes: [{
                Name: "Item",
                FieldRefs: [
                    "Title",
                    "Status",
                    "Owners"
                ]
            }],
            CustomFields: [
                {
                    name: "Owners",
                    title: "Owners",
                    type: Helper.SPCfgFieldType.User,
                    multi: true,
                    selectionMode: SPTypes.FieldUserSelectionType.PeopleOnly
                } as Helper.IFieldInfoUser,
                {
                    name: "Status",
                    title: "Status",
                    type: Helper.SPCfgFieldType.Choice,
                    defaultValue: "Draft",
                    required: true,
                    showInNewForm: false,
                    choices: [
                        "Draft", "Submitted", "Rejected", "Pending Approval",
                        "Approved", "Archived"
                    ]
                } as Helper.IFieldInfoChoice
            ],
            ViewInformation: [
                {
                    ViewName: "All Items",
                    ViewFields: [
                        "LinkTitle", "Owners", "Status"
                    ]
                }
            ]
        }
    ]
});