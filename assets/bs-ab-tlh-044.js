document.addEventListener("DOMContentLoaded", () => {

	/******************************************************************/
	/*  open/close submenu
	/******************************************************************/

	const openSubmenu = () => {
		const subMenuItems = document.querySelectorAll("li.SidebarMenu__has-submenu");

		subMenuItems.forEach((subMenuItem) => {
			subMenuItem.addEventListener("click", () => {
				subMenuItem.querySelector(".SidebarMenu__submenu").classList.add("SidebarMenu__submenu--open")
			});	
		})
	}

	const closeSubmenu = () => {
		const closeSubmenus = document.querySelectorAll(".SidebarMenu__submenu-close");

		closeSubmenus.forEach((closeSubmenu) => {
			closeSubmenu.addEventListener("click", (event) => {

				event.stopPropagation();
				closeSubmenu.parentNode.classList.remove("SidebarMenu__submenu--open")
			});	
		})
	}


	/******************************************************************/
	/* open sidebar vavigation
	/******************************************************************/

    const openSideBarNavigation = () => {
		const sideBarAVariant = document.querySelector(".a-variant.SidebarMenu.Drawer");
        const sidebarBVariant = document.querySelector(".tlh-044.SidebarMenu.Drawer");
        const headerIconBVariant = document.querySelector(".Header__Icon");
        const drawerCloseBVariant = document.querySelector(".tlh-044 .Drawer__Close");

        headerIconBVariant.addEventListener("click", () => {
			sideBarAVariant.style.display = "none";
            sidebarBVariant.ariaHidden = false;
        });

        drawerCloseBVariant.addEventListener("click", () => {
            sidebarBVariant.ariaHidden = true;
        })
    }
    
    window.activateAbTlh044 = () => {
        openSideBarNavigation();
		openSubmenu();
		closeSubmenu();
    };
    
    window.activateAbTlh044();
})
