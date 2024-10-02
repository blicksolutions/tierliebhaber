document.addEventListener("DOMContentLoaded", () => {
	/******************************************************************/
	/* open sidebar vavigation
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
	/*  open submenu
	/******************************************************************/

	const openSubmenu = () => {
		const subMenuItems = document.querySelectorAll("li.SidebarMenu__item-has-submenu");
		const sideBarMenuDrawer = document.querySelector(".tlh-044.SidebarMenu");

		

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
		const sideBarMenuDrawer = document.querySelector(".tlh-044.SidebarMenu");

		closeSubmenus.forEach((closeSubmenu) => {
			closeSubmenu.addEventListener("click", (event) => {
				event.stopPropagation();

				closeSubmenu.parentNode.classList.remove("SidebarMenu__submenu--open");
			});
		});
	};

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
		});
	};

	window.activateAbTlh044 = () => {
		openSideBarNavigation();
		openSubmenu();
		closeSubmenu();
		bestsellerSwiper();
	};

	window.activateAbTlh044();
});
