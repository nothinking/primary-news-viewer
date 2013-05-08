package com.example.viewpager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class ListViewAdapter extends BaseAdapter {

	private Activity activity;
	private JSONArray jsonData;
	

	public JSONArray getJsonData() {
		return jsonData;
	}

	public ListViewAdapter(Activity activity, JSONArray data) {
		this.activity = activity;
		this.jsonData = data;
	}

	@Override
	public int getCount() {
		return jsonData.length();
	}

	@Override
	public JSONObject getItem(int position) {
		JSONObject data = null;
		try {
			data = ((JSONObject) jsonData.get(position));
		} catch (JSONException e) {
			e.printStackTrace();
		}
				
		return data;
	}

	@Override
	public long getItemId(int position) {
		return position;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		
		if (convertView == null) {
			LayoutInflater inflater = (LayoutInflater) activity.getLayoutInflater();
			convertView = inflater.inflate(R.layout.list_row, null);
		}

		TextView title = (TextView) convertView.findViewById(R.id.title);
		try {
			title.setText(getItem(position).getString("title"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		TextView info = (TextView) convertView.findViewById(R.id.info);
		try {
			info.setText(getItem(position).getString("cpKorName"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		
		return convertView;
	}


}
