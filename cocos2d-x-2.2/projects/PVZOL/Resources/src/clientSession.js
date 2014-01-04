var ClientSession = function(){
	this.ws = null;
	this.sendData = [];
	this.recvData = [];	
}
//"ws://localhost:8888"
ClientSession.prototype.connect = function(host, cb){
    var self = this;

	  var ws = this.ws = new WebSocket(host);
	  ws.onopen = function(){
        cb();
			  D("on open "+host);
        ws.onmessage = function(evt){
		        self.onMessage(evt.data);
	      }  
	  };
}

ClientSession.prototype.isConnected = function(){
    return this.ws && this.ws.readyState == 1;
}

ClientSession.prototype.send = function(data){
	this.ws.send(data);
}

ClientSession.prototype.onMessage = function(msg){
	  D("recv msg "+msg);
	  //D(msg);
	  //if(msgHandler[msg.id]){
	  //	msgHandler[msg.id](this, msg);
	  //}
    this.recvData.push(msg);
}
