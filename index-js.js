const menu = document.querySelector('.menu');
const suporters_for_drag = document.querySelector('.supporters');
const up_btn = document.querySelector('.up-btn');
const photos_block = document.getElementById('photos');
const gallery = document.querySelector('.gallery');
const photo_frame = document.querySelector('.photo-frame');
const all_photos_gallery = document.querySelectorAll('.photo');




//------------------------------------------------------



// Init suporters datas ------------------------------start

class Suporter {
	constructor(img, name, text, position){
		this.img = img;
		this.name = name;
		this.text = text;
		this.position = position;
	}
}
function add_supporter(sup){
	let supporters_dom = document.querySelector('.supporters');

	let img  = document.createElement("DIV"); //add img
	img.classList.add('supporter-picture');
	img.style.backgroundImage = `url(${sup.img})`;

	let text  = document.createElement("P"); //add text
	text.classList.add('supporter-text');
	text.innerHTML = sup.text;

	let name  = document.createElement("P"); //add name
	name.classList.add('supporter-name');
	name.innerHTML = sup.name;

	let position  = document.createElement("P"); //add position
	position.classList.add('supporter-position');
	position.innerHTML = sup.position;

	let one_supporter = document.createElement("DIV"); //add one supporter to dom
	one_supporter.classList.add('one-supporter');

	one_supporter.appendChild(img);
	one_supporter.appendChild(text);
	one_supporter.appendChild(name);
	one_supporter.appendChild(position);

	supporters_dom.appendChild(one_supporter);
	return one_supporter;
}

function add_icon(){
	const indicators = document.querySelector('.indicators');
	indicators.appendChild(document.createElement("I"));
}

function init_supporters(){
	
	for(let sup of SUPPORTERS){
		add_supporter(sup);
		add_icon()
	}
}
function remove_all_supporters(){
	const supporters_dom = document.querySelectorAll('.one-supporter');
	for(let sup of supporters_dom){
		sup.remove();
	}
}

//-----------------------------------------------------end

//ADD CURRENT -----------------------------------------start

function add_current(action='stay'){
	const indicators = document.querySelectorAll('.indicators I');

	switch (action) {
		case 'left':
			if((current+2) > indicators.length){
				current = 0;
			}else{
				current++;
			}
			break;
		case 'right':
			if((current-1) < 0){
				current = indicators.length-1;
			}else{
				current--;
			}
			break;
	}

	//remove current classes
	const current_i = document.querySelector('.current-i');
	if(current_i){ current_i.classList.remove('current-i') }

	//add new current class
	indicators[current].classList.add('current-i');

}


//MOVE SUPPORTER-----------------------------------------start

function move_sup(sup, drag_mode=false){
	if(drag_mode){

	}else{
		sup.style.transform = `translateX(-${sup.offsetWidth*2}px)`;
	}
	
}


//-------------------------------------------------------end


//SUPPORTERS AUTO MOVE-----------------------------------start

function auto_move(){
	const all_supporters = document.querySelectorAll('.one-supporter');
	const indicators = document.querySelectorAll('.indicators I');

	if(!on_drag){
		for (let sup of all_supporters){
			move_sup(sup);
		}
		add_current('left');
	}

	setTimeout(() => {

		if(!on_drag){
			remove_all_supporters();
			for(let sup of SUPPORTERS){
				add_supporter(sup)
			}
			SUPPORTERS.push(SUPPORTERS.shift())
		}
		
		auto_move();
		
	}, 4000)
	
	
}

//------------------------------------------------------end

//DRAG-------------------------------------------------start

function drag(e){
	on_drag = true;
	suporters_for_drag.classList.add('on-drag');
}

function stop_drag(e){
	on_drag = false;
	end_point = e.screenX;
	suporters_for_drag.classList.remove('on-drag');
}


//------------------------------------------------------end

//STIKY MENU-------------------------------------------start
function add_stiky_menu(e) {
	if (document.documentElement.scrollTop > 250){
		menu.classList.add('stiky-menu');
		up_btn.style.bottom = '40px';
	}
	else if (menu.classList.contains('stiky-menu')) {
		menu.classList.remove('stiky-menu');
		up_btn.style.bottom = '-70px';
	}

	if(document.documentElement.scrollTop > 580 && document.documentElement.scrollTop < 1900){
		menu.style.boxShadow = '0 3px 15px #b3b3b3';
	}
	else{
		menu.style.boxShadow = 'None';
	}	
}
//-----------------------------------------------------end

// GALLERY---------------------------------------------start
function move_photo_to_center() {
	photo_frame.style.top = '50%';
	photo_frame.style.left = '50%';
	photo_frame.style.transform = 'translate(-50%, -50%)';
	if(global_gallery_photo.type === 'small'){
		photo_frame.style.width = '500px';
		photo_frame.style.height = '500px';
	}
}

