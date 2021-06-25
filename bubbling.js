function Circle(i=0,j=0,Rad=2) {return {x:i, y:j, r:Rad};}
function Point(i=0,j=0) {return {x:i,y:j};}
//var iSrc='../Pictures/image_40.bmp';//'../Pictures/test.jpg';
//im.src=iSrc;
var cnvs;
var im,d0;
var Iw,Ih;
var mOver=false;
var drawMode=true;
var ctx;
var bblR;
//ctx2.fillStyle = "#ff0000";
var Cx=0;var Cy=0;var num=0;var Sx,Sy,Sr;
var grd;
var grd0=[];

function init()
{
	cnvs = document.getElementById('yourCanvasID');
	var url=getCookie('url');
	var rad=getCookie('rad');

	im = document.getElementById('i'); 	//if(im.src!=url){newImage();}
	d0 = document.getElementById('d0');
	Iw=im.width;Ih=im.height;
	d0.style.width=Iw;
	d0.style.height=Ih;
	cnvs.style.position='absolute';
	cnvs.style.top=0; cnvs.style.left=0; cnvs.width=Iw; cnvs.height=Ih; cnvs.style.width=Iw; cnvs.style.height=Ih;
	cnvs.style.zIndex=2;
	ctx=cnvs.getContext('2d'); ctx.fillStyle = "#000000";
	var xy=document.getElementById('xycoordinates').innerHTML+="<div id='a'><a href='#' id='bblBtn' onclick='start()'> Bubbling </a><input type='number' name='bblR' id='bblR' onchange='bblR=value;' style='width:60px; margin-left:75px' value='17'><br> | <a href='#' id='drwBtn' onclick='drawMode=1'> Draw_Mode </a><br> | <a href='#' id='clrBtn' onclick='drawMode=0'> Clear_Mode</a><br> | <a href='#' id='resetBbl' onclick='resetBubbling()'> Reset_Bubbling </a><br><a href='#' id='newImg' onclick='newImage()'>New_Image</a><br><input type='text' name='imgURL' id=imgURL value='Paste image URL'><br><textarea onclick='value=JSON.stringify(circls);'>Get JSON circles</textarea></div>";
/*	var da=document.createElement('div');
	da.id='a';
	xy.appendChild(da);
	var a1=document.createElement('a');
	a1.href='#'; a1.id='BblBtn'; a1.onclick=start; a1.appendChild(document.createTextNode(' Bubbling '));
	da.appendChild(a1);
	var ipt = document.createElement('input');
	ipt.type='number';ipt.name='bblR';ipt.id='bblR';ipt.onchange=function(){bblR=this.value;}; ipt.style.width=40;ipt.style.marginLeft=75; ipt.value=17;
	da.appendChild(ipt);
	da.appendChild(document.createElement('br'));*/
	
	/*var a=document.getElementById('bblBtn'); a.style.top=Ih+5;
	var a=document.getElementById('drwBtn'); a.style.top=Ih+5;
	var a=document.getElementById('clrBtn'); a.style.top=Ih+5;
	var a=document.getElementById('resetBbl'); a.style.top=Ih+5;*/
	grd=Grid();

  	if (typeof(mOver) != 'undefined' && typeof(drawBrush) != 'undefined') {
    		cnvs.onmousedown = () => {mOver = true;};
		cnvs.onmouseup = () => {mOver = false;};
		cnvs.onmousemove = (event) => {drawBrush(event);}; 
  	}
}

function newImage()
{
	d0.removeChild(im);
	im=document.createElement('img');
	var url=document.getElementById('imgURL').value;
	im.src=url;
	document.cookie='';
	im.id='i';
	im.onload=init;
	d0.insertBefore(im,cnvs);
}

function start()
{
	grd0=[];
	grd.map(function(x){var a=[];x.map(function(y){a.push(y);});grd0.push(a);});
	bubbling(bblR);
	getReadyCanvas();
}

function Grd(x,y)
{
	if(x>Iw+1){return true;}
	if(y>Ih+1){return true;}
	if(x<=0){return true;}
	if(y<=0){return true;}
	return grd[x][y];
}

