var XUI = function(){
	this.attr = {};
	this.dom = null;
}

XUI.prototype.init = function(ui){
	this.dom = this.load(ui);
}

XUI.prototype.getDOM = function(){
	return this.dom;
}

XUI.prototype.getNode = function(name){
	return this.attr[name];
}

XUI.prototype.load = function(ui){
	var self = this;
	//D("load "+ui.type);
	if(ui.type=="bitmap"){
		//D(ui.src);
		var inst = new XUI.BitmapSprite(ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
			D("bitmap "+ui.name);
		}
		return inst;
	}
	else if(ui.type=="shape"){
		var inst = new XUI.ShapeNode(ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
			D("shape "+ui.name);
		}
		return inst;
	}
	else if(ui.type=="button"){
		var inst = new XUI.Button(ui);
		//var inst = XUI.CreateButton(ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
			D("button "+ui.name);
		}
		return inst;
	}
	else if(ui.type=="text"){
		var inst = null;
		if("input" == ui.textType){
			inst = new XUI.InputText(ui);
		}
		else{
			inst = new XUI.TextSprite(ui);			
		}
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
			D("text "+ui.name);
		}	
		return inst;
	}
	else if(ui.type=="frame"){
		var ret = [];
		for(var i = 0; i < ui.elements.length; ++i){
			ret.push(self.load(ui.elements[i]));				
		}
		
		var inst = new XUI.FrameSprite(ret, ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
			D("frame "+ui.name);
		}
		return inst;
	}
	else if(ui.type=="layer"){
		var ret = [];
		for(var i = 0; i < ui.frames.length; ++i){
			ret.push(self.load(ui.frames[i]));
		}
		
		var inst = new XUI.Layer(ret, ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
			D("layer "+ui.name);
		}
		return inst;
	}
	else if(ui.type=="dom"){
		var ret = [];
		for(var i = 0; i < ui.layers.length; ++i){
			ret.push(self.load(ui.layers[i]));
		}

		var inst = new XUI.DOM(ret, ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
			D("dom "+ui.name);
		}
		return inst;
	}
	else if(ui.type=="graphic" || ui.type=="movie clip"){
		var ret = [];
		for(var i = 0; i < ui.dom.length; ++i){
			ret.push(self.load(ui.dom[i]));
		}
		
		var inst = new XUI.MovieClip(ret, ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
			D("mc "+ui.name);
		}
		return inst;
	}
	else{
		alert("XUI.load not support type "+ui.type);
		return [];
	}
}

XUI.resDir = "res";

XUI.setCoord = function(item, ui){
	//D(JSON.stringify(ui.reg));
	//if(ui.reg){
	//	item.setAnchorPoint(cc.p(ui.reg[0], ui.reg[1]));
	//}
	//else{
		item.setAnchorPoint(cc.p(0, 1));	
	//}		
    item.setPosition(XUI.getPoint(ui.x, ui.y));
    if(ui.rotation && ui.rotation != 0){
    	item.setRotation(ui.rotation);
   		//D(ui.rotation);
    }	    
    if(ui.width){
    	item.getWidth = function(){return ui.width;}
    	D("width "+ui.width);
    }
    if(ui.height){
    	item.getHeight = function(){return ui.height;}
    	D("height "+ui.height);
    }
    if(ui.name){
    	item.name = ui.name;
    	D("name "+ui.name);
    }
}

XUI.getPoint = function(x, y){
	// scale = winsize/fla.size
	//x = x*winScaleX;
	//y = y*winScaleY;
	//return cc.p(x, winSize.height-y)
	//D("x="+Math.round(x));
	//D("y="+Math.round(y));
	return cc.p(Math.round(x), -1*Math.round(y));
}

