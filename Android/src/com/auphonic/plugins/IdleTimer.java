package com.auphonic.plugins;

import android.view.WindowManager.LayoutParams;

import org.json.JSONArray;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;

public class IdleTimer extends Plugin {

  public PluginResult execute(String action, JSONArray args, String callbackId) {
    if (action.equals("enable")) {
      this.cordova.getActivity().getWindow().clearFlags(LayoutParams.FLAG_KEEP_SCREEN_ON);
      return new PluginResult(Status.OK);
    } else if (action.equals("disable")) {
      this.cordova.getActivity().getWindow().addFlags(LayoutParams.FLAG_KEEP_SCREEN_ON);
      return new PluginResult(Status.OK);
    }
    return new PluginResult(Status.INVALID_ACTION);
  }
}
