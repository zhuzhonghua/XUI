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
//var i = 0;
//
//var data={
//	"duration": 49,
//    "startRotation": 0,
//    "endRotation": 90,
//    "startTransform": {
//        "x": 55.75,
//        "y": -95
//      },
//      "endTransform": {
//        "x": 251.7,
//        "y": -255
//      }
//}
//
//var dAngle=(data.endRotation-data.startRotation)/data.duration;
//D("angle="+dAngle);
//
//var dx=(data.endTransform.x-data.startTransform.x)/data.duration;
//var dy=(data.endTransform.y-data.startTransform.y)/data.duration;
//D("dx="+dx+",dy="+dy);
//
//var x=0,y=0;
//
//var transX=data.startTransform.x, transY=data.startTransform.y;
//var endTransX=data.endTransform.x, endTransY=data.endTransform.y;
//var startRota=data.startRotation, endRota=data.endRotation;
//
//var angle=0;
//
//var middle = function(start, end, pos){
//	if(start <= end){
//		return start <= pos && pos <= end;
//	}
//	else{
//		return start > pos && pos > end;
//	}
//}
//var angle2Radian = function(angle){
//	return angle * 2 * Math.PI / 360;
//}
//
//var MySprite = cc.Sprite.extend({
//	newP:null,
//	visit:function(){
//		this._super();
//		if(this.newP){
//			this.setPosition(this.newP);
//			this.newP = null;
//		}
//	},
//	rotate:function(angle, p0){
//		this.setRotation(angle);
//
//		var pos = this.getPosition();		
//
//		var radian = angle2Radian(angle);
//		var cosRadian = Math.cos(radian);
//		var sinRadian = Math.sin(radian);
//
//		var t1 = new cc.AffineTransform(1, 0, 0, 1, -p0.x, -p0.y);
//		var t2 = new cc.AffineTransform(cosRadian, -sinRadian, sinRadian, cosRadian, 0, 0);
//		var t3 = new cc.AffineTransform(1, 0, 0, 1, p0.x, p0.y);
//
//		var finalTrans = cc.AffineTransformConcat(cc.AffineTransformConcat(t1, t2), t3);
//		this.newP = cc.PointApplyAffineTransform(pos, finalTrans);
//	}
//});

var BezierDrawNodeExt = cc.DrawNode.extend({
	ctor:function(){
		this._super();
		//this.draw = this.drawCanvas;
		//this.drawQuadBezier = this.drawQuadBezierCanvas;
	},
	drawCanvas:function (ctx) {		
		var context = ctx || cc.renderContext;

        if ((this._blendFunc && (this._blendFunc.src == gl.SRC_ALPHA) && (this._blendFunc.dst == gl.ONE)))
            context.globalCompositeOperation = 'lighter';

        for (var i = 0; i < this._buffer.length; i++) {
        	var element = this._buffer[i];
            if (element.type === cc.DrawNode.TYPE_BEZIER ) {
                cc.drawingUtil.drawPoly(element.verts, element.length, false, false);
            }
        }
	},
	/**
     * draws a quad bezier path
     * @override
     * @param {cc.Point} origin
     * @param {cc.Point} control
     * @param {cc.Point} destination
     * @param {Number} segments
     */
    drawQuadBezierCanvas:function (origin, control, destination, segments) {
        var vertices = [];

        var t = 0.0;
        for (var i = 0; i < segments; i++) {
            var x = Math.pow(1 - t, 2) * origin.x + 2.0 * (1 - t) * t * control.x + t * t * destination.x;
            var y = Math.pow(1 - t, 2) * origin.y + 2.0 * (1 - t) * t * control.y + t * t * destination.y;
            vertices.push(cc.p(x , y));
            t += 1.0 / segments;
        }
        vertices.push(cc.p(destination.x, destination.y));

        var element = new cc._DrawNodeElement(cc.DrawNode.TYPE_BEZIER);
        element.verts = vertices;        
        this._buffer.push(element);
    }
});

cc.DrawNode.TYPE_BEZIER = 3;

