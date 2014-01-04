#include "xui.h"
#include "AppMacros.h"
#include "ScriptingCore.h"
#include "cocos2d_specifics.hpp"
#include "jsapi.h"

USING_NS_CC;

//
extern CCSize winSize;

NAMESPACE_XUI_BEGIN;

JSClass  *jsb_XUI_class;
JSObject *jsb_XUI_prototype;

JSBool js_xui_create(JSContext *cx, uint32_t argc, jsval *vp)
{
    jsval *argv = JS_ARGV(cx, vp);
    if (argc > 0) {
        XUI* ret = new XUI(argv[0]);
        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *p = jsb_get_native_proxy(ret);
                if (p) {
                    jsret = OBJECT_TO_JSVAL(p->obj);
                } else {
                    // create a new js obj of that class
                    js_proxy_t *proxy = js_get_or_create_proxy<XUI>(cx, ret);
                    jsret = OBJECT_TO_JSVAL(proxy->obj);
                }
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);
        JS_SET_RVAL(cx, vp, jsret);
        return JS_TRUE;
    }

    JS_ReportError(cx, "js_xui_create wrong number of arguments");
    return JS_FALSE;
}


void js_xui_XUI_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOG("jsbindings: finalizing JS object %p (XUI)", obj);
}

JSBool js_xui_XUI_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    jsval *argv = JS_ARGV(cx, vp);
    if (argc == 1) {
        XUI* cobj = new XUI(argv[0]);
        if (cobj)
        {
            cobj->autorelease();
        }

        TypeTest<XUI> t;
        js_type_class_t *typeClass;
        uint32_t typeId = t.s_id();
        HASH_FIND_INT(_js_global_type_ht, &typeId, typeClass);
        assert(typeClass);
        JSObject *obj = JS_NewObject(cx, typeClass->jsclass, typeClass->proto, typeClass->parentProto);
        JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(obj));
        // link the native object with the javascript object
        js_proxy_t* p = jsb_new_proxy(cobj, obj);
        JS_AddNamedObjectRoot(cx, &p->obj, "XUI::XUI");
        return JS_TRUE;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return JS_FALSE;
}

