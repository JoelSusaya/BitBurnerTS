export async function main(ns) {
    async function sidebarTest() {
        let drawerItemTempParent = document.createElement("div");
        drawerItemTempParent.innerHTML = `
        <div id="custom-1" class="MuiButtonBase-root jss21 MuiListItem-root MuiListItem-gutters MuiListItem-padding MuiListItem-button css-1kk0p5e" tabindex="0" role="button">
            <div class="MuiListItemIcon-root css-1f8bwsm">
                <svg class="MuiSvgIcon-root MuiSvgIcon-colorSecondary MuiSvgIcon-fontSizeMedium css-16w0lv1" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="LastPageIcon">
                    <path d="M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path>
                </svg>
            </div>
            <div class="MuiListItemText-root css-1tsvksn">
                <p class="MuiTypography-root MuiTypography-body1 css-11wufc6">Custom</p>
            </div>
            <span class="MuiTouchRipple-root css-w0pj6f"></span>
        </div>
        `;
        let drawerItem = drawerItemTempParent.firstElementChild;
        // Create a basic div tag to use instead of creating several
        const BLANK_ELEMENT = document.createElement("div");
        const BUTTONS = document.querySelectorAll(".MuiButtonBase-root");
        let customNode = document.getElementById("custom-1");
        if (customNode !== null) {
            customNode.remove();
        }
        let hacking = BLANK_ELEMENT;
        //ns.tprint(buttonBases.length);
        for (let button of BUTTONS) {
            let buttonHTML = button;
            if (buttonHTML.innerText == "Hacking") {
                hacking = buttonHTML;
            }
        }
        let hackingDrawer = hacking.nextElementSibling;
        //ns.tprint(hackingDrawer.innerHTML);
        let hackingListRoot = BLANK_ELEMENT;
        if (hackingDrawer !== null) {
            let listRoot = hackingDrawer.querySelector(".MuiList-root");
            if (listRoot != null) {
                hackingListRoot = listRoot;
            }
        }
        else {
            ns.tprint("Error: hackingDrawer not found (is null).");
            ns.exit();
        }
        //ns.tprint(hackingListRoot.innerHTML);
        //ns.tprint(drawerItem.innerHTML);
        if (drawerItem !== null) {
            hackingListRoot.appendChild(drawerItem);
            //ns.tprint("Custom drawer injected.");
        }
        else {
            ns.tprint("Error: drawerItem is null");
        }
    }
    await sidebarTest();
}