function Grid()
{
	 var grid=[];
	for(i=0;i<=Iw+1;i++)
	{
		grid[i]=[];
		for(j=0;j<=Ih+1;j++)
		{
			grid[i][j]=(i==0||j==0||i==Iw+1||j==Ih+1);
		}
	}
	return grid;
}
function showGrid()
{
	for(i=1;i<Iw;i++)
	{
		for(j=1;j<Ih;j++)
		{
			if(Grd(i,j))
			{
//				ctx.fillStyle=""
				set_pixel(i-1,j-1);
			}
			else
			{
				
			}
		}
	}
}
function add_crcl(x,y,r,id)
{
var d = document.getElementById("d");
d.innerHTML+="<div class='circle' id='c"+id+"'></div>";
var c = document.getElementById('c'+id);
c.style.position	= 'absolute';
var Ya = y-r;
var Xa = x-r;
c.style.backgroundImage=iSrc;
c.style.top 	= Ya+'px';
c.style.left	= Xa+'px';
c.style.backgroundPosition = "-"+Xa+"px -"+Ya+"px";
c.style.width	= 2*r+"px";
c.style.height	= 2*r+"px";
}
/*
<body onmousedown='f1(event)' onmouseup='if(window.interval) clearInterval(interval)' >
		<div id='c1' class='circle'> <canvas id="yourCanvasID" /></div>
		<div id='c2' class='circle'> </div>
		<div id='c3' class='circle'> </div>
*/

var circls=[];
function bubbling(minR=17,maxR=Ih)
{
	var medians=getMedians(minR);
	var circle_rate=getCircleRate(medians,minR);
	var c_r = circle_rate.sort(function(a,b) {return (a.r < b.r) ? 1 : ((b.r < a.r) ? -1 : 0);} );
	//draw_circle(c_r[0].x,c_r[0].y,c_r[0].r);
	if(c_r.length)
	{
		fillCircle(c_r[0].x,c_r[0].y,c_r[0].r);
		circls.push(c_r[0]);
		bubbling(minR,maxR);
	}
//	return c_r;
}

function getReadyCanvas()
{
	ctx.fillRect(0,0,Iw,Ih);
	for(c in circls)
	{
		fill_circle(im,circls[c].x,circls[c].y,circls[c].r);
	}
}

function resetBubbling()
{
	grd=[];
	grd0.map(function(x){var a=[];x.map(function(y){a.push(y);});grd.push(a);});
	ctx.clearRect(0,0,Iw,Ih);
	circls=[];
	showGrid();
}
//function debug1(m){var a=[];var b=[];var i=0;m.map(function(o){i++;if(check_circle(o.x,o.y,o.r)){a.push(o);console.log(i);}else{b.push(o);}}); return{a:a,b:b};}

function getMedians(minR=17)
{
	var medians=[];
	for(i=1;i<=Iw+1;i++)
	{
		var cnt=0;
		for(j=0;j<=Ih+1;j++)
		{//найдем середины разрешеных отрезков
			if(Grd(i,j))
			{
				cnt=Math.round(cnt/2);
					if(cnt>=minR){medians.push(Circle(i,j-cnt,cnt));}
				cnt=0;
			}
			else
			{
				cnt++;
			}
		}
	}
	return medians;
}

function getCircleRate(medians,minR=17)
{
		var circle_rate=[];
	medians.map(function(i)//for(i in medians)
	{
		var r1=1;
		//x=medians[i].x;
		x=i.x;
		y=i.y;
//		var chk=true;
		while(r1<=i.r && !check_circle(x,y,r1))
		{
			r1++;
		}
		if(r1-1>minR){circle_rate.push(Circle(x,y,r1-1));}
	});
	return circle_rate;
}


function showMedians(m)
{
	for(i in m)
	{
	x=m[i].x;
	y=m[i].y;
	ctx.fillStyle='#f00';
	ctx.fillRect(x,y,1,1);
	//ctx.stroke();
	}
}


function check_circle(x0,y0,R) {
	var Z = 0, x = 0, y = R;
	var b=false;
	while (x<=y) 
	{
		b|=Grd(x0-x,y0-y)|| Grd(x0-x,y0+y)|| Grd(x0+x,y0-y)|| Grd(x0+x,y0+y)|| Grd(x0-y,y0-x)|| Grd(x0-y,y0+x)|| Grd(x0+y,y0-x)|| Grd(x0+y,y0+x);
		if(b){return true;}
		if (Z>0) { y--; Z -= y; Z -= y; }
		x++; Z += x; Z += x;
}
  return b;
}

function fillCircle(x0,y0,R)
{
	ctx.fillRect(x0-2,y0-2,4,4);
	draw_circle(x0,y0,2);
	for(r=3;r<R;r++){draw_circle2(x0,y0,r);}
}

