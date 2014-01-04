#ifndef __XUI_H__
#define __XUI_H__
#include "cocos2d.h"
#include "cocos-ext.h"
#include "AppMacros.h"

USING_NS_CC;
USING_NS_CC_EXT;

#include "jsapi.h"
#include "jsfriendapi.h"


#define NAMESPACE_XUI_BEGIN namespace XUI{

#define NAMEPSACE_XUI_END   }

NAMESPACE_XUI_BEGIN;

void register_xui_js(JSContext* cx, JSObject* global);

class XUI: public CCObject
{
public:
    XUI(jsval ui);
    CCNode* getDOM(){return m_dom;}
    CCNode* getNode(const char* name)
    {
        std::map<std::string, CCNode*>::iterator iter = m_attr.find(name);
        if (iter != m_attr.end())
        {
            return iter->second;
        }
        else
        {
            return NULL;
        }
    }
    CCNode* load(jsval ui);
private:
    CCNode*                         m_dom;
std::map<std::string, CCNode*>  m_attr;
};

class RotateInterface
{
public:
    RotateInterface(jsval ui);
protected:
    CCPoint m_transform;
};

class BitmapSprite: public CCSprite, public RotateInterface
{
public:
    BitmapSprite(jsval ui);
    void xuiUpdate(){};
    void rotate(double angle);
private:
    CCPoint m_transform;
};

class TextSprite: public CCLabelTTF, public RotateInterface
{
public:
    TextSprite(jsval ui);
    void setBlendFunc(const ccBlendFunc &blendFunc){}
    void xuiUpdate(){}
    void rotate(double angle);
private:
    CCPoint m_transform;
};

class InputText: public CCEditBox
{
public:
    InputText(jsval ui);
    void setBlendFunc(const ccBlendFunc &blendFunc){}
    void xuiUpdate(){}
};

class Button:public CCMenuItemImage, public RotateInterface
{
public:
    Button(jsval ui);
    void setBlendFunc(const ccBlendFunc &blendFunc){}
    void xuiUpdate(){}
    void rotate(double angle);
private:
    CCPoint m_transform;
};

class MovieClip:public CCSprite, public RotateInterface
{
public:
    MovieClip(CCNode* dom[], int len, jsval ui);
    void setRecursiveBlendFunc(const ccBlendFunc &blendFunc);
    void xuiUpdate();
    void rotate(double angle);
private:
    CCNode** m_dom;
    int     m_len;

    int     m_curFrame;
    int     m_frameLen;
};

class FrameSprite: public CCLayer
{
public:
    FrameSprite(CCNode* elements[], int len, jsval ui);
    void setBlendFunc(const ccBlendFunc &blendFunc);
    void xuiUpdate();

    int     getStartFrame(){return m_startFrame;}
    int     getDuration(){return m_duration;}
private:
    CCNode** m_elements;
    int     m_len;

    int     m_duration;
    int     m_tween;

    double  m_dAngle;

    CCPoint m_endTransform;
    CCPoint m_startTransform;

    double  m_dx;
    double  m_dy;

    int     m_startFrame;
    int     m_currFrame;
    double  m_angleAccu;
    double  m_xAccu;
    double  m_yAccu;
};

class Layer: public CCLayer
{
public:
    Layer(CCNode* frames[], int len, jsval ui);
    void setBlendFunc(const ccBlendFunc &blendFunc);
    CCNode* getFrame(int frameIndex);
    void xuiUpdate(int curFrame);
private:
    CCNode**    m_frames;
    int         m_len;

    CCNode*     m_lastFrameInst;
};

class DOM:public CCLayer
{
public:
    DOM(CCNode* layers[], int len, jsval ui);
    void xuiUpdate(float f);
private:
    CCNode**    m_layers;
    int         m_len;

    CCSize      m_size;

    int         m_curFrame;
    int         m_frameLen;
};

NAMEPSACE_XUI_END
#endif