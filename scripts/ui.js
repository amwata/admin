

	const UI = function () {
		this.loader = document.querySelector(".loader")
		this.maps = document.querySelectorAll(".cnty svg .g")
		this.mdlCtn = document.querySelector(".mdlbox")
		this.mdlClose = document.querySelector(".modal .close")
		this.mdlSeats = Array.from(document.querySelectorAll(".mdlbox .mdlseat"))
		this.mdlNxt = document.querySelector(".mdlbody .nxt")
		this.mdlPrev = document.querySelector(".mdlbody .prv")
		this.homeSec = document.querySelector("#home")
		this.progSec = document.querySelector("#progress")
		this.floaTag = document.querySelector("div.float")
		
		
		this.mdlSeatsLen = 0
		
	}
	
	UI.prototype.isInView = function (el, p, d = true) {
		const percentVisible = p/100,
		{top:elemTop, bottom:elemBottom, height:elemHeight} = el.getBoundingClientRect(),
		overhang = elemHeight * (1 - percentVisible)
	 	
	 	if(!d){return (elemTop >= -overhang && elemBottom <= window.innerHeight + overhang)}
		return elemBottom <= window.innerHeight + overhang
	}

	UI.prototype.showCnty = function (){
		this.maps.forEach(map => {
			map.addEventListener("click", function(e){
			document.body.classList.add("info","noscroll")
		})})
	}
	
	UI.prototype.closeDlg = function (){
		this.mdlClose.addEventListener("click", function(e){
			document.body.classList.remove("info","noscroll")
		})
	}
	
	UI.prototype.endLoad = function () {
		this.loader.style.display = "none"
		this.toggleBodyscroll()
	}
	
    UI.prototype.toggleBodyscroll = function () {
		if (!document.body.classList.contains("noscroll")){
			document.body.classList.add("noscroll")
		}else{document.body.classList.remove("noscroll")}
	}
	
	UI.prototype.addScroll = function () {
		if (document.body.classList.contains("noscroll")){
			document.body.classList.remove("noscroll")
		}
	}
	
	UI.prototype.removeScroll = function () {
		if (!document.body.classList.contains("noscroll")){
			document.body.classList.add("noscroll")
		}
	}
	
	UI.prototype.events = function(){
		let s = 0,
		d = 0,
		end = 0,
		lft = 0
		window.addEventListener("scroll", (e) =>{
			if(this.isInView(this.homeSec, 0, false) || this.isInView(this.progSec, 0, false)){
				this.floaTag.classList.remove("opac")
			}else this.floaTag.classList.add("opac")
		})
		this.mdlNxt.addEventListener("click", (e) =>{
			e.preventDefault()
			this.scrolNxt(this.mdlCtn, this.mdlSeats, this.mdlPrev, e.target)
		})
		
		this.mdlPrev.addEventListener("click", (e) =>{
			e.preventDefault()
			this.scrolPrv(this.mdlCtn, this.mdlSeats, this.mdlNxt, e.target)
		})
		
		this.mdlCtn.addEventListener("touchstart", (e) =>{
			s = e.touches[0].pageX
		})
		
		this.mdlCtn.addEventListener("touchmove", (e) =>{
			d = e.touches[0].pageX
		})
		
		this.mdlCtn.addEventListener("touchend", (e) =>{
			end = d - s
			if(end < -50) this.scrolNxt(this.mdlCtn, this.mdlSeats, this.mdlPrev, this.mdlNxt)
			else if(end > 50) this.scrolPrv(this.mdlCtn, this.mdlSeats, this.mdlNxt, this.mdlPrev)
		})
	}
		
	UI.prototype.scrolNxt = function(ctn, divs, a, e){
		this.mdlSeatsLen++
		if(this.mdlSeatsLen >= divs.length - 1){
			e.classList.add("end")
			this.mdlSeatsLen = divs.length - 1
		}
		a.classList.remove("end")
		ctn.scrollLeft += (divs[this.mdlSeatsLen].getBoundingClientRect().left -20)
	}
		
	UI.prototype.scrolPrv = function(ctn, divs, a, e) {
		this.mdlSeatsLen--
		if(this.mdlSeatsLen <= 0){
			e.classList.add("end")
	 		this.mdlSeatsLen = 0
		}
		a.classList.remove("end")
		ctn.scrollLeft += (divs[this.mdlSeatsLen].getBoundingClientRect().left -20)
	}
	
	
	
	