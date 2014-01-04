var dom = fl.getDocumentDOM();

var filePath = "file:///c:|"
var fileName = "undefined";
var originFileURI = null;

if (dom.pathURI != "undefined") {

	filePath = dom.pathURI.substr(0, dom.pathURI.lastIndexOf("/"));
	//fileName = dom.pathURI.substr(dom.pathURI.lastIndexOf("/")+l, dom.pathURI.lastIndexOf(".fla"));
	fileName = dom.name.substr(0, dom.name.lastIndexOf(".fla"));
	fileName = escapeName(fileName);

	FLfile.createFolder(filePath+"/"+fileName);
	filePath = filePath+"/"+fileName;
};

(function(){
	if (typeof JSON !== 'object') {
	    JSON = {};
	}


    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;

    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {

// Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }

}());

function JSONStringfy(item){
	var s = '';
	switch(item.constructor){
		case Array:{
			s += '[';
			var res = new Array();
			for(var o in item){
				res.push(JSONStringfy(item[o]));
			}
			s += res.join(',');
			s += ']';

			return s;
		}
		break;

		case Object:{
			s += '{';
			var res = new Array();
			for(var o in item){
				res.push(o+":"+JSONStringfy(item[o]));
			}
			s += res.join(',');
			s += '}';

			return s;
		}
		break;

		case Number:{
			return item;
		}
		break;

		case String:{
			if(item[0] == "^"){
				return item.substr(1, item.length);
			}
			else{
				return '"'+item+'"';
			}
		}
		break;

		default:
			return item;
	}
}

FlaToJson = function(){
	this.exportedLib = {};
	this.allLines = [];
	this.timeline = [];
	this.layer = [];
	this.frame = [];
	this.element = [];
}

function exportAll(){
	PClear();	
	fl.trace("exportAll");
	var ftj = new FlaToJson();
	ftj.exportAll();	
}

FlaToJson.prototype.exportAll = function(){
	PClear();
	var out = {};
	out.type = "dom";
	out.name = fileName;
	out.width = dom.width;
	out.height = dom.height;
	out.x = 0;
	out.y = 0;

	out.layers = [];
	P("start export all");
	
	this.timeline.push(dom.getTimeline());

	this.exportTimeline(dom.getTimeline(), out.layers);
	out.frameLen = Math.max.apply(null, out.layers.map(function(layer){return layer.frameLen;}));

	this.timeline.pop();
	//fl.trace(allLines.join("\n"));
	//
	var jsonFileName = filePath+"/"+fileName+".js";
	FLfile.write(jsonFileName, "var "+fileName+" ="+JSON.stringify(out));
	P("push to file " + jsonFileName);
	PFlush();
}

FlaToJson.prototype.exportTimeline = function (timeline, out){
	var nlayer = timeline.layers.length;
	P("timeline name="+timeline.name+", layers="+nlayer);
	for( var layer_index = nlayer-1; layer_index >= 0; --layer_index ){
		var curLayer = timeline.layers[layer_index];
		
		this.layer.push(layer_index);

		P("layer name="+curLayer.name+", frames="+curLayer.frames.length);

		var curLayerOut = {};
		curLayerOut.type = "layer";
		curLayerOut.x = 0;
		curLayerOut.y = 0;
		curLayerOut.name = curLayer.name;
		curLayerOut.frameLen = curLayer.frames.length;
		curLayerOut.frames = [];
		// for motion type frame
		var lastFrame = null;
		this.exportLayer(curLayer, curLayerOut.frames)
		
		//if(curLayerOut.frames.length > 0){
			out.push(curLayerOut);
		//}		

		this.layer.pop();
	}
}

FlaToJson.prototype.exportLayer = function (curLayer, out){
	for(var i = 0; i < curLayer.frames.length;++i){
		var curFrame = curLayer.frames[i];

		this.frame.push(i);
		if(i == curFrame.startFrame){
			P(i+" start frame="+curFrame.startFrame+", dur="+curFrame.duration+", elements="+curFrame.elements.length);
			//if(curFrame.elements.length <= 0){
			//	continue;
			//}
			var keyFrameOut = {};
			keyFrameOut.type = "frame";
			keyFrameOut.x = 0;
			keyFrameOut.y = 0;
			keyFrameOut.startFrame=curFrame.startFrame;

			if(curFrame.name && curFrame.name.length > 0){
				keyFrameOut.name = curFrame.name;
			}
			
			keyFrameOut.elements = [];

			var nelement = curFrame.elements.length;
			for( var element_index = 0; element_index < nelement; ++element_index ){
				var element = curFrame.elements[element_index];
				var ret = this.exportItem( element );
				if(ret){
					keyFrameOut.elements.push(ret);
				}				
			}

			keyFrameOut.duration = curFrame.duration;

			// motion type motion
			if("motion" == curFrame.tweenType){
				var endFrameIndex = curFrame.startFrame+curFrame.duration;
				if(endFrameIndex < curLayer.frames.length){
					var endFrame = curLayer.frames[endFrameIndex];
					
					keyFrameOut.startMatrix = curFrame.elements[0].matrix;
					keyFrameOut.endMatrix = endFrame.elements[0].matrix;

					keyFrameOut.startRotation = curFrame.elements[0].rotation;
					keyFrameOut.endRotation = endFrame.elements[0].rotation;

					keyFrameOut.startTransform = {"x":curFrame.elements[0].transformX, "y":curFrame.elements[0].transformY};
					keyFrameOut.endTransform = {"x":endFrame.elements[0].transformX, "y":endFrame.elements[0].transformY};
					keyFrameOut.tweenType = "motion";
				}
			}
			P("frame start="+curFrame.startFrame+", dur="+curFrame.duration);
			//if(keyFrameOut.elements.length >= 1){
				out.push(keyFrameOut);	
			//}			
		}
		this.frame.pop();
	}
}

getItemType = function(element){
	if(element.elementType == "instance"){
		P("element instance name="+element.libraryItem.name+", type="+element.libraryItem.itemType);
		return element.libraryItem.itemType;
	}
	else{
		P("element name="+element.name+", type="+element.elementType);
		return element.elementType;
	}
}

FlaToJson.prototype.exportItem = function (element){
	var type = getItemType(element);
	
	this.element.push(element);

	var ret = null;

	if(type == "text"){
		ret = this.exportText(element);
	}
	else if(type == "shape"){
		var timeline = this.timeline[this.timeline.length-1];
		var layer = this.layer[this.layer.length-1];
		///fl.getDocumentDOM().getTimeline().setSelectedLayers(layer, true);

		var frame = this.frame[this.frame.length-1];
		//fl.getDocumentDOM().getTimeline().setSelectedFrames(frame, frame+1, true);
		//fl.getDocumentDOM().getTimeline().copyFrames();

		//P("isGroup="+element.isGroup);

		alert("!!!!!!!!!!dont use shape timeline="+timeline.name+", layer="+layer+", frame="+frame);
		
		
		//fl.getDocumentDOM().mouseClick({x:element.x+element.width/2, y:element.y+element.height/2}, false, true);
		//fl.getDocumentDOM().convertSelectionToBitmap()
		//return this.exportItem(fl.getDocumentDOM().selection[0]);
		//P("x="+element.x+",y="+element.y+",width="+element.width+",height="+element.height);
		//return this.exportShape(element);
	}
	else if(type == "bitmap"){
		ret = this.exportBitmap(element);
	}
	else if(type == "graphic"){
		ret = this.exportGraphic(element);
	}
	else if(type == "button"){
		ret = this.exportButton(element);
	}
	else if(type == "movie clip"){
		ret = this.exportMovieClip(element);
	}
	else{
		P("!!!!!!no exporter for " + type);
		ret =  null;
	}
	
	this.element.pop();

	//JSON.stringify(ret);

	return ret;
}

function escapeName(name){
	return name.replace(/[\s\/]+/g, "_");
}

function setBaseAttr(gra, item){
	//gra.x = item.x-item.left;
	//gra.y = item.y-item.top;
	gra.x = item.x;
	gra.y = item.y;
	gra.reg = [item.x==item.left?0:1, item.y==item.top?1:0];
	gra.width = item.width;
	gra.height = item.height;
	gra.transformX = item.transformX;
	gra.transformY = item.transformY;
	gra.scaleX = item.scaleX;
	gra.scaleY = item.scaleY;
	gra.rotation = item.rotation;

	if(item.name && item.name.length > 0){
		gra.name = item.name;	
	}
}

FlaToJson.prototype.exportShape = function (item){
	var contourArray = item.contours;

	var shapeContours = [];
	for (i=0;  i<contourArray.length;  i++)
	{
		var contour = contourArray[i];
		
		var oneContour = {};
		oneContour.type = "contour";
		oneContour.interior = contour.interior;
		oneContour.orientation = contour.orientation;

		if(contour.fill.color){
			oneContour.color = contour.fill.color;
		}

		var result = [];

		var he = contour.getHalfEdge();

		var iStart = he.id;
		var id = 0;
		while (id != iStart)
		{
			// see if the edge is linear
			var edge = he.getEdge();
			var p0 = edge.getControl(0);
			var p1 = edge.getControl(1);
			var p2 = edge.getControl(2);

			result.push({"ori":p0, "ctl":p1, "dst":p2});

			var vrt = he.getVertex();
			
			var x = vrt.x;
			var y = vrt.y;
			//fl.trace("vrt: " + x + ", " + y+", ori:"+p0.x+","+p0.y+",control:"+p1.x+","+p1.y+",dst:"+p2.x+","+p2.y);
			
			he = he.getNext();
			id = he.id;
		}

		if(result.length <= 0) continue;

		function GetNext(dst){
			for(var i = 0; i < result.length; ++i){
				if(samePoint(dst, result[i].ori))
					return result[i];
			}
			return null;
		}

		// link result
		var polyResult = [];
		// calc quad bezier
		var startP, ele;
		ele = startP = result[0];
		while(false == samePoint(ele.dst, startP.ori)){
			var vertices = GetQuadBezier(ele.ori, ele.ctl, ele.dst);
			polyResult = polyResult.concat(vertices);
			ele = GetNext(ele.dst);
			if(ele == null){
				break;
			}
		}

		oneContour.edges = polyResult.reverse();

		shapeContours.push(oneContour);
	}

	var gra = {};

	gra.type = "shape";
	gra.contours = shapeContours;
	setBaseAttr(gra, item);
	
	P("export Shape contours="+shapeContours.length);

	return gra;
}

FlaToJson.prototype.exportBitmap = function (item){
	var libraryItemName = escapeName(item.libraryItem.name);

	if(!this.exportedLib[libraryItemName]){
		this.exportPNG(item);

		this.exportedLib[libraryItemName] = true;
	}

	var gra = {};
	
	gra.type = "bitmap";
	gra.src = fileName+"_"+libraryItemName+".png";
	setBaseAttr(gra, item);
	
	P("export bitmap "+libraryItemName);

	return gra;
}

FlaToJson.prototype.exportGraphic = function (item){
	var mc = this.exportMovieClip(item);
	//mc.type = "graphic";
	return mc;
}

FlaToJson.prototype.exportText = function (ele){
	var tex = {};	
	tex.type = "text";

	setBaseAttr(tex, ele);
	
	tex.textType = ele.textType;// static, dynamic, input
	tex.fontSize = ele.getTextAttr("size");
	tex.fillColor = ele.getTextAttr("fillColor");
	tex.fontName = ele.getTextAttr("face");
	tex.alignment = ele.getTextAttr("alignment");

	tex.embedString = ele.getTextString();
	tex.lineType = ele.lineType;

	P("export text "+ele.name);

	return tex;
}

FlaToJson.prototype.exportMovieClip = function (ele){
	// check if shape
	var isShape = true;
	for(var i = 0; i < ele.libraryItem.timeline.layers.length; i++){
		if(ele.libraryItem.timeline.layers[i].frames.length != 1){
			isShape = false;
			break;
		}
		for(var j = 0; j < ele.libraryItem.timeline.layers[i].frames[0].elements.length; ++j){
			if(ele.libraryItem.timeline.layers[i].frames[0].elements[j].elementType!="shape"){
				isShape = false;
				break;		
			}
		}
		if(false == isShape){
			break;
		}
	}
	if(isShape){
		P("movie clip convert to bitmap name="+ele.libraryItem.name);
		return this.exportBitmap(ele);
	}

	var mc = {};
	mc.type = "movie clip";

	mc.blendMode=ele.blendMode;

	setBaseAttr(mc, ele);

	mc.dom = [];

	this.exportTimeline(ele.libraryItem.timeline, mc.dom);	
	mc.frameLen = Math.max.apply(null, mc.dom.map(function(layer){return layer.frameLen;}));

	P("export mc "+ele.libraryItem.timeline.name);

	return mc;
}

FlaToJson.prototype.exportPNG = function(item){
	var libraryItemName = escapeName(item.libraryItem.name);
	pName = libraryItemName;
	
	fl.copyLibraryItem(dom.pathURI, item.libraryItem.name);

	var exportDoc = fl.createDocument();
	exportDoc.clipPaste();
	exportDoc.selectAll();
	exportDoc.width = Math.round(item.width/item.scaleX);
	exportDoc.height = Math.round(item.height/item.scaleY);
	exportDoc.moveSelectionBy({x:-exportDoc.selection[0].left, y:-exportDoc.selection[0].top});
	exportDoc.selectNone();
	
	var pngName = filePath+"/"+fileName+"_"+pName+".png";
	if(false == exportDoc.exportPNG(pngName, true, true)){
		alert(pngName);
	}
	exportDoc.close(false);
	P("export PNG "+pngName);
}

FlaToJson.prototype.exportButton = function (item){
	var btn = {};
	btn.type = "button";
	
	setBaseAttr(btn, item);

	var libraryItemName = escapeName(item.libraryItem.name);

	var normalPNG = "";
	var selectedPNG = "";

	if(!this.exportedLib[libraryItemName]){
		// 1 export normal
		fl.copyLibraryItem(dom.pathURI, item.libraryItem.name);

		var exportDoc = fl.createDocument();
		exportDoc.clipPaste();
		exportDoc.selectAll();
		exportDoc.width = Math.round(item.width/item.scaleX);
		exportDoc.height = Math.round(item.height/item.scaleY);
		exportDoc.moveSelectionBy({x:-exportDoc.selection[0].left, y:-exportDoc.selection[0].top});
		exportDoc.selectNone();		
		var pngName = filePath+"/"+fileName+"_"+libraryItemName+"_normal"+".png";
		if(false == exportDoc.exportPNG(pngName, true, true)){
			alert(pngName);
		}
		P("export PNG "+pngName);
		normalPNG = fileName+"_"+libraryItemName+"_normal.png";

		// 2 export selected
		exportDoc.selectAll();	
		if(exportDoc.selection[0].libraryItem.timeline.frameCount > 2){
			for(var i = 0; i < exportDoc.selection[0].libraryItem.timeline.layers.length; ++i){
				exportDoc.selection[0].libraryItem.timeline.currentLayer = i;
				exportDoc.selection[0].libraryItem.timeline.removeFrames(0, 2);
			}
			pngName = filePath+"/"+fileName+"_"+libraryItemName+"_selected"+".png";
			if(false == exportDoc.exportPNG(pngName, true, true)){
				alert(pngName);
			}
			P("export PNG "+pngName);
			selectedPNG = fileName+"_"+libraryItemName+"_selected.png";
		}
		else{
			selectedPNG = normalPNG;
		}	
		
		exportDoc.close(false);
		this.exportedLib[libraryItemName] = [normalPNG, selectedPNG];
	}
	else{
		normalPNG = this.exportedLib[libraryItemName][0];
		selectedPNG = this.exportedLib[libraryItemName][1];
	}

	btn.srcNormal = normalPNG;
	btn.srcSelected = selectedPNG;

	P("export button "+item.name);

	return btn;
}

////////////////////////////////////
//

function testDocNamePath(){
	fl.trace(dom.pathURI);
	fl.trace(filePath);
	fl.trace(fileName);

	fl.trace(dom.width);
	fl.trace(dom.height);
}


function test(){
	dom.selectAll();
	var symbolItem = dom.selection[0];
	var	labelLayer = null;
	var controlLayer = null;
	var layers = symbolItem.libraryItem.timeline.layers;

	for (var i = 0; i < layers.length; i++)
	{
		cmpName = layers[i].name.toLowerCase();
		if (cmpName == "labels"){
			labelLayer = layers[i];
			break;
		}
	}
//
	//if (labelLayer == null) {
	//	labelLayer = symbolItem.timeline.layers[0];
	//}
//
	//var labelIndex = 0;
//
	//var frameNumber = 0;
	//var hitSpan = false;
	//var endFrameNumber = 0;
//
	//var labelNum = new Array();
//
	//while (labelIndex < labelLayer.frames.length)
	//{
	//	labelFrame = labelLayer.frames[labelIndex++];
//
	//	if (labelFrame.name != null && labelFrame.name.length > 0)
	//	{
	//		endFrameNumber = frameNumber + labelFrame.duration - 1;
//
	//		labelNum.push(labelFrame.name+":["+frameNumber+","+endFrameNumber+",true]");
	//		
	//		frameNumber = endFrameNumber + 1;
	//		labelIndex = frameNumber;
	//	}
	//	else{
	//		frameNumber += 1;
	//	}
	//}
//
	//fl.trace("{"+labelNum.join(",")+"}");

	var asCodeArray = new Array();
	for (var i = 0; i < labelLayer.frames.length; ++i){
		labelFrame = labelLayer.frames[i];
		if (labelFrame.actionScript) {
			var asCode = labelFrame.actionScript;
			// //
			asCode = asCode.replace(/^\s+/g, "");
			asCode = asCode.replace(/^\/\/.*/g, "");
			asCode = asCode.replace(/^\/\*[\s\S]*\*\//g, "");
			asCode = asCode.replace(/^\s+/g, "");
			asCode = asCode.replace(/\n+/g, "");
			if(asCode.length > 0){
				fl.trace(i);

				asCode = asCode.split("\n")[0];
				asCode = asCode.split("\r")[0];
				asCode = asCode.split(";")[0];

				var posLeft = asCode.indexOf("(");
				var posRight = asCode.indexOf(")");

				var type = asCode.substr(0, posLeft);
				var label = null;
				if(asCode[posLeft+1] == '"'){
					label = asCode.substr(posLeft+2, posRight-posLeft-3);
				}
				else{
					label = asCode.substr(posLeft+1, posRight-posLeft-1);	
				}
				fl.trace("type="+type+", label="+label);
			}			
		};
	}
//
	//fl.trace("{"+asCodeArray.join(",")+"}");
	//var out = new Array();
	//dom.selectAll();
	//var theElems=dom.selection;
	//print("the ele len: "+theElems.length);
	//for (var i = theElems.length - 1; i >= 0; i--) {
	//	var item = theElems[i];
	//	//dom.selectNone();
	//	fl.trace("element "+i+" name ="+theElems[i].name+", type="+theElems[i].elementType);		
	//	switch(item.elementType){
	//		case "instance":{
	//			fl.trace("element "+i+" name ="+item.libraryItem.name+", type="+item.libraryItem.itemType);
	//			switch(item.libraryItem.itemType){
	//				case "graphic":{
	//					exportGraphic(item);
	//					fl.trace("export graphic "+item.libraryItem.name);
	//				}
	//				break;
	//			}
	//		}
	//		break;
	//	}	
	//};

	//var str = '{a:1, b:2}';
	//for(var item in str){
	//	fl.trace(item);
	//}
	//fl.trace(str.parseJSON(null));
	//alert(FLfile.read(filePath+"/"+"test2_platypus.js"));
	//var a = [1,2,3];
	//fl.trace(JSONStringfy(a, ""));
	//// 测试movie clip 的帧数，帧上有代码，stop代码
	//var out = new Array();
	//var mc = null;
	//var mcInst = null;
	//dom.selectAll();
	//var theElems=dom.selection;
	//for (var i = theElems.length - 1; i >= 0; i--) {
	//	fl.trace("element "+i+" name ="+theElems[i].name+", type="+theElems[i].elementType);
	//	if ("instance" == theElems[i].elementType) {
	//		fl.trace("element "+i+" name ="+theElems[i].libraryItem.name+", type="+theElems[i].libraryItem.itemType);
	//		if ("movie clip" == theElems[i].libraryItem.itemType) {
	//			mc = theElems[i];
	//			break;
	//		}
	//	}
	//}
//
	//var spriteSheetExport = fl.spriteSheetExporter;
	//spriteSheetExport.beginExport();
  	//spriteSheetExport.addSymbol(mc.libraryItem);
	//spriteSheetExport.layoutFormat = "JSON";
	//var outName = filePath+"/"+fileName+"_"+theElems[i].name;
	//spriteSheetExport.exportSpriteSheet(outName, "png");
	//fl.trace("movie clip export "+outName);

	//var layers = mc.timeline.layers;
	////fl.trace("name="+mc.name+", layers len="+layers.length);
	//
	////for (i = 0; i < layers.length; i++)
	////{
	////	fl.trace("layer name="+layers[i].name);
	////}
//
	//var curLayer = mc.timeline.layers[0];
	//fl.trace("layer name="+curLayer.name+", frame len="+curLayer.frames.length);
	//for(var i = 0; i < curLayer.frames.length; ++i){
	//	var curFrame = curLayer.frames[i];
	//	//fl.trace(i+" frame name="+curFrame.name+", dura="+curFrame.duration);
	//	//fl.trace(i+" as="+curFrame.actionScript);
	//	curFrame.actionScript+="\n";
	//}

	//var number = "123";
	//fl.trace(number.constructor);
	//var a = {"x":0, "y":0};
	////var a = [0, 0];
	//fl.trace(a.constructor);
	//for(var o in a){
	//	fl.trace(o+" "+a[o]);
	//}
	//return;
//
	//alert("Fuck You");
	//// dom
	//
	//// library
	//var libItems = dom.library.items;
	//for (var i = libItems.length - 1; i >= 0; i--) {
	//	//fl.trace(libItems[i].name);
	//	fl.trace(libItems[i].name+"  "+libItems[i].linkageIdentifier);
//
	//	//if (libItems[i].itemType == "bitmap") {
	//	//	fl.trace(libItems[i].name);	
	//	//};		
	//};
	//fl.trace("");
	// timeline
	//var timeLines = dom.timelines;
	//for (var i = timeLines.length - 1; i >= 0; i--) {
	//	fl.trace("timeline "+i+" "+timeLines[i].name);
//
	//	var timeline = timeLines[i];
	//	displayAllElements(timeline, tab);
	//};
}

var tab = "\t";
var curr_doc = dom;
var main_timeline = curr_doc.getTimeline();

function displayAllElements() {
	var out = new Array();
	dom.selectAll();
	var theElems=dom.selection;
	for (var i = theElems.length - 1; i >= 0; i--) {
		dom.selectNone();
		fl.trace("element "+i+" name ="+theElems[i].name+", type="+theElems[i].elementType);
		switch(theElems[i].elementType){
			case "instance":{
				fl.trace("element "+i+" name ="+theElems[i].libraryItem.name+", type="+theElems[i].libraryItem.itemType);
				switch(theElems[i].libraryItem.itemType){
					case "graphic":{
						fl.trace("export graphic "+theElems[i].libraryItem.name);
					}
					break;
					case "movie clip":{
						fl.trace("export movie clip "+theElems[i].libraryItem.name);
					}					
					break;
					default:{
						fl.trace("!!!!!!!!!!!!!no exporter for " + theElems[i].libraryItem.itemType);
					}
					break;
				}
			}
			break;
			case "text":{
				fl.trace("export text "+theElems[i].name);
			}
			break;
			default:{
				fl.trace("!!!!!!no exporter for " + theElems[i].elementType);
			}
			break;
		}	
	};
}


function exportPNG(){
	dom.selectAll();
	var theElems=dom.selection;
	for (var i = theElems.length - 1; i >= 0; i--) {
		//fl.trace("element "+i+" name ="+theElems[i].name+", type="+theElems[i].elementType);
		if ("instance" == theElems[i].elementType) {
			//fl.trace("element "+i+" name ="+theElems[i].libraryItem.name+", type="+theElems[i].libraryItem.itemType);
			if ("graphic" == theElems[i].libraryItem.itemType) {
				exportGraphic(theElems[i]);
			};
		}
	};
}


function testExportText(){
	dom.selectAll();
	var theElems=dom.selection;
	for (var i = theElems.length - 1; i >= 0; i--) {
		//fl.trace("element "+i+" name ="+theElems[i].name+", type="+theElems[i].elementType);
		if ("text" == theElems[i].elementType) {
			var textObj = theElems[i];
			//fl.trace("element "+i+" name ="+textObj.name+", accName="+textObj.variableName);
			//fl.trace("element "+i+" name ="+textObj.name+", maxCharacter="+textObj.maxCharacters);
			//fl.trace("element "+i+" name ="+textObj.name+", embededCharacters="+textObj.embededCharacters);
			//fl.trace("element "+i+" name ="+textObj.name+", TextString="+textObj.getTextString());
			exportText(textObj);
		};
	};
}

function P(ele){
	fl.trace(ele);
	var log = filePath+"/"+fileName+".log";
	FLfile.write(log, ele+"\n", "append");
}

function PClear(){
	var log = filePath+"/"+fileName+".log";
	FLfile.write(log, "");
}

function PFlush(){
	
}

function testExportMovieClip(){
	var mc = dom.timelines[0].layers[0].frames[0].elements[0];

	fl.trace(mc.elementType);
	fl.trace(mc.libraryItem.itemType);
	//var tl = mc.libraryItem.timeline;
	//P("layers "+tl.layers.length);
	//P("layer 0 framelen "+tl.layers[0].frames.length);	
	//P("layer 1 framelen "+tl.layers[1].frames.length);
	//P("layer 2 framelen "+tl.layers[2].frames.length);
	
	//for(var k = mc.libraryItem.timeline.layers.length-1; k>=0; k--){
	//	var curLayer = mc.libraryItem.timeline.layers[k];
	//	fl.trace("layer name="+curLayer.name+", frame len="+curLayer.frames.length);
	//	for(var i = 0; i < curLayer.frames.length;++i){
	//		var curFrame = curLayer.frames[i];
			//P(i+" frame name="+curFrame.name+", dura="+curFrame.duration+" tweenType="+curFrame.tweenType+", labelType="+curFrame.labelType+
			//	", motionTweenOrientToPath="+curFrame.motionTweenOrientToPath+",motionTweenRotate="+curFrame.motionTweenRotate+
			//	", motionTweenRotateTimes="+curFrame.motionTweenRotateTimes);
	//		P(i+" isMotionObject="+curFrame.isMotionObject());
			//if("motion"==curFrame.tweenType){
			//	P(i+" motionXML="+curFrame.getMotionObjectXML())
			//}
			//P(i+" as="+curFrame.actionScript);
			//i += curFrame.duration;
	//	}
	//	P("");
	//}
}

function testPNG(){
	var item = dom.timelines[0].layers[0].frames[0].elements[0];

	//fl.trace(new FlaToJson().exportBitmap(item));
	fl.trace("width="+item.width);
	fl.trace("height="+item.height);
	fl.trace("scaleX="+item.scaleX);
	fl.trace("scaleY="+item.scaleY);

	fl.trace("originWidth="+Math.round(item.width/item.scaleX));
	fl.trace("originHeight="+Math.round(item.height/item.scaleY));
}

function testMCBlend(){
	var item = dom.timelines[0].layers[0].frames[0].elements[0];
	fl.trace("elementType="+item.elementType);
	fl.trace("instanceType="+item.instanceType);
	fl.trace("blendMode="+item.blendMode);
}

function GetQuadBezier(origin, control, destination){
	var vertices = [];

    var t = 0.0;
    for (var i = 0; i < 3; i++) {
        var x = Math.pow(1 - t, 2) * origin.x + 2.0 * (1 - t) * t * control.x + t * t * destination.x;
        var y = Math.pow(1 - t, 2) * origin.y + 2.0 * (1 - t) * t * control.y + t * t * destination.y;
        vertices.push({"x":x, "y":y});
        t += 1.0 / 3;
    }
    vertices.push({"x":destination.x, "y":destination.y});
    return vertices;
}

function testText(){
	var item = fl.getDocumentDOM().timelines[0].layers[0].frames[0].elements[0];
	fl.trace(item.elementType);
	fl.trace(item.name);
	fl.trace(item.width);
	fl.trace(item.height);
	fl.trace(item.getTextString());
	var fillColor = item.getTextAttr("fillColor");
	var r = fillColor.substr(1, 2);
	fl.trace(r);
	var g = fillColor.substr(3, 2);
	fl.trace(g);
	var b = fillColor.substr(5, 2);
	fl.trace(b);
}
function testShape(){	
	var item = fl.getDocumentDOM().timelines[0].layers[0].frames[0].elements[0];
	fl.trace(JSON.stringify(new FlaToJson().exportShape(item)));
	return;
	var selArray = [item];
	fl.trace( "selection length: " + selArray.length );

	var elt = selArray[0];
	fl.trace( "selected element" + elt );
	fl.trace( "element type: " + elt.elementType );
	
	var contourArray = elt.contours;
	fl.trace("contour array length: " + contourArray.length);

	var contourCount = 0;
	for (i=0;  i<contourArray.length;  i++)
	{
		var contour = contourArray[i];
		fl.trace(" ");
		fl.trace("Next Contour, orientation:" + contour.orientation + ", interior: " + contour.interior + ", color: " + contour.fill.color);

		var result = [];

		contourCount++;

		var he = contour.getHalfEdge();

		var iStart = he.id;
		var id = 0;
		while (id != iStart)
		{
			// see if the edge is linear
			var edge = he.getEdge();
			var p0 = edge.getControl(0);
			var p1 = edge.getControl(1);
			var p2 = edge.getControl(2);

			result.push({"ori":p0, "ctl":p1, "dst":p2});

			var vrt = he.getVertex();
			
			var x = vrt.x;
			var y = vrt.y;
			//fl.trace("vrt: " + x + ", " + y+", ori:"+p0.x+","+p0.y+",control:"+p1.x+","+p1.y+",dst:"+p2.x+","+p2.y);
			
			he = he.getNext();
			id = he.id;
		}

		if(result.length <= 0) continue;

		function GetNext(dst){
			for(var i = 0; i < result.length; ++i){
				if(samePoint(dst, result[i].ori))
					return result[i];
			}
			return null;
		}

		// link result
		var polyResult = [];
		// calc quad bezier
		var startP, ele;
		ele = startP = result[0];
		while(false == samePoint(ele.dst, startP.ori)){
			var vertices = GetQuadBezier(ele.ori, ele.ctl, ele.dst);
			polyResult = polyResult.concat(vertices);
			ele = GetNext(ele.dst);
			if(ele == null){
				break;
			}
		}

		//fl.trace(JSON.stringify(polyResult.reverse()));
	}
	
}

function samePoint(p1, p2){
	return p1.x == p2.x && p1.y == p2.y;
}

function testBtn(){
	var item = dom.timelines[0].layers[0].frames[0].elements[0];

	fl.trace(item.name);
	fl.trace(item.elementType);
	fl.trace(item.libraryItem.itemType);
	fl.trace(item.libraryItem.timeline);
	for(var i = 0; i < item.libraryItem.timeline.layers.length; ++i){
		var curLayer = item.libraryItem.timeline.layers[i];
		fl.trace("layer name="+curLayer.name+", frame len="+curLayer.frames.length);
		for(var j = 0; j < curLayer.frames.length; ++j){
			fl.trace("frame name = "+curLayer.frames[j].name+", elements="+curLayer.frames[j].elements.length);
		}
	}
}

function testBtnState(){
	var item = dom.timelines[0].layers[0].frames[0].elements[0];

	fl.trace(item.name);
	fl.trace(item.elementType);
	fl.trace(item.libraryItem.itemType);
	fl.trace(item.libraryItem.timeline);

	fl.copyLibraryItem(dom.pathURI, item.libraryItem.name);

	var exportDoc = fl.createDocument();
	exportDoc.clipPaste();
	exportDoc.selectAll();

	for(var i = 0; i < exportDoc.selection[0].libraryItem.timeline.layers.length; ++i){
		exportDoc.selection[0].libraryItem.timeline.currentLayer = i;
		exportDoc.selection[0].libraryItem.timeline.removeFrames(0, 4);
	}
	
	exportDoc.width = Math.round(item.width/item.scaleX);
	exportDoc.height = Math.round(item.height/item.scaleY);
	exportDoc.moveSelectionBy({x:-exportDoc.selection[0].left, y:-exportDoc.selection[0].top});
	exportDoc.selectNone();	
}

function testRegPoint(){
	var item = dom.timelines[0].layers[0].frames[0].elements[0];

	fl.trace("X="+item.x);
	fl.trace("Y="+item.y);
	fl.trace("left="+item.left);
	fl.trace("top="+item.top);
	fl.trace("width="+item.width);
	fl.trace("height="+item.height);
	fl.trace(item.x==item.left?0:1);
	fl.trace(item.y==item.top?1:0);
	fl.trace("rotation="+item.rotation);
}

function testMovieClipKeyFrame(){
	var mc = dom.timelines[0].layers[0].frames[0].elements[0];

	var tl = mc.libraryItem.timeline;

	for(var k = mc.libraryItem.timeline.layers.length-1; k>=0; k--){
		var curLayer = mc.libraryItem.timeline.layers[k];
		//fl.trace("layer name="+curLayer.name+", frame len="+curLayer.frames.length);
		for(var i = 0; i < curLayer.frames.length;++i){
			var curFrame = curLayer.frames[i];
			if(i == curFrame.startFrame){
				P(i+" start frame="+curFrame.startFrame+", dur="+curFrame.duration+", tweenType="+curFrame.tweenType);
			}			
		}
		P("");
	}
}

function testJSONStringfy(){
	var a = [1, 2, 3];
	//fl.trace(JSONStringfy(a));

	var b = {"x":0, "y":0};
	//fl.trace(JSONStringfy(b));

	var c = {"x":b, "y":a};
	//fl.trace(JSON.stringify(c));

	//fl.trace(JSON.parse(JSON.stringify(c)).x.x);

	//fl.trace(JSON.parse(JSON.stringify({frames: [[0,0,804,400,0,0,0]]})));

	var data = FLfile.read(filePath+"/PlatypusGame_bg.js");
	fl.trace(data);
	fl.trace(JSON.parse(data));
}
