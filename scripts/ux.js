const UX = function () {
	
	this.crudUrl ="https://script.google.com/macros/s/AKfycbwjsGw5sH0XXTtkK7bCtWP1DeG4Q1d91NJPzk7UfDNgkxtpA2hnroPeif5IqdESATps/exec"
	this.relUrl = "https://script.google.com/macros/s/AKfycbxpYKw_4booxMVqQT-OM26Fw9F-S4aUmPan453d-0ewscbxrx9Ll_nTXFUmZ7ztUwL6/exec"
	
	this.ls = window.localStorage
	
	this.initDiv = document.querySelector(".frmInit")
	this.crudDiv = document.querySelector(".frmCrud")
	this.delDiv = document.querySelector(".frmDel")
	this.frmInit = document.forms["frmInit"]
	this.frmCrud = document.forms["frmCrud"]
	this.frmDel = document.forms["frmDel"]
	this.initMsg = document.querySelector(".frmInit #alert")
	this.crudMsg = document.querySelector(".frmCrud #alert")
	this.delMsg = document.querySelector(".frmDel #alert")
	this.auth = document.querySelector("#auth")
	this.frmClose = document.querySelector(".frmClose a")
	this.addPost = document.querySelector(".action .add")
	this.btnCrud = document.querySelector("#btnCrud")
	
	this.outBtn = document.querySelector("#out")
	this.delFrmXbtn = document.querySelector(".send #cancel")
	this.delInfo = document.querySelector(".delInfo p")
	this.frmH = document.querySelector("#frmh5")
	this.tBody = document.querySelector(".items table tbody")
	this.selectPost = document.querySelector("#post")
	this.selectCnty = document.querySelector("#area")
	this.frmPost = document.querySelector("#frmPost")
	this.frmRelCtn = document.querySelector("#frmRelCtn")
	this.frmCounty= document.querySelector("#crudCounty")
	this.areaCtn = document.querySelector(".areactn")
	this.aspPg = "manage-aspirants.html"
	this.relPg = "manage-results.html"
	this.subs = 0
	
}

UX.prototype.init = function(){
	if(this.ls.getItem("pwrd") && this.ls.getItem("crudSigma")){
		this.initDiv.style.display = "none"
		this.loadTable(this.selectPost.value, this.selectCnty.value)
		this.refresh()
		return
	}
	this.frmInit.addEventListener("submit", ev => {
		ev.preventDefault()
		
		let data = new FormData(ev.target)
		this.auth.textContent = "Processing..."
		fetch(this.crudUrl, {method: "POST", body: data})
		.then(res => {
			if(!res.ok){
				throw new Error(`HTTP Error! status: ${res.status}`)
			}return res.json()
		}).then(e => {
			this.auth.textContent = "Authenticate"
			if(e.error){
				throw new Error(e.error)
				return
			}
			this.initDiv.style.display = "none"
			this.ls.setItem("pwrd", frmInit["pass"].value)
			this.ls.setItem("crudSigma", JSON.stringify(e))
			this.loadTable(this.selectPost.value, this.selectCnty.value)
			
		}).catch(er => {
			this.auth.textContent = "Try Again!"
			this.initMsg.innerHTML = `<div class="err">${er}</div>`
		})
	})
}

UX.prototype.addNew = function(){
	this.frmCrud.addEventListener("submit", ev => {
		ev.preventDefault()
		ev.target["seat"].disabled = false
		ev.target["pass"].value = this.ls.getItem("pwrd")
		let data = new FormData(ev.target)
		if(this.subs > 0) return
		this.subs++
		this.btnCrud.value = "Saving..."
		fetch(this.crudUrl, {method: "POST", body: data})
		.then(res => {
			if(!res.ok){
				throw new Error(`HTTP Error! status: ${res.status}`)
			}return res.json()
		}).then(e => {
			if(e.error){
				throw new Error(e.error)
				return
			}
			this.btnCrud.value = "Saved!"
			ev.target["name"].value=""
			ev.target["party"].value=""
			this.showMsg(this.crudMsg, `<div class="scs">RECENT ACTIVITY: ${ev.target["seat"].value} candidate updated successfully!</div>`)
			this.refresh()
			
			if(ev.target["action"].value === "EDIT"){
				setTimeout(() =>{
					document.body.classList.remove("frmCrudVis")
				}, 5000)
			}this.subs = 0
		}).catch(er => {
			this.btnCrud.value = "Try Again!"
			this.showMsg(this.crudMsg, `<div class="err">RECENT ERROR: ${er}</div>`)
			this.subs = 0
		})
	})
}

