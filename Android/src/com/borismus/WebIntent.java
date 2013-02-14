package com.borismus.webintent;

import java.util.HashMap;
import java.util.Map;

import org.apache.cordova.DroidGap;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.text.Html;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;

/**
 * @originalAuthor boris@borismus.com
 * @modifiedBy christoph.pojer@gmail.com
 */
public class WebIntent extends Plugin {

  private String onNewIntentCallback = null;

  private Map<String, String>getExtras(JSONObject extras) {
    Map<String, String> map = new HashMap<String, String>();
    if (extras == null) return map;
    try {
      JSONArray names = extras.names();
      for (int i = 0; i < names.length(); i++) {
        String key = names.getString(i);
        map.put(key, extras.getString(key));
      }
    } catch(JSONException e) {}
    return map;
  }

  public PluginResult execute(String action, JSONArray args, String callbackId) {
    try {
      if (action.equals("startActivity") && args.length() == 1) {
        JSONObject obj = args.getJSONObject(0);
        startActivity(
          obj.getString("action"),
          obj.has("url") ? Uri.parse(obj.getString("url")) : null,
          obj.has("type") ? obj.getString("type") : null,
          getExtras(obj.has("extras") ? obj.getJSONObject("extras") : null)
        );
        return new PluginResult(Status.OK);
      } else if (action.equals("hasExtra") && args.length() == 1) {
        Intent i = this.cordova.getActivity().getIntent();
        return new PluginResult(Status.OK, i.hasExtra(args.getString(0)));
      } else if (action.equals("getExtra") && args.length() == 1) {
        Intent i = this.cordova.getActivity().getIntent();
        String extraName = args.getString(0);
        if (i.hasExtra(extraName)) return new PluginResult(Status.OK, i.getStringExtra(extraName));
        else return new PluginResult(Status.ERROR);
      } else if (action.equals("getURI") && args.length() == 0) {
        Intent i = this.cordova.getActivity().getIntent();
        return new PluginResult(Status.OK, i.getDataString());
      } else if (action.equals("onNewIntent") && args.length() == 0) {
        this.onNewIntentCallback = callbackId;
        PluginResult result = new PluginResult(Status.NO_RESULT);
        result.setKeepCallback(true);
        return result;
      } else if (action.equals("sendBroadcast") && args.length() == 1) {
        JSONObject obj = args.getJSONObject(0);
        sendBroadcast(obj.getString("action"), getExtras(obj.has("extras") ? obj.getJSONObject("extras") : null));
        return new PluginResult(Status.OK);
      }
      return new PluginResult(Status.INVALID_ACTION);
    } catch (JSONException e) {
      return new PluginResult(Status.JSON_EXCEPTION);
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    if (this.onNewIntentCallback != null) {
      PluginResult result = new PluginResult(Status.OK, intent.getDataString());
      result.setKeepCallback(true);
      this.success(result, this.onNewIntentCallback);
    }
  }

  void startActivity(String action, Uri uri, String type, Map<String, String> extras) {
    Intent i = (uri != null ? new Intent(action, uri) : new Intent(action));

    if (type != null) {
      if (uri != null) i.setDataAndType(uri, type); //Fix the crash problem with android 2.3.6
      else i.setType(type);
    }

    for (String key : extras.keySet()) {
      String value = extras.get(key);
      if (key.equals(Intent.EXTRA_TEXT) && type.equals("text/html"))
        i.putExtra(key, Html.fromHtml(value)); // If type is text html, the extra text must sent as HTML
      else if (key.equals(Intent.EXTRA_STREAM))
        i.putExtra(key, Uri.parse(value)); // allowes sharing of images as attachments. Value should be the URI of a file
      else if (key.equals(Intent.EXTRA_EMAIL))
        i.putExtra(Intent.EXTRA_EMAIL, new String[]{value}); // allows to add the email address of the receiver
      else
        i.putExtra(key, value);
    }
    this.cordova.getActivity().startActivity(i);
  }

  void sendBroadcast(String action, Map<String, String> extras) {
    Intent intent = new Intent();
    intent.setAction(action);
    for (String key : extras.keySet())
      intent.putExtra(key, extras.get(key));

    this.cordova.getActivity().sendBroadcast(intent);
  }
}
