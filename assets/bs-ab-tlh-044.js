document.addEventListener("DOMContentLoaded", () => {

	/******************************************************************/
	/* bestseller swiper
	/******************************************************************/

	const bestsellerSwiper = () => {
		const bestseller = new Swiper(".bestseller__swiper", {
			slidesPerView: 1,
			centerInsufficientSlides: true,
			spaceBetween: 10,
		});

		const bestsellerCategories = document.querySelectorAll(".bestseller__category");

		bestsellerCategories.forEach((bestsellerCategory) => {
			bestsellerCategory.addEventListener("click", () => {

				bestsellerCategories.forEach((category) => {
					category.classList.remove("active");
				});

				bestsellerCategory.classList.add("active");

				bestseller.slideTo(bestsellerCategory.dataset.slideTo);
			});
		});
	};

	/******************************************************************/
	/* open sidebar navigation
	/******************************************************************/

	const openSideBarNavigation = () => {
		const sideBarAVariant = document.querySelector(".a-variant.SidebarMenu.Drawer");
		const sidebarBVariant = document.querySelector(".tlh-044.SidebarMenu.Drawer");
		const headerIcon = document.querySelector(".Header__Wrapper .Header__Icon");
		const drawerCloseBVariant = document.querySelector(".tlh-044 .Drawer__Close");

		headerIcon.addEventListener("click", () => {
			sideBarAVariant.style.display = "none";
			sidebarBVariant.ariaHidden = false;
		});

		drawerCloseBVariant.addEventListener("click", () => {
			sidebarBVariant.ariaHidden = true;
		});
	};

	/******************************************************************/
	/*  open submenu
	/******************************************************************/

	const openSubmenu = () => {
		const subMenuItems = document.querySelectorAll("li.SidebarMenu__item-has-submenu");

		subMenuItems.forEach((subMenuItem) => {
			subMenuItem.addEventListener("click", () => {
				subMenuItem.querySelector(".SidebarMenu__submenu").classList.add("SidebarMenu__submenu--open");
			});
		});
	};

	/******************************************************************/
	/*  close submenu
	/******************************************************************/

	const closeSubmenu = () => {
		const closeSubmenus = document.querySelectorAll(".SidebarMenu__submenu-close");

		closeSubmenus.forEach((closeSubmenu) => {
			closeSubmenu.addEventListener("click", (event) => {
				event.stopPropagation();

				closeSubmenu.parentNode.classList.remove("SidebarMenu__submenu--open");
			});
		});
	};

	/******************************************************************/
	/* AB Test functions
	/******************************************************************/

	const clicksOnMenuItems = () => {
		const menuItems = document.querySelectorAll(".SidebarMenu .Collapsible a, .SidebarMenu .Collapsible__Button, .SidebarMenu .SidebarMenu__item, .SidebarMenu .SidebarMenu__submenu-close");

		menuItems.forEach((menuItem) => {
			menuItem.addEventListener("click", () => {

				// AB custom goal => "Clicks on menu items"
				console.log("click on menu item!")

				// window['ablyft'].push({
				// 	eventType: 'custom',
				// 	eventName: 'clicks-on-menu-items'
				// }); 
			});
		});
	}

	const checkTimeSpentOnMenu = () => {
		let menuOpenTime;
		let menuCloseTime;
		const headerIcon = document.querySelector(".Header__Wrapper .Header__Icon");
		const sideBarMenuDrawerClose = document.querySelectorAll(".SidebarMenu .Drawer__Close, .PageOverlay, .SidebarMenu .Collapsible a, .SidebarMenu .SidebarMenu__item a");

		headerIcon.addEventListener("click", () => {
			menuOpenTime = new Date();
		});

		sideBarMenuDrawerClose.forEach((drawerClose) => {
			drawerClose.addEventListener("click", () => {
				menuCloseTime = new Date();
	
				const timeSpentOnMenu = menuCloseTime - menuOpenTime;
				const timeSpentOnMenuInSeconds = Math.floor(timeSpentOnMenu / 1000);
	
				const minutes = Math.floor(timeSpentOnMenuInSeconds / 60);
				const seconds = timeSpentOnMenuInSeconds % 60;
	
				// AB custom goal => "Time spent on menu"
				console.log(`Das Menü war ${timeSpentOnMenuInSeconds}s lang offen.`);

				// window['ablyft'].push({
				// 	eventType: 'custom',
				// 	eventName: 'time-spent-on-menu',
				// 	eventValue: timeSpentOnMenuInSeconds
				// }); 
			});
		});
	}

	/******************************************************************/
	/* call these functions in A and B Variant
	/******************************************************************/

	checkTimeSpentOnMenu();
	clicksOnMenuItems();

	/******************************************************************/
	/* window function to activate AB-TLH-044
	/******************************************************************/

	window.activateAbTlh044 = () => {
		openSideBarNavigation();
		openSubmenu();
		closeSubmenu();
		bestsellerSwiper();
	};

	//window.activateAbTlh044();
});
