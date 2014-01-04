(function(){
	if(typeof XUI !== "object"){
		XUI = {};
	}
	
	XUI.load = function(ui){
		//D("load "+ui.type);
		if(ui.type=="bitmap"){
			//D(ui.src);
			return new XUI.BitmapSprite(ui);
		}
		else if(ui.type=="button"){
			return new XUI.Button(ui);
		}
		else if(ui.type=="text"){
			return new XUI.TextSprite(ui);
		}
		else if(ui.type=="frame"){
			var ret = [];
			for(var i = 0; i < ui.elements.length; ++i){
				ret.push(XUI.load(ui.elements[i]));				
			}
			
			return new XUI.FrameSprite(ret, ui);
		}
		else if(ui.type=="layer"){
			var ret = [];
			for(var i = 0; i < ui.frames.length; ++i){
				ret.push(XUI.load(ui.frames[i]));
			}
			
			return new XUI.Layer(ret, ui);
		}
		else if(ui.type=="dom"){
			var ret = [];
			for(var i = 0; i < ui.layers.length; ++i){
				ret.push(XUI.load(ui.layers[i]));
			}

			return new XUI.DOM(ret, ui);
		}
		else if(ui.type=="graphic" || ui.type=="movie clip"){
			var ret = [];
			for(var i = 0; i < ui.dom.length; ++i){
				ret.push(XUI.load(ui.dom[i]));
			}
			
			return new XUI.MovieClip(ret, ui);
		}
		else{
			alert("XUI.load not support type "+ui.type);
			return [];
		}
	}

	XUI.setCoord = function(item, ui){
		//D(JSON.stringify(ui.reg));
		if(ui.reg){
			item.setAnchorPoint(cc.p(ui.reg[0], ui.reg[1]));
		}
		else{
			item.setAnchorPoint(cc.p(0, 1));	
		}		
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
		return cc.p(x, -y);
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
		update:function(){},
		rotate:function(angle){
			XUI.rotate(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
		}
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
			this.initWithString(ui.embedString, ui.fontName, ui.fontSize, cc.size(ui.width, ui.height), alignment);

			XUI.setCoord(this, ui);

			this.setScaleX(ui.scaleX);
			this.setScaleY(ui.scaleY);

			D("text create "+ui.embedString+", pos="+JSON.stringify(this.getPosition()));
		},
		update:function(){},
		rotate:function(angle){
			XUI.rotate(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
		}
	});
	
	XUI.Button = cc.MenuItemImage.extend({
		ui:null,
		ctor:function(ui){
			this._super();
			this.ui = ui;
			
			this.initWithNormalImage("res/"+ui.src, null, null, this);

			XUI.setCoord(this, ui);
			this.setScaleX(ui.scaleX);
			this.setScaleY(ui.scaleY);

			D("button create");
		},
		rotate:function(angle){
			XUI.rotate(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
		}
	});

	XUI.MovieClip = cc.Layer.extend({
		ui:null,
		dom:null,
		ctor:function(dom, ui){
			this._super();	
			this.ui = ui;

			this.dom = dom;

			// for rotation
			this.setContentSize(cc.SizeZero());
			XUI.setCoord(this, ui);
			//this.setRotation(ui.rotation);

			this.setScaleX(ui.scaleX);
			this.setScaleY(ui.scaleY);

			this.onMCEnter();

			D("mc create dom="+this.dom.length+", pos="+JSON.stringify(this.getPosition()));
		},
		onMCEnter:function(){
			for(var i = 0; i < this.dom.length; ++i){
				this.addChild(this.dom[i]);
			}
		},
		update:function(){
			for(var i = 0; i < this.dom.length; ++i){
				this.dom[i].update();
			}
		},
		rotate:function(angle){
			XUI.rotate(this, angle, cc.p(this.ui.transformX, this.ui.transformY));
		}
	});

	XUI.FrameSprite = cc.Layer.extend({
		duration:1,
		elements:[],
		startMatrix:null,
		endMatrix:null,

		ctor:function(elements, ui){
			this._super();

			XUI.setCoord(this, ui);

			this.duration = ui.duration;
			this.elements = elements;

			if(ui.startMatrix){
				this.startMatrix = ui.startMatrix;	
			}
			if(ui.endMatrix){
				this.endMatrix = ui.endMatrix;
			}
			D("Frame create elements= "+this.elements.length+", pos="+JSON.stringify(this.getPosition()));
		},
		onFrameEnter:function(){
			for(var i = 0;i < this.elements.length; ++i){
				this.addChild(this.elements[i]);
			};
			//D("on Enter");
		},
		onFrameEnd:function(){
			for(var i = 0;i < this.elements.length; ++i){
				this.removeChild(this.elements[i], true);
			};
		},
		update:function(){			
			for(var i = 0; i < this.elements.length; ++i){
				this.elements[i].update();
			}
			// todo: matrix
		}
	});

	XUI.Layer = cc.Layer.extend({
		frames:[],
		frameInFrame:0,
		frameIndex:0,
		ui:null,
		ctor:function(frames, ui){
			this._super();
			this.frames = frames;
			this.ui = ui;

			XUI.setCoord(this, ui);

			if(this.frames.length > 0){
				this.addChild(this.frames[0]);
				this.frames[0].onFrameEnter();
			}
			
			D("Layer create frames="+this.frames.length+", pos="+JSON.stringify(this.getPosition()));
		},

		update:function(){
			var frame = this.frames[this.frameIndex];

			this.frameInFrame++;
			if(this.frameInFrame >= frame.duration){
				this.removeChild(frame, true);
				frame.onFrameEnd();

				this.frameInFrame=0;

				this.frameIndex++;
				if(this.frameIndex >= this.frames.length){
					this.frameIndex=0;
				}

				frame = this.frames[this.frameIndex];

				this.addChild(frame);
				frame.onFrameEnter();
			}

			frame.update();
		}
	});

	XUI.DOM = cc.Layer.extend({
		layers:null,
		ui:null,
		ctor:function(layers, ui){
			this._super();

			this.layers = layers;
			this.ui = ui;			
		},
		init:function(){
			XUI.setCoord(this, this.ui);
			this.setPosition(cc.p(0+winSize.width/2-this.ui.width/2, winSize.height-(winSize.height/2-this.ui.height/2)));
			//this.setScaleX(winScaleX);
			//this.setScaleY(winScaleY);

			for(var i = 0; i < this.layers.length; ++i){
				this.addChild(this.layers[i]);
			}

			D("Dom create layers="+this.layers.length+", pos="+JSON.stringify(this.getPosition()));

			//this.schedule(this.update);	
		},
		update:function(){
			for(var i = 0; i < this.layers.length; ++i){
				this.layers[i].update();
				//D("layer "+i+" update");
			}
		}
	});

	XUI.rotate = function(item, angle, p0){
		var pos = item.getPosition();		

		var radian = this.angle2Radian(angle);
		var cosRadian = Math.cos(radian);
		var sinRadian = Math.sin(radian);

		var t1 = new cc.AffineTransform(1, 0, 0, 1, -p0.x, -p0.y);
		var t2 = new cc.AffineTransform(cosRadian, -sinRadian, sinRadian, cosRadian, 0, 0);
		var t3 = new cc.AffineTransform(1, 0, 0, 1, p0.x, p0.y);

		item.setRotation(angle);
		var finalTrans = cc.AffineTransformConcat(cc.AffineTransformConcat(t1, t2), t3);
		var newPos = cc.PointApplyAffineTransform(pos, finalTrans);
		item.setAdditionalTransform(new cc.AffineTransform(1, 0, 0, 1, newPos.x-pos.x, newPos.y-pos.y));
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
})();
