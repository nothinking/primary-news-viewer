package com.example.viewpager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListView;
import android.widget.Toast;

public class ObjectFragment extends Fragment {
	static WebView myWebView;
	public static final String ARG_OBJECT = "object";
	private static final String[] ENG_NAME = new String[] {
		"primarySisa"
		, "primarySports"
		, "primaryEntertain"
		, "primaryLife"
		, "manyCommentsTotal"
		, "manyCommentsSports"
		, "manyCommentsEntertain"
		, "popularTotal"
	};
	

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

//		myWebView = (WebView) ((MainActivity) getActivity()).findViewById(R.id.webview);
		myWebView = (WebView) inflater.inflate(R.layout.webview,  container, false);
		
		View rootView = inflater.inflate(R.layout.fragment_object,  container, false);
		Bundle args = getArguments();
		int index = args.getInt(ARG_OBJECT);
		
		JSONArray data = new JSONArray();
		try {
			data = getFragmentData(index);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		// 리스트뷰.
		ListViewAdapter adapter = new ListViewAdapter(getActivity(), data);
		ListView list = (ListView) rootView.findViewById(R.id.listView);
		list.setAdapter(adapter);
		list.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> parent, View view,
					int i, long l) {
				ListViewAdapter ad = (ListViewAdapter) parent.getAdapter();
				JSONArray ja = ad.getJsonData();
				JSONObject jo = null;
				try {
					jo = (JSONObject) ja.get(i);
				} catch (JSONException e) {
					e.printStackTrace();
				}
				String url = null;
				try {
					url = jo.getString("url");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				
				Toast.makeText(getActivity().getApplicationContext(), url, Toast.LENGTH_SHORT).show();
				
				showWebview(url);
				
			}
		});
		
		return rootView;
	}


	protected void showWebview(String url) {
		myWebView.loadUrl(url);
		
	}


	private JSONArray getFragmentData(int i) throws JSONException {
		String newsData = ((MainActivity) getActivity()).getNewsData();
		JSONArray data;
		
		data = new JSONObject(newsData).getJSONArray(ENG_NAME[i]);
		
		return data;
	}
	
	
}