JSBool js_xui_XUI_getDOM(JSContext *cx, uint32_t argc, jsval *vp)
{
    JSObject *obj = JS_THIS_OBJECT(cx, vp);
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    XUI* cobj = (XUI *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
    if (argc == 0) {
        CCNode* ret = dynamic_cast<CCNode*>(cobj->getDOM());
        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *proxy = js_get_or_create_proxy<CCNode>(cx, ret);
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);
        JS_SET_RVAL(cx, vp, jsret);
        return JS_TRUE;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
    return JS_FALSE;
}

JSBool js_xui_XUI_getNode(JSContext *cx, uint32_t argc, jsval *vp)
{
    jsval *argv = JS_ARGV(cx, vp);
    JSBool ok = JS_TRUE;
    JSObject *obj = JS_THIS_OBJECT(cx, vp);
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    XUI* cobj = (XUI *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
    if (argc == 1) {
        std::string src_tmp;
        ok &= jsval_to_std_string(cx, argv[0], &src_tmp);

        CCNode* ret = cobj->getNode(src_tmp.c_str());
        jsval jsret;
        do {
            if (ret) {
                js_proxy_t *proxy = js_get_or_create_proxy<CCNode>(cx, ret);
                jsret = OBJECT_TO_JSVAL(proxy->obj);
            } else {
                jsret = JSVAL_NULL;
            }
        } while (0);
        JS_SET_RVAL(cx, vp, jsret);
        return JS_TRUE;
    }

    JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return JS_FALSE;
}

void js_register_xui_XUI(JSContext *cx, JSObject *global) {
    jsb_XUI_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_XUI_class->name = "XUI";
    jsb_XUI_class->addProperty = JS_PropertyStub;
    jsb_XUI_class->delProperty = JS_PropertyStub;
    jsb_XUI_class->getProperty = JS_PropertyStub;
    jsb_XUI_class->setProperty = JS_StrictPropertyStub;
    jsb_XUI_class->enumerate = JS_EnumerateStub;
    jsb_XUI_class->resolve = JS_ResolveStub;
    jsb_XUI_class->convert = JS_ConvertStub;
    jsb_XUI_class->finalize = js_xui_XUI_finalize;
    jsb_XUI_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        {0, 0, 0, JSOP_NULLWRAPPER, JSOP_NULLWRAPPER}
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("getDOM", js_xui_XUI_getDOM, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("getNode", js_xui_XUI_getNode, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    jsb_XUI_prototype = JS_InitClass(
        cx, global,
        NULL,
        jsb_XUI_class,
        js_xui_XUI_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);
    // make the class enumerable in the registered namespace
    JSBool found;
    JS_SetPropertyAttributes(cx, global, "XUI", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

    // add the proto and JSClass to the type->js info hash table
    TypeTest<XUI> t;
    js_type_class_t *p;
    uint32_t typeId = t.s_id();
    HASH_FIND_INT(_js_global_type_ht, &typeId, p);
    if (!p) {
        p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
        p->type = typeId;
        p->jsclass = jsb_XUI_class;
        p->proto = jsb_XUI_prototype;
        p->parentProto = NULL;
        HASH_ADD_INT(_js_global_type_ht, type, p);
    }
}

void register_xui_js(JSContext* cx, JSObject* global)
{
    // first, try to get the ns
    jsval nsval;
    JSObject *ns;
    JS_GetProperty(cx, global, "xui", &nsval);
    if (nsval == JSVAL_VOID) {
        ns = JS_NewObject(cx, NULL, NULL, NULL);
        nsval = OBJECT_TO_JSVAL(ns);
        JS_SetProperty(cx, global, "xui", &nsval);
    } else {
        JS_ValueToObject(cx, nsval, &ns);
    }

    JSObject *tmpObj;

    // xui.create
    tmpObj = JSVAL_TO_OBJECT(anonEvaluate(cx, global, "(function () { return xui; })()"));
    JS_DefineFunction(cx, tmpObj, "create", js_xui_create, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    // 
    js_register_xui_XUI(cx, ns);
}

bool checkAndGetString(JSContext* cx, JSObject* tmp, const char* name, std::string* ret)
{
    JSBool ok = JS_TRUE;
    jsval js_prop;
    ok = JS_GetProperty(cx, tmp, name, &js_prop);
    if (!ok)
    {
        return false;
    }
    else
    {
        ok = jsval_to_std_string(cx, js_prop, ret);
        return true;
    }
}

double getJSNumber(JSContext* cx, JSObject* tmp, const char* name)
{
    JSBool ok = JS_TRUE;
    jsval js_double;
    ok &= JS_GetProperty(cx, tmp, name, &js_double);
    double doubleRet;
    ok &= JS_ValueToNumber(cx, js_double, &doubleRet);

    return doubleRet;
}

std::string getJSString(JSContext* cx, JSObject* tmp, const char* name)
{
    JSBool ok = JS_TRUE;
    jsval js_string;
    ok &= JS_GetProperty(cx, tmp, name, &js_string);
    std::string src_tmp;
    ok &= jsval_to_std_string(cx, js_string, &src_tmp);

    return src_tmp;
}

CCPoint transformPoint(double x, double y)
{
    return CCPoint(floor(x), -1 * floor(y));
}

CCPoint getPoint(JSContext* cx, JSObject* tmp, const char* name)
{
    JSBool ok = JS_TRUE;
    jsval js_point;
    ok = JS_GetProperty(cx, tmp, name, &js_point);
    
    JSObject *pointObj;
    ok = JS_ValueToObject(cx, js_point, &pointObj);

    double x = getJSNumber(cx, pointObj, "x");
    double y = getJSNumber(cx, pointObj, "y");

    return transformPoint(x, y);
}

void setCoord(CCNode* item, JSContext* cx, JSObject* tmp)
{
    // anchor point
    //item->setAnchorPoint(ccp(0, 1));
    
    // x y
    double xPos = getJSNumber(cx, tmp, "x");
    double yPos = getJSNumber(cx, tmp, "y");
    item->setPosition(transformPoint(xPos, yPos));

    // rotation
    jsval js_rotation;
    JSBool ok = JS_GetProperty(cx, tmp, "rotation", &js_rotation);
    if (ok)
    {
        double rotation = 0;
        ok = JS_ValueToNumber(cx, js_rotation, &rotation);
        if (0 != rotation)
        {
            item->setRotation(rotation);
        }        
    }

    // scale
    jsval js_scalex;
    ok = JS_GetProperty(cx, tmp, "scaleX", &js_scalex);
    if (ok)
    {
        double scalex = 0;
        ok = JS_ValueToNumber(cx, js_scalex, &scalex);
        item->setScaleX(scalex);
    }

    jsval js_scaley;
    ok = JS_GetProperty(cx, tmp, "scaleY", &js_scaley);
    if (ok)
    {
        double scaley = 0;
        ok = JS_ValueToNumber(cx, js_scaley, &scaley);
        item->setScaleX(scaley);
    }
}

double angle2Radian(double angle)
{
    return angle * 2 * 3.141592653 / 360;
}

void xuiTransform(CCNode* item, double angle, CCPoint& p0, CCAffineTransform* additional)
{
    CCPoint pos = item->getPosition();
    double radian = angle2Radian(angle);
    double cosRadian = cos(radian);
    double sinRadian = sin(radian);

    CCAffineTransform t1 = __CCAffineTransformMake(1, 0, 0, 1, -p0.x, -p0.y);
    CCAffineTransform t2 = __CCAffineTransformMake(cosRadian, -sinRadian, sinRadian, cosRadian, 0, 0);
    CCAffineTransform t3 = __CCAffineTransformMake(1, 0, 0, 1, p0.x, p0.y);

    item->setRotation(angle);
    CCAffineTransform finalTrans = CCAffineTransformConcat(CCAffineTransformConcat(t1, t2), t3);
    if (additional)
    {
        finalTrans = CCAffineTransformConcat(finalTrans, *additional);
    }
    CCPoint newPos = CCPointApplyAffineTransform(pos, finalTrans);
    item->setAdditionalTransform(__CCAffineTransformMake(1, 0, 0, 1, newPos.x-pos.x, newPos.y-pos.y));
}

XUI::XUI(jsval ui)
{
    this->m_dom = this->load(ui);
}

CCNode* XUI::load(jsval ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    std::string type = getJSString(cx, tmp, "type");
    if (strcmp(type.c_str(), "bitmap") == 0)
    {
        BitmapSprite* bmp = new BitmapSprite(ui);
        std::string name;
        if (checkAndGetString(cx, tmp, "name", &name) && name.size() > 0)
        {
            this->m_attr.insert(make_pair(name, bmp));
        }
        return bmp;
    }
    else if (strcmp(type.c_str(), "button") == 0)
    {
        Button* inst = new Button(ui);
        std::string name;
        if (checkAndGetString(cx, tmp, "name", &name) && name.size() > 0)
        {
            this->m_attr.insert(make_pair(name, inst));
        }
        return inst;
    }
    else if (strcmp(type.c_str(), "text") == 0)
    {
        CCNode* inst = NULL;
        std::string textType = getJSString(cx, tmp, "textType");
        if (strcmp(textType.c_str(), "input") == 0)
        {
            inst = new InputText(ui);
        }
        else{
            inst = new TextSprite(ui);
        }

        std::string name;
        if (checkAndGetString(cx, tmp, "name", &name) && name.size() > 0)
        {
            this->m_attr.insert(make_pair(name, inst));
        }
        return inst;
    }
    else if (strcmp(type.c_str(), "frame") == 0)
    {
        // scale
        jsval js_prop;
        ok = JS_GetProperty(cx, tmp, "elements", &js_prop);

        JSObject *js_obj;
        JS_ValueToObject(cx, js_prop, &js_obj);

        uint32_t length = 0;
        ok = JS_GetArrayLength(cx, js_obj, &length);

        CCNode** ret = NULL;
        if (length > 0)
        {
            ret = new CCNode*[length];
        }
        for (int i = 0; i < length; ++i)
        {
            jsval value;
            ok = JS_GetElement(cx, js_obj, i, &value);
            ret[i] = this->load(value);            
        }
        
        FrameSprite* inst = new FrameSprite(ret, length, ui);
        std::string name;
        if (checkAndGetString(cx, tmp, "name", &name) && name.size() > 0)
        {
            this->m_attr.insert(make_pair(name, inst));
        }
        return inst;
    }
    else if (strcmp(type.c_str(), "layer") == 0)
    {
        // scale
        jsval js_prop;
        ok = JS_GetProperty(cx, tmp, "frames", &js_prop);

        JSObject *js_obj;
        JS_ValueToObject(cx, js_prop, &js_obj);

        uint32_t length = 0;
        ok = JS_GetArrayLength(cx, js_obj, &length);

        CCNode** ret = NULL;
        if (length > 0)
        {
            ret = new CCNode*[length];
        }
        for (int i = 0; i < length; ++i)
        {
            jsval value;
            ok = JS_GetElement(cx, js_obj, i, &value);
            ret[i] = this->load(value);            
        }

        Layer* inst = new Layer(ret, length, ui);
        std::string name;
        if (checkAndGetString(cx, tmp, "name", &name) && name.size() > 0)
        {
            this->m_attr.insert(make_pair(name, inst));
        }
        return inst;
    }
    else if (strcmp(type.c_str(), "dom") == 0)
    {
        // scale
        jsval js_prop;
        ok = JS_GetProperty(cx, tmp, "layers", &js_prop);

        JSObject *js_obj;
        JS_ValueToObject(cx, js_prop, &js_obj);

        uint32_t length = 0;
        ok = JS_GetArrayLength(cx, js_obj, &length);

        CCNode** ret = NULL;
        if (length > 0)
        {
            ret = new CCNode*[length];
        }
        for (int i = 0; i < length; ++i)
        {
            jsval value;
            ok = JS_GetElement(cx, js_obj, i, &value);
            ret[i] = this->load(value);            
        }

        DOM* inst = new DOM(ret, length, ui);
        std::string name;
        if (checkAndGetString(cx, tmp, "name", &name) && name.size() > 0)
        {
            this->m_attr.insert(make_pair(name, inst));
        }
        return inst;
    }
    else if (strcmp(type.c_str(), "graphic") == 0 || strcmp(type.c_str(), "movie clip") == 0)
    {
        // scale
        jsval js_prop;
        ok = JS_GetProperty(cx, tmp, "dom", &js_prop);

        JSObject *js_obj;
        JS_ValueToObject(cx, js_prop, &js_obj);

        uint32_t length = 0;
        ok = JS_GetArrayLength(cx, js_obj, &length);

        CCNode** ret = NULL;
        if (length > 0)
        {
            ret = new CCNode*[length];
        }
        for (int i = 0; i < length; ++i)
        {
            jsval value;
            ok = JS_GetElement(cx, js_obj, i, &value);
            ret[i] = this->load(value);            
        }

        MovieClip* inst = new MovieClip(ret, length, ui);
        std::string name;
        if (checkAndGetString(cx, tmp, "name", &name) && name.size() > 0)
        {
            this->m_attr.insert(make_pair(name, inst));
        }
        return inst;
    }
    else
    {
        CCAssert(false, std::string("no support type ").append(type).c_str());
        //JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
        return NULL;
    }
}

RotateInterface::RotateInterface(jsval ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    this->m_transform.x = getJSNumber(cx, tmp, "transformX");
    this->m_transform.y = getJSNumber(cx, tmp, "transformY");
}

BitmapSprite::BitmapSprite(jsval ui):RotateInterface(ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    // get src of bitmap
    std::string src = getJSString(cx, tmp, "src");
    this->initWithFile(std::string("res/").append(src).c_str());

    setCoord(this, cx, tmp);
    
    CCLOG("bitmap create x=%d, y=%d", this->getPosition().x, this->getPosition().y);
}

void BitmapSprite::rotate(double angle)
{
    xuiTransform(this, angle, this->m_transform, NULL);
}

TextSprite::TextSprite(jsval ui):RotateInterface(ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    std::string alignment = getJSString(cx, tmp, "alignment");

    CCTextAlignment textAlign;

    if (strcmp(alignment.c_str(), "center") == 0)
    {
        textAlign = kCCTextAlignmentCenter;
    }
    else if (strcmp(alignment.c_str(), "left") == 0)
    {
        textAlign = kCCTextAlignmentLeft;
    }
    else if (strcmp(alignment.c_str(), "right") == 0)
    {
        textAlign = kCCTextAlignmentRight;
    }

    std::string embedString = getJSString(cx, tmp, "embedString");
    double fontSize = getJSNumber(cx, tmp, "fontSize");
    double width = getJSNumber(cx, tmp, "width");
    double height = getJSNumber(cx, tmp, "height");

    this->initWithString(embedString.c_str(), "Arial", fontSize, CCSizeMake(width, height), textAlign);
    setCoord(this, cx, tmp);

    CCLOG("text create x=%d, y=%d", this->getPosition().x, this->getPosition().y);
}

void TextSprite::rotate(double angle)
{
    xuiTransform(this, angle, this->m_transform, NULL);
}

InputText::InputText(jsval ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    double width = getJSNumber(cx, tmp, "width");
    double height = getJSNumber(cx, tmp, "height");
    
    this->initWithSizeAndBackgroundSprite(CCSizeMake(width, height), NULL);

    std::string embedString = getJSString(cx, tmp, "embedString");

    setCoord(this, cx, tmp);
    
    this->setPlaceHolder(embedString.c_str());
    this->setFontColor(ccc3(255, 255, 0));

    std::string lineType = getJSString(cx, tmp, "lineType");
    if (strcmp(lineType.c_str(), "password") == 0)
    {
        this->setInputFlag(kEditBoxInputFlagPassword);
    }

    CCLOG("inputtext create x=%d, y=%d", this->getPosition().x, this->getPosition().y);
}

Button::Button(jsval ui):RotateInterface(ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    std::string src = getJSString(cx, tmp, "src");
    this->initWithNormalImage(std::string("res/").append(src).c_str(), NULL, NULL, this, NULL);

    setCoord(this, cx, tmp);
}

void Button::rotate(double angle)
{
    xuiTransform(this, angle, this->m_transform, NULL);
}

MovieClip::MovieClip(CCNode* dom[], int len, jsval ui):RotateInterface(ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    CCSprite::init();
    
    this->m_dom = dom;
    this->m_len = len;

    setCoord(this, cx, tmp);

    for (int i = 0; i < len; ++i)
    {
        CCSprite::addChild(dom[i]);
    }

    // blend mode
    jsval js_blend_mode;
    ok = JS_GetProperty(cx, tmp, "blendMode", &js_blend_mode);
    if (ok)
    {
        std::string blendMode;
        ok = jsval_to_std_string(cx, js_blend_mode, &blendMode);
        ccBlendFunc blend = {GL_SRC_ALPHA, GL_ONE};
        this->setRecursiveBlendFunc(blend);
    }

    this->m_curFrame = 0;
    this->m_frameLen = getJSNumber(cx, tmp, "frameLen");

    CCLOG("mc create x=%d, y=%d", this->getPosition().x, this->getPosition().y);
}

void MovieClip::setRecursiveBlendFunc(const ccBlendFunc &blendFunc)
{
    this->setBlendFunc(blendFunc);
    for (int i = 0; i < this->m_len; ++i)
    {
        Layer* layer = dynamic_cast<Layer*>(this->m_dom[i]);
        if (layer)
        {
            layer->setBlendFunc(blendFunc);
        }
    }    
}

void MovieClip::xuiUpdate()
{
    for (int i = 0; i < this->m_len; ++i)
    {
        Layer* layer = dynamic_cast<Layer*>(this->m_dom[i]);
        if (layer)
        {
            layer->xuiUpdate(this->m_curFrame);
        }        
    }
    this->m_curFrame++;
    if (this->m_curFrame >= this->m_frameLen)
    {
        this->m_curFrame = 0;
    }    
}

void MovieClip::rotate(double angle)
{
    xuiTransform(this, angle, this->m_transform, NULL);
}

FrameSprite::FrameSprite(CCNode* elements[], int len, jsval ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    this->setContentSize(CCSizeZero);

    setCoord(this, cx, tmp);

    this->m_elements = elements;
    this->m_len = len;

    this->m_duration = getJSNumber(cx, tmp, "duration");
    std::string tweenType = getJSString(cx, tmp, "tweenType");
    if(strcmp(tweenType.c_str(), "motion") == 0)
    {
        this->m_tween = 1;

        double endRotation = getJSNumber(cx, tmp, "endRotation");
        double startRotation = getJSNumber(cx, tmp, "startRotation");

        this->m_dAngle = (endRotation - startRotation)/this->m_duration;

        this->m_endTransform = getPoint(cx, tmp, "endTransform");
        this->m_startTransform = getPoint(cx, tmp, "startTransform");

        this->m_dx = (this->m_endTransform.x-this->m_startTransform.x)/this->m_duration;
        this->m_dy = (this->m_endTransform.y-this->m_startTransform.y)/this->m_duration;
    }
    else
    {
        this->m_tween = 0;
        this->m_dAngle = 0;

        this->m_endTransform = CCPoint(0, 0);
        this->m_startTransform = CCPoint(0, 0);

        this->m_dx = 0;
        this->m_dy = 0;
    }

    for (int i = 0; i < len; i++)
    {
        this->addChild(elements[i]);
    }

    this->m_startFrame = getJSNumber(cx, tmp, "startFrame");

    this->m_currFrame = 0;
    this->m_angleAccu = 0;
    this->m_xAccu = 0;
    this->m_yAccu = 0;

    CCLOG("frame create x=%d, y=%d", this->getPosition().x, this->getPosition().y);
}

void FrameSprite::setBlendFunc(const ccBlendFunc &blendFunc)
{
    for (int i = 0; i < this->m_len; ++i)
    {
        MovieClip* mc = dynamic_cast<MovieClip*>(this->m_elements[i]);
        if (mc)
        {
            mc->setBlendFunc(blendFunc);
            continue;
        }
        
        BitmapSprite* bmp = dynamic_cast<BitmapSprite*>(this->m_elements[i]);
        if(bmp)
        {
            bmp->setBlendFunc(blendFunc);
        }
    }
    
}

void FrameSprite::xuiUpdate()
{
    for (int i = 0; i < this->m_len; ++i)
    {
        MovieClip* mc = dynamic_cast<MovieClip*>(this->m_elements[i]);
        if (mc)
        {
            mc->xuiUpdate();            
        }
    }
    if (this->m_tween)
    {
        if (this->m_currFrame >= this->m_duration)
        {
            this->m_currFrame = 0;
            this->m_angleAccu = 0;
            this->m_xAccu = 0;
            this->m_yAccu = 0;
        }
        this->m_currFrame++;
        this->m_angleAccu += this->m_dAngle;
        this->m_xAccu += this->m_dx;
        this->m_yAccu += this->m_dy;

        CCAffineTransform matrix = __CCAffineTransformMake(1,0,0,1,this->m_xAccu,this->m_yAccu);
        xuiTransform(this->m_elements[0], this->m_angleAccu, this->m_startTransform, &matrix);
    }    
}

Layer::Layer(CCNode* frames[], int len, jsval ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    this->setContentSize(CCSizeZero);
    this->m_frames = frames;
    this->m_len = len;

    setCoord(this, cx, tmp);

    for (int i = 0; i < len ; ++i)
    {
        this->addChild(frames[i]);
        frames[i]->setVisible(false);
    }

    this->m_lastFrameInst = NULL;

    CCLOG("layer create x=%d, y=%d", this->getPosition().x, this->getPosition().y);
}

void Layer::setBlendFunc(const ccBlendFunc &blendFunc)
{
    for (int i = 0; i < this->m_len; ++i)
    {
        FrameSprite* frame = dynamic_cast<FrameSprite*>(this->m_frames[i]);
        if (frame)
        {
            frame->setBlendFunc(blendFunc);
        }        
    }    
}

CCNode* Layer::getFrame(int frameIndex)
{
    for (int i = 0; i < this->m_len; ++i)
    {
        FrameSprite* frame = dynamic_cast<FrameSprite*>(this->m_frames[i]);
        if (frame)
        {
            if (frame->getStartFrame() <= frameIndex && 
                frameIndex < frame->getStartFrame()+frame->getDuration())
            {
                return frame;
            }            
        }        
    }
    
    return NULL;
}

void Layer::xuiUpdate(int curFrame)
{
    CCNode* frame = this->getFrame(curFrame);
    if (this->m_lastFrameInst != frame)
    {
        if (this->m_lastFrameInst)
        {
            this->m_lastFrameInst->setVisible(false);
        }
        this->m_lastFrameInst = frame;
        if (frame)
        {
            frame->setVisible(true);
        }        
    }
    if (frame)
    {
        FrameSprite* frameSprite = dynamic_cast<FrameSprite*>(frame);
        if (frameSprite)
        {
            frameSprite->xuiUpdate();
        }        
    }    
}

DOM::DOM(CCNode* layers[], int len, jsval ui)
{
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JSBool ok = JS_TRUE;

    JSObject *tmp;
    JS_ValueToObject(cx, ui, &tmp);

    this->setContentSize(CCSizeZero);

    this->m_layers = layers;
    this->m_len = len;

    this->m_size.width = getJSNumber(cx, tmp, "width");
    this->m_size.height = getJSNumber(cx, tmp, "height");

    this->setAnchorPoint(ccp(0, 1));
    this->setPosition(ccp(0+winSize.width/2-this->m_size.width/2, winSize.height-(winSize.height/2-this->m_size.height/2)));

    for (int i = 0; i < len; ++i)
    {
        this->addChild(layers[i]);
    }
    
    this->m_frameLen = getJSNumber(cx, tmp, "frameLen");
    this->m_curFrame = 0;

    this->schedule(schedule_selector(DOM::xuiUpdate));

    CCLOG("dom create x=%d, y=%d", this->getPosition().x, this->getPosition().y);
}

void DOM::xuiUpdate(float f)
{
    for (int i = 0; i < this->m_len; ++i)
    {
        Layer* layer = dynamic_cast<Layer*>(this->m_layers[i]);
        if (layer)
        {
            layer->xuiUpdate(this->m_curFrame);
        }        
    }
    this->m_curFrame++;
    if (this->m_curFrame >= this->m_frameLen)
    {
        this->m_curFrame = 0;
    }    
}

NAMEPSACE_XUI_END;
