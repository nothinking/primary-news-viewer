package com.example.viewpager;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentStatePagerAdapter;

public class PagerAdapter extends FragmentStatePagerAdapter {
	
	private static final String[] CONTENT = new String[] {
		"주요뉴스-종합"
		, "주요뉴스-스포츠"
		, "주요뉴스-연예"
		, "주요뉴스-라이프"
		, "댓글뉴스-종합"
		, "댓글뉴스-스포츠"
		, "댓글뉴스-연예"
		, "인기뉴스-종합"
	};
	

	public PagerAdapter(android.support.v4.app.FragmentManager fm) {
		super(fm);
	}

	@Override
	public Fragment getItem(int i) {
		Fragment fragment = new ObjectFragment();
		
		Bundle args = new Bundle();
		args.putInt(ObjectFragment.ARG_OBJECT, i);
		fragment.setArguments(args);
		
		return fragment;
	}

	@Override
	public int getCount() {
		return CONTENT.length;
	}
	
	@Override
	public CharSequence getPageTitle(int position) {
		return CONTENT[position];
	}

}
