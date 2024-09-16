document.addEventListener("DOMContentLoaded", () => {

    const openSideBarNavigation = () => {
        const sidebarBVariant = document.querySelector(".tlh-044.SidebarMenu.Drawer");
        const headerIconBVariant = document.querySelector(".Header__Icon");
        const drawerCloseBVariant = document.querySelector(".tlh-044 .Drawer__Close");

        headerIconBVariant.addEventListener("click", () => {
            sidebarBVariant.ariaHidden = false;
        });

        drawerCloseBVariant.addEventListener("click", () => {
            sidebarBVariant.ariaHidden = true;
        })
    }
    
    window.activateAbTlh044 = () => {
        openSideBarNavigation();
    };
    
    window.activateAbTlh044();
})
