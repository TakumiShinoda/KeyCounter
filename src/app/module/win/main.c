#include <windows.h>
#include <stdio.h>
#include <time.h>
#include <string>
#include <unistd.h>
#include "Defines.h"

#define WIN32_LEAN_AND_MEAN

struct KeyChecker{
  int key = 0;
  short state = 0;
  bool check = false;
  bool get(){
    if(state & 0x0001){
      if(!check){
        check = true;
        return 1;
      }
    }

    if(state & 0x8000){
    }else{
      check = false;
    }
    return 0;
  }
  std::string getChar(){
    return keyCodeToReadableString(key);
  }
};

int APIENTRY WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd){
  time_t now;

  int pathsize = 512;
  char cdbuff[pathsize];

  getcwd(cdbuff, pathsize);
  std::vector<std::string> jsonKeys;
  std::ifstream ifs(strcat(cdbuff, "\\module\\keyLayouts.json"), std::ios::in);

  if (ifs.fail()) {
      std::cerr << "failed to read " << cdbuff << "keyLayouts.json" << std::endl;
  }else{
    const std::string json((std::istreambuf_iterator<char>(ifs)), std::istreambuf_iterator<char>());
    ifs.close();

    picojson::value v;
    const std::string err = picojson::parse(v, json);
    if (err.empty() == false) {
        std::cerr << err << std::endl;
    }else{
      picojson::object& o = v.get<picojson::object>();

      for(picojson::object::const_iterator it = o.begin(); it != o.end(); it++){
        jsonKeys.push_back((*it).first);
      }
    }
  }

  struct KeyChecker KeyCheckers[(int)jsonKeys.size()];

  for(int i = 0; i < (int)jsonKeys.size(); i++){
    KeyCheckers[i].key = atoi(jsonKeys[i].c_str());
    KeyCheckers[i].state = GetAsyncKeyState(KeyCheckers[i].key);
    KeyCheckers[i].get();
  }


  while(true){
    for(int i = 0; i < (int)jsonKeys.size(); i++){
      KeyCheckers[i].state = GetAsyncKeyState(KeyCheckers[i].key);
    }

    for(int i = 0; i < (int)jsonKeys.size(); i++){
      if(KeyCheckers[i].get()){
        now = time(NULL);
        std::string fromJson = getCharFromJson(cdbuff, std::to_string(KeyCheckers[i].key));

        if(fromJson.empty()){
          std::cout << now << " " << KeyCheckers[i].getChar().c_str() << " native" << std::endl;
        }else{
          std::cout << now << " " << fromJson << " json" << std::endl;
        }
      }
    }
  }
  return 0;
}