XUI.BitmapSprite = cc.Sprite.extend({
	ui:null,
	ctor:function(ui){
		this._super();
		this.ui = ui;

		//this.initWithFile("res/"+ui.src);			
		this.init(XUI.resDir+"/"+ui.src);
		XUI.setCoord(this, ui);
		this.setScaleX(ui.scaleX);
		this.setScaleY(ui.scaleY);

		D("bitmap create "+ui.src+", pos="+JSON.stringify(this.getPosition()));
	},
	xuiUpdate:function(){
		//D("bm update");
	},
	rotate:function(angle){
		XUI.transform(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
	}
});

XUI.ShapeNode = cc.DrawNode.extend({
	ui:null,
	ctor:function(ui){
		this._super();
		this.ui = ui;
		//this.setContentSize(cc.p(winSize.width, winSize.height));
		XUI.setCoord(this, ui);
		this.setPosition(cc.p(0, 0));
		this.setScaleX(ui.scaleX);
		this.setScaleY(ui.scaleY);

		for(var i = 0; i < ui.contours.length; ++i){
			var contour = ui.contours[i];
			
			var edges = JSON.parse(JSON.stringify(contour.edges));

			for(var j = 0; j < edges.length; ++j){
				edges[j].y = -edges[j].y;
			}

			if(contour.color){
				var r=parseInt(contour.color.substr(1, 2), 16)/255;
				var g=parseInt(contour.color.substr(3, 2), 16)/255;
				var b=parseInt(contour.color.substr(5, 2), 16)/255;

				this.drawPoly(edges, cc.c4f(r,g,b,0.5), 0.1, cc.c4f(0,0,0,1) );
			}
			else{
				this.drawPoly(edges, cc.c4f(1,0,0,0.5), 0.1, cc.c4f(0,0,1,1) );
			}			
		}

		D("shape create contour len="+ui.contours.length+", pos="+JSON.stringify(this.getPosition()));
	},
	setBlendFunc:function(src, dst){},
	xuiUpdate:function(){}
});

XUI.TextSprite = cc.LabelTTF.extend({
	ui:null,
	ctor:function(ui){
		this._super();	

		this.ui = ui;		
		
		var alignment = ui.alignment;
		if(alignment=="center"){
			alignment=cc.TEXT_ALIGNMENT_CENTER;
		}
		else if(alignment=="left"){
			alignment=cc.TEXT_ALIGNMENT_LEFT;
		}
		else if(alignment=="right"){
			alignment=cc.TEXT_ALIGNMENT_RIGHT;	
		}

		
		// to rgb		
		var ccFontDef = {};
		ccFontDef.fontName = "Arial";
		ccFontDef.fontSize = ui.fontSize;
		ccFontDef.fontAlignmentH = alignment;

		var color = ui.fillColor;
		ccFontDef.fontFillColor = {	"r":parseInt(color.substr(1, 2), 16),
					 				"g":parseInt(color.substr(3, 2), 16),
					 				"b":parseInt(color.substr(5, 2), 16)};
		ccFontDef.fontDimensions = {"width":ui.width, 
									"height":ui.height};

		// must before set 
		this.initWithStringAndTextDefinition(ui.embedString, ccFontDef);
		this.setColor(ccFontDef.fontFillColor);

		XUI.setCoord(this, ui);

		this.setScaleX(ui.scaleX);
		this.setScaleY(ui.scaleY);

		D("text create "+ui.embedString+", pos="+JSON.stringify(this.getPosition())+", fontname="+ui.fontName+",fontSize="+ui.fontSize);
	},
	setBlendFunc:function(src, dst){},
	xuiUpdate:function(){
		//D("tex update");
	},
	rotate:function(angle){
		XUI.transform(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
	}
});

XUI.InputText = cc.EditBox.extend({
	ui:null,
	ctor:function(ui){
		this._super(cc.size(ui.width, ui.height));
		this.init();

		this.ui = ui;
		
		XUI.setCoord(this, ui);
		this.setText(ui.embedString);
		this.setFontColor(cc.c3b(200, 200, 0));

		if("password"==ui.lineType){
			this.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
		}
		D("InputText create");
	},
	setBlendFunc:function(src, dst){},
	xuiUpdate:function(){
		//D("input update");
	}
});


//XUI.CreateButton = function(ui){
//	var menu = null;
//	
//    var btn = cc.MenuItemImage.create(
//        XUI.resDir+"/"+ui.srcNormal,
//        XUI.resDir+"/"+ui.srcSelected,
//        function () {
//        	//D(menu.toSource());
//        	if(menu && menu.click){
//        		menu.click();
//        	}
//            D("button was clicked.");
//        },this);
//    
//    menu = cc.Menu.create(btn);
//    menu.setPosition(cc.p(0, 0));
//
//    btn.ui = ui;
//    XUI.setCoord(btn, ui);
//	btn.setScaleX(ui.scaleX);
//	btn.setScaleY(ui.scaleY);
//
//    menu.setBlendFunc = function(src, dst){};
//	menu.xuiUpdate = function(){
//		//D("btn update");
//	};
//	menu.rotate = function(angle){
//		XUI.transform(menu, angle, cc.p(btn.ui.transformX, btn.ui.transformY));
//	};
//
//	D("button create");
//
//	return menu;
//}

var BUTTON_IDLE = -1;
var BUTTON_BEGAN = 0;

XUI.Button = cc.Sprite.extend({   
    ui:null,
    normalSprite:null,
    selectedSprite:null,

    state:BUTTON_IDLE,

    events:null,

    isTouchEnable:null,

    addEvent:function(event, cb){
    	//D("add listener, name="+this.ui.name+",event="+event+",cb="+cb.toSource());
    	this.events[event] = cb;
    },
    containTouch:function(touch){
    	return cc.rectContainsPoint(cc.rect(0, 0, this.ui.width, this.ui.height), this.normalSprite.convertTouchToNodeSpace(touch))
    },
    ctor:function(ui){
    	this._super();
		this.ui = ui;		
		this.init();
		this.events = {};
		var self = this;

		XUI.setCoord(this, ui);
		this.setScaleX(ui.scaleX);
		this.setScaleY(ui.scaleY);

		// normal 
		this.normalSprite = cc.Sprite.create(XUI.resDir+"/"+ui.srcNormal);		
		XUI.setCoord(this.normalSprite, ui);
		this.normalSprite.setPosition(cc.p(0, 0));
		this.addChild(this.normalSprite);

		// selected
		this.selectedSprite = cc.Sprite.create(XUI.resDir+"/"+ui.srcSelected);
		XUI.setCoord(this.selectedSprite, ui);
		this.selectedSprite.setPosition(cc.p(0, 0));
		this.addChild(this.selectedSprite);

		this.selectedSprite.setVisible(false);

		this.isTouchEnable = true;

		D("Button "+JSON.stringify(this.getPosition()));
    },
    enableTouch:function(flag){
    	if(flag){
    		if(!this.isTouchEnable){
    			cc.registerTargetedDelegate(0, true, this);		
    			this.isTouchEnable = true;
    		}
    	}
    	else{
    		if (this.isTouchEnable) {
    			cc.unregisterTouchDelegate(this);
    			this.isTouchEnable = false;
    		}
    	}
    },
    onEnter:function () {
        cc.registerTargetedDelegate(0, true, this);
        this._super();
    },
    onExit:function () {
        cc.unregisterTouchDelegate(this);
        this._super();
    },
    isSelected:function(){
    	return this.state == BUTTON_BEGAN;
    },
    onTouchBegan:function (touch, event) {
        if(this.containTouch(touch)){
        	this.state = BUTTON_BEGAN;
        }
        else{
        	return false;
        }
        this.normalSprite.setVisible(false);
        this.selectedSprite.setVisible(true);
        //D("touch began btn="+this.ui.name);
        if(this.events["touch_down"]){
        	this.events["touch_down"]();
        }
        return true;
    },
    onTouchMoved:function (touch, event) {
        // If it weren't for the TouchDispatcher, you would need to keep a reference
        // to the touch from touchBegan and check that the current touch is the same
        // as that one.
        // Actually, it would be even more complicated since in the Cocos dispatcher
        // you get CCSets instead of 1 UITouch, so you'd need to loop through the set
        // in each touchXXX method.
        //cc.Assert(this._state == PADDLE_STATE_GRABBED, "Paddle - Unexpected state!");

        //var touchPoint = touch.getLocation();
        //touchPoint = cc.Director.getInstance().convertToGL( touchPoint );

        //this.setPosition(cc.p(touchPoint.x, this.getPosition().y));
        if(this.state != BUTTON_BEGAN) return;

        if(this.containTouch(touch)){
        	//do nothing        	
        	if(this.events["touch_move"]){
        		this.events["touch_move"](true);
        	}
        }
        else{
        	this.normalSprite.setVisible(true);
        	this.selectedSprite.setVisible(false);
        	this.state = BUTTON_IDLE;

        	if(this.events["touch_move"]){
        		this.events["touch_move"](false);
        	}        	
        }
        //D("touch move");
    },
    onTouchEnded:function (touch, event) {
        //cc.Assert(this._state == PADDLE_STATE_GRABBED, "Paddle - Unexpected state!");
        //this._state = PADDLE_STATE_UNGRABBED;
        //this.containsTouchLocation(touch)
        if(this.containTouch(touch)){
        	if(this.events["click"]){
        		this.events["click"]();
        	}
        	this.normalSprite.setVisible(true);
        	this.selectedSprite.setVisible(false);
        	this.state = BUTTON_IDLE;
        }
        else{
        	return;
        }
        //D("touch end, btn="+this.ui.name);
    },
    setBlendFunc:function(src, dst){},
	xuiUpdate:function(){},
	rotate:function(angle){
		XUI.transform(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
	}
});

//XUI.Button = cc.Layer.extend({
//	ui:null,
//	ctor:function(ui){
//		this._super();
//		this.ui = ui;		
//
//		XUI.setCoord(this, ui);
//		this.setScaleX(ui.scaleX);
//		this.setScaleY(ui.scaleY);
//
//		// normal 
//		var normal = this.normal = cc.Sprite.create(XUI.resDir+"/"+ui.srcNormal);		
//		//normal.setPosition(cc.p(0, 0));
//		this.addChild(normal);
//
//		// selected
//		var selected = this.selected = cc.Sprite.create(XUI.resDir+"/"+ui.srcSelected);
//		//selected.setPosition(cc.p(0, 0));
//		this.addChild(selected);
//
//		selected.setVisible(false);
//
//		this.setTouchEnabled(true);  
//		D("button create");
//	},
//	onEnter:function(){		
//		this._super();
//	},
//	onExit:function () {
//        cc.unregisterTouchDelegate(this);
//        this._super();
//        D("onExit");
//    },
//	onTouchesEnded:function (touches,event) {  
//        D("touch");
//    },
//	setBlendFunc:function(src, dst){},
//	xuiUpdate:function(){},
//	rotate:function(angle){
//		XUI.transform(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
//	}
//});

XUI.MovieClip = cc.Sprite.extend({
	ui:null,
	dom:null,
	curFrame:0,

	state:ANI_STATE_STOP,

	ctor:function(dom, ui){
		this._super();	
		this.init();

		this.ui = ui;

		this.dom = dom;

		// for rotation
		//this.setContentSize(cc.SizeZero());
		XUI.setCoord(this, ui);

		this.setScaleX(ui.scaleX);
		this.setScaleY(ui.scaleY);
		
		for(var i = 0; i < dom.length; ++i){
			this.addChild(dom[i]);
		}

		if(ui.blendMode && ui.blendMode != "normal"){
			this.setRecursiveBlendFunc(gl.SRC_ALPHA, gl.ONE);			
		}
		this.state = ANI_STATE_RUN;		
		D("mc create dom="+this.dom.length+", pos="+JSON.stringify(this.getPosition()));
	},
	setRecursiveBlendFunc:function(src, dst){
		this.setBlendFunc(src, dst);
		this.dom.map(function(element){
			element.setBlendFunc(src, dst);
		});
	},
	//onMCEnter:function(){
	//	for(var i = 0; i < this.dom.length; ++i){
	//		this.addChild(this.dom[i]);
	//	}
	//},
	xuiUpdate:function(){
		if(this.state != ANI_STATE_RUN) return;

		for(var i = 0; i < this.dom.length; ++i){
			this.dom[i].xuiUpdate(this.curFrame);
		}
		this.curFrame++;
		if(this.curFrame >= this.ui.frameLen){
			this.curFrame = 0;
		}
		//D("mc update");
	},
	rotate:function(angle){
		XUI.rotate(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
	},	
	gotoAndPlay:function(frame){
		this.state = ANI_STATE_RUN;

		if(typeof frame == "number"){
			this.curFrame = frame;
		}
		else{
			this.curFrame = frame.getStartFrame();
		}
	},
	stop:function(){
		this.state = ANI_STATE_STOP;		
	}
});

XUI.FrameSprite = cc.Layer.extend({
	duration:1,
	elements:[],
	ui:null,
	currFrame:0,

	dAngle:0,
	angleAccu:0,
	dx:0,
	xAccu:0,
	dy:0,
	yAccu:0,		

	transX:0,
	transY:0,

	startTransform:null,
	endTransform:null,

	events:null,

	clear:function(){
		currFrame = 0;
	},
	getStartFrame:function(){
		return this.ui.startFrame;
	},
	isFrameEnd:function(frameIndex){
		//D(this.ui.name+" frameindex="+frameIndex+",startFrame="+this.ui.startFrame+",durationi="+this.ui.duration);
		if(frameIndex+1 == this.ui.startFrame+this.ui.duration){
			return true;
		}
		else{
			return false;
		}
	},
	addEvent:function(event, cb){
		this.events[event] = cb;
	},
	getEventCB:function(event){
		return this.events[event];
	},
	ctor:function(elements, ui){
		this._super();
		this.init();
		this.ui = ui;
		this.events = {};

		this.setContentSize(cc.SizeZero());

		XUI.setCoord(this, ui);

		this.duration = ui.duration;
		this.elements = elements;

		if(ui.tweenType=="motion"){
			this.dAngle = (ui.endRotation-ui.startRotation)/ui.duration;

			var endTransform = this.endTransform = XUI.getPoint(ui.endTransform.x, ui.endTransform.y);
			var startTransform = this.startTransform = XUI.getPoint(ui.startTransform.x, ui.startTransform.y);

			this.dx=(endTransform.x-startTransform.x)/ui.duration;
			this.dy=(endTransform.y-startTransform.y)/ui.duration;

			this.transX = startTransform.x;
			this.transY = startTransform.y;
		}
		
		for(var i = 0;i < this.elements.length; ++i){
			this.addChild(this.elements[i]);
		};

		D("Frame create elements= "+this.elements.length+", pos="+JSON.stringify(this.getPosition()));
	},
	setBlendFunc:function(src, dst){
		this.elements.map(function(element){
			element.setBlendFunc(src, dst);
		});
	},
	//onFrameEnter:function(){
	//	for(var i = 0;i < this.elements.length; ++i){
	//		this.addChild(this.elements[i]);
	//	};
	//	//D("on Enter");
	//},
	//onFrameEnd:function(){
	//	for(var i = 0;i < this.elements.length; ++i){
	//		this.removeChild(this.elements[i], true);
	//	};
	//	this.clear();
	//},
	xuiUpdate:function(){
		for(var i = 0; i < this.elements.length; ++i){
			this.elements[i].xuiUpdate();
		}
		// todo: matrix
		if(this.ui.tweenType){
			if(this.currFrame >= this.duration){
				this.currFrame=0;
				this.angleAccu=0;
				this.xAccu=0;
				this.yAccu=0;
			}

			this.currFrame++;
			this.angleAccu+=this.dAngle;
			this.xAccu+=this.dx;
			this.yAccu+=this.dy;

			XUI.transform(this.elements[0], this.angleAccu, cc.p(this.transX, this.transY), 
				new cc.AffineTransform(1,0,0,1,this.xAccu,this.yAccu));

			//D("x"+this.xAccu+",y="+this.yAccu+",angle="+this.angleAccu);
		}
		//D("frame update");			
	},
});

XUI.Layer = cc.Layer.extend({
	frames:[],
	frameIndex:0,
	ui:null,
	lastFrameInst:null,

	ctor:function(frames, ui){
		this._super();
		this.init();

		this.setContentSize(cc.SizeZero());

		this.frames = frames;
		this.ui = ui;

		XUI.setCoord(this, ui);

		for(var i = 0; i < this.frames.length; ++i){
			this.addChild(this.frames[i]);
			this.frames[i].setVisible(false);
		}		
		
		D("Layer create frames="+this.frames.length+", pos="+JSON.stringify(this.getPosition()));
	},
	setBlendFunc:function(src, dst){
		this.frames.map(function(frame){
			frame.setBlendFunc(src, dst);
		});
	},
	getFrame:function(frameIndex){
		for(var i=0; i < this.frames.length; ++i){
			var frame = this.frames[i];
			if(frame.ui.startFrame <= frameIndex && frameIndex < frame.ui.startFrame+frame.ui.duration){
				return frame;
			}
		}
		return null;
	},
	xuiUpdate:function(curFrame){
		//D("layer update");
		//D("layer="+this.ui.name+",frameindex="+curFrame);
		var frame = this.getFrame(curFrame);
		//frame?D("frame start="+frame.startFrame+",dur="+frame.duration):D("frameindex="+curFrame+" overpass framelen="+this.ui.frameLen);
		if(this.lastFrameInst != frame){
			if(this.lastFrameInst){
				//this.removeChild(this.lastFrameInst, true);
				this.lastFrameInst.setVisible(false);				
			}
			this.lastFrameInst = frame;				
			if(frame){
				//this.addChild(frame);
				frame.setVisible(true);
				if(frame.getEventCB("enter")){
					frame.getEventCB("enter")();
				}
			}				
		}

		if(frame){
			frame.xuiUpdate();
		}

		if(frame.isFrameEnd(curFrame)){
			if(frame.getEventCB("over")){
				frame.getEventCB("over")();
				//D("frame over");
			}
		}
	}
});

var ANI_STATE_RUN = 0;
var ANI_STATE_STOP = 1;

XUI.DOM = cc.Layer.extend({
	layers:null,
	ui:null,
	curFrame:0,

	state:ANI_STATE_STOP,

	ctor:function(layers, ui){
		this._super();
		this.init();

		XUI.setCoord(this, ui);

		this.setContentSize(cc.SizeZero());

		this.layers = layers;
		this.ui = ui;			

		this.setAnchorPoint(cc.p(0, 1));
		this.setPosition(cc.p(0+winSize.width/2-this.ui.width/2, winSize.height-(winSize.height/2-this.ui.height/2)));

		for(var i = 0; i < layers.length; ++i){
			this.addChild(layers[i]);
		}

		D("Dom create layers="+layers.length+", pos="+JSON.stringify(this.getPosition()));

		//this.schedule(this.xuiUpdate);	
		this.xuiUpdate();
	},
	xuiUpdate:function(){
		//D("Dom update");
		//D("dom xui update frame="+this.curFrame);
		for(var i = 0; i < this.layers.length; ++i){
			this.layers[i].xuiUpdate(this.curFrame);
			//D("layer "+i+" update");
		}
		this.curFrame++;
		if(this.curFrame >= this.ui.frameLen){
			this.curFrame = 0;
		}		
	},
	startUpdate:function(){
		this.schedule(this.xuiUpdate);
		this.state = ANI_STATE_RUN;
	},
	stopUpdate:function(){
		this.unschedule(this.xuiUpdate);
		this.state = ANI_STATE_STOP;
	},
	gotoAndPlay:function(frame){
		if(this.state != ANI_STATE_RUN){
			this.startUpdate();
		}
		if(typeof frame == "number"){
			this.curFrame = frame;
		}
		else{
			this.curFrame = frame.getStartFrame();
		}
	},
	stop:function(){
		if(this.state != ANI_STATE_STOP){
			this.stopUpdate();	
		}		
	}
});


XUI.transform = function(item, angle, p0, additional){
	var pos = item.getPosition();		

	var radian = XUI.angle2Radian(angle);
	var cosRadian = Math.cos(radian);
	var sinRadian = Math.sin(radian);

	var t1 = new cc.AffineTransform(1, 0, 0, 1, -p0.x, -p0.y);
	var t2 = new cc.AffineTransform(cosRadian, -sinRadian, sinRadian, cosRadian, 0, 0);
	var t3 = new cc.AffineTransform(1, 0, 0, 1, p0.x, p0.y);

	item.setRotation(angle);
	var finalTrans = cc.AffineTransformConcat(cc.AffineTransformConcat(t1, t2), t3);
	if(additional){
		finalTrans = cc.AffineTransformConcat(finalTrans, additional);
	}
	var newPos = cc.PointApplyAffineTransform(pos, finalTrans);
	item.setAdditionalTransform(new cc.AffineTransform(1, 0, 0, 1, newPos.x-pos.x, newPos.y-pos.y));
}

XUI.angle2Radian = function(angle){
	return angle * 2 * Math.PI / 360;
}

XUI.middle = function(start, end, pos){
	if(start <= end){
		return start <= pos && pos <= end;
	}
	else{
		return start > pos && pos > end;
	}
}

XUI.filterResource = function(ui){		
	if(ui.type=="bitmap" || ui.type=="button"){
		//D(ui.src);
		return [ui.src];
	}
	else if(ui.type=="dom"){
		var ret = [];
		for(var i = 0; i < ui.layers.length; ++i){
			ret = ret.concat(XUI.filterResource(ui.layers[i]));
		}
		return ret;
	}
	else if(ui.type=="layer"){
		var ret = [];
		for(var i = 0; i < ui.frames.length; ++i){
			ret = ret.concat(XUI.filterResource(ui.frames[i]));
		}
		return ret;	
	}
	else if(ui.type=="frame"){
		var ret = [];
		for(var i = 0; i < ui.elements.length; ++i){
			var xxx = XUI.filterResource(ui.elements[i]);
			//D(JSON.stringify(xxx));
			ret = ret.concat(xxx);
		}
		//D(JSON.stringify(ret));
		return ret;		
	}
	else if(ui.type=="graphic" || ui.type=="movie clip"){
		var ret = [];
		for(var i = 0; i < ui.dom.length; ++i){
			ret = ret.concat(XUI.filterResource(ui.dom[i]));
		}
		return ret;			
	}
	else{
		//alert("filter resource "+ui.type);
		return [];
	}
}