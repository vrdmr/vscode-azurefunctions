/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WebSiteManagementModels } from 'azure-arm-website';
import * as vscode from 'vscode';
import * as appservice from 'vscode-azureappservice';
import { IActionContext } from 'vscode-azureextensionui';
import { ext } from '../../extensionVariables';
import { ProductionSlotTreeItem } from '../../tree/ProductionSlotTreeItem';
import { SlotTreeItemBase } from '../../tree/SlotTreeItemBase';
import { checkForRemoteDebugSupport } from './checkForRemoteDebugSupport';

export async function startRemoteDebug(context: IActionContext, node?: SlotTreeItemBase): Promise<void> {
    if (!node) {
        node = await ext.tree.showTreeItemPicker<SlotTreeItemBase>(ProductionSlotTreeItem.contextValue, context);
    }

    const siteClient: appservice.SiteClient = node.root.client;
    const siteConfig: WebSiteManagementModels.SiteConfig = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification }, async progress => {
        appservice.reportMessage('Fetching site configuration...', progress);
        return await siteClient.getSiteConfig();
    });

    checkForRemoteDebugSupport(siteConfig);

    await appservice.startRemoteDebug(siteClient, siteConfig);
}