function draw_circle(x0,y0,R) {
	var Z = 0, x = 0, y = R;
	while (x<=y)
	{
		set_pixel(x0-x,y0-y); 
		set_pixel(x0-x,y0+y); 
		set_pixel(x0+x,y0-y); 
		set_pixel(x0+x,y0+y); 
		set_pixel(x0-y,y0-x); 
		set_pixel(x0-y,y0+x); 
		set_pixel(x0+y,y0-x); 
		set_pixel(x0+y,y0+x);
		if (Z>0) { y--; Z -= y; Z -= y; }
		x++; Z += x; Z += x;
	}
	//ctx.stroke();
}

function draw_circle2(x0,y0,R) {
	var Z = 0, x = 0, y = R;
	while (x<=y)
	{
		set_pixel(x0-x,y0-y,2); 	//11
		set_pixel(x0-x,y0+y,2); 	//7
		set_pixel(x0+x,y0-y,2); 	//1
		set_pixel(x0+x,y0+y,2); 	//5
		set_pixel(x0-y,y0-x,2); 	//10
		set_pixel(x0-y,y0+x,2); 	//8
		set_pixel(x0+y,y0-x,2); 	//2
		set_pixel(x0+y,y0+x,2);	//4
		if (Z>0) { y--; Z -= y; Z -= y; }
		x++; Z += x; Z += x;
	}
	//ctx.stroke();
}

function fill_circle(img,x0,y0,r) 
{
for(var R=1;R<r;R++){
	var Z = 0, x = 0, y = R;
	while (x<=y)
	{
		ctx.drawImage(img,x0-x,y0-y,2,2,x0-x,y0-y,2,2);
		ctx.drawImage(img,x0-x,y0+y,2,2,x0-x,y0+y,2,2);
		ctx.drawImage(img,x0+x,y0-y,2,2,x0+x,y0-y,2,2);
		ctx.drawImage(img,x0+x,y0+y,2,2,x0+x,y0+y,2,2);
		ctx.drawImage(img,x0-y,y0-x,2,2,x0-y,y0-x,2,2);
		ctx.drawImage(img,x0-y,y0+x,2,2,x0-y,y0+x,2,2);
		ctx.drawImage(img,x0+y,y0-x,2,2,x0+y,y0-x,2,2); 
		ctx.drawImage(img,x0+y,y0+x,2,2,x0+y,y0+x,2,2); 
		if (Z>0) { y--; Z -= y; Z -= y; }
		x++; Z += x; Z += x;
	}
	}	//ctx.stroke();
}


function set_pixel(x,y,s=1)
{	
	if(x>Iw){x=Iw-1;}
	if(y>Ih){y=Ih-1;}
	if(x<0){x=0;}
	if(y<0){y=0;}
	grd[x+1][y+1]=true;

	ctx.fillRect(x,y,s,s);
}

function drawBrush(e,s=5)
{
	if(mOver)
	{
		x=e.clientX;
		y=e.clientY;
	if(x>Iw){x=Iw-1;}
	if(y>Ih){y=Ih-1;}
	if(x<0){x=0;}
	if(y<0){y=0;}
	if(drawMode){
	ctx.fillRect(x,y,s,s);
	for(i=x;i<s+x;i++){for(j=y;j<s+y;j++){grd[i][j]=true;}}
	}
	else
	{
		ctx.clearRect(x,y,s,s);
		for(i=x;i<s+x;i++){for(j=y;j<s+y;j++){grd[i][j]=false;}}
	}
	//ctx.stroke();
	}
	else
	{
		return null;
	}
}


function canvasToImg() 
{
	var cnvs = document.getElementById("yourCanvasID");
	var ctx = cnvs.getContext("2d");
	//draw a red box
	ctx.fillStyle="#FF0000";
	ctx.fillRect(10,10,30,30);

	var url = canvas.toDataURL();
	var newImg = document.createElement("img"); // create img tag
	newImg.src = url;
	document.body.appendChild(newImg); // add to end of your document
}

