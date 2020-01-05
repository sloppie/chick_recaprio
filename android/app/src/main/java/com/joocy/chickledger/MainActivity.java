package com.joocy.chickledger;

// import android.os.Build;
// import android.content.Intent;
// import android.app.NotificationChannel;
// import android.app.NotificationManager;
// import androidx.media.app.NotificationCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;


import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

	private String CHANNEL_ID = "ChickLedgerChannel";

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "chickledger2";
  }
	
	@Override
	protected ReactActivityDelegate createReactActivityDelegate() {
		return new ReactActivityDelegate(this, getMainComponentName()) {
			@Override
			protected ReactRootView createRootView() {
				return new RNGestureHandlerEnabledRootView(MainActivity.this);
			}
		};
	}

	// private void createNotificationChannel() {
  //   // Create the NotificationChannel, but only on API 26+ because
  //   // the NotificationChannel class is new and not in the support library
  //   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  //       CharSequence name = "ChickLedgerChannel";
  //       String description = "Notify on the state of eggs inventory";
  //       int importance = NotificationManager.IMPORTANCE_DEFAULT;
  //       NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
  //       channel.setDescription(description);
  //       // Register the channel with the system; you can't change the importance
  //       // or other notification behaviors after this
  //       NotificationManager notificationManager = getSystemService(NotificationManager.class);
  //       notificationManager.createNotificationChannel(channel);
  //   }
  // }

}
