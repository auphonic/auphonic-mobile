package com.auphonic.plugins;

import android.view.WindowManager.LayoutParams;

import org.json.JSONArray;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;

public class IdleTimer extends CordovaPlugin {

  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
    if (action.equals("enable")) {
      this.cordova.getActivity().getWindow().clearFlags(LayoutParams.FLAG_KEEP_SCREEN_ON);
      callbackContext.sendPluginResult(new PluginResult(Status.OK));
      return true;
    } else if (action.equals("disable")) {
      this.cordova.getActivity().getWindow().addFlags(LayoutParams.FLAG_KEEP_SCREEN_ON);
      callbackContext.sendPluginResult(new PluginResult(Status.OK));
      return true;
    }

    callbackContext.sendPluginResult(new PluginResult(Status.INVALID_ACTION));
    return false;
  }
}
