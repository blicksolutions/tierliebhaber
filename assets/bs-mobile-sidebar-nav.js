document.addEventListener("DOMContentLoaded", () => {
	/******************************************************************/
	/* bestseller swiper
	/******************************************************************/

	const bestsellerSwiper = () => {
		const bestseller = new Swiper(".bestseller__swiper", {
			slidesPerView: 1,
			centerInsufficientSlides: true,
			spaceBetween: 10,
			allowTouchMove: false,
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
	/* window function to activate AB-TLH-044
	/******************************************************************/

	window.mobileSidbarNavigation = () => {
		openSideBarNavigation();
		openSubmenu();
		closeSubmenu();
		bestsellerSwiper();
	};

	window.mobileSidbarNavigation();
});
