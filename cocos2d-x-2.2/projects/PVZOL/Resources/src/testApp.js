/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var testScene = cc.Scene.extend({
    layer1:null,
    ctor:function() {
        this._super();
    },

    onEnter:function () {
        this._super();        

        //var wsServer = 'ws://localhost:8888/';
        //var websocket = new WebSocket(wsServer);
        //websocket.binaryType = "arraybuffer";
        //websocket.onopen = function(){D("on open");};
        //websocket.onclose = function(){D("on close");};
        //websocket.onmessage = function(){D("on message");};
        //websocket.onerror = function(){D("on error");};

        //setInterval(function(){
        //  D("socket state "+websocket.readyState);
        //}, 1000);
        //var tt = cc.Sprite.create("res/testFla.png");
        //tt.setAnchorPoint(cc.p(0.5, 0.5));
        //D("x="+(winSize.width / 2));
        //D("y="+(winSize.height / 2));
//
        //tt.setPosition(cc.p(200, 300));
//
        //this.addChild(tt);

//
        //tt = cc.Sprite.create("res/testFla_sat50_400.png.png");
        //tt.setAnchorPoint(cc.p(0, 1));
        //tt.setPosition(cc.p(0, 0));
//
        //var tt2 = new cc.Sprite();
        //tt2.init();
        //tt2.setAnchorPoint(cc.p(0, 1));
        //tt2.setPosition(cc.p(0, 600));
//
        //tt2.addChild(tt);
//
        //tt2.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        //		
    		//this.addChild(tt2);
    		//
        //var ui = {"type":"text","x":2,"y":18,"reg":[0,1],"width":160.6,"height":86,"transformX":82.3,"transformY":61,"scaleX":1,"scaleY":1,"rotation":0,"name":"_desc","textType":"dynamic","fontSize":12,"fillColor":"#ffffff","fontName":"宋体","alignment":"left","embedString":"  abcdAGDCDGFG "};
        //var tex = cc.LabelTTF.create(ui.embedString, null, 12, {"width":75, "height":150});
        ////tex.setAnchorPoint(cc.p(0, 1))
        //tex.setPosition(cc.p(200, 500));
        //this.addChild(tex);

		//var layer = cc.Layer.create();
		//layer.setAnchorPoint(0, 1);
		//layer.setPosition(0, 0);
		//tt.addChild(layer);

		//for(var i = 0; i < star.contours.length; ++i){
		//	var contour = star.contours[i];
		//	
		//	var edges = JSON.parse(JSON.stringify(contour.edges));
//
		//	for(var j = 0; j < edges.length; ++j){
		//		edges[j].y = winSize.height-edges[j].y;
		//	}
		//	if(contour.color){
		//		var r=parseInt(contour.color.substr(1, 2), 16)/255;
		//		var g=parseInt(contour.color.substr(3, 2), 16)/255;
		//		var b=parseInt(contour.color.substr(5, 2), 16)/255;
////
		//		draw.drawPoly(edges, cc.c4f(r,g,b,0.5), 0.1, cc.c4f(0,0,0,1) );
		//	}
		//	else{
		//		draw.drawPoly(edges, cc.c4f(1,0,0,0.5), 0.1, cc.c4f(0,0,1,1) );
		//	}			
		//}

		//var shapeNode = new XUI.ShapeNode(star);
		//shapeNode.setPosition(0, 0);
		//this.addChild(shapeNode);
		//D(ptArray.length);		
		//for(var index = 0;index < ptArray.length; ++index){
		//	var contour = ptArray[index];
		//	var edges = contour.edges;
		//	//D("type="+contour.type+",edgeslen="+edges.length+",color="+contour.color);
		//	var i = 0;
		//	var vertices=[];
////
		//	while(i < edges.length){
		//		var vertices1 = GetQuadBezier(cc.p(edges[i], edges[i+1]), cc.p(edges[i+2], edges[i+3]), cc.p(ptArray[i+4], ptArray[i+5]));
		//		i += 6;
		//		//D(JSON.stringify(vertices1));
		//		vertices = vertices.concat(vertices1);
		//		var vertices2 = GetQuadBezier(cc.p(edges[i], edges[i+1]), cc.p(edges[i+2], edges[i+3]), cc.p(ptArray[i+4], ptArray[i+5]));
		//		i += 6;
		//		//D(JSON.stringify(vertices2));
		//		vertices = vertices.concat(vertices2);								
		//	}
		//	if(vertices.length > 2){
		//		draw.drawPoly(vertices, cc.c4f(1,0,0,0.5), 1, cc.c4f(0,0,0,1));
		//	}			
		//}

        //var src = "testFla_Balloon.png";
//
		//var tt = new cc.Sprite();
		//tt.initWithFile("res/"+src);
		//tt.setAnchorPoint(cc.p(0, 1))
		//tt.setPosition(cc.p(0, -2.35));
//
////
		//var dom = cc.Layer.create();
		//
		//dom.setAnchorPoint(cc.p(0, 1));
		//dom.setPosition(cc.p(0, 768));
		//this.addChild(dom);	
//
		//dom.addChild(tt);
//////////
		//
		//var layer= cc.Layer.create();
		//layer.setAnchorPoint(cc.p(0, 1));
		//layer.setPosition(cc.p(0, 0));
		//dom.addChild(layer);
//
		//layer.addChild(tt);
////
		//var bm1 = cc.Sprite.create("res/"+testFla1.src);
		//bm1.setAnchorPoint(cc.p(0, 1));		
		//bm1.setPosition(cc.p(0, 0));
		//layer.addChild(bm1);
//////
		////this.rotate(layer, 45, );
////////
		//this.rotate(tt, 45, cc.p(transX, transY), new cc.AffineTransform(1, 0, 0, 1, 50, -50));
		//var self = this;
		//setInterval(function(){
		//	self.myUpdate(tt);
		//}, 50);
//
		//var layer2 = cc.Layer.create();
		//layer2.setAnchorPoint(cc.p(0, 1));
		//layer2.setPosition(cc.p(168, -3));
		//dom.addChild(layer2);
//////
		//var bm2 = cc.Sprite.create("res/"+testFla2.src);
		//bm2.setAnchorPoint(cc.p(0, 1));
		//bm2.setPosition(cc.p(0, 0));
		//layer2.addChild(bm2);
//

		//var bm = cc.Sprite.create();
		//bm.initWithFile("res/"+testFla1.src);
		//bm.setAnchorPoint(cc.p(0, 1));
		//bm.setPosition(cc.p(0, 0));
////
		////var frame = cc.Layer.create();
		////frame.setContentSize(cc.SizeZero());
		////frame.setAnchorPoint(cc.p(0, 1));
		////frame.setPosition(cc.p(0, 0));
		////frame.addChild(bm);
////
		////var layer = cc.Layer.create();
		////layer.setContentSize(cc.SizeZero());
		////layer.setAnchorPoint(cc.p(0, 1));
		////layer.setPosition(cc.p(0, 0));
		////layer.addChild(frame);
////
		//var mc = cc.Layer.create();
		//mc.setContentSize(cc.SizeZero());
		//mc.setAnchorPoint(cc.p(0, 1));		
		//mc.setPosition(cc.p(73, -110));
		//mc.addChild(bm);
////
		////frame = cc.Layer.create();
		////frame.setContentSize(cc.SizeZero());
		////frame.setAnchorPoint(cc.p(0, 1));
		////frame.setPosition(cc.p(0, 0));
		////frame.addChild(mc);
////
		////layer = cc.Layer.create();
		////layer.setContentSize(cc.SizeZero());
		////layer.setAnchorPoint(cc.p(0, 1));
		////layer.setPosition(cc.p(0, 0));
		////layer.addChild(frame);
//
		//var dom = cc.Layer.create();
		//dom.setContentSize(cc.SizeZero());
		//dom.setAnchorPoint(cc.p(0, 1));
		//dom.setPosition(cc.p(0, 768));	
		//dom.addChild(mc);
////
		//this.addChild(dom);
//
		//if(testFla.width){
		//	winScaleX = winSize.width/testFla.width;			
		//}
		//if(testFla.height){
		//	winScaleY = winSize.height/testFla.height;
		//}
		//
        //var dom = xui.create(testFla);


        var dom = new XUI();
        //dom.init(score);
////
        //this.layer = dom.getDOM();


        //this.layer = cc.Layer.create();
        //D(this.layer.getTouchMode());
        //////this.layer.init();
        //this.layer.setPosition(cc.p(0, 768));
        ////
        ////D("xui loaded "+JSON.stringify(this.layer.ui));


        //this.addChild(this.layer);

        var bkg = cc.Sprite.create("res/score_Graphic_shape_645.png");
        bkg.setPosition(cc.p(100, 100));
        this.addChild(bkg);

        // to rgb		
		var ccFontDef = {};
		ccFontDef.fontName = "Arial";
		ccFontDef.fontSize = 15;
		ccFontDef.fontFillColor = {	"r":255,
					 				"g":255,
					 				"b":0};
		ccFontDef.fontDimensions = {"width":50, 
									"height":30};

        var label = cc.LabelTTF.createWithFontDefinition("999999", ccFontDef);
        label.setPosition(cc.p(100, 100));
        label.setColor({"r":255, "g":255, "b":0});
        this.addChild(label);
    }
});