UX.prototype.del = function(){
	this.frmDel.addEventListener("submit", ev => {
		ev.preventDefault()
		ev.target["pass"].value = this.ls.getItem("pwrd")
		let data = new FormData(ev.target)
		if(this.subs > 0) return
		this.subs++
		this.delInfo.textContent = "Deleting..."
		fetch(this.crudUrl, {method: "POST", body: data})
		.then(res => {
			if(!res.ok){
				throw new Error(`HTTP Error! status: ${res.status}`)
			}return res.json()
		}).then(e => {
			if(e.error){
				throw new Error(e.error)
				return
			}
			ev.target.reset()
			this.showMsg(this.delMsg, `<div class="scs">${ev.target["seat"].value} record deleted successfully!</div>`)
			this.delInfo.textContent = "Record deleted!"
			this.refresh()
			setTimeout(() =>{
				this.delDiv.style.display = "none"
				this.subs = 0
			}, 3000)
			
		}).catch(er => {
			this.showMsg(this.delMsg, `<div class="err">ERROR: ${er}<br>Try again!</div>`)
			this.delInfo.textContent = "An error occurred!"
			ev.target.reset()
			this.refresh()
			setTimeout(() =>{
				this.delDiv.style.display = "none"
				this.subs = 0
			}, 3000)
		})
	})
}

UX.prototype.delRec = function(){
	let btns = Array.from(document.querySelectorAll("td .del"))
	btns.forEach(btn => {
		btn.addEventListener("click", e => {
			e.preventDefault()
			let seat = this.selectPost.value,
				id = btn.dataset.id
			this.frmDel["seat"].value = seat
			this.frmDel["id"].value = id
			this.delDiv.style.display = "flex"
			this.delInfo.textContent = `Delete record ${id} from ${seat} table?`
		})
	})
	this.del()
}
UX.prototype.xFrmDel = function(){
	this.delFrmXbtn.addEventListener("click", e => {
		e.preventDefault()
		this.delDiv.style.display = "none"
	})
}

UX.prototype.update = function(){
	let btns = Array.from(document.querySelectorAll("td .edit"))
	btns.forEach(btn => {
		btn.addEventListener("click", e => {
			e.preventDefault()
			
			let seat = this.selectPost.value,
				id = btn.dataset.id,
			 	obj = JSON.parse(this.ls.getItem("crudSigma"))
			
			this.frmCrud["seat"].value = seat
			this.frmCrud["action"].value ="EDIT"
			this.frmCrud["id"].value = id
			document.body.classList.add("frmCrudVis")
			
			const data = obj[seat],
			match = data.filter(i => i[0] === id)[0]
			this.frmCrud["seat"].disabled = true
			
			if(seat === "Presidential"){
				this.frmCrud["name"].value = match[1]
				this.frmCrud["party"].value = match[2]
			}
			else if(seat === "Gubernatorial" || seat == "Senatorial"){
				this.frmCrud["name"].value = match[1]
				this.frmCrud["party"].value = match[2]
				this.frmCrud["county"].value = match[3]
			}this.postChanged(seat, `Update ${seat} seat for ID: ${id}.`)
		})
	})
}
UX.prototype.postChanged = function(t, x){
	if(t === "Gubernatorial" || t === "Senatorial") this.frmCounty.classList.remove("none")
	else if (t === "Presidential") this.frmCounty.classList.add("none")
	this.changeFrmH(x)
}
UX.prototype.selectedPost = function(){
	this.outBtn.addEventListener("click", e => {
		e.preventDefault()
		this.logOut()
	})
	this.frmPost.addEventListener("change", e => {
		this.postChanged(e.target.value, `Add new ${e.target.value} seat.`)
	})
	
	this.selectCnty.addEventListener("change", ev => {
		this.loadTable(this.selectPost.value, ev.target.value)
	})
	
	this.changeEv()
	this.addPost.addEventListener("click", e => {
		e.preventDefault()
		this.frmCrud.reset()
		this.frmCrud["seat"].disabled = false
		this.frmCrud["seat"].value = this.selectPost.value
		this.frmCrud["county"].value = this.selectCnty.value
		this.postChanged(this.frmPost.value, `Add new ${this.frmCrud["seat"].value} seat.`)
		document.body.classList.add("frmCrudVis")
		this.frmCrud["action"].value ="ADD"
	})
	this.addNew()
	this.frmClose.addEventListener("click", e => {
		e.preventDefault()
		document.body.classList.remove("frmCrudVis")
	})
}
UX.prototype.changeFrmH = function(str){
	this.frmH.textContent = str
}
UX.prototype.changeEv = function(){
	this.selectPost.addEventListener("change", e => {
		if(e.target.value === "Gubernatorial" || e.target.value === "Senatorial") {
			this.areaCtn.classList.remove("none")
			this.loadTable(e.target.value, this.selectCnty.value)
		}
		else if(e.target.value === "Presidential") {
			this.areaCtn.classList.add("none")
			this.loadTable(e.target.value, this.selectCnty.value)
		}
	})
}

