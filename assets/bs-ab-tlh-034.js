window.activateAbTlh034 = () => {
	document.querySelector(".ProductForm__AddToCart")?.classList.add("BS-Button--yellow");
	document.querySelector(".StickyATC__ATC")?.classList.add("BS-Button--yellow");

    document.addEventListener('rerenderingFinished',() => {
        document.querySelector(".Cart__Checkout")?.classList.add("BS-Button--yellow");  
    });
};