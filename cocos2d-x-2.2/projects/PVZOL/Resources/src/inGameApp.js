var WALK_STATE = 0;
var JUMP_STATE = 1;
var DOWN_STATE = 2;

var InGameScene = cc.Scene.extend({
    bkg:[],
    char:null,

    walkStart:null,
    walkEnd:null,
    jumpStart:null,
    jumpEnd:null,
    downStart:null,
    downEnd:null,

    walkState:null,
    jumpState:null,
    downState:null,

    btnJump:null,
    btnDown:null,

    _tScore:null,
    _nScore:0,

    ctor:function() {
        this._super();
    },
    onEnter:function () {
        this._super();        

        // load bkg
        var bkgDom = new XUI();
        bkgDom.init(bkg);       
        var tmp = bkgDom.getDOM();
        this.bkg.push(tmp);
        this.addChild(tmp);
        // collision to update score
        tmp.collisions = [];
        var ball = bkgDom.getNode("ball_1");
        tmp.collisions.push(ball);    

        // load second bkg to loop bkg
        bkgDom = new XUI();
        bkgDom.init(bkg);
        tmp = bkgDom.getDOM();
        this.bkg.push(tmp);
        // set pos to most right
        var tmpPos = tmp.getPosition();
        tmp.setPosition(cc.p(winSize.width, tmpPos.y));        
        this.addChild(tmp);
        // collision to update score
        tmp.collisions = [];
        tmp.collisions.push(bkgDom.getNode("ball_1"));

        // load char
        var charDom = new XUI();
        charDom.init(char);
        this.char = charDom.getDOM();
        this.addChild(this.char);

        this.char.startUpdate();

        // move char to ground
        this.char.setPosition(cc.p(0, 300));

        var self = this;

        // char move to center 
        var oriPos = this.char.getPosition();

        var mt = cc.MoveTo.create(1.0, cc.p(winSize.width/2, oriPos.y));        
        var cb = cc.CallFunc.create(function(){self.movedToCenterChar();});

        this.char.runAction(cc.Sequence.create(mt, cb));
        this.char.colision_state = WALK_STATE;

        // walk start end , jump start end
        this.walkStart = charDom.getNode("walk_start");
        this.walkEnd = charDom.getNode("walk_end");
        this.jumpStart = charDom.getNode("jump_start");
        this.jumpEnd = charDom.getNode("jump_end");
        this.downStart = charDom.getNode("down_start");
        this.downEnd = charDom.getNode("down_end");

        // state to collision ball
        this.walkState = charDom.getNode("walk_state");
        this.jumpState = charDom.getNode("jump_state");
        this.downState = charDom.getNode("down_state");

        this.walkEnd.addEvent("over", function(){
            self.char.gotoAndPlay(self.walkStart);
            self.char.colision_state = WALK_STATE;
        });
        this.jumpEnd.addEvent("over", function(){
            self.char.gotoAndPlay(self.walkStart);
            self.char.colision_state = WALK_STATE;
        });
        this.downEnd.addEvent("over", function(){
            if(self.btnDown.isSelected()){
                self.char.stop();
            }
            else{
                self.char.gotoAndPlay(self.walkStart);
                self.char.colision_state = WALK_STATE;
            }            
        });

        // load control button
        var ctlXUI = new XUI();
        ctlXUI.init(control);
        var ctlDOM = ctlXUI.getDOM();
        this.addChild(ctlDOM);

        this.btnJump = ctlXUI.getNode("btnJump");
        this.btnDown = ctlXUI.getNode("btnDown");
        this.btnStop = ctlXUI.getNode("btnStop");

        this._tScore = ctlXUI.getNode("t_score");
        this._tScore.setString("0");
        this._nScore = 0;

        this.btnStop.addEvent("click", function(){
            D("stop click");
            self.gameOver();
        })

        this.btnJump.addEvent("click", function(){
            self.charJump();
            self.char.colision_state = JUMP_STATE;
        });


        this.btnDown.addEvent("touch_down", function(){
            self.charDown();
            self.char.colision_state = DOWN_STATE;
        });
        this.btnDown.addEvent("touch_move", function(in_rect){
            if(!in_rect){
                self.char.gotoAndPlay(self.walkStart);
                self.char.colision_state = WALK_STATE;
            }
        });
        this.btnDown.addEvent("click", function(){            
            self.char.gotoAndPlay(self.walkStart);
            self.char.colision_state = WALK_STATE;
        });
    },
    update:function(){
        this.updateBkg();
        this.checkCollision();
    },
    movedToCenterChar:function(){
        //this.char.gotoAndPlay();
        D("move char to center ");
        var self = this;
        this.schedule(this.update);
        //setInterval(function(){
        //    var tmp = self.bkg[0].collisions[0];
        //    D("tmp name="+tmp.name);
        //    D("tmpPos="+JSON.stringify(tmp.getPosition()));
        //    D("pos="+JSON.stringify(tmp.convertToWorldSpace(cc.p(0, -62))));
        //}, 1);
        //var tmp = this.bkg[0];
        //var tmpPos = tmp.getPosition();
        //tmp.setPosition(cc.p(tmpPos.x-200, tmpPos.y));
//
        //tmp = this.bkg[1];
        //tmpPos = tmp.getPosition();
        //tmp.setPosition(cc.p(tmpPos.x-200, tmpPos.y));
    },
    checkCollision:function(){
        var charState = null;
        if(this.char.colision_state == WALK_STATE){
            charState = this.walkState;
        }
        else if(this.char.colision_state == JUMP_STATE){
            charState = this.jumpState;
        }
        else{
            //D("down state");
            charState = this.downState;
        }

        var charPos = charState.convertToWorldSpace(cc.p(0, 0));
        var charRect = cc.rect(charPos.x, charPos.y-charState.getHeight(), charState.getWidth(), charState.getHeight());
        //if(this.char.colision_state == DOWN_STATE){
        //    D("rect="+JSON.stringify(charRect));
        //}

        for(var i = 0; i < this.bkg.length; ++i){
            var tmp = this.bkg[i];
            for(var j = 0; j < tmp.collisions.length; ++j){
                var colin = tmp.collisions[j];
                if(!colin.isVisible()) continue;
                
                var colinPos = colin.convertToWorldSpace(cc.p(0, 0));
                var colinRect = cc.rect(colinPos.x, colinPos.y-colin.getHeight(), colin.getWidth(), colin.getHeight());
                
                //if(this.char.colision_state==DOWN_STATE){
                //    D("colin rect="+JSON.stringify(colinRect));
                //}

                if(cc.rectIntersectsRect(charRect, colinRect)){
                    //D("collision");
                    colin.setVisible(false);
                    this._nScore += 1;
                    this._tScore.setString(""+this._nScore);
                }
            }
        }
    },
    resetCollision:function(item){
        for (var i = 0; i < item.collisions.length; i++) {
            item.collisions[i].setVisible(true);
        };
    },
    updateBkg:function(){
        for(var i = 0; i < this.bkg.length; ++i){
            var tmp = this.bkg[i];
            var tmpPos = tmp.getPosition();

            // move bkg to left
            tmp.setPosition(cc.p(tmpPos.x-10, tmpPos.y));
            tmpPos = tmp.getPosition();

            // if move outof screen, move to right most
            if(tmpPos.x < -1 * winSize.width){
                tmp.setPosition(cc.p(winSize.width, tmpPos.y));
                this.resetCollision(tmp);
            }
        }
    },
    charJump:function(){
        //D("char jump");
        this.char.gotoAndPlay(this.jumpStart);

        var mb = cc.MoveBy.create(0.3, cc.p(0, 100));
        var mb2= cc.MoveBy.create(0.3, cc.p(0, -100));

        this.char.runAction(cc.Sequence.create(mb, mb2));
    },
    charDown:function(){
        this.char.gotoAndPlay(this.downStart);  
    },
    gameOver:function(){
        this.unschedule(this.update);
        this.char.stopUpdate();


        D("score ================");
        D(score.width);
        D(score.height);

        var endXUI = new XUI();        
        endXUI.init(score);
        var endDOM = endXUI.getDOM();
        endDOM.setPosition(cc.p(winSize.width/2-endDOM.getWidth()/2, winSize.height/2+endDOM.getHeight()/2));
        this.addChild(endDOM);

        var endBtn = endXUI.getNode("btn_game_over");
        var t_score = endXUI.getNode("t_score");
        t_score.setString(""+this._nScore);
        endBtn.addEvent("click", function(){
            director.end();
        });
    }
});

