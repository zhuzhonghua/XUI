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
 var i = 0;
var testScene = cc.Scene.extend({
    layer1:null,
    myUpdate:function(layer){
    	//layer.setRotation(layer.getRotation()+5);
    	//D(layer.isIgnoreAnchorPointForPosition());
    	this.rotate(layer, i+=5, cc.p(152, -112));
	},
	angle2Radian:function(angle){
		return angle * 2 * Math.PI / 360;
	},
	rotate:function(item, angle, p0){
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
	},	
    onEnter:function () {
        this._super();

		

		//var tt = cc.Sprite.create("res/"+testFla1.src);
		//tt.setAnchorPoint(cc.p(0, 1))
		//tt.setPosition(cc.p(0, 768));
		//this.addChild(tt);
		//var dom = cc.Layer.create();
		//
		//dom.setAnchorPoint(cc.p(0, 1));
		//dom.setPosition(cc.p(0, 380));
		//this.addChild(dom);		
		////dom.setRotation(90);
		//dom.setContentSize(cc.SizeZero());
////////
		//
		//var layer= cc.Layer.create();
		//layer.setAnchorPoint(cc.p(0, 1));
		//layer.setPosition(cc.p(88, -48));
		//layer.setContentSize(cc.SizeZero());
		//dom.addChild(layer);
//
		//var bm1 = cc.Sprite.create("res/"+testFla1.src);
		//bm1.setAnchorPoint(cc.p(0, 1));		
		//bm1.setPosition(cc.p(0, 0));
		//layer.addChild(bm1);
//
		////this.rotate(layer, 45, );
////
		//var self = this;
		//setInterval(function(){
		//	self.myUpdate(layer);
		//}, 100);

		//var layer2 = cc.Layer.create();
		//layer2.setAnchorPoint(cc.p(0, 1));
		//layer2.setPosition(cc.p(168, -3));
		//dom.addChild(layer2);
//
		//var bm2 = cc.Sprite.create("res/"+testFla2.src);
		//bm2.setAnchorPoint(cc.p(0, 1));
		//bm2.setPosition(cc.p(0, 0));
		//layer2.addChild(bm2);

		//var dom = cc.Layer.create();
		//dom.setAnchorPoint(cc.p(0, 1));
		//dom.setPosition(cc.p(0, 450));		
		//this.addChild(dom);
//
		//var layer = cc.Layer.create();
		//layer.setAnchorPoint(cc.p(0, 1));
		//layer.setPosition(cc.p(0, 0));
		//dom.addChild(layer);
////
		//var frame = cc.Layer.create();
		//frame.setAnchorPoint(cc.p(0, 1));
		//frame.setPosition(cc.p(0, 0));
		//layer.addChild(frame);
////
		//var mc = cc.Layer.create();
		//mc.setAnchorPoint(cc.p(0, 1));
		////mc.setPosition(cc.p(57, 64));
		//mc.setPosition(cc.p(57, -64));
		//frame.addChild(mc);
////
		//layer = cc.Layer.create();
		//layer.setAnchorPoint(cc.p(0, 1));
		//layer.setPosition(cc.p(0, 0));
		//mc.addChild(layer);
////
		//frame = cc.Layer.create();
		//frame.setAnchorPoint(cc.p(0, 1));
		//frame.setPosition(cc.p(0, 0));
		//layer.addChild(frame);
//
		//var bm = cc.Sprite.create("res/"+testFla1.src);
		//bm.setAnchorPoint(cc.p(0, 1));
		//bm.setPosition(cc.p(0, 0));
		//frame.addChild(bm);

		//if(testFla.width){
		//	winScaleX = winSize.width/testFla.width;			
		//}
		//if(testFla.height){
		//	winScaleY = winSize.height/testFla.height;
		//}
		//
        this.layer = XUI.load(testFla);
        this.layer.init();
        
        this.addChild(this.layer);
    }
});

