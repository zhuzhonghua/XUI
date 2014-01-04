var EnterGameScene = cc.Scene.extend({
    layer1:null,
    btnStart:null,
    btnLogo:null,

    ctor:function() {
        this._super();
    },

    onEnter:function () {
        this._super();        

        var dom = new XUI();
        dom.init(enterGame);
        this.layer = dom.getDOM();
        
        this.addChild(this.layer);

        this.btnStart = dom.getNode("btnStart");
        this.btnLogo = dom.getNode("btnLogo");

        var self = this;
        this.btnStart.addEvent("click", function(){
            self.btnStartClick();
        });
    },
    btnStartClick:function(){
    	//D(this.toSource());
    	var self = this;

    	this.btnStart.setVisible(false);
    	var btnLogoPos = this.btnLogo.getPosition();

    	var mt = cc.MoveTo.create(0.9, cc.p(btnLogoPos.x, -1 * winSize.height));    	
    	var cb = cc.CallFunc.create(function(){self.readyToStart();});

    	this.btnLogo.runAction(cc.Sequence.create(mt, cb));
    },
    readyToStart:function(){
    	D("readyToStart");
        director.replaceScene(new InGameScene());
    }
});