function move_photo_to_initial_place() {
	photo_frame.style.top = `${global_gallery_photo.top}px`;
	photo_frame.style.left = `${global_gallery_photo.left}px`;
	photo_frame.style.width = `${global_gallery_photo.width}px`;
	photo_frame.style.height = `${global_gallery_photo.height}px`
	
	photo_frame.style.transform = 'translate(0, 0)';
}

function get_current_gallery_photo(photo) {
	return {
			top: photo.getBoundingClientRect().top,
			height: photo.getBoundingClientRect().bottom - photo.getBoundingClientRect().top,
			left: photo.getBoundingClientRect().left,
			width: photo.getBoundingClientRect().right - photo.getBoundingClientRect().left,
			url: photo.style.backgroundImage,
			type: photo.classList.contains('left-b')? 'big':'small',
			}	
}

function show_gallery_photo(photo){
	gallery.style.display = 'block';
	global_gallery_photo = get_current_gallery_photo(photo)

	photo_frame.style.top = `${global_gallery_photo.top}px`;
	photo_frame.style.left = `${global_gallery_photo.left}px`;
	photo_frame.style.backgroundImage = global_gallery_photo.url;
	photo_frame.style.width = `${global_gallery_photo.width}px`;
	photo_frame.style.height = `${global_gallery_photo.height}px`
	photo_frame.style.display = 'block';
	
	setTimeout(move_photo_to_center, 100);
}
function hide_gallery_photo(){
	setTimeout(() => {
		gallery.style.display = 'none';
		document.body.style.overflow = 'auto';
		photo_frame.style.display = 'none';
	}, 500)

	move_photo_to_initial_place();
}

 function click_gallery(e) {
 	let clicked_photo;

 	if(e.target.tagName == 'SPAN'){
 		clicked_photo = e.target.parentNode;
 		document.body.style.overflow = 'hidden';
 		show_gallery_photo(clicked_photo);

 	}else if(e.target.classList.contains('gallery')) {
 		hide_gallery_photo()

 	}else if(e.target.classList.contains('btn') || e.target.tagName == 'I') {
 		btn_clicked(e.target)

 	}else{
 		clicked_photo = e.target
 		document.body.style.overflow = 'hidden';
 		show_gallery_photo(clicked_photo);
 	} 	
 }

function btn_clicked(btn) {
	let photo;

	if(btn.classList.contains('left-btn') || btn.parentNode.classList.contains('left-btn')) {
		for(let i = 0; i < all_photos_gallery.length; i++){
			if(all_photos_gallery[i].style.backgroundImage == global_gallery_photo.url) {

				if(i){
					global_gallery_photo = get_current_gallery_photo(all_photos_gallery[i-1]);					
				}else{
					global_gallery_photo = get_current_gallery_photo(all_photos_gallery[all_photos_gallery.length-1]);	
				}
				break;
			}
		}
	}else if(btn.classList.contains('right-btn') || btn.parentNode.classList.contains('right-btn')) {
			for(let i = 0; i < all_photos_gallery.length; i++){
				if(all_photos_gallery[i].style.backgroundImage == global_gallery_photo.url) {
					console.log('in');
					if(i+1 === all_photos_gallery.length){
						global_gallery_photo = get_current_gallery_photo(all_photos_gallery[0]);					
					}else{
						global_gallery_photo = get_current_gallery_photo(all_photos_gallery[i+1]);
					}
					break;
				}
			}
	}
	photo_frame.style.backgroundImage = global_gallery_photo.url;
	if(global_gallery_photo.type === 'small'){
		photo_frame.style.width = '500px';
		photo_frame.style.height = '500px';
	}
}

//------------------------------------------------------end



// MAIN()
///////////////////////////////////////////////////////////////////////////////////////////////// 

window.addEventListener('scroll', add_stiky_menu);
suporters_for_drag.addEventListener('mousedown', drag);
suporters_for_drag.addEventListener('mouseup', stop_drag);
photos_block.addEventListener('click', click_gallery);

var global_gallery_photo;


//-------------------------------------------------

const Vika = new Suporter('img/vika.jpg',
						  'viktoria shevaldina',
						  '“Great template, just what we were looking for. Easy to install, easy to navigate. Well documented. Really enjoyed the support diagrams.”',
						  'product manager');
const Petro = new Suporter('img/petro.jpg',
						  'petro davybida',
						  '“Great template, just what we were looking for. Easy to install, easy to navigate. Well documented. Really enjoyed the support diagrams.”',
						  'chef');
const Google = new Suporter('img/google-man.jpg',
						  'google youtube',
						  '“Great template, just what we were looking for. Easy to install, easy to navigate. Well documented. Really enjoyed the support diagrams.”',
						  'information manager');

var SUPPORTERS = [Vika,Petro,Google]

var current = 1;
var on_drag = false;

init_supporters();
add_current();
auto_move(Vika,Petro,Google);

var scroll = new SmoothScroll('a[href*="#"]', {
	speed: 600
});