UX.prototype.loadTable = function(x, y){
	try{
		let obj = JSON.parse(this.ls.getItem("crudSigma"))
		if(x === "Presidential"){
			this.areaCtn.classList.add("none")
			const match = obj[x]
			this.tBody.innerHTML = ""
			for(let i = 0; i<match.length; i++){
				this.tBody.innerHTML += `
					<tr>
						<td>${match[i][0]}</td>
						<td>${match[i][1]}</td>
						<td>${match[i][2]}</td>
						<td class="action">
							<a href="" class="edit" data-id=${match[i][0]}><i class="fa fa-pencil"></i></a>
							<a href="" class="del" data-id=${match[i][0]}><i class="fa fa-trash"></i></a>
						</td>
					</tr>
				`
			}
		}
		else if(x === "Gubernatorial" || x === "Senatorial"){
			this.areaCtn.classList.remove("none")
			const seat = obj[x],
			match = seat.filter(i => i[3] === y)
			this.tBody.innerHTML = ""
			for(let i = 0; i<match.length; i++){
				this.tBody.innerHTML += `
					<tr>
						<td>${match[i][0]}</td>
						<td>${match[i][1]}</td>
						<td>${match[i][2]}</td>
						<td class="action">
							<a href="" class="edit" data-id=${match[i][0]}><i class="fa fa-pencil"></i></a>
							<a href="" class="del" data-id=${match[i][0]}><i class="fa fa-trash"></i></a>
						</td>
					</tr>
				`
			}
		}else throw "error"
		this.update()
		this.delRec()
		this.xFrmDel()
	}
	catch(er){
		this.logOut()
	}
}
UX.prototype.logOut = function(pg=this.aspPg){
	this.ls.clear()
	location.href = pg
}
UX.prototype.showMsg = function(el, sms){
	el.innerHTML = sms
	setTimeout(() =>{
		el.innerHTML = ""
	}, 5000)
}

UX.prototype.refresh = function(){
	let data = new FormData()
	data.append("pass", this.ls.getItem("pwrd"))
	data.append("tag", "admin")
	data.append("action", "INIT")
	fetch(this.crudUrl, {method: "POST", body: data})
	.then(res => {
		if(!res.ok){
			throw new Error(`HTTP Error! status: ${res.status}`)
		}return res.json()
	}).then(e => {
		if(e.error){
			throw new Error(e.error)
			return
		}
		this.ls.setItem("crudSigma", JSON.stringify(e))
		this.loadTable(this.selectPost.value, this.selectCnty.value)
	}).catch(er => {
		console.log(er)
	})
}

UX.prototype.loadRelData = function(){
	this.frmRelInit()
	this.relReset()
	this.outBtn.addEventListener("click", e => {
		e.preventDefault()
		this.logOut(this.relPg)
	})
	
	this.selectCnty.addEventListener("change", ev => {
		this.relFrms(ev.target.value)
	})
	
}

UX.prototype.frmRelInit = function(){
	if(this.ls.getItem("relPwrd") && this.ls.getItem("relSigma")){
		this.initDiv.style.display = "none"
		this.relFrms(this.selectCnty.value)
		return
	}
	
	this.frmInit.addEventListener("submit", ev => {
		ev.preventDefault()
		
		let data = new FormData(ev.target)
		this.auth.textContent = "Processing..."
		fetch(this.relUrl, {method: "POST", body: data})
		.then(res => {
			if(!res.ok){
				throw new Error(`HTTP Error! status: ${res.status}`)
			}return res.json()
		}).then(e => {
			this.auth.textContent = "Authenticate"
			if(e.error){
				throw new Error(e.error)
				return
			}
			this.initDiv.style.display = "none"
			this.ls.setItem("relPwrd", frmInit["pass"].value)
			this.ls.setItem("relSigma", JSON.stringify(e))
			this.relFrms(this.selectCnty.value)
		}).catch(er => {
			this.auth.textContent = "Try Again!"
			this.initMsg.innerHTML = `<div class="err">${er}</div>`
		})
	})
}

UX.prototype.relReset = function(){
	if(!this.ls.getItem("relPwrd")){
		return
	}
	let data = new FormData()
	data.append("pass", this.ls.getItem("relPwrd"))
	data.append("tag", "admin")
	data.append("action", "INIT")
	fetch(this.relUrl, {method: "POST", body: data})
	.then(res => {
		if(!res.ok){
			throw new Error(`HTTP Error! status: ${res.status}`)
		}return res.json()
	}).then(e => {
		if(e.error){
			throw new Error(e.error)
			return
		}
		this.ls.setItem("relSigma", JSON.stringify(e))
		setTimeout(()=>{
			this.relReset()
		}, 30000)
		
	}).catch(er => {
		console.log(er)
		setTimeout(()=>{
			this.relReset()
		}, 30000)
	})
}

