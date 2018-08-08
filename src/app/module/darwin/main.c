#include <stdio.h>
#include <time.h>
#include <ApplicationServices/ApplicationServices.h>

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
    std::string res = resArr[1].get<std::string>();
    return res;
  }catch(...){
    return "";
  }
}

CGEventRef on_tap(CGEventTapProxy proxy, CGEventType type, CGEventRef event, void *refcon){
  CGKeyCode key = CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode);
  std::string keyFromJson = getCharFromJson("src/app/module/keyLayouts.json", std::to_string(key)); // module/keyLayouts.json
  time_t now;
  time(&now);

  if(keyFromJson.empty()){
    keyFromJson = "<unknown>";
  }

  std::cout << now << " " << keyFromJson << " json" <<std::endl;

  fflush(stdout);
  return event;
}

int main(int argc, const char * argv[]) {
  CGEventFlags flags = CGEventSourceFlagsState(kCGEventSourceStateCombinedSessionState);
  CGEventMask mask = (CGEventMaskBit(kCGEventKeyUp) | CGEventMaskBit(kCGEventFlagsChanged));
  CFMachPortRef tap = CGEventTapCreate(kCGSessionEventTap, kCGHeadInsertEventTap, 0, mask, on_tap, &flags);
  if (!tap) {
    fprintf(stderr, "This program requires sudo.");
    return -1;
  }
  CFRunLoopSourceRef runloop = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0);
  CFRunLoopAddSource(CFRunLoopGetCurrent(), runloop, kCFRunLoopCommonModes);
  CGEventTapEnable(tap, true);
  CFRunLoopRun();
  return 0;
}
