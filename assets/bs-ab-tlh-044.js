document.addEventListener("DOMContentLoaded", () => {

	let menuOpenTime;
	let menuCloseTime;

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

			menuOpenTime = new Date();
		});

		drawerCloseBVariant.addEventListener("click", () => {
			sidebarBVariant.ariaHidden = true;

			menuCloseTime = new Date();

			const timeSpentOnMenu = menuCloseTime - menuOpenTime;
			const timeSpentOnMenuInSeconds = Math.floor(timeSpentOnMenu / 1000);

			const minutes = Math.floor(timeSpentOnMenuInSeconds / 60);
			const seconds = timeSpentOnMenuInSeconds % 60;

			// AB custom goal aufrufen, zu klären in welchem Format
			console.log(`Das Menü war ${minutes} min ${seconds}s lang offen.`);
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
