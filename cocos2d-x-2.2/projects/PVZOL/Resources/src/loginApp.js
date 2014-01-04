var LoginScene = cc.Scene.extend({
    charName:null,
    start:null,
    dom:null,
    randomName:null,

    ctor:function() {
        this._super();
    },

    onEnter:function () {
        this._super();    
        
        //var ws = new WebSocket("ws://localhost:8888");
        ////ws.binaryType = "arraybuffer";
        //ws.onopen = function(){
        //	D("onopen");
        //	ws.send("hello");
        //}
        //ws.onmessage = function(evt){
        //	D("message "+evt.data);
        //}

        //var i = 0;
        //var t = function(){
        //	D("t"+i);
        //	i+=1;
        //	if(i == 3){
        //		clearInterval(t);
        //	}
        //}
        //setInterval(t, 1);
        var dom = this.dom = new XUI();
        dom.init(login);

        this.addChild(dom.getDOM());

        this.charName = dom.getNode("name");
        //D("name ui = "+JSON.stringify(this.charName.ui));

        this.start = dom.getNode("start");
        this.randomName = dom.getNode("randomName");
        var self = this;
        this.start.click = function(){
        	self.startGame();
        };
    },
    startGame:function(){
        session.start("1234");
    }
});

