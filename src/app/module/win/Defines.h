#include <iostream>
#include <fstream>
#include <sstream>
#include <iterator>
#include "../picojson.h"
#include <string>

std::string getCharFromJson(std::string file, std::string key){
  std::ifstream ifs(file, std::ios::in);

  if (ifs.fail()) {
      std::cerr << "failed to read " << file << std::endl;
      return "";
  }
  const std::string json((std::istreambuf_iterator<char>(ifs)), std::istreambuf_iterator<char>());
  ifs.close();

  picojson::value v;
  const std::string err = picojson::parse(v, json);
  if (err.empty() == false) {
      std::cerr << err << std::endl;
      return "";
  }

  picojson::object& obj = v.get<picojson::object>();

  try{
    picojson::array& resArr = obj[key].get<picojson::array>();
    std::string res = resArr[0].get<std::string>();
    return res;
  }catch(...){
    return "";
  }
}

int Keys[100] = {
  VK_RETURN,
  VK_SHIFT,
  VK_LBUTTON,
  VK_RBUTTON,
  VK_MBUTTON,
  VK_BACK,
  VK_TAB,
  VK_CAPITAL,
  VK_ESCAPE,
  VK_SPACE,
  VK_PRIOR,
  VK_NEXT,
  VK_END,
  VK_HOME,
  VK_LEFT,
  VK_RIGHT,
  VK_UP,
  VK_DOWN,
  VK_SNAPSHOT,
  VK_INSERT,
  VK_DELETE,
  VK_LWIN,
  VK_RWIN,
  VK_APPS,
  VK_F1,
  VK_F2,
  VK_F3,
  VK_F4,
  VK_F5,
  VK_F6,
  VK_F7,
  VK_F8,
  VK_F9,
  VK_F10,
  VK_F11,
  VK_F12,
  VK_F13,
  VK_F14,
  VK_F15,
  VK_F16,
  VK_F17,
  VK_F18,
  VK_F19,
  VK_F20,
  VK_F21,
  VK_F22,
  VK_F23,
  VK_F24,
  VK_NUMLOCK,
  VK_SCROLL,
  VK_LSHIFT,
  VK_RSHIFT,
  VK_LCONTROL,
  VK_RCONTROL,
  VK_LMENU,
  VK_RMENU,
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
};

std::string keyCodeToReadableString(int keyCode){
  switch(keyCode){
    case VK_RETURN: return "<enter>";
    case VK_SHIFT: return "<shift>";
    case VK_LBUTTON: return "<lmousebutton>";
    case VK_RBUTTON: return "<rmousebutton>";
    case VK_MBUTTON: return "<centermousebutton>";
    case VK_BACK: return "<backspace>";
    case VK_TAB: return "<tab>";
    case VK_CAPITAL: return "<caps>";
    case VK_ESCAPE: return "<esc>";
    case VK_SPACE: return "<space>";
    case VK_PRIOR: return "<pageup>";
    case VK_NEXT: return "<pagedown>";
    case VK_END: return "<end>";
    case VK_HOME: return "<home>";
    case VK_LEFT: return "<left>";
    case VK_RIGHT: return "<right>";
    case VK_UP: return "<up>";
    case VK_DOWN: return "<down>";
    case VK_SNAPSHOT: return "<prtscr>";
    case VK_INSERT: return "<insert>";
    case VK_DELETE: return "<delete>";
    case VK_LWIN: return "<lwindows>";
    case VK_RWIN: return "<rwindows>";
    case VK_APPS: return "<application>";
    case VK_F1: return "<f1>";
    case VK_F2: return "<f2>";
    case VK_F3: return "<f3>";
    case VK_F4: return "<f4>";
    case VK_F5: return "<f5>";
    case VK_F6: return "<f6>";
    case VK_F7: return "<f7>";
    case VK_F8: return "<f8>";
    case VK_F9: return "<f9>";
    case VK_F10: return "<f10>";
    case VK_F11: return "<f11>";
    case VK_F12: return "<f12>";
    case VK_F13: return "<f13>";
    case VK_F14: return "<f14>";
    case VK_F15: return "<f15>";
    case VK_F16: return "<f16>";
    case VK_F17: return "<f17>";
    case VK_F18: return "<f18>";
    case VK_F19: return "<f19>";
    case VK_F20: return "<f20>";
    case VK_F21: return "<f21>";
    case VK_F22: return "<f22>";
    case VK_F23: return "<f23>";
    case VK_F24: return "<f24>";
    case VK_NUMLOCK: return "<numlock>";
    case VK_SCROLL: return "<scroll>";
    case VK_LSHIFT: return "<lshift>";
    case VK_RSHIFT: return "<rshift>";
    case VK_LCONTROL: return "<lcontrol>";
    case VK_RCONTROL: return "<rcontrol>";
    case VK_LMENU: return "<lalt>";
    case VK_RMENU: return "<ralt>";
    case 'A': return "a";
    case 'B': return "b";
    case 'C': return "c";
    case 'D': return "d";
    case 'E': return "e";
    case 'F': return "f";
    case 'G': return "g";
    case 'H': return "h";
    case 'I': return "i";
    case 'J': return "j";
    case 'K': return "k";
    case 'L': return "l";
    case 'M': return "m";
    case 'N': return "n";
    case 'O': return "o";
    case 'P': return "p";
    case 'Q': return "q";
    case 'R': return "r";
    case 'S': return "s";
    case 'T': return "t";
    case 'U': return "u";
    case 'V': return "v";
    case 'W': return "w";
    case 'X': return "x";
    case 'Y': return "y";
    case 'Z': return "z";
    default: return "<unknown>";
  }
};