UX.prototype.relFrms = function(x){
	try{
		let obj = JSON.parse(this.ls.getItem("relSigma")),
		pArea = ""
		for(let [k, v] of Object.entries(obj)){
			 pArea = v.filter(n => n[3].toString() === x)
		}
		const pMatch = obj["Presidential"]
		this.frmRelCtn.innerHTML = ""
			
			let frm = document.createElement("form"),
				fbx = document.createElement("div"),
				send = document.createElement("div"),
				btnP = document.createElement("button")
			frm.setAttribute("class", "form")
			fbx.setAttribute("class", "fieldsBox")
			send.setAttribute("class", "send")
			frm.innerHTML = `<h2> Presidential - ${pArea.length > 0 ? pArea[0][5] : x.toUpperCase()}</h2>`
			
			for(let i = 0; i<pMatch.length; i++){
				fbx.innerHTML += `
					<div class="field">
						<input name=${pMatch[i][0]} type="number" class="inp" required autofocus>
						<label for=${pMatch[i][0]}>${pMatch[i][1]}</label>
					</div>`
			}
			fbx.innerHTML += `<div class="field rejvots">
				<input name="void" type="number" class="inp" required autofocus>
				<label for="void">Rejected Votes</label>
				</div>`
			frm.appendChild(fbx)
			frm.innerHTML += `
				<input name="seat" value="Presidential" type="hidden">
				<input name="county" value=${x} type="hidden">
				<div class="alert" id="pmsg"></div>`
				btnP.textContent = "Presidential"
				btnP.onclick = (t) => {
					t.preventDefault()
					this.relUpdate(t.target)
				}
				send.appendChild(btnP)
				frm.appendChild(send)
				
			this.frmRelCtn.appendChild(frm)
			for(let [k, v] of Object.entries(obj)){
				const gsMatch = v.filter(n => n[3].toString() === x)
				if(gsMatch.length > 0){
					let frm = document.createElement("form"),
						fbx = document.createElement("div"),
						send = document.createElement("div"),
						btnP = document.createElement("button")
						send.setAttribute("class", "send")
						frm.setAttribute("class", "form")
						fbx.setAttribute("class", "fieldsBox")
						frm.innerHTML = `<h2>${k} - ${gsMatch[0][5]}</h2>`
					
					for(let i = 0; i<gsMatch.length; i++){
						fbx.innerHTML += `
						<div class="field">
						<input name=${gsMatch[i][0]} type="number" class="inp" required autofocus>
						<label for=${gsMatch[i][0]}>${gsMatch[i][1]}</label>
						</div>`
					}
					frm.appendChild(fbx)
					frm.innerHTML += `
						<input name="seat" value=${k} type="hidden">
						<input name="county" value=${x} type="hidden">
						<div class="alert"></div>`
						btnP.textContent = k
						btnP.onclick = (t) => {
							t.preventDefault()
							this.relUpdate(t.target)
						}
						send.appendChild(btnP)
						frm.appendChild(send)
					this.frmRelCtn.appendChild(frm)
			}
		}
		this.frmRelCtn.querySelectorAll("form").forEach(f => f.addEventListener("submit", (e)=>{
			e.preventDefault()
		}))
	}
	catch(er){
		this.logOut(this.relPg)
	}
}

UX.prototype.relUpdate = function(ev){
	if(this.subs > 0) return
	this.subs++
	let frm = ev.parentElement.parentElement,
		msgBx = ev.parentElement.previousElementSibling
	
	let data = new FormData(frm)
	data.append("pass", this.ls.getItem("relPwrd"))
	data.append("tag", "admin")
	data.append("action", "POST")
	ev.textContent = "Updating..."
	
	fetch(this.relUrl, {method: "POST", body: data})
	.then(res => {
		if(!res.ok){
			throw new Error(`HTTP Error! status: ${res.status}`)
		}return res.json()
	}).then(e => {
		if(e.error){
			throw new Error(e.error)
			return
		}
		frm.reset()
		ev.textContent = "Updated!"
		this.showMsg(msgBx, `<div class="scs">SUCCESS:<br>Results updated for ${e.count} candidate(s).</div>`)
		this.subs = 0
	}).catch(er => {
		ev.textContent = "Try again!"
		this.showMsg(msgBx, `<div class="err">ERROR: ${er}<br>Try again!</div>`)
		this.subs = 0
	})
}