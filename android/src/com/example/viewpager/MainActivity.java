package com.example.viewpager;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;

public class MainActivity extends FragmentActivity {
	
	PagerAdapter pagerAdapter;
	ViewPager mViewPager;
	String newsData;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		try {
			doHttp();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	// 뷰페이저 세팅.
	private void display() {
		
		pagerAdapter = new PagerAdapter(getSupportFragmentManager());
		
		mViewPager = (ViewPager) findViewById(R.id.pager);
		mViewPager.setAdapter(pagerAdapter);
	}
	
	// AsyncTask로 json데이터 불러오기.
	private void doHttp() throws IOException {
		AsyncTask<Void, Void, String> task = new AsyncTask<Void, Void, String>() {
			private StringBuffer out = new StringBuffer();
			
			@Override
			protected String doInBackground(Void... params) {
				try {
					URL url = new URL("http://hee.dev.daum.net/node/make-api/api/api.js");
					HttpURLConnection conn = (HttpURLConnection) url.openConnection();
					InputStream in = conn.getInputStream();
					
					
					byte[]  b = new byte[4096];
					
					for (int n; (n = in.read(b)) != -1;) {
						out.append(new String(b, 0, n));
					}
					
					
				} catch(Exception e) {
					e.printStackTrace();
				}
			    
				return out.toString();
			}

			@Override
			protected void onPostExecute(String result) {
				newsData = result;
				display();
			}
			
		};
		
		task.execute();
	}
	
	public String getNewsData() {
		return newsData;
	}

}
