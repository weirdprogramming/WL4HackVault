var json;

/*
function reloadIframes() {
	//Reload all iframes
	var i, frames;
	frames = document.getElementsByTagName("iframe");
	for (i = 0; i < frames.length; ++i) {
		frames[i].src=frames[i].src;
	}
}
*/

function loadIframe(element,videoType) {
	videoId=element.getAttribute("video-id");
	if (videoType == "youtube") {
		element.innerHTML='<iframe width="240" height="160" src="https://www.youtube.com/embed/'+videoId+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
	} else if (videoType == "bilibili") {
		element.innerHTML='<iframe width="240" height="160" src="https://player.bilibili.com/player.html?aid='+videoId+'" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"  style="width: 240; height: 160px; max-width: 100%"></iframe>';
	}
}

function main() {
	initializeAjax();
}

function initializeAjax() {
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open('GET', 'romhacks.json', true);

	xhr.onload = function(e) {
		if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			json=JSON.parse(xhr.response);
			// console.log(json);
			loadJSON();
		}
	};
	xhr.send();
}

function loadJSON() {
	var list=document.getElementById("list");
	var data = json;
	var html = '';
	for(let i=0;i<data.length;i++) {
		var divHack=document.createElement('div');
			divHack.className="hack shadow-sm p-3 mb-3 bg-white rounded";

			var divTitle=document.createElement('div');
			divTitle.className="row";
			divTitle.innerHTML='<div class="col"><strong>'+data[i]["name"]+'</strong></div>';
			divHack.appendChild(divTitle);

			var divCentral=document.createElement('div');
			divCentral.className="row";
				var divCarousel=document.createElement('div');
				divCarousel.className="col-sm-3";
					var divCarouselControls=document.createElement('div');
					divCarouselControls.setAttribute("id","carouselExampleControls-i"+i);
					divCarouselControls.className="carousel slide";
					divCarouselControls.setAttribute("data-ride","carousel");

					// Disable cycling because of videos
					divCarouselControls.setAttribute("data-interval","false");
						var divCarouselInner=document.createElement('div');
						divCarouselInner.className="carousel-inner";

						for (let j=0; j<data[i]["images"].length;j++) {
							var divItemI=document.createElement('div');
							if (j==0) {
								divItemI.className="carousel-item active";
							} else {
								divItemI.className="carousel-item";
							}
							divItemI.innerHTML='<img src="./images/'+data[i]["images"][j]+'" class="d-block image" alt="'+data[i]["images"][j]+'"/>';
							divCarouselInner.appendChild(divItemI);
						}

						for (let j=0; j<data[i]["videos"].length;j++) {
							var divItemI=document.createElement('div');
							if (j==0 && data[i]["images"].length == 0) {
								divItemI.className="carousel-item active";
							} else {
								divItemI.className="carousel-item";
							}
							divItemI.setAttribute("video-id",data[i]["videos"][j]["id"]);
							divItemI.innerHTML='<img class="video-ready" src="./images/play.png" class="d-block image" alt="play.png"/>';
							if (data[i]["videos"][j]["type"] == "youtube") {
								divItemI.setAttribute("onclick",'loadIframe(this,"youtube")');
							} else if (data[i]["videos"][j]["type"] == "bilibili") {
								divItemI.setAttribute("onclick",'loadIframe(this,"bilibili")');
							}
							divCarouselInner.appendChild(divItemI);
						}

						divCarouselControls.appendChild(divCarouselInner);
						divCarouselControls.innerHTML+='<a class="carousel-control-prev" href="#carouselExampleControls-i'+i+'" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true" > </span> <span class="sr-only">Previous</span> </a> <a class="carousel-control-next" href="#carouselExampleControls-i'+i+'" role="button" data-slide="next" > <span class="carousel-control-next-icon" aria-hidden="true" ></span> <span class="sr-only">Next</span> </a>';

					divCarousel.appendChild(divCarouselControls);

				divCentral.appendChild(divCarousel);

				var divDescription=document.createElement('div');
				divDescription.className="col-sm-5";
				divDescription.innerHTML=""/* "Hack Description:" */;
				divDescription.innerHTML+='<p> Creator: '+data[i]["creator"]+' <br />Date Submitted: '+data[i]["date"];
				divDescription.innerHTML+='Difficulty: <span class="badge badge-pill badge-primary badge-'+(data[i]["difficulty"].toLowerCase())+'">'+data[i]["difficulty"]+'</span></p>';
				divDescription.innerHTML+='<p>'+data[i]["description"]+'</p>';
				divCentral.appendChild(divDescription);

				var divDownload=document.createElement('div');
				divDownload.className="col-sm-4";
					var divProgress=document.createElement('div');
					divProgress.setAttribute('style',"height: 20px;");
					divProgress.className="progress";
					if (data[i]["completed"] == "true") {
						divProgress.innerHTML='<div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuemin="0" aria-valuemax="100">Status: Completed'+'</div>';
						divDownload.appendChild(divProgress);
					} else {
						divProgress.innerHTML='<div class="progress-bar bg-secondary" role="progressbar" style="width: 100%" aria-valuemin="0" aria-valuemax="100">Status: WIP'+'</div>';
						divDownload.appendChild(divProgress);
					}
					var divRating=document.createElement('div');
					divRating.setAttribute('style',"height: 20px;");
					divRating.className="progress";
					divRating.innerHTML+='<div class="progress-bar bg-warning" role="progressbar" style="width: 100%" aria-valuemin="100"> Stars: '+data[i]["rating"]+ '</div>';
					divDownload.appendChild(divRating);

					var aDownload=document.createElement('a');
					aDownload.setAttribute("id","btn-download");
					if (data[i]["filename"] != "") {
						aDownload.className="btn btn-primary float-right btn-lg";
						aDownload.setAttribute("href","./patches/"+data[i]["filename"]);
					} else {
						aDownload.setAttribute('style',"color: #fff");
						aDownload.className="btn btn-secondary float-right btn-lg";
						aDownload.setAttribute("disabled","");
					}

					aDownload.setAttribute("role","button");
					aDownload.innerHTML="Download";
					divDownload.appendChild(aDownload);

					var aStar=document.createElement('a');
					aStar.setAttribute("id","btn-star");
					aStar.className="btn btn-warning float-right btn-lg mr-2";
					aStar.setAttribute("role","button");
					aStar.innerHTML="★";
					divDownload.appendChild(aStar);


				divCentral.appendChild(divDownload);


			divHack.appendChild(divCentral);

			var divTags=document.createElement('div');
			divTags.className="row";
			divTags.innerHTML='<div class="col">Tags: '+data[i]["tags"]+'</div>';
			divHack.appendChild(divTags);

		list.appendChild(divHack);
		new Carousel(divCarouselControls);
	}
}
