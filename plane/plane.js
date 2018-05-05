(function () {
    let box = document.getElementById('plane');
    box.bgtop =0
    box.bgtimer=setInterval(function () {
        box.bgtop += 2;
        box.style.backgroundPositionY = box.bgtop + 'px';
    }, 20);
    let span = document.querySelector('.score span');
    //我方飞机构造函数
    class Myplane{
        constructor(w,h,x,y,img,boom) {
            this.w = w;
            this.h = h;
            this.x = x;
            this.y = y;
            this.maxx = 2*x;
            this.maxy = y;
            this.img = img;
            this.boom = boom;
            this.init();
        }
        init() {
            this.createPlace();
            this.move();
            this.shootBullet();
            return this;
        }
        //创建我方飞机
        createPlace() {
            this.plane = document.createElement('img');
            this.plane.src = this.img;
            this.plane.style.cssText = `width:${this.w}px;height:${this.h}px;position:absolute;top:${this.y}px;left:${this.x}px;`;
            box.appendChild(this.plane);
            return this;
        }
        //我方飞机移动
        move() {
            let This = this;
            let upTimer = null;
            let downTimer = null;
            let leftTimer = null;
            let rightTimer = null;
            let upLock = true;
            let downLock = true;
            let leftLock = true;
            let rightLock = true;
            document.addEventListener('keydown', keymove, false);
            document.addEventListener('keyup', keyup, false);
            function keymove(e){
            	console.log(e.keyCode);
            	switch (e.keyCode){
            		case 37: moveLeft();
            			break;
            		case 38: moveUp();
            			break;
            		case 39: moveRight();
            			break;
            		case 40: moveDown();
            			break;
            	}
            }
            function moveLeft(){
            	if(leftLock){
            		leftLock = false;
            		clearInterval(rightTimer);
            		leftTimer = setInterval(function(){
            			This.x-=4;
		            	if(This.x<=0){
		            		This.x=0;
		            	}
		            	This.plane.style.left = This.x + 'px';
            		},20);
            	}
            }
            function moveRight(){
            	if(rightLock){
            		rightLock = false;
            		clearInterval(leftTimer);
            		rightTimer = setInterval(function(){
            			This.x+=4;
		            	if(This.x>=This.maxx){
		            		This.x=This.maxx;
		            	}
		            	This.plane.style.left = This.x + 'px';
            		},20);
            	}
            }
            function moveUp(){
            	if(upLock){
            		upLock = false;
            		clearInterval(downTimer);
            		upTimer = setInterval(function(){
            			This.y-=4;
		            	if(This.y<=0){
		            		This.y=0;
		            	}
		            	This.plane.style.top = This.y + 'px';
            		},20);
            	}
            }
            function moveDown(){
            	if(downLock){
            		downLock = false;
            		clearInterval(upTimer);
            		downTimer = setInterval(function(){
            			This.y+=4;
		            	if(This.y>=This.maxy){
		            		This.y=This.maxy;
		            	}
		            	This.plane.style.top = This.y + 'px';
            		},20)
            	}
            }
            function keyup(e){
            	if(e.keyCode==37){
            		clearInterval(leftTimer);
					leftLock=true;
            	}
            	if(e.keyCode==38){
            		clearInterval(upTimer);
					upLock=true;
            	}
            	if(e.keyCode==39){
            		clearInterval(rightTimer);
					rightLock=true;
            	}
            	if(e.keyCode==40){
            		clearInterval(downTimer);
					downLock=true;
            	}
            }
            return this;
        }
        //我方飞机发射子弹
        shootBullet(){
        	var This = this;
        	//按下
        	document.addEventListener('keydown',shootdown,false);
        	let shootLock = true, shootTimer = null;
        	function shootdown(e){
        		if(e.keyCode==90){
        			if(shootLock){
        				shootLock = false;
        				shoot();
        				shootTimer = setInterval(shoot,150);
        			}
        		}
        		return false;
        	}
        	function shoot(){
    			new Bullet(6,14,This.x+This.w/2-3,This.y-14,'img/bullet.png');
    		}
        	
        	//抬起
        	document.addEventListener('keyup', shootup, false);
        	function shootup(e){
        		if(e.keyCode==90){
	        		shootLock = true;
	        		clearInterval(shootTimer);
        		}
        	}
        	
            return this;
        }
    }
    //子弹构造函数
    class Bullet{
    	constructor(w,h,x,y,img){
    		this.w = w;
    		this.h = h;
    		this.x = x;
    		this.y = y;
    		this.img = img;
    		this.createBullet();
    	}
    	//创建子弹
    	createBullet(){
    		this.bullet = document.createElement('img');
    		this.bullet.src = this.img;
    		this.bullet.style.cssText = `width:${this.w}px;height:${this.h}px;position:absolute;top:${this.y}px;left:${this.x}px;`;
    		box.appendChild(this.bullet);
    		this.moveBullet();
    	}
    	//子弹运动
    	moveBullet(){
    		let This = this;
    		this.timer = setInterval(
    			function(){
    				This.y-=5;
    				This.bullet.style.top = This.y + 'px';
    				if(This.y<-This.y){
    					clearInterval(This.timer);
    					box.removeChild(This.bullet);
    				}
    				This.bump();
    			},20
    		);
    	}
    	//子弹碰撞敌机
    	bump(){
    		let enemys = document.querySelectorAll('.enemy');
    		for(let i=0; i<enemys.length;i++){
    			if(this.x + this.w > enemys[i].offsetLeft &&
    				this.x < enemys[i].offsetLeft + enemys[i].offsetWidth &&
    				this.y + this.h > enemys[i].offsetTop &&
    				this.y < enemys[i].offsetTop + enemys[i].offsetHeight){
    				try{
    					box.removeChild(this.bullet);
    					clearInterval(this.timer);
    				}catch(e){
    					return;
    				}
    				enemys[i].blood--;
    				if(enemys[i].blood<=0){
    					span.innerHTML = +span.innerHTML + enemys[i].score;
    					enemys[i].className = '';
    					clearInterval(enemys[i].timer);
    					enemys[i].src = enemys[i].boom;
    					let timer = setTimeout(function(){
    						box.removeChild(enemys[i]);
    						clearTimeout(timer);
    					},500);
    				}
    			}
    		}
    		
    	}
    }
    
    
    
    
    //敌机构造函数
    class Enemyplane{
    	constructor(w,h,x,y,img,boom,blood,score,speed){
    		this.w = w;
    		this.h = h;
    		this.x = x;
    		this.y = y;
    		this.img = img;
            this.boom = boom;
            this.blood = blood;
            this.score = score;
            this.speed = speed;
            this.create();
    	}
    	//创建敌方飞机
    	create(){
    		this.enemy = document.createElement('img');
    		this.enemy.className = 'enemy';
    		this.enemy.src = this.img;
    		this.enemy.boom = this.boom;
    		this.enemy.blood = this.blood;
    		this.enemy.score = this.score;
    		this.enemy.style.cssText = `width:${this.w}px;height:${this.h}px;position:absolute;top:${this.y}px;left:${this.x}px;`;
            box.appendChild(this.enemy);
            this.enemyMove();
    	}
    	//敌机运动
    	enemyMove(){
    		let This = this;
    		this.enemy.timer = setInterval(function(){
    			This.y+=This.speed;
    			This.enemy.style.top = This.y + 'px';
    			if(This.y>box.offsetHeight){
    				clearInterval(This.enemy.timer);
    				box.removeChild(This.enemy);
    			}
    			This.bump();
    		},20);
    	}
    	//敌机碰撞我方飞机
    	bump(){
    		if(usePlace.x + usePlace.w > this.x){
    			if(usePlace.x < this.x + this.w){
    				if(usePlace.y + usePlace.h > this.y){
    					if(usePlace.y < this.y + this.h){
    						let enemys=document.querySelectorAll('.enemy');
    						for(let i = 0; i< enemys.length;i++){
    							clearInterval(enemys[i].timer);
    						}
    						clearInterval(enemyTimer);
    						clearInterval(box.bgtimer);
    						usePlace.plane.src = usePlace.boom;
    						setTimeout(function(){
    							alert('gameover');
    							location.reload();
    						},1000)
    						
    					}
    				}
    			}
    		}
    	}
    }
    
    


    let usePlace = new Myplane(66, 80, (box.offsetWidth - 66) / 2, box.offsetHeight - 80, 'img/myplane.gif', 'img/myplaneBoom.gif');
    
    //随机产生敌方飞机
    let enemyTimer = setInterval(function(){
    	for(let i=0;i<run(1,5);i++){
    		let num = run(0,12);
    		if(num<7){
    			new Enemyplane(34,24,run(0,box.offsetWidth-34),-24,'img/smallplane.png','img/smallplaneboom.gif',1,1,run(1,5));
    		}else if(num<11){
    			new Enemyplane(46,60,run(0,box.offsetWidth-46),-60,'img/midplane.png','img/midplaneboom.gif',3,5,run(1,3));
    		}else {
    			new Enemyplane(110,164,run(0,box.offsetWidth-110),-164,'img/bigplane.png','img/bigplaneboom.gif',10,20,1);
    		}
    	}
    },2000);
    function run(min, max){
    	return Math.floor(Math.random()*(max-min+1)+min);
    }
})();