//canvasToImg();
function cnvs_getCoordinates(e)
{
	x=e.clientX;
	y=e.clientY;
	document.getElementById("xycoordinates").innerHTML="Coordinates: (" + x + "," + y + ")";
}
function f1(e)
{
	Cx = e.clientX;
	Cy = e.clientY;
	Sr=2;
	var d = document.getElementById("d");
	num++;
	d.innerHTML+="<div class='circle' id='c"+num+"'></div>";
	var c = document.getElementById('c'+num);
	c.style.position	= 'absolute';
	//E1=e;
	interval=setInterval('f12()',50);
}
var interval;
//var E1;
function f12(e)
{
//	Sx = e.clientX;
//	Sy = e.clientY;
	//Sr = Math.round(Math.sqrt((Sx-Cx)*(Sx-Cx)+(Sy-Cy)*(Sy-Cy)));
	Sr*=1.1;
var Ya = Math.abs(Cy-Sr);
var Xa = Math.abs(Cx-Sr);
var c = document.getElementById('c'+num);
c.style.top 	= Ya+'px';
c.style.left	= Xa+'px';
c.style.backgroundPosition = "-"+Xa+"px -"+Ya+"px";
c.style.width	= 2*Sr+"px";
c.style.height	= 2*Sr+"px";
}
function f2(e)
{
	Sx = e.clientX;
	Sy = e.clientY;
	Sr = Math.round(Math.sqrt((Sx-Cx)*(Sx-Cx)+(Sy-Cy)*(Sy-Cy)));
	//num++;
	document.getElementById("xycoordinates").innerHTML="Coordinates: (" + Sx + "," + Sy + ")";
	//add_crcl(Cx,Cy,Sr,num);
	
//interval=setInterval('add_crcl(Sx,Sy,Sr,num)',50)
}

function putFP(e)
{
	Cx=e.clientX;
	Cy=e.clientY;
	set_pixel(Cx,Cy);
}

function putSP(e)
{
	Sx=e.clientX;
	Sy=e.clientY;
	draw_line(Cx,Cy,Sx,Sy);
}

function cut_line(x1, y1, x2, y2) {
  /*
    эта функция должна обрезать линию по границам активного окна и возвращать
    true, если надо рисовать хоть что-то,
    false - если рисовать ничего не надо, т.е. линия целиком лежит вне окна.
    разумеется, у меня есть полный код этой и многих других функций - полноценная
    графическая система для ОС, но не выкладывать же сюда её всю? Хотя, если
    кому понадобится - в принципе, могу и поделиться, я в целом не жадный ;-)
  */
  return true;
}


function draw_hline(x1,x2,y) {
  if (x1>x2) {
    //swap(x1,x2);
    var t = x1; x1 = x2; x2 = t;
  }
  while (x1<=x2) set_pixel(x1++,y);
}


function draw_vline(y1,y2,x) {
  if (y1>y2) {
    //swap(x1,x2);
    var t = y1; y1 = y2; y2 = t;
  }
  while (y1<=y2) set_pixel(x,y1++);
}
function abs(i){return Math.abs(i);}

function draw_line(x1, y1, x2, y2) {
  if (y1==y2) {
    draw_hline(x1,x2,y1);
  } else if (x1==x2) {
    draw_vline(y1,y2,x1);
  } else if (cut_line(x1,y1,x2,y2)) {
    var Z = 0;
    var kx, ky, max_dev, step_small;
    // выбираем направление рисования
    if (abs(x1-x2)>=abs(y1-y2)) {     // по горизонтали
      // всегда рисуем слева направо
      if (x1>x2) { 
        // swap(x1,x2); 
        var t = x1; x1 = x2; x2 = t;
        // swap(y1,y2); 
        t = y1; y1 = y2; y2 = t;
      }
      // коэффициенты прямой
      kx = abs(y2-y1); ky = x2-x1;
      // начинаем рисовать
      step_small = (y1>y2) ? -1 : 1;
      max_dev = ky >> 1;
      while (x1<=x2) {
        set_pixel(x1,y1);
        x1++;
        Z += kx;
        if (Z>max_dev) { y1 += step_small; Z -= ky; }
      }
    } else {                          // по вертикали
      // всегда рисуем сверху вниз
      if (y1>y2) { 
        // swap(x1,x2); 
        var t = x1; x1 = x2; x2 = t;
        // swap(y1,y2); 
        t = y1; y1 = y2; y2 = t;
      }
      // коэффициенты прямой
      kx = y2-y1; ky = abs(x2-x1);
      // начинаем рисовать
      step_small = (x1>x2) ? -1 : 1;
      max_dev = kx >> 1;
      while (y1<=y2) {
        set_pixel(x1,y1);
        y1++;
        Z += ky;
        if (Z>max_dev) { x1 += step_small; Z -= kx; }
      }
    }
  }
	//ctx.stroke();
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
