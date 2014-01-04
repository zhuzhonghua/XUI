var XUI = function(ui){
	if(! this instanceof XUI){
		return new XUI(ui);
	}
	this.attr = {};
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
		}
		return inst;
	}
	else if(ui.type=="shape"){
		var inst = new XUI.ShapeNode(ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
		}
		return inst;
	}
	else if(ui.type=="button"){
		var inst = new XUI.Button(ui);
		if(ui.name && ui.name.length > 0){
			self.attr[ui.name] = inst;
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
		}
		return inst;
	}
	else{
		alert("XUI.load not support type "+ui.type);
		return [];
	}
}

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

}

XUI.getPoint = function(x, y){
	// scale = winsize/fla.size
	//x = x*winScaleX;
	//y = y*winScaleY;
	//return cc.p(x, winSize.height-y)
	return cc.p(Math.round(x), -1*Math.round(y));
}

XUI.BitmapSprite = cc.Sprite.extend({
	ui:null,
	ctor:function(ui){
		this._super();
		this.ui = ui;

		this.initWithFile("res/"+ui.src);			
		XUI.setCoord(this, ui);
		this.setScaleX(ui.scaleX);
		this.setScaleY(ui.scaleY);

		D("bitmap create "+ui.src+", pos="+JSON.stringify(this.getPosition()));
	},
	init:function(){
		this._super();
	},
	xuiUpdate:function(){},
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
		// must before set 
		this.initWithString(ui.embedString, null, ui.fontSize, {"width":ui.width, "height":ui.height}, alignment);

		XUI.setCoord(this, ui);

		this.setScaleX(ui.scaleX);
		this.setScaleY(ui.scaleY);

		D("text create "+ui.embedString+", pos="+JSON.stringify(this.getPosition())+", fontname="+ui.fontName+",fontSize="+ui.fontSize);
	},
	xuiUpdate:function(){},
	rotate:function(angle){
		XUI.transform(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
	}
});

XUI.InputText = cc.EditBox.extend({
	ui:null,
	ctor:function(ui){
		this._super(cc.size(ui.width, ui.height));

		this.ui = ui;
		
		XUI.setCoord(this, ui);
		this.setText(ui.embedString);
		this.setFontColor(cc.c3b(255, 250, 0));

		if("password"==ui.lineType){
			this.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
		}
	},
	xuiUpdate:function(){}
});


//XUI.CreateButton = function(ui){
//	var menu = null;
//	
//    var btn = cc.MenuItemImage.create(
//        "res/"+ui.srcNormal,
//        "res/"+ui.srcSelected,
//        null,
//        function () {
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

XUI.Button = cc.Menu.extend({
	ui:null,
	ctor:function(ui){
		this._super();
		this.ui = ui;
		
        var btn = cc.MenuItemImage.create(
            "res/"+ui.srcNormal,
            "res/"+ui.srcSelected,
            function () {
                D("btn");
            },this);
        btn.setAnchorPoint(cc.p(0, 1));

        this.initWithItems([btn]);

		XUI.setCoord(btn, ui);
		btn.setScaleX(ui.scaleX);
		btn.setScaleY(ui.scaleY);

		this.setPosition(cc.p(0, 0));

		D("button create "+ui.srcNormal+", "+ui.srcSelected);
	},
	xuiUpdate:function(){},
	rotate:function(angle){
		XUI.transform(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
	}
});

XUI.MovieClip = cc.Sprite.extend({
	ui:null,
	dom:null,
	curFrame:0,

	ctor:function(dom, ui){
		this._super();	
		this.ui = ui;

		this.dom = dom;

		// here
		this.init();
		// for rotation
		//this.setContentSize(cc.SizeZero());
		XUI.setCoord(this, ui);

		this.setScaleX(ui.scaleX);
		this.setScaleY(ui.scaleY);

		if(ui.blendMode && ui.blendMode != "normal"){
			this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
		}

		for(var i = 0; i < dom.length; ++i){
			this.addChild(dom[i]);
		}

		D("mc create dom="+this.dom.length+", pos="+JSON.stringify(this.getPosition()));
	},
	//onMCEnter:function(){
	//	for(var i = 0; i < this.dom.length; ++i){
	//		this.addChild(this.dom[i]);
	//	}
	//},
	xuiUpdate:function(){
		for(var i = 0; i < this.dom.length; ++i){
			this.dom[i].xuiUpdate(this.curFrame);
		}
		this.curFrame++;
		if(this.curFrame >= this.ui.frameLen){
			this.curFrame = 0;
		}
	},
	rotate:function(angle){
		XUI.rotate(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
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
	clear:function(){
		currFrame = 0;
	},
	ctor:function(elements, ui){
		this._super();
		this.ui = ui;

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
	}
});

XUI.Layer = cc.Layer.extend({
	frames:[],
	frameIndex:0,
	ui:null,
	lastFrameInst:null,

	ctor:function(frames, ui){
		this._super();
		this.setContentSize(cc.SizeZero());

		this.frames = frames;
		this.ui = ui;

		XUI.setCoord(this, ui);

		//if(this.frames.length > 0){
		//	this.addChild(this.frames[0]);
		//	//if(this.frames[0].onFrameEnter){
		//	//	this.frames[0].onFrameEnter();
		//	//}				
		//}
		
		D("Layer create frames="+this.frames.length+", pos="+JSON.stringify(this.getPosition()));
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
		//D("layer="+this.ui.name+",frameindex="+curFrame);
		var frame = this.getFrame(curFrame);
		//frame?D("frame start="+frame.startFrame+",dur="+frame.duration):D("frameindex="+curFrame+" overpass framelen="+this.ui.frameLen);
		if(this.lastFrameInst != frame){
			if(this.lastFrameInst){
				this.removeChild(this.lastFrameInst, true);
			}
			this.lastFrameInst = frame;				
			if(frame){
				this.addChild(frame);
			}				
		}

		if(frame){
			frame.xuiUpdate();
		}
	}
});

XUI.DOM = cc.Layer.extend({
	layers:null,
	ui:null,
	curFrame:0,

	ctor:function(layers, ui){
		this._super();
		this.setContentSize(cc.SizeZero());

		this.layers = layers;
		this.ui = ui;			

		this.setAnchorPoint(cc.p(0, 1));
		this.setPosition(cc.p(0+winSize.width/2-this.ui.width/2, winSize.height-(winSize.height/2-this.ui.height/2)));

		for(var i = 0; i < layers.length; ++i){
			this.addChild(layers[i]);
		}

		D("Dom create layers="+layers.length+", pos="+JSON.stringify(this.getPosition()));

		this.schedule(this.xuiUpdate);	
	},
	init:function(){
	},
	xuiUpdate:function(){
		//D("dom xui update frame="+this.curFrame);
		for(var i = 0; i < this.layers.length; ++i){
			this.layers[i].xuiUpdate(this.curFrame);
			//D("layer "+i+" update");
		}
		this.curFrame++;
		if(this.curFrame >= this.ui.frameLen){
			this.curFrame = 0;
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
		//D(ui);
		return [ui.srcNormal,ui.srcSelected];
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