var testScene = cc.Scene.extend({
    layer1:null,
    myUpdate:function(layer){
    	x+=dx;
    	y+=dy;
    	//angle+=dAngle;
    	angle += dAngle;

    	//var trans = new cc.AffineTransform(1,0,0,1,x,y);
    	//this.rotate(layer, angle, cc.p(transX+x, transY+y));
    	//this.rotate(layer, angle, cc.p(transX, transY));
    	this.rotate(layer, angle, cc.p(transX, transY), new cc.AffineTransform(1,0,0,1,x,y));
//
    	if(!middle(transX, endTransX, transX+x)){
    		x=0;
    	}
    	if(!middle(transY, endTransY, transY+y)){
    		y=0;
    	}
    	if(!middle(startRota, endRota, startRota+angle)){
    		angle=0;
    	}
    	//D("pos="+JSON.stringify(layer.getPosition())+",x="+x+",y="+y+",angle="+angle);
    	//D("pos="+JSON.stringify(layer.getPosition()));
	},
	
	rotate:function(item, angle, p0, addTransform){
		var pos = item.getPosition();

		var radian = angle2Radian(angle);
		var cosRadian = Math.cos(radian);
		var sinRadian = Math.sin(radian);

		var t1 = new cc.AffineTransform(1, 0, 0, 1, -p0.x, -p0.y);
		var t2 = new cc.AffineTransform(cosRadian, -sinRadian, sinRadian, cosRadian, 0, 0);
		var t3 = new cc.AffineTransform(1, 0, 0, 1, p0.x, p0.y);

		item.setRotation(angle);
		var finalTrans = cc.AffineTransformConcat(cc.AffineTransformConcat(t1, t2), t3);
		if(addTransform){
			finalTrans = cc.AffineTransformConcat(finalTrans, addTransform);
		}
		var newPos = cc.PointApplyAffineTransform(pos, finalTrans);

		item.setAdditionalTransform(new cc.AffineTransform(1, 0, 0, 1, newPos.x-pos.x, newPos.y-pos.y));
	},	
    onEnter:function () {
        this._super();
        this.init();

        //var tt = cc.Sprite.create();
        //tt.init();
    		//tt.initWithFile("bg.png");
    		//tt.setAnchorPoint(cc.p(0, 1))
    		//tt.setPosition(cc.p(0, 600));
    		//this.addChild(tt);
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

        var star = 
        {
        "type": "shape",
        "contours": [{
          "type": "contour",
          "interior": false,
          "orientation": 1,
          "edges": [{
            "x": 381.95,
            "y": 158
          },
          {
            "x": 381.95,
            "y": 212.66666666666669
          },
          {
            "x": 381.95000000000005,
            "y": 267.33333333333337
          },
          {
            "x": 381.95,
            "y": 322
          },
          {
            "x": 381.95,
            "y": 322
          },
          {
            "x": 473.95000000000005,
            "y": 322
          },
          {
            "x": 565.95,
            "y": 322.00000000000006
          },
          {
            "x": 657.95,
            "y": 322
          },
          {
            "x": 657.95,
            "y": 322
          },
          {
            "x": 657.95,
            "y": 267.33333333333337
          },
          {
            "x": 657.95,
            "y": 212.66666666666669
          },
          {
            "x": 657.95,
            "y": 158
          }]
        },
        {
          "type": "contour",
          "interior": true,
          "orientation": -1,
          "edges": [{
            "x": 381.95,
            "y": 158
          },
          {
            "x": 381.95,
            "y": 212.66666666666669
          },
          {
            "x": 381.95000000000005,
            "y": 267.33333333333337
          },
          {
            "x": 381.95,
            "y": 322
          },
          {
            "x": 381.95,
            "y": 322
          },
          {
            "x": 473.95000000000005,
            "y": 322
          },
          {
            "x": 565.95,
            "y": 322.00000000000006
          },
          {
            "x": 657.95,
            "y": 322
          },
          {
            "x": 657.95,
            "y": 322
          },
          {
            "x": 657.95,
            "y": 267.33333333333337
          },
          {
            "x": 657.95,
            "y": 212.66666666666669
          },
          {
            "x": 657.95,
            "y": 158
          }]
        }],
        "x": 519.95,
        "y": 240,
        "reg": [1, 0],
        "width": 276,
        "height": 164,
        "transformX": 519.95,
        "transformY": 240,
        "scaleX": 1,
        "scaleY": 1,
        "rotation": 0
      };
        
		
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
		//if(enterGame.width){
		//	winScaleX = winSize.width/enterGame.width;			
		//}
		//if(enterGame.height){
		//	winScaleY = winSize.height/enterGame.height;
		//}
		
        var xui = new XUI(control);
//
        this.layer = xui.getDOM();
        //this.layer.setScaleX(winScaleX);
        //this.layer.setScaleY(winScaleY);
        ////this.layer.init();
        ////this.layer.setPosition(cc.p(0, 0));
        //
        this.addChild(this.layer);
    }